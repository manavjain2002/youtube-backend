import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

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

        if (alreadyLiked) {
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
        throw new ApiError(400, 'Unable to create likes');
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

        if (!likeData) {
            throw new ApiError(400, 'Not liked');
        }

        if (likeData.owner !== req.user._id) {
            throw new ApiError(400, 'Only like owner can delete the like');
        }

        const data = await deleteLike(likeData._id);

        if (!data) {
            throw new ApiError(400, 'Unable to delete like');
        }

        res.status(200).json(
            new ApiResponse(200, data, 'Like deleted successfully'),
        );
    } catch (error) {
        throw new ApiError(400, 'Unable to delete likes');
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
                alreadyLiked ? true : false,
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
