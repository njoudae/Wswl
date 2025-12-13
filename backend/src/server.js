import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import driverRoutes from './routes/drivers.js';
import supervisorRoutes from './routes/supervisors.js';
import passengerRoutes from './routes/passengers.js';

import multer from 'multer';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const publicDir = path.join(__dirname, "../public");
const uploadsDir = path.join(__dirname, "../uploads");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(publicDir));
app.use("/uploads", express.static(uploadsDir));

app.use(cors());
const upload = multer(); // minimal setup to avoid breaking body parsing globally

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // safe for non-multipart
app.use(morgan('dev'));

// Static frontend
const frontendPath = path.join(__dirname, '../../frontend/public');
app.use(express.static(frontendPath));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/supervisors', supervisorRoutes);
app.use('/api/passengers', passengerRoutes);

// Fallback to index or login if needed
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, '../../index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
