import mongoose from 'mongoose';

const PlaylistSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        startingDate: {
            type: Date,
            default: new Date().getTime(), // current timestamp
        },
        closingDate: {
            type: Date,
            default: new Date().setMonth(new Date().getMonth() + 3).getTime(), // 3 months
        },
        referralCode: {
            type: String,
        },
        amountPaid: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    },
);

export const Playlist = mongoose.model('Playlist', PlaylistSchema);
