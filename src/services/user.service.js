import mongoose from 'mongoose';
import { User } from '../models/user.model.js';

export const findUser = async (data) => {
    try {
        const user = await User.findOne(data);
        return user;
    } catch (error) {
        console.error('Error white fetching user by data ', data, ' :', error);
        return null;
    }
};

export const createUser = async (userData) => {
    try {
        const data = await User.create(userData);
        return data;
    } catch (error) {
        console.error('Unable to create user: ', error);
    }
};

export const updateUserById = async (id, data) => {
    try {
        const user = await User.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true },
        ).select('-password -refreshToken');
        return user;
    } catch (error) {
        console.error(
            'Error white updating user by data: ',
            data,
            ' and id :',
            id,
            ' Error: ',
            error,
        );
        return null;
    }
};

export const deleteUserById = async (id) => {
    try {
        const user = await User.findByIdAndDelete(id).select(
            '-password -refreshToken',
        );
        return user;
    } catch (error) {
        console.error(
            'Error white deleting user by id :',
            id,
            ' Error: ',
            error,
        );
        return null;
    }
};

export const getUserProfile = async (id, loggedIn) => {
    try {
        const userProfile = await User.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(id),
                },
            },
            {
                $lookup: {
                    from: 'subscriptions',
                    as: 'subscribers',
                    localField: '_id',
                    foreignField: 'channel',
                },
            },
            {
                $lookup: {
                    from: 'subscriptions',
                    as: 'subscribedTo',
                    localField: '_id',
                    foreignField: 'subscriber',
                },
            },
            {
                $lookup: {
                    from: 'videos',
                    as: 'watchHistory',
                    localField: 'watchHistory',
                    foreignField: '_id',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'users',
                                as: 'owner',
                                localField: 'owner',
                                foreignField: '_id',
                                pipeline: [
                                    {
                                        $project: {
                                            fullName: 1,
                                            username: 1,
                                            avatar: 1,
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            $addFields: {
                                owner: {
                                    $first: '$owner',
                                },
                            },
                        },
                    ],
                },
            },
            {
                $lookup: {
                    from: 'premiums',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'isPremiumUser',
                },
            },
            {
                $addFields: {
                    subscribersCount: {
                        $size: '$subscribers',
                    },
                    subscribedToCount: {
                        $size: '$subscribedTo',
                    },
                    isSubscriber: {
                        $cond: {
                            if: { $in: [id, '$subscribers.subscriber'] },
                            then: true,
                            else: false,
                        },
                    },
                    isPremiumUser: {
                        $cond: {
                            if: {
                                $lt: [Date.now(), '$isPremiumUser.closingDate'],
                            },
                            then: true,
                            else: false,
                        },
                    },
                },
            },
            {
                $project: {
                    username: 1,
                    email: 1,
                    fullName: 1,
                    avatar: 1,
                    coverImage: 1,
                    watchHistory: 1,
                    subscribersCount: 1,
                    subscribedToCount: 1,
                    isSubscriber: 1,
                    isPremiumUser: 1,
                    role: 1,
                },
            },
        ]);

        if (userProfile.length == 0) {
            console.log('Unable to get user profile');
            return null;
        }

        if (loggedIn) {
            return userProfile[0];
        }

        userProfile[0].watchHistory = [];
        return userProfile[0];
    } catch (error) {
        console.error('Error while fetching user channel profile: ', error);
        return null;
    }
};

export const getAllUsers = async () => {
    try {
        const users = await User.find({});
        return users;
    } catch (error) {
        console.error('Unable to fetch all users');
    }
};
