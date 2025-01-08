import {
    createLike,
    deleteLike,
    getAllLikes,
    isLikedVideo,
} from '../controllers/like.controller.js';
import { verifyJwt } from '../middlewares/auth.middleware.js';
import express from 'express';

const app = express.Router();

app.route('/').post(verifyJwt, createLike).delete(verifyJwt, deleteLike);
app.route('/user/:videoId').get(verifyJwt, isLikedVideo);
app.route('/video/:videoId').get(verifyJwt, getAllLikes);

export default app;
