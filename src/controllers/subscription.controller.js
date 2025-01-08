import { createSubscriptions, deleteSubscriptions, findSubscriptions } from '../services/subscription.service.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

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

        if (alreadySubscribed && alreadySubscribed.length > 0) {
            throw new ApiError(400, 'Already subscribed');
        }

        const subscribeData = {
            channel: channelId,
            subscriber: req.user._id,
        };

        const data = await createSubscriptions(subscribeData);

        if (!data) {
            throw new ApiError(400, 'Unable to create subscription');
        }

        res.status(200).json(
            new ApiResponse(200, data, 'Subscription created successfully'),
        );
    } catch (error) {
        throw new ApiError(400, error?.message || 'Unable to create subscriptions');
    }
});

export const deleteSubscription = asyncHandler(async (req, res) => {
    try {
        const { channelId } = req.params;
        if (!channelId) {
            throw new ApiError(400, 'Channel Id is required');
        }

        const subscriptionData = await findSubscriptions({
            channel: channelId,
            subscriber: req.user._id,
        });

        if (!subscriptionData || subscriptionData.length == 0) {
            throw new ApiError(400, 'Not subscriptions');
        }

        if (subscriptionData[0].subscriber.toString() != req.user._id.toString()) {
            throw new ApiError(
                400,
                'Only subscriber can delete the subscription',
            );
        }

        const data = await deleteSubscriptions(subscriptionData[0]._id);

        if (!data) {
            throw new ApiError(400, 'Unable to delete subscription');
        }

        res.status(200).json(
            new ApiResponse(200, data, 'Subscription deleted successfully'),
        );
    } catch (error) {
        throw new ApiError(400, error?.message || 'Unable to delete subscriptions');
    }
});

export const isSubscribedChannel = asyncHandler(async (req, res) => {
    try {
        const { channelId } = req.params;
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
                alreadySubscribed && alreadySubscribed.length > 0 ? true : false,
                'Subscription fetched successfully',
            ),
        );
    } catch (error) {
        throw new ApiError(400, error?.message || 'Unable to fetch subscriptions');
    }
});

export const getAllSubscription = asyncHandler(async (req, res) => {
    try {
        const { channelId } = req.params;
        if (!channelId) {
            throw new ApiError(400, 'Channel Id is required');
        }

        const subscriptions = await findSubscriptions({
            channel: channelId,
        });

        res.status(200).json(
            new ApiResponse(
                200,
                subscriptions,
                'Subscription fetched successfully',
            ),
        );
    } catch (error) {
        throw new ApiError(400, error?.message ||  'Unable to fetch subscriptions');
    }
});
