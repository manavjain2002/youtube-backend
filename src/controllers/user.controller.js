import { cookieOptions, refreshTokenSecret, ROLES } from '../constants.js';
import {
    createUser,
    deleteUserById,
    findUser,
    getAllUsers,
    getUserProfile,
    updateUserById,
} from '../services/user.service.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import jwt from 'jsonwebtoken';

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await findUser({ _id: userId });

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false });
        return {
            accessToken,
            refreshToken,
        };
    } catch (error) {
        throw new ApiError(
            500,
            error?.message || 'Unable to generate access and refresh token: ',
            error,
        );
    }
};

export const registerUser = asyncHandler(async (req, res) => {
    try {
        const { fullName, username, email, password } = req.body;
        if (
            [fullName, username, email, password].some((value) => value == '')
        ) {
            throw new ApiError(400, 'Fill all the fields properly');
        }

        const user =
            (await findUser({ email })) || (await findUser({ username }));
        if (user) {
            throw new ApiError(
                400,
                'User with this email and username already exists',
            );
        }

        const avatarLocalPath =
            req.files && req.files?.avatar.length > 0
                ? req.files?.avatar[0]?.path
                : '';

        const avatarImg =
            avatarLocalPath.length > 0
                ? await uploadOnCloudinary(avatarLocalPath)
                : '';

        const coverImgLocalPath =
            req.files && req.files?.coverImg.length > 0
                ? req.files?.coverImg[0]?.path
                : '';

        const coverImg =
            coverImgLocalPath.length > 0
                ? await uploadOnCloudinary(coverImgLocalPath)
                : '';

        const userData = {
            username,
            email,
            fullName,
            avatar: avatarImg.url,
            coverImage: coverImg.url,
            password,
        };

        const createdUser = await createUser(userData);

        if (!createdUser) {
            throw new ApiError(500, 'Cannot create user');
        }

        res.status(201).json(
            new ApiResponse(201, userData, 'User created successfully.'),
        );
    } catch (error) {
        throw new ApiError(
            500,
            error?.message || 'Unable to register user: ',
            error,
        );
    }
});

export const loginUser = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;
        if ([email, password].some((value) => value == '')) {
            throw new ApiError(400, 'Fill all the fields properly');
        }

        const user = await findUser({ email });
        if (!user) {
            throw new ApiError(400, 'User with this email does not exist');
        }

        if (!(await user?.isCorrectPassword(password))) {
            throw new ApiError(400, 'Invalid credentials');
        }

        const { accessToken, refreshToken } =
            await generateAccessAndRefreshToken(user?._id);

        res.status(200)
            .cookie('accessToken', accessToken, cookieOptions)
            .cookie('refreshToken', refreshToken, cookieOptions)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken },
                    'User logged in successfully.',
                ),
            );
    } catch (error) {
        throw new ApiError(
            500,
            error?.message || 'Unable to login user: ',
            error,
        );
    }
});

export const logoutUser = asyncHandler(async (req, res) => {
    try {
        const user = req.user;

        const updatedUser = await updateUserById(user?._id, {
            refreshToken: undefined,
        });

        if (!updatedUser) {
            throw new ApiError(500, 'Unable to logout user');
        }

        res.status(200)
            .clearCookie('accessToken', cookieOptions)
            .clearCookie('refreshToken', cookieOptions)
            .json(new ApiResponse(200, {}, 'User logged out successfully'));
    } catch (error) {
        throw new ApiError(
            500,
            error?.message || 'Unable to logout user: ',
            error,
        );
    }
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
    try {
        const token = req.cookies.refreshToken || req.body.refreshToken;

        if (!token) {
            throw new ApiError(400, 'Token is null');
        }

        const decodedData = jwt.verify(token, refreshTokenSecret);

        if (!decodedData) {
            throw new ApiError(400, 'Invalid token requested');
        }

        const user = await findUser({ _id: decodedData?._id });
        if (!user) {
            throw new ApiError(400, 'Invalid data');
        }

        if (token !== user?.refreshToken) {
            throw new ApiError(400, 'Invalid refresh token requested');
        }

        const { accessToken, refreshToken } =
            await generateAccessAndRefreshToken(user?._id);

        res.status(200)
            .cookie('accessToken', accessToken, cookieOptions)
            .cookie('refreshToken', refreshToken, cookieOptions)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken },
                    'Access token refreshed successfully.',
                ),
            );
    } catch (error) {
        throw new ApiError(
            500,
            error?.message || 'Unable to refresh access token: ',
            error,
        );
    }
});

