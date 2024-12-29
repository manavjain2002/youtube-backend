import { Comment } from '../models/comment.model.js';

export const findComment = async (data) => {
    try {
        const comment = await Comment.find(data);
        return comment;
    } catch (error) {
        console.error(
            'Error white fetching comment by data ',
            data,
            ' :',
            error,
        );
        return null;
    }
};

export const createCommentData = async (commentData) => {
    try {
        const data = await Comment.create(commentData);
        return data;
    } catch (error) {
        console.error('Unable to create comment: ', error);
    }
};

export const updateCommentData = async (id, commentData) => {
    try {
        const data = await Comment.findByIdAndUpdate(
            id,
            {
                $set: commentData,
            },
            {
                new: true,
            },
        );
        return data;
    } catch (error) {
        console.error('Unable to update comment: ', error);
    }
};

export const deleteCommentData = async (id) => {
    try {
        const comment = await Comment.findByIdAndDelete(id);
        return comment;
    } catch (error) {
        console.error(
            'Error white deleting comment by id :',
            id,
            ' Error: ',
            error,
        );
        return null;
    }
};
