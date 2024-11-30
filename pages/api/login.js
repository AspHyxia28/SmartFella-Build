import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      const user = rows[0];
      if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ email: user.email }, 'secret', { expiresIn: '1h' });
        res.status(200).json({ token });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Login failed', error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}