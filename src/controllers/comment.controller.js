import mongoose from 'mongoose';
import {
    createCommentData,
    deleteCommentData,
    findComment,
    updateCommentData,
} from '../services/comment.service.js';
import { findVideo } from '../services/video.service.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

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

        if (alreadyCommented && alreadyCommented.length > 0) {
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
        throw new ApiError(400, error?.message || 'Unable to create comments');
    }
});


export const updateComment = asyncHandler(async (req, res) => {
    try {
        const {commentId} = req.params
        if (!commentId) {
            throw new ApiError(400, 'Comment Id is required');
        }
        const { content } = req.body;
        if (!content) {
            throw new ApiError(400, 'Content is required');
        }

        const commentData = await findComment({ _id: commentId });

        if (!commentData || commentData.length == 0) {
            throw new ApiError(400, 'Not commented');
        }

        if (commentData[0].owner.toString() != req.user._id) {
            throw new ApiError(400, 'Only owner can update the comment');
        }

        const data = await updateCommentData(commentData[0]._id, { content });

        if (!data) {
            throw new ApiError(400, 'Unable to update comment');
        }

        res.status(200).json(
            new ApiResponse(200, data, 'Comment updated successfully'),
        );
    } catch (error) {
        throw new ApiError(400, error?.message || 'Unable to update comments');
    }
});

export const deleteComment = asyncHandler(async (req, res) => {
    try {
        const { commentId } = req.params;
        if (!commentId) {
            throw new ApiError(400, 'Video Id is required');
        }
        
        const commentData = await findComment({
            _id: commentId
        });

        if (!commentData || commentData.length == 0) {
            throw new ApiError(400, 'Not commented');
        }

        const videoData = await findVideo({ _id: new mongoose.Types.ObjectId(commentData[0].video) });
        if (!videoData) {
            throw new ApiError(400, 'Video with this id is not available');
        }

        if (
            commentData[0].owner.toString() != req.user._id &&
            videoData.owner.toString() != req.user._id
        ) {
            throw new ApiError(
                400,
                'Only comment owner or video owner can delete the comment',
            );
        }

        const data = await deleteCommentData(commentData[0]._id);

        if (!data) {
            throw new ApiError(400, 'Unable to delete comment');
        }

        res.status(200).json(
            new ApiResponse(200, data, 'Comment deleted successfully'),
        );
    } catch (error) {
        throw new ApiError(400, error?.message || 'Unable to delete comments');
    }
});


export const getUserComment = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.params;
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
        const { videoId } = req.params;
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
