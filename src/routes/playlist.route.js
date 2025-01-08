import {
    createPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    getPlaylist,
    addVideoFromPlaylist,
} from '../controllers/playlist.controller.js';
import { verifyJwt } from '../middlewares/auth.middleware.js';
import express from 'express';

const app = express.Router();

app.route('/').post(verifyJwt, createPlaylist);

app.route('/remove-video/:playlistId').patch(verifyJwt, removeVideoFromPlaylist)
app.route('/add-video/:playlistId').patch(verifyJwt, addVideoFromPlaylist)

app.route('/:playlistId')
    .get(verifyJwt, getPlaylist)
    .delete(verifyJwt, deletePlaylist);

export default app;
