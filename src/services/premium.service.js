import mongoose from 'mongoose';
import { Premium } from '../models/premium.model.js';

export const createPremiumData = async (premiumDataToCreate) => {
    try {
        const data = await Premium.create(premiumDataToCreate);
        return data;
    } catch (error) {
        console.error('Error while creating premium data: ', error);
    }
};

export const deletePremiumData = async (premiumId) => {
    try {
        const deletedData = await Premium.findByIdAndDelete(premiumId);
        return deletedData;
    } catch (error) {
        console.error('Error while deleting premium data: ', error);
    }
};

export const findLatestPremiumData = async (userId) => {
    try {
        const data = await Premium.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(userId),
                },
            },
            {
                $sort: {
                    closingDate: 'asc',
                },
            },
        ]);

        if (data.length == 0) {
            return null;
        }

        return data[0][0];
    } catch (error) {}
};
