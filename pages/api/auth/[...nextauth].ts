import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import clientPromise from '../../../lib/mongodb';

export default NextAuth({
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const client = await clientPromise;
        const db = client.db('HimanshuWeather');
        const user = await db.collection('users').findOne({ email: credentials?.email });

        if (!user) {
          throw new Error('No user found with the email');
        }

        const isPasswordValid = await compare(credentials?.password, user.password);

        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }

        return { id: user._id, email: user.email };
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin' // Redirect here if there's an error
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      console.log('Session:', session);
      console.log('Token:', token);
    
      if (token) {
        session.user = {
          id: token.id,
          email: token.email
        };
      }
      return session;
    }
    
  },
  secret: process.env.NEXTAUTH_SECRET,
});
