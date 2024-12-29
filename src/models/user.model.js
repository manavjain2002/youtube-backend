import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { View } from './view.model.js';
import { Like } from './like.model.js';
import { Comment } from './comment.model.js';
import { Tweet } from './tweet.model.js';
import { Subscription } from './subscription.model.js';
import { Premium } from './premium.model.js';
import { Playlist } from './playlist.model.js';
import {
    accessTokenExpiry,
    accessTokenSecret,
    refreshTokenExpiry,
    refreshTokenSecret,
} from '../constants';

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            lowercase: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            required: true,
        },
        coverImage: {
            type: String,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            default: ROLES.USER,
        },
        refreshToken: {
            type: String,
        },
        watchHistory: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Video',
            },
        ],
    },
    {
        timestamps: true,
    },
);

userSchema.methods.isCorrectPassword = (password) => {
    return bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = () => {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
            fullName: this.fullName,
        },
        accessTokenSecret,
        {
            expiresIn: accessTokenExpiry,
        },
    );
};

userSchema.methods.generateRefreshToken = () => {
    return jwt.sign(
        {
            _id: this._id,
        },
        refreshTokenSecret,
        {
            expiresIn: refreshTokenExpiry,
        },
    );
};

userSchema.post('findByIdAndDelete', async function (doc) {
    if (doc) {
        await View.deleteMany({ owner: doc._id });
        console.log(`Deleted views for owner: ${doc._id}`);

        await Like.deleteMany({ owner: doc._id });
        console.log(`Deleted likes for owner: ${doc._id}`);

        await Comment.deleteMany({ owner: doc._id });
        console.log(`Deleted comments for owner: ${doc._id}`);

        await Tweet.deleteMany({ owner: doc._id });
        console.log(`Deleted tweets for owner: ${doc._id}`);

        await Video.deleteMany({ owner: doc._id });
        console.log(`Deleted videos for owner: ${doc._id}`);

        await Subscription.deleteMany({
            $or: [{ subscriber: doc._id }, { channel: doc._id }],
        });
        console.log(`Deleted subscriptions for owner: ${doc._id}`);

        await Premium.deleteMany({ user: doc._id });
        console.log(`Deleted premium for owner: ${doc._id}`);

        await Playlist.deleteMany({ user: doc._id });
        console.log(`Deleted playlists for owner: ${doc._id}`);
    }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

export const User = mongoose.model('User', userSchema);
