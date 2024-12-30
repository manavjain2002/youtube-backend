import mongoose from 'mongoose';
import { View } from './view.model.js';
import { Like } from './like.model.js';
import { Comment } from './comment.model.js';
import { Tweet } from './tweet.model.js';
import { Playlist } from './playlist.model.js';

const videoSchema = new mongoose.Schema(
    {
        videoFile: {
            type: String,
            required: true,
        },
        thumbnail: {
            type: String,
            required: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        },
        isPublished: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    },
);

videoSchema.post('findById', async function (doc) {
    if (doc) {
        const views = await View.find({ video: doc._id });
        console.log(`Deleted views for video: ${doc._id}`);

        const likes = await Like.find({ video: doc._id });
        console.log(`Deleted likes for video: ${doc._id}`);

        const comments = await Comment.find({ video: doc._id });
        console.log(`Deleted comments for video: ${doc._id}`);

        const tweets = await Tweet.find({ video: doc._id });
        console.log(`Deleted tweets for video: ${doc._id}`);

        doc = {
            ...doc,
            views,
            likes,
            comments,
            tweets,
        };
    }
});

videoSchema.post('findByIdAndDelete', async function (doc) {
    if (doc) {
        await View.deleteMany({ video: doc._id });
        console.log(`Deleted views for video: ${doc._id}`);

        await Like.deleteMany({ video: doc._id });
        console.log(`Deleted likes for video: ${doc._id}`);

        await Comment.deleteMany({ video: doc._id });
        console.log(`Deleted comments for video: ${doc._id}`);

        await Tweet.deleteMany({ video: doc._id });
        console.log(`Deleted tweets for video: ${doc._id}`);

        await Playlist.updateMany(
            { videos: doc._id },
            { $pull: { videos: doc._id } },
        );
    }
});

export const Video = mongoose.model('Video', videoSchema);
