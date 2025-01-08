import { findLikes } from '../services/like.service.js';
import { findView, updateViewData } from '../services/view.service.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const updateView = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.params;
        if (!videoId) {
            throw new ApiError(400, 'Video Id is required');
        }
        const { watchDuration } = req.body;
        if (!watchDuration) {
            throw new ApiError(400, 'WatchDuration is required');
        }

        const data = await updateViewData(req.user._id, videoId, watchDuration);

        if (!data) {
            throw new ApiError(400, 'Unable to create view');
        }

        res.status(200).json(
            new ApiResponse(200, data, 'View created successfully'),
        );
    } catch (error) {
        throw new ApiError(400, error?.message || 'Unable to create views');
    }
});

export const isViewedVideo = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.params;
        if (!videoId) {
            throw new ApiError(400, 'Video Id is required');
        }

        const viewData = await findView({
            video: videoId,
            viewer: req.user._id.toString(),
        });
        res.status(200).json(
            new ApiResponse(
                200,
                viewData && viewData.length > 0 ? viewData[0] : null,
                'View fetched successfully',
            ),
        );
    } catch (error) {
        throw new ApiError(400, 'Unable to fetch views');
    }
});

export const getAllVideoViews = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.params;
        if (!videoId) {
            throw new ApiError(400, 'Video Id is required');
        }

        const views = await findView({
            video: videoId,
        });

        res.status(200).json(
            new ApiResponse(200, views, 'View fetched successfully'),
        );
    } catch (error) {
        throw new ApiError(400, 'Unable to fetch views');
    }
});

export const getAllVideoLikes = asyncHandler(async (req, res) => {
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
