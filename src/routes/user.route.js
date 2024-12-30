import express from 'express';
import {
    addToWatchHistory,
    clearWatchHistory,
    deleteUser,
    getUser,
    getUserChannelProfile,
    getUserData,
    getUsers,
    getUserWatchHistory,
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
    updateAvatarImage,
    updateCoverImage,
    updatePassword,
    updateUser,
} from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJwt } from '../middlewares/auth.middleware.js';
const app = express.Router();

app.route('/register').post(
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'coverImg', maxCount: 1 },
    ]),
    registerUser,
);
app.route('/login').post(loginUser);
app.route('/logout').post(verifyJwt, logoutUser);
app.route('/refresh-token').post(verifyJwt, refreshAccessToken);
app.route('/watchHistory')
    .get(verifyJwt, getUserWatchHistory)
    .post(verifyJwt, addToWatchHistory)
    .delete(verifyJwt, clearWatchHistory);
app.route('/getAllUsers').get(verifyJwt, getUsers);
app.route('/:id').patch(verifyJwt, updateUser).get(getUserData);
app.route('/channel/:id').get(verifyJwt, getUserChannelProfile);

app.route('/avatar/:id').patch(
    upload.single('avatar'),
    verifyJwt,
    updateAvatarImage,
);

app.route('/coverImg/:id').patch(
    upload.single('coverImg'),
    verifyJwt,
    updateCoverImage,
);

app.route('/password/:id').patch(verifyJwt, updatePassword);

app.route('/').get(verifyJwt, getUser).delete(verifyJwt, deleteUser);

export default app;
