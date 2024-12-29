import {
    createCommentData,
    deleteCommentData,
    updateCommentData,
} from '../services/comment.service';
import { findVideo } from '../services/video.service';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const createComment = asyncHandler(async (req, res) => {
    try {
        const { videoId, content } = req.body;
        if (!videoId || !content) {
            throw new ApiError(400, 'Video Id is required');
        }

        const alreadyCommented = await findComment({
            video: videoId,
            owner: req.user._id,
        });

        if (alreadyCommented) {
            throw new ApiError(400, 'Already commented');
        }

        const commentData = {
            video: videoId,
            owner: req.user._id,
            content,
        };

        const data = await createCommentData(commentData);

        if (!data) {
            throw new ApiError(400, 'Unable to create comment');
        }

        res.status(200).json(
            new ApiResponse(200, data, 'Comment created successfully'),
        );
    } catch (error) {
        throw new ApiError(400, 'Unable to create comments');
    }
});

export const updateComment = asyncHandler(async (req, res) => {
    try {
        const { commentId, content } = req.body;
        if (!commentId || !content) {
            throw new ApiError(400, 'Comment Id and content is required');
        }

        const commentData = await findComment({ _id: commentId });

        if (!commentData) {
            throw new ApiError(400, 'Not commented');
        }

        if (commentData.owner !== req.user._id) {
            throw new ApiError(400, 'Only owner can update the comment');
        }

        const data = await updateCommentData(commentData._id, { content });

        if (!data) {
            throw new ApiError(400, 'Unable to update comment');
        }

        res.status(200).json(
            new ApiResponse(200, data, 'Comment updated successfully'),
        );
    } catch (error) {
        throw new ApiError(400, 'Unable to update comments');
    }
});

export const deleteComment = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.body;
        if (!videoId) {
            throw new ApiError(400, 'Video Id is required');
        }

        const videoData = await findVideo({ _id: videoId });
        if (!videoData) {
            throw new ApiError(400, 'Video with this id is not available');
        }

        const commentData = await findComment({
            video: videoId,
            owner: req.user._id,
        });

        if (!commentData) {
            throw new ApiError(400, 'Not commented');
        }

        if (
            commentData.owner !== req.user._id &&
            videoData.owner !== req.user._id
        ) {
            throw new ApiError(
                400,
                'Only comment owner or video owner can delete the comment',
            );
        }

        const data = await deleteCommentData(commentData._id);

        if (!data) {
            throw new ApiError(400, 'Unable to delete comment');
        }

        res.status(200).json(
            new ApiResponse(200, data, 'Comment deleted successfully'),
        );
    } catch (error) {
        throw new ApiError(400, 'Unable to delete comments');
    }
});

export const getUserComment = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.body;
        if (!videoId) {
            throw new ApiError(400, 'Video Id is required');
        }

        const comments = await findComment({
            video: videoId,
            owner: req.user._id,
        });

        res.status(200).json(
            new ApiResponse(200, comments, 'Comment fetched successfully'),
        );
    } catch (error) {
        throw new ApiError(400, 'Unable to fetch comments');
    }
});

export const getAllComments = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.body;
        if (!videoId) {
            throw new ApiError(400, 'Video Id is required');
        }

        const comments = await findComment({
            video: videoId,
        });

        res.status(200).json(
            new ApiResponse(200, comments, 'Comment fetched successfully'),
        );
    } catch (error) {
        throw new ApiError(400, 'Unable to fetch comments');
    }
});
