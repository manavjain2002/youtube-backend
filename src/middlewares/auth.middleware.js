import { accessTokenSecret, ROLES } from '../constants.js';
import { findUser } from '../services/user.service.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';

export const verifyJwt = asyncHandler(async (req, res, next) => {
    const token =
        req.cookies.accessToken ||
        req.headers('Authorization').replace('Bearer ', '');

    if (!token) {
        throw new ApiError(400, 'token is null');
    }

    const decodedData = jwt.verify(token, accessTokenSecret);

    if (!decodedData) {
        throw new ApiError(400, 'Invalid token requested');
    }

    const user = await findUser({ _id: decodedData._id });
    if (!user) {
        throw new ApiError(400, 'Invalid data');
    }

    req.user = user;

    next();
});

export const onlyAdmin = asyncHandler(async (req, res, next) => {
    if (req.user.role === ROLES.ADMIN) {
        next();
    } else {
        throw new ApiError(400, 'Only admin');
    }
});