export const updateUser = asyncHandler(async (req, res) => {
    try {
        const { fullName, email, username } = req.body;

        const user = req.user;

        const existingUser =
            (email ? await findUser({ email }) : null) ||
            (username ? await findUser({ username }) : null);
        if (existingUser) {
            throw new ApiError(
                400,
                'User with this email and username already exists',
            );
        }

        const dataToUpdate = {};
        if (email) {
            dataToUpdate.email = email;
        }

        if (username) {
            dataToUpdate.username = username;
        }

        if (fullName) {
            dataToUpdate.fullName = fullName;
        }

        const updatedUser = await updateUserById(user._id, dataToUpdate);
        if (!updatedUser) {
            throw new ApiError(500, 'Unable to update user.');
        }

        res.status(200).json(
            new ApiResponse(200, updatedUser, 'User updated successfully'),
        );
    } catch (error) {
        throw new ApiError(
            500,
            error?.message || 'Unable to update user: ',
            error,
        );
    }
});

export const updateAvatarImage = asyncHandler(async (req, res) => {
    try {
        const avatarImageLocalPath =
            req.file && req.file.path ? req.file.path : '';
        if (!avatarImageLocalPath) {
            throw new ApiError(400, 'Avatar Image path is required');
        }

        const avatarImagePath = await uploadOnCloudinary(avatarImageLocalPath);
        if (!avatarImagePath) {
            throw new ApiError(
                500,
                'Unable to upload the avatar image on cloudinary',
            );
        }

        const updatedUser = await updateUserById(req.user._id, {
            avatar: avatarImagePath.url,
        });

        if (!updatedUser) {
            throw new ApiError(500, 'Unable to update user');
        }

        res.status(200).json(
            new ApiResponse(
                200,
                updatedUser,
                'Avatar Image updated successfully',
            ),
        );
    } catch (error) {
        throw new ApiError(500, 'Unable to update avatar image');
    }
});

export const updateCoverImage = asyncHandler(async (req, res) => {
    try {
        const coverImageLocalPath =
            req.file && req.file.path ? req.file.path : '';
        if (!coverImageLocalPath) {
            throw new ApiError(400, 'Cover Image path is required');
        }

        const coverImagePath = await uploadOnCloudinary(coverImageLocalPath);
        if (!coverImagePath) {
            throw new ApiError(
                500,
                'Unable to upload the cover image on cloudinary',
            );
        }

        const updatedUser = await updateUserById(req.user._id, {
            coverImage: coverImagePath.url,
        });

        if (!updatedUser) {
            throw new ApiError(500, 'Unable to update user');
        }

        res.status(200).json(
            new ApiResponse(
                200,
                updatedUser,
                'Cover Image updated successfully',
            ),
        );
    } catch (error) {
        throw new ApiError(500, 'Unable to update cover image');
    }
});

