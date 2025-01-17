import { ROLES } from '../constants.js';
import {
    addVideoDataFromPlaylist,
    createPlaylistData,
    deletePlaylistData,
    findPlaylistData,
    removeVideoDataFromPlaylist,
} from '../services/playlist.service.js';
import { findUser } from '../services/user.service.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const checkVideoPresent = (videosToCheck, videoList) => {
    return videosToCheck.some((video) => {
        const data = videoList.map(
            (data) => data._id.toString() == video.toString(),
        );
        return data.includes(true);
    });
};

export const createPlaylist = asyncHandler(async (req, res) => {
    try {
        const { name, description, videos } = req.body;

        if (!name || !description || !videos || videos.length == 0) {
            throw new ApiError(400, 'Name and description are required');
        }

        const playlistDataToCreate = {
            owner: req.user?._id,
            name,
            description,
            videos,
        };

        const createdData = await createPlaylistData(playlistDataToCreate);

        if (!createdData) {
            throw new ApiError(400, 'Unable to create playlist data ');
        }

        res.status(200).json(
            new ApiResponse(
                200,
                createdData,
                'Playlist data created successfully.',
            ),
        );
    } catch (error) {
        throw new ApiError(
            500,
            error?.message || 'Unable to create playlist data',
        );
    }
});

export const addVideoFromPlaylist = asyncHandler(async (req, res) => {
    try {
        const { playlistId } = req.params;

        if (!playlistId) {
            throw new ApiError(400, 'Playlist Id is required');
        }

        const { videos } = req.body;
        if (!videos || videos.length == 0) {
            throw new ApiError(400, 'Videos are required');
        }

        const playlistData = await findPlaylistData(playlistId);

        if (!playlistData) {
            throw new ApiError(400, `Unable to fetch playlist`);
        }

        if (checkVideoPresent(videos, playlistData.videos)) {
            throw new ApiError(
                400,
                `One of the video is already present in playlist`,
            );
        }

        const updatedData = await addVideoDataFromPlaylist(playlistId, videos);
        if (!updatedData) {
            throw new ApiError(400, 'Unable to add videos');
        }

        res.status(200).json(
            new ApiResponse(
                200,
                updatedData,
                'Video added to playlist successfully.',
            ),
        );
    } catch (error) {
        throw new ApiError(
            500,
            error?.message || 'Unable to create playlist data',
        );
    }
});

export const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    try {
        const { playlistId } = req.params;

        if (!playlistId) {
            throw new ApiError(400, 'Playlist Id is required');
        }

        const { videos } = req.body;
        if (!videos || videos.length == 0) {
            throw new ApiError(400, 'Videos are required');
        }

        const playlistData = await findPlaylistData(playlistId);
        if (!playlistData) {
            throw new ApiError(400, `Unable to fetch playlist`);
        }

        if (!checkVideoPresent(videos, playlistData.videos)) {
            throw new ApiError(
                400,
                `One of the video is not present in playlist`,
            );
        }

        const updatedData = await removeVideoDataFromPlaylist(
            playlistId,
            videos,
        );
        if (!updatedData) {
            throw new ApiError(400, 'Unable to remove videos');
        }

        res.status(200).json(
            new ApiResponse(
                200,
                updatedData,
                'Video removed from playlist successfully.',
            ),
        );
    } catch (error) {
        throw new ApiError(
            500,
            error?.message || 'Unable to create playlist data',
        );
    }
});

export const deletePlaylist = asyncHandler(async (req, res) => {
    try {
        const { playlistId } = req.params;

        if (!playlistId) {
            throw new ApiError(400, 'Playlist Id is required');
        }

        const playlistData = await findPlaylistData(playlistId);
        if (!playlistData) {
            throw new ApiError(400, 'Invalid playlist id requested');
        }

        const userData = await findUser({ _id: req.user?._id });

        if (
            playlistData.owner !== req.user._id &&
            userData.role !== ROLES.ADMIN
        ) {
            throw new ApiError(
                400,
                'Only playlist creator or admin can delete the playlist',
            );
        }

        const deletedData = await deletePlaylistData({ _id: playlistId });

        if (!deletedData) {
            throw new ApiError(400, 'Unable to delete playlist data ');
        }

        res.status(200).json(
            new ApiResponse(
                200,
                deletedData,
                'Playlist data deleted successfully.',
            ),
        );
    } catch (error) {
        throw new ApiError(
            500,
            error?.message || 'Unable to delete playlist data',
        );
    }
});

export const getPlaylist = asyncHandler(async (req, res) => {
    try {
        const { playlistId } = req.params;

        if (!playlistId) {
            throw new ApiError(400, 'Playlist Id is required');
        }

        const playlistData = await findPlaylistData(playlistId);
        if (!playlistData) {
            throw new ApiError(400, 'Invalid playlist id requested');
        }

        res.status(200).json(
            new ApiResponse(
                200,
                playlistData,
                'Playlist data fetched successfully.',
            ),
        );
    } catch (error) {
        throw new ApiError(
            500,
            error?.message || 'Unable to fetch playlist data',
        );
    }
});
