import { Like } from '../models/like.model.js';

export const findLikes = async (data) => {
    try {
        const like = await Like.find(data);
        return like;
    } catch (error) {
        console.error('Error white fetching like by data ', data, ' :', error);
        return null;
    }
};

export const createLikes = async (likeData) => {
    try {
        const data = await Like.create(likeData);
        return data;
    } catch (error) {
        console.error('Unable to create like: ', error);
    }
};

export const deleteLikes = async (id) => {
    try {
        const like = await Like.findByIdAndDelete(id);
        return like;
    } catch (error) {
        console.error(
            'Error white deleting like by id :',
            id,
            ' Error: ',
            error,
        );
        return null;
    }
};
