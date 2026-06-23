import express          from 'express';
import cors             from 'cors';
import dotenv           from 'dotenv';
import fishRoutes       from './routes/fishRoutes';
import authRoutes       from './routes/authRoutes';
import sessionRoutes    from './routes/sessionRoutes';
import catchRoutes      from './routes/catchRoutes';
import userRoutes       from './routes/userRoutes';
import { errorHandler } from './middleware/errorHandler';
import scoreRoutes      from './routes/scoreRoutes';

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

const allowedOrigins = process.env.CORS_ORIGIN
    ?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean) ?? [];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }

        callback(new Error('Not allowed by CORS'));
    },
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'FishingScore API is running!',
    });
});

app.use('/api/fish', fishRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/catches', catchRoutes);
app.use('/api/users', userRoutes);
app.use('/api/scores', scoreRoutes);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});