import { verifyJwt } from '../middlewares/auth.middleware.js';
import express from 'express';
import { isViewedVideo, updateView } from '../controllers/view.controller.js';

const app = express.Router();

app.route('/:videoId')
    .post(verifyJwt, updateView)
    .get(verifyJwt, isViewedVideo);

export default app;
