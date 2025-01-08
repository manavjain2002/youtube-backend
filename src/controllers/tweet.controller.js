import {
    createTweetData,
    deleteTweetData,
    findTweet,
    updateTweetData,
} from '../services/tweet.service.js';
import { findVideo } from '../services/video.service.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createTweet = asyncHandler(async (req, res) => {
    try {
        const { videoId, content } = req.body;
        if (!videoId || !content) {
            throw new ApiError(400, 'Video Id is required');
        }

        const alreadyTweeted = await findTweet({
            video: videoId,
            owner: req.user._id,
        });

        if (alreadyTweeted && alreadyTweeted.length > 0) {
            throw new ApiError(400, 'Already tweeted');
        }

        const tweetData = {
            video: videoId,
            owner: req.user._id,
            content,
        };

        const data = await createTweetData(tweetData);

        if (!data) {
            throw new ApiError(400, 'Unable to create tweet');
        }

        res.status(200).json(
            new ApiResponse(200, data, 'Tweet created successfully'),
        );
    } catch (error) {
        throw new ApiError(400, error?.message || 'Unable to create tweets');
    }
});

export const updateTweet = asyncHandler(async (req, res) => {
    try {
        const { tweetId } = req.params;
        if (!tweetId) {
            throw new ApiError(400, 'Tweet Id is required');
        }
        const { content } = req.body;
        if (!content) {
            throw new ApiError(400, 'Content is required');
        }

        const tweetData = await findTweet({ _id: tweetId });

        if (!tweetData || tweetData.length == 0) {
            throw new ApiError(400, 'Not tweeted');
        }

        if (tweetData[0].owner.toString() != req.user._id) {
            throw new ApiError(400, 'Only owner can update the tweet');
        }

        const data = await updateTweetData(tweetData[0]._id, { content });

        if (!data) {
            throw new ApiError(400, 'Unable to update tweet');
        }

        res.status(200).json(
            new ApiResponse(200, data, 'Tweet updated successfully'),
        );
    } catch (error) {
        throw new ApiError(400, error?.message || 'Unable to update tweets');
    }
});

export const deleteTweet = asyncHandler(async (req, res) => {
    try {
        const { tweetId } = req.params;
        if (!tweetId) {
            throw new ApiError(400, 'Video Id is required');
        }

        const tweetData = await findTweet({ _id: tweetId });

        if (!tweetData || tweetData.length == 0) {
            throw new ApiError(400, 'Not tweets');
        }

        const videoData = await findVideo({ _id: tweetData[0].video });
        if (!videoData) {
            throw new ApiError(400, 'Video with this id is not available');
        }

        if (
            tweetData[0].owner.toString() != req.user._id &&
            videoData.owner.toString() != req.user._id
        ) {
            throw new ApiError(
                400,
                'Only tweet owner or video owner can delete the tweet',
            );
        }

        const data = await deleteTweetData(tweetData[0]._id);

        if (!data) {
            throw new ApiError(400, 'Unable to delete tweet');
        }

        res.status(200).json(
            new ApiResponse(200, data, 'Tweet deleted successfully'),
        );
    } catch (error) {
        throw new ApiError(400, error?.message || 'Unable to delete tweets');
    }
});

export const getUserTweet = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.params;
        if (!videoId) {
            throw new ApiError(400, 'Video Id is required');
        }

        const tweets = await findTweet({
            video: videoId,
            owner: req.user._id,
        });

        res.status(200).json(
            new ApiResponse(200, tweets, 'Tweet fetched successfully'),
        );
    } catch (error) {
        throw new ApiError(400, 'Unable to fetch tweets');
    }
});

export const getAllTweets = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.params;
        if (!videoId) {
            throw new ApiError(400, 'Video Id is required');
        }

        const tweets = await findTweet({
            video: videoId,
        });

        res.status(200).json(
            new ApiResponse(200, tweets, 'Tweet fetched successfully'),
        );
    } catch (error) {
        throw new ApiError(400, 'Unable to fetch tweets');
    }
});
