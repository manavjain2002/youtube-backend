import { Like } from '../models/like.model.js';

export const findLike = async (data) => {
    try {
        const like = await Like.findOne(data);
        return like;
    } catch (error) {
        console.error('Error white fetching like by data ', data, ' :', error);
        return null;
    }
};

export const createLike = async (likeData) => {
    try {
        const data = await Like.create(likeData);
        return data;
    } catch (error) {
        console.error('Unable to create like: ', error);
    }
};

export const deleteLike = async (id) => {
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
