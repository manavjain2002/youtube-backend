import {
    createTweet,
    deleteTweet,
    getAllTweets,
    getUserTweet,
    updateTweet,
} from '../controllers/tweet.controller.js';
import { verifyJwt } from '../middlewares/auth.middleware.js';
import express from 'express';

const app = express.Router();

app.route('/').post(verifyJwt, createTweet);
app.route('/user/:videoId').get(verifyJwt, getUserTweet);
app.route('/video/:videoId').get(getAllTweets);
app.route('/:tweetId').patch(verifyJwt, updateTweet).delete(verifyJwt, deleteTweet);

export default app;
