import { Video } from '../models/video.model.js';

export const findVideo = async (data) => {
    try {
        const video = await Video.aggregate([
            { $match: data },
            {
                $lookup: {
                    from: 'users',
                    localField: 'owner',
                    foreignField: '_id',
                    as: 'owner',
                    pipeline: [
                        {
                            $project: {
                                username: 1,
                                email: 1,
                                fullName: 1,
                                avatar: 1,
                            },
                        },
                    ],
                },
            },
            {
                $lookup: {
                    from: 'likes',
                    localField: '_id',
                    foreignField: 'video',
                    as: 'likes',
                },
            },
            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
                    foreignField: 'video',
                    as: 'comments',
                },
            },
            {
                $lookup: {
                    from: 'tweets',
                    localField: '_id',
                    foreignField: 'video',
                    as: 'tweets',
                },
            },
            {
                $lookup: {
                    from: 'views',
                    localField: '_id',
                    foreignField: 'video',
                    as: 'views',
                },
            },
            {
                $addFields: {
                    owner: {
                        $first: '$owner',
                    },
                    likesCount: {
                        $size: '$likes',
                    },
                    commentsCount: {
                        $size: '$comments',
                    },
                    tweetsCount: {
                        $size: '$tweets',
                    },
                    viewsCount: {
                        $size: '$views',
                    },
                },
            },
            {
                $project: {
                    likesCount: 1,
                    commentsCount: 1,
                    tweetsCount: 1,
                    viewsCount: 1,
                    likes: 1,
                    comments: 1,
                    tweets: 1,
                    views: 1,
                    videoFile: 1,
                    thumbnail: 1,
                    owner: 1,
                    title: 1,
                    description: 1,
                    duration: 1,
                    isPublished: 1,
                },
            },
        ]);

        if (video.length == 0) {
            console.log('Unable to find with this data');
            return null;
        }
        return video[0];
    } catch (error) {
        console.error('Error white fetching video by data ', data, ' :', error);
        return null;
    }
};

export const createVideo = async (videoData) => {
    try {
        const data = await Video.create(videoData);
        return data;
    } catch (error) {
        console.error('Unable to create video: ', error);
    }
};

export const updateVideoById = async (id, data) => {
    try {
        const video = await Video.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true },
        );
        return video;
    } catch (error) {
        console.error(
            'Error white updating video by data: ',
            data,
            ' and id :',
            id,
            ' Error: ',
            error,
        );
        return null;
    }
};

export const deleteVideoById = async (id) => {
    try {
        const video = await Video.findByIdAndDelete(id);
        return video;
    } catch (error) {
        console.error(
            'Error white deleting video by id :',
            id,
            ' Error: ',
            error,
        );
        return null;
    }
};

export const getAllVideosData = async (
    page = 0,
    limit = 10,
    query,
    sortBy,
    sortType,
) => {
    try {
        const queryData = [
            {
                $limit: parseInt(limit),
            },
            {
                $skip: parseInt(page) * parseInt(limit),
            },
        ];

        if (sortBy && sortType) {
            const sortCriteria = {};
            sortCriteria[sortBy] = sortType;
            queryData.push({
                $sort: sortCriteria,
            });
        }

        if (query) {
            queryData.push({
                $match: query,
            });
        }

        const videos = await Video.aggregate(queryData);

        if (videos.length > 0) {
            return videos;
        }

        return null;
    } catch (error) {
        console.error('Error while getting all videos', error?.message);
    }
};
