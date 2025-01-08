
import { createComment, deleteComment, getAllComments, getUserComment, updateComment } from '../controllers/comment.controller.js';
import { verifyJwt } from '../middlewares/auth.middleware.js';
import express from 'express';

const app = express.Router();

app.route('/').post(verifyJwt, createComment)
app.route('/user/:videoId').get(verifyJwt, getUserComment);
app.route('/video/:videoId').get(getAllComments);
app.route('/:commentId').patch(verifyJwt, updateComment).delete(verifyJwt, deleteComment);

export default app;