export const updatePassword = asyncHandler(async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if ([oldPassword, newPassword].some((data) => data == '')) {
            throw new ApiError(400, 'All fields are required');
        }

        const user = await findUser({ _id: req.user._id });

        if (!(await user.isCorrectPassword(oldPassword))) {
            throw new ApiError(400, 'Invalid old password provided');
        }
        user.password = newPassword;
        await user.save({ validateBeforeSave: false });

        res.status(200).json(
            new ApiResponse(200, user, 'User password updated successfully'),
        );
    } catch (error) {
        throw new ApiError(500, error?.message || 'Unable to update password');
    }
});
export const getUserData = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new ApiError(400, 'Unable to get user data');
        }

        const user = await findUser({ _id: id });
        if (!user) {
            throw new ApiError(400, 'Invalid user id');
        }
        res.status(200).json(
            new ApiResponse(200, user, 'User fetched successfully'),
        );
    } catch (error) {
        throw new ApiError(500, error?.message || 'Unable to fetch user');
    }
});

export const getUser = asyncHandler(async (req, res) => {
    try {
        res.status(200).json(
            new ApiResponse(200, req.user, 'User fetched successfully'),
        );
    } catch (error) {
        throw new ApiError(500, error?.message || 'Unable to fetch user');
    }
});

export const getUserChannelProfile = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            throw new ApiError(400, 'Invalid id requested');
        }

        const userProfile = await getUserProfile(id, false);
        if (!userProfile) {
            throw new ApiError(400, 'Invalid user requested');
        }

        res.status(200).json(
            new ApiResponse(
                200,
                userProfile,
                'User Profile fetched successfully',
            ),
        );
    } catch (error) {
        throw new ApiError(
            500,
            error?.message || 'Unable to fetch user profile',
        );
    }
});

export const getUserWatchHistory = asyncHandler(async (req, res) => {
    try {
        const userProfile = await getUserProfile(req.user._id, true);
        if (!userProfile) {
            throw new ApiError(400, 'Invalid user requested');
        }

        res.status(200).json(
            new ApiResponse(
                200,
                userProfile.watchHistory,
                'User Profile fetched successfully',
            ),
        );
    } catch (error) {
        throw new ApiError(
            500,
            error?.message || 'Unable to fetch user watch history',
        );
    }
});

export const deleteUser = asyncHandler(async (req, res) => {
    try {
        const deletedUser = await deleteUserById(req.user._id);
        if (!deletedUser) {
            throw new ApiError(500, 'Unable to delete user');
        }

        res.status(200).json(
            new ApiResponse(200, deletedUser, 'User deleted successfully'),
        );
    } catch (error) {
        throw new ApiError(
            500,
            error?.message || 'Unable to fetch delete user',
        );
    }
});

export const addToWatchHistory = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.body;
        if (!videoId) {
            throw new ApiError(400, 'Video id is required');
        }
        const user = await findUser({ _id: req.user._id });

        const userWatchHistory = user.watchHistory;

        user.watchHistory.push(videoId);

        user.save({ validateBeforeSave: false });
        res.status(200).json(
            new ApiResponse(
                200,
                userWatchHistory,
                'Watch Histroy cleared successfully',
            ),
        );
    } catch (error) {
        throw new ApiError(
            500,
            error?.message || 'Unable to clear user watch history',
        );
    }
});

export const clearWatchHistory = asyncHandler(async (req, res) => {
    try {
        const user = await findUser({ _id: req.user._id });
        const userWatchHistory = user.watchHistory;
        user.watchHistory = [];
        user.save({ validateBeforeSave: false });
        res.status(200).json(
            new ApiResponse(
                200,
                userWatchHistory,
                'Watch Histroy cleared successfully',
            ),
        );
    } catch (error) {
        throw new ApiError(
            500,
            error?.message || 'Unable to clear user watch history',
        );
    }
});

export const getUsers = asyncHandler(async (req, res) => {
    try {
        if (req.user.role !== ROLES.ADMIN) {
            throw new ApiError(400, 'Only admin can access this endpoint');
        }
        const users = await getAllUsers();
        res.status(200).json(
            new ApiResponse(200, users, 'Users fetched successfully'),
        );
    } catch (error) {
        throw new ApiError(500, error?.message || 'Unable to get all users');
    }
});
