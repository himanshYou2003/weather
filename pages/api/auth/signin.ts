import { compare } from 'bcryptjs';
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
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    return res.status(200).json({ message: 'Sign-in successful', user });
  } catch (error) {
    console.error('Sign-in error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}



