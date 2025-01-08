import { createLikes, deleteLikes, findLikes } from '../services/like.service.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createLike = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.body;
        if (!videoId) {
            throw new ApiError(400, 'Video Id is required');
        }

        const alreadyLiked = await findLikes({
            video: videoId,
            likedBy: req.user._id,
        });

        if (alreadyLiked.length > 0) {
            throw new ApiError(400, 'Already liked');
        }

        const likeData = {
            video: videoId,
            likedBy: req.user._id,
        };

        const data = await createLikes(likeData);

        if (!data) {
            throw new ApiError(400, 'Unable to create like');
        }

        res.status(200).json(
            new ApiResponse(200, data, 'Like created successfully'),
        );
    } catch (error) {
        throw new ApiError(400, error?.message || 'Unable to create likes');
    }
});



export const deleteLike = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.body;
        if (!videoId) {
            throw new ApiError(400, 'Video Id is required');
        }

        const likeData = await findLikes({
            video: videoId,
            likedBy: req.user._id,
        });

        if (!likeData || likeData.length == 0) {
            throw new ApiError(400, 'Not liked');
        }

        if (likeData[0].likedBy.toString() != req.user._id) {
            throw new ApiError(400, 'Only like owner can delete the like');
        }

        const data = await deleteLikes(likeData[0]._id);

        if (!data) {
            throw new ApiError(400, 'Unable to delete like');
        }

        res.status(200).json(
            new ApiResponse(200, data, 'Like deleted successfully'),
        );
    } catch (error) {
        throw new ApiError(400, error?.message || 'Unable to delete likes');
    }
});


export const isLikedVideo = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.params;
        if (!videoId) {
            throw new ApiError(400, 'Video Id is required');
        }

        const alreadyLiked = await findLikes({
            video: videoId,
            likedBy: req.user._id,
        });

        res.status(200).json(
            new ApiResponse(
                200,
                alreadyLiked.length > 0 ? true : false,
                'Like fetched successfully',
            ),
        );
    } catch (error) {
        throw new ApiError(400, 'Unable to fetch likes');
    }
});

export const getAllLikes = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.params;
        if (!videoId) {
            throw new ApiError(400, 'Video Id is required');
        }

        const likes = await findLikes({
            video: videoId,
        });

        res.status(200).json(
            new ApiResponse(200, likes, 'Like fetched successfully'),
        );
    } catch (error) {
        throw new ApiError(400, 'Unable to fetch likes');
    }
});
