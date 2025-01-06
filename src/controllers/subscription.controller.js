import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const createSubscription = asyncHandler(async (req, res) => {
    try {
        const { channelId } = req.params;
        if (!channelId) {
            throw new ApiError(400, 'Channel is required');
        }

        const alreadySubscribed = await findSubscriptions({
            channel: channelId,
            subscriber: req.user._id,
        });

        if (alreadySubscribed) {
            throw new ApiError(400, 'Already subscribed');
        }

        const subscribeData = {
            channel: channelId,
            subscriber: req.user._id,
        };

        const data = await createSubscription(subscribeData);

        if (!data) {
            throw new ApiError(400, 'Unable to create subscription');
        }

        res.status(200).json(
            new ApiResponse(200, data, 'Subscription created successfully'),
        );
    } catch (error) {
        throw new ApiError(400, 'Unable to create subscriptions');
    }
});

export const deleteSubscription = asyncHandler(async (req, res) => {
    try {
        const { channelId } = req.body;
        if (!channelId) {
            throw new ApiError(400, 'Channel Id is required');
        }

        const subscriptionData = await findSubscriptions({
            channel: channelId,
            subscriber: req.user._id,
        });

        if (!subscriptionData) {
            throw new ApiError(400, 'Not subscriptiond');
        }

        if (subscriptionData.subscriber !== req.user._id) {
            throw new ApiError(
                400,
                'Only subscriber can delete the subscription',
            );
        }

        const data = await deleteSubscription(subscriptionData._id);

        if (!data) {
            throw new ApiError(400, 'Unable to delete subscription');
        }

        res.status(200).json(
            new ApiResponse(200, data, 'Subscription deleted successfully'),
        );
    } catch (error) {
        throw new ApiError(400, 'Unable to delete subscriptions');
    }
});

export const isSubscribedChannel = asyncHandler(async (req, res) => {
    try {
        const { channelId } = req.body;
        if (!channelId) {
            throw new ApiError(400, 'Channel Id is required');
        }

        const alreadySubscribed = await findSubscriptions({
            channel: channelId,
            subscriber: req.user._id,
        });

        res.status(200).json(
            new ApiResponse(
                200,
                alreadySubscribed ? true : false,
                'Subscription fetched successfully',
            ),
        );
    } catch (error) {
        throw new ApiError(400, 'Unable to fetch subscriptions');
    }
});

export const getAllSubscription = asyncHandler(async (req, res) => {
    try {
        const { channel } = req.body;
        if (!channel) {
            throw new ApiError(400, 'Channel Id is required');
        }

        const subscriptions = await findSubscriptions({
            channel: channel,
        });

        res.status(200).json(
            new ApiResponse(
                200,
                subscriptions,
                'Subscription fetched successfully',
            ),
        );
    } catch (error) {
        throw new ApiError(400, 'Unable to fetch subscriptions');
    }
});
