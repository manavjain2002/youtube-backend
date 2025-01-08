import mongoose from 'mongoose';
import { Playlist } from '../models/playlist.model.js';

export const createPlaylistData = async (playlistDataToCreate) => {
    try {
        const data = await Playlist.create(playlistDataToCreate);
        return data;
    } catch (error) {
        console.error('Error while creating playlist data: ', error);
    }
};

export const deletePlaylistData = async (playlistId) => {
    try {
        const deletedData = await Playlist.findByIdAndDelete(playlistId);
        return deletedData;
    } catch (error) {
        console.error('Error while deleting playlist data: ', error);
    }
};

export const addVideoDataFromPlaylist = async (playlistId, videos) => {
    try {
        const updatedPlaylist = await Playlist.findByIdAndUpdate(
            playlistId,
            { $push: { videos: videos } }, // Remove all videoIds in the array
            { new: true } // Return the updated document
        ); // Populate videos if needed

        // Handle case where playlist is not found
        if (!updatedPlaylist) {
            throw new Error('Playlist not found');
        }

        return updatedPlaylist;
    } catch (error) {
        console.error('Error while removing video from playlist data: ', error);
    }
};

export const removeVideoDataFromPlaylist = async (playlistId, videos) => {
    try {
        const updatedPlaylist = await Playlist.findByIdAndUpdate(
            playlistId,
            { $pull: { videos: { $in: videos } } }, // Remove all videoIds in the array
            { new: true } // Return the updated document
        ); // Populate videos if needed

        // Handle case where playlist is not found
        if (!updatedPlaylist) {
            throw new Error('Playlist not found');
        }

        return updatedPlaylist;
    } catch (error) {
        console.error('Error while removing video from playlist data: ', error);
    }
};

export const findPlaylistData = async (playlistId) => {
    try {
        const data = await Playlist.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(playlistId),
                },
            },
            {
                $lookup: {
                    from: 'videos',
                    localField: 'videos',
                    foreignField: '_id',
                    as: 'videos',
                },
            },
        ]);

        if (data.length == 0) {
            return null;
        }

        return data[0];
    } catch (error) {}
};
