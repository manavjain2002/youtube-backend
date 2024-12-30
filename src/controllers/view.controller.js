import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const updateView = asyncHandler(async (req, res) => {
    try {
        const { videoId, watchDuration } = req.body;
        if (!videoId || !watchDuration) {
            throw new ApiError(400, 'Video Id and WatchDuration are required');
        }

        const viewData = {
            video: videoId,
            viewedBy: req.user._id,
            watchDuration,
        };

        const data = await updateView(viewData);

        if (!data) {
            throw new ApiError(400, 'Unable to create view');
        }

        res.status(200).json(
            new ApiResponse(200, data, 'View created successfully'),
        );
    } catch (error) {
        throw new ApiError(400, 'Unable to create views');
    }
});

export const isViewedVideo = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.body;
        if (!videoId) {
            throw new ApiError(400, 'Video Id is required');
        }

        const alreadyViewed = await findView({
            video: videoId,
            viewedBy: req.user._id,
        });

        res.status(200).json(
            new ApiResponse(
                200,
                alreadyViewed ? true : false,
                'View fetched successfully',
            ),
        );
    } catch (error) {
        throw new ApiError(400, 'Unable to fetch views');
    }
});

export const getAllVideoViews = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.body;
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
