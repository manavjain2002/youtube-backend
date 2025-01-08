import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import {
    createVideo,
    deleteVideoById,
    findVideo,
    getAllVideosData,
    updateVideoById,
} from '../services/video.service.js';
import mongoose from 'mongoose';

export const getAllVideos = asyncHandler(async (req, res) => {
    try {
        const { page = 0, limit = 10, query, sortBy, sortType } = req.query;
        const videos = await getAllVideosData(
            page,
            limit,
            query,
            sortBy,
            sortType,
        );
        if (!videos) {
            throw new ApiError(400, 'Unable to fetch all videos');
        }
        res.status(200).json(
            new ApiResponse(200, videos, 'Videos fetched successfully'),
        );
    } catch (error) {
        throw new ApiError(500, 'Unable to fetch videos');
    }
});

export const publishAVideo = asyncHandler(async (req, res) => {
    try {
        const { title, description } = req.body;
        if ([title, description].some((data) => data == '')) {
            throw new ApiError(400, 'All fields are required');
        }

        const videoLocalPath =
            req.files && req.files.video && req.files.video.length > 0
                ? req.files.video[0]?.path
                : '';

        const thumbnailLocalPath =
            req.files && req.files.thumbnail && req.files.thumbnail.length > 0
                ? req.files.thumbnail[0]?.path
                : '';

        const videoPath = videoLocalPath
            ? await uploadOnCloudinary(videoLocalPath)
            : '';

        const thumbnailPath = thumbnailLocalPath
            ? await uploadOnCloudinary(thumbnailLocalPath)
            : '';

        const videoData = {
            videoFile: videoPath?.url,
            thumbnail: thumbnailPath.url,
            owner: req.user._id,
            title,
            description,
            duration: videoPath?.duration,
        };

        const createdVideoData = await createVideo(videoData);
        if (!createdVideoData) {
            throw new ApiError(400, 'Unable to create video data');
        }

        res.status(201).json(
            new ApiResponse(
                200,
                createdVideoData,
                'Video data created successfully',
            ),
        );
    } catch (error) {
        throw new ApiError(400, error?.message || 'Unable to create video');
    }
});



export const getVideoById = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.params;
        if (!videoId) {
            throw new ApiError(400, 'Video Id is required');
        }

        const video = await findVideo({
            _id: new mongoose.Types.ObjectId(videoId),
        });
        
        if (!video) {
            throw new ApiError(400, 'Unable to find video with this id');
        }

        res.status(200).json(
            new ApiResponse(200, video, 'Video fetched successfully'),
        );
    } catch (error) {
        throw new ApiError(400, error?.message || 'Unable to get video');
    }
});

export const updateVideo = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.params;
        if (!videoId) {
            throw new ApiError(400, 'Video Id is required');
        }

        const videoData = await findVideo({
            _id: new mongoose.Types.ObjectId(videoId),
        });
        if (!videoData) {
            throw new ApiError(400, 'Invalid video id requested');
        }

        if (videoData.owner._id.toString() != req.user._id) {
            throw new ApiError(400, 'Only video owner can update');
        }

        const { title, description } = req.body;
        const dataToUpdate = {};

        if (title) {
            dataToUpdate.title = title;
        }

        if (description) {
            dataToUpdate.description = description;
        }

        const updatedVideo = await updateVideoById(videoId, dataToUpdate);
        if (!updatedVideo) {
            throw new ApiError(400, 'Unable to update video');
        }

        res.status(200).json(
            new ApiResponse(200, updatedVideo, 'Video updated successfully'),
        );
    } catch (error) {
        throw new ApiError(500, error?.message || 'Unable to update video');
    }
});

export const deleteVideo = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.params;
        if (!videoId) {
            throw new ApiError(400, 'Video Id is required');
        }

        const videoData = await findVideo({
            _id: new mongoose.Types.ObjectId(videoId),
        });
        if (!videoData) {
            throw new ApiError(400, 'Invalid video id requested');
        }

        if (videoData.owner._id.toString() != req.user._id) {
            throw new ApiError(400, 'Only video owner can delete');
        }

        const deletedVideo = await deleteVideoById(videoId);
        if (!deletedVideo) {
            throw new ApiError(400, 'Unable to delete video');
        }

        res.status(200).json(
            new ApiResponse(200, deletedVideo, 'Video deleted successfully'),
        );
    } catch (error) {
        throw new ApiError(500, error?.message || 'Unable to delete video');
    }
});

export const togglePublishStatus = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.params;
        if (!videoId) {
            throw new ApiError(400, 'Video Id is required');
        }

        const videoData = await findVideo({
            _id: new mongoose.Types.ObjectId(videoId),
        });
        if (!videoData) {
            throw new ApiError(400, 'Invalid video id requested');
        }

        if (videoData.owner._id.toString() != req.user._id) {
            throw new ApiError(
                400,
                'Only video owner can toggle publish status',
            );
        }

        const updatedVideo = await updateVideoById(videoId, {
            isPublished: !videoData.isPublished,
        });
        if (!updatedVideo) {
            throw new ApiError(400, 'Unable to toggle publish status of video');
        }

        res.status(200).json(
            new ApiResponse(
                200,
                updatedVideo,
                'Video Published Status updated successfully',
            ),
        );
    } catch (error) {
        throw new ApiError(500, error?.message || 'Unable to delete video');
    }
});

export const updateVideoLink = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new ApiError(400, 'Video id is required');
        }
        const videoLocalPath = req.file && req.file.path ? req.file.path : '';
        if (!videoLocalPath) {
            throw new ApiError(400, 'Video path is required');
        }

        const videoPath = await uploadOnCloudinary(videoLocalPath);

        if (!videoPath) {
            throw new ApiError(500, 'Unable to upload the video on cloudinary');
        }
        
        const videoData = await findVideo({
            _id: new mongoose.Types.ObjectId(id),
        });
        
        if (videoData.owner._id.toString() != req.user._id) {
            throw new ApiError(400, 'Video owner can change the video');
        }

        const updatedVideo = await updateVideoById(id, {
            video: videoPath.url,
            duration: videoPath.duration,
        });

        if (!updatedVideo) {
            throw new ApiError(500, 'Unable to update video');
        }

        res.status(200).json(
            new ApiResponse(200, updatedVideo, 'Video updated successfully'),
        );
    } catch (error) {
        throw new ApiError(500, error?.message || 'Unable to update video');
    }
});


export const updateThumbnailLink = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new ApiError(400, 'Thumbnail id is required');
        }
        const thumbnailLocalPath =
            req.file && req.file.path ? req.file.path : '';
        if (!thumbnailLocalPath) {
            throw new ApiError(400, 'Thumbnail path is required');
        }

        const thumbnailPath = await uploadOnCloudinary(thumbnailLocalPath);

        if (!thumbnailPath) {
            throw new ApiError(
                500,
                'Unable to upload the thumbnail on cloudinary',
            );
        }

        const thumbnailData = await findVideo({
            _id: new mongoose.Types.ObjectId(id),
        });
        if (thumbnailData.owner._id.toString() != req.user._id) {
            throw new ApiError(400, 'Thumbnail owner can change the thumbnail');
        }

        const updatedThumbnail = await updateVideoById(id, {
            thumbnail: thumbnailPath.url,
        });

        if (!updatedThumbnail) {
            throw new ApiError(500, 'Unable to update thumbnail');
        }

        res.status(200).json(
            new ApiResponse(
                200,
                updatedThumbnail,
                'Thumbnail updated successfully',
            ),
        );
    } catch (error) {
        throw new ApiError(500, 'Unable to update thumbnail');
    }
});
