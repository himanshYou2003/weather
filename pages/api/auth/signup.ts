import { hash } from 'bcryptjs';
import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('HimanshuWeather'); 

    const existingUser = await db.collection('users').findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await hash(password, 12);

    const newUser = {
      email,
      password: hashedPassword,
    };

    await db.collection('users').insertOne(newUser);

    return res.status(201).json({ message: 'User created successfully', newUser });
  } catch (error) {
    console.error('Sign-up error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
