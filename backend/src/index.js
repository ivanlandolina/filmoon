import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import moviesRouter from './routes/movies.routes.js';

const app = express();

// CORS: autorizza il dominio del frontend in produzione
const allowOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({
  origin: allowOrigin,
  methods: ['GET','POST','DELETE','PUT','PATCH','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));

// Middlewares
app.use(cors({ origin: process.env.CLIENT_URL?.split(',') || '*', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// Healthcheck
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/movies', moviesRouter);

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Errore interno' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server on :${PORT}`)
})

async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connesso');
    app.listen(PORT, () => console.log(`Server avviato su http://localhost:${PORT}`));
  } catch (e) {
    console.error('Errore connessione MongoDB', e);
    process.exit(1);
  }
}

start();