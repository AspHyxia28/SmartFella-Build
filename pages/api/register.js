import bcrypt from 'bcryptjs';
import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const [rows] = await pool.query('INSERT INTO users (email, username, password, role) VALUES (?, ?, ?, ?)', [email, username, hashedPassword, role]);
      res.status(200).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error during user registration:', error);
      res.status(500).json({ message: 'User registration failed', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}