import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import User from '../models/User.js';

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
});

// Registrazione utente
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = registerSchema.parse(req.body);
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email già registrata' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });
    res.status(201).json({ id: user._id, name: user.name, email: user.email });
  } catch (e) { next(e); }
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

// Login utente
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Credenziali errate' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Credenziali errate' });
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (e) { next(e); }
});

export default router;