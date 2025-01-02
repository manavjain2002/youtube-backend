import express from 'express';
import cors from 'cors';
import userRouter from './routes/user.route.js';
import videoRouter from './routes/video.route.js';
import viewRouter from './routes/view.route.js';
import cookieParser from 'cookie-parser';

export const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    }),
);

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/videos', videoRouter);
app.use('/api/v1/views', viewRouter);
