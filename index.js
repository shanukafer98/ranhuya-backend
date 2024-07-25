import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors'; 

dotenv.config();

// Check if MONGO environment variable is set
if (!process.env.MONGO) {
  throw new Error('MONGO environment variable is not defined');
}

mongoose
  .connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1); // Exit process with failure
  });

const __dirname = path.resolve();

const app = express(); // Move this line before using app

// Middleware
app.use(cors({
  origin: "http://13.49.80.197", // Update with your production domain
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

app.use(cors({
  origin: "http://localhost:5173", // Update with your production domain
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Static files
app.use(express.static(path.join(__dirname, '/client/dist')));

// Routes
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.get('/', (req, res) => {
  res.send('Hello World, from express');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error occurred:', err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Start server
const port =  3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
