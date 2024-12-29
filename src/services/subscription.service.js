import { Subscription } from '../models/subscription.model';

export const findSubscription = async (data) => {
    try {
        const subscription = await Subscription.findOne(data);
        return subscription;
    } catch (error) {
        console.error(
            'Error white fetching subscription by data ',
            data,
            ' :',
            error,
        );
        return null;
    }
};

export const createSubscription = async (subscriptionData) => {
    try {
        const data = await Subscription.create(subscriptionData);
        return data;
    } catch (error) {
        console.error('Unable to create subscription: ', error);
    }
};

export const deleteSubscription = async (id) => {
    try {
        const subscription = await Subscription.findByIdAndDelete(id);
        return subscription;
    } catch (error) {
        console.error(
            'Error white deleting subscription by id :',
            id,
            ' Error: ',
            error,
        );
        return null;
    }
};
