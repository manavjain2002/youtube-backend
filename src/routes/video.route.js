import express from 'express';
import { verifyJwt } from '../middlewares/auth.middleware.js';
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateThumbnailLink,
    updateVideo,
    updateVideoLink,
} from '../controllers/video.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { getAllVideoLikes, getAllVideoViews } from '../controllers/view.controller.js';
import { getAllComments } from '../controllers/comment.controller.js';
import { getAllTweets } from '../controllers/tweet.controller.js';

const app = express.Router();

app.route('/getAllVideos').get(verifyJwt, getAllVideos);

app.route('/publish').post(
    upload.fields([
        { name: 'video', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 },
    ]),
    verifyJwt,
    publishAVideo,
);

app.route('/video/:id').post(
    upload.single('video'),
    verifyJwt,
    updateVideoLink,
);

app.route('/thumbnail/:id').post(
    upload.single('thumbnail'),
    verifyJwt,
    updateThumbnailLink,
);

app.route('/:videoId')
    .get(getVideoById)
    .patch(verifyJwt, updateVideo)
    .delete(verifyJwt, deleteVideo);

app.route('/toggle/:videoId').post(verifyJwt, togglePublishStatus);

app.route('/views/:videoId').get(verifyJwt, getAllVideoViews);

app.route('/likes/:videoId').get(verifyJwt, getAllVideoLikes);

app.route('/comments/:videoId').get(verifyJwt, getAllComments);

app.route('/tweets/:videoId').get(verifyJwt, getAllTweets);

export default app;
