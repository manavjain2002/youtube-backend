import { cookieOptions, ROLES } from '../constants.js';
import {
    createPremiumData,
    deletePremiumData,
    findLatestPremiumData,
} from '../services/premium.service.js';
import { findUser } from '../services/user.service.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createPremium = asyncHandler(async (req, res) => {
    try {
        const { startingDate, closingDate, referralCode, amountPaid } =
            req.body;

        if (!closingDate || !amountPaid) {
            throw new ApiError(400, 'Closing Date and Paid amount is required');
        }

        let newStartingDate = startingDate
            ? new Date(startingDate).toISOString()
            : new Date(Date.now()).toISOString;
        let newClosingDate = new Date(closingDate).toISOString();

        if (new Date(newClosingDate) < new Date(Date.now())) {
            throw new ApiError(
                400,
                'Closing date should be more than todays date',
            );
        }

        const premiumDataToCreate = {
            user: req.user?._id,
            startingDate: newStartingDate,
            closingDate: newClosingDate,
            referralCode,
            amountPaid,
        };

        const createdData = await createPremiumData(premiumDataToCreate);

        if (!createdData) {
            throw new ApiError(400, 'Unable to create premium data ');
        }

        res.status(200)
            .cookie('isPremiumUser', true, cookieOptions)
            .json(
                new ApiResponse(
                    200,
                    createdData,
                    'Premium data created successfully.',
                ),
            );
    } catch (error) {
        throw new ApiError(
            500,
            error?.message || 'Unable to create premium data',
        );
    }
});

export const deletePremium = asyncHandler(async (req, res) => {
    try {
        const { premiumId } = req.params;

        if (!premiumId) {
            throw new ApiError(400, 'Premium Id is required');
        }

        const premiumData = await findLatestPremiumData(req.user._id);

        if (!premiumData) {
            throw new ApiError(400, 'Invalid premium id requested');
        }

        const userData = await findUser({ _id: req.user?._id });
        if (
            premiumData.user.toString() != req.user._id.toString() &&
            userData.role != ROLES.ADMIN
        ) {
            throw new ApiError(400, 'Only premium user can delete the premium');
        }

        const deletedData = await deletePremiumData(premiumId);

        if (!deletedData) {
            throw new ApiError(400, 'Unable to delete premium data ');
        }

        res.status(200)
            .clearCookie('isPremiumUser', cookieOptions)
            .json(
                new ApiResponse(
                    200,
                    deletedData,
                    'Premium data deleted successfully.',
                ),
            );
    } catch (error) {
        throw new ApiError(
            500,
            error?.message || 'Unable to delete premium data',
        );
    }
});

export const isPremiumUser = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(
            '🚀 ~ file:  premium.controller.js:123 ~ isPremiumUser ~ userId:',
            userId,
        );

        if (!userId) {
            throw new ApiError(400, 'User Id is required');
        }

        const premiumData = await findLatestPremiumData(userId);
        console.log(
            '🚀 ~ file:  premium.controller.js:131 ~ isPremiumUser ~ premiumData:',
            premiumData,
        );

        res.status(200).json(
            new ApiResponse(
                200,
                premiumData
                    ? new Date(premiumData?.closingDate) > Date.now()
                    : false,
                'Premium data fetched successfully.',
            ),
        );
    } catch (error) {
        throw new ApiError(
            500,
            error?.message || 'Unable to fetch premium data',
        );
    }
});
