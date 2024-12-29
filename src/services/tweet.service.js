import { Tweet } from '../models/tweet.model.js';

export const findTweet = async (data) => {
    try {
        const tweet = await Tweet.find(data);
        return tweet;
    } catch (error) {
        console.error('Error white fetching tweet by data ', data, ' :', error);
        return null;
    }
};

export const createTweetData = async (tweetData) => {
    try {
        const data = await Tweet.create(tweetData);
        return data;
    } catch (error) {
        console.error('Unable to create tweet: ', error);
    }
};

export const updateTweetData = async (id, tweetData) => {
    try {
        const data = await Tweet.findByIdAndUpdate(
            id,
            {
                $set: tweetData,
            },
            {
                new: true,
            },
        );
        return data;
    } catch (error) {
        console.error('Unable to update tweet: ', error);
    }
};

export const deleteTweetData = async (id) => {
    try {
        const tweet = await Tweet.findByIdAndDelete(id);
        return tweet;
    } catch (error) {
        console.error(
            'Error white deleting tweet by id :',
            id,
            ' Error: ',
            error,
        );
        return null;
    }
};
