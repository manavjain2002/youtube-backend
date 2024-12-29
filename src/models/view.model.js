import mongoose from 'mongoose';

const viewSchema = new mongoose.Schema(
    {
        viewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        video: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Video',
        },
        watchDuration: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    },
);

export const View = mongoose.model('View', viewSchema);
