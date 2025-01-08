import {
    createPremium,
    deletePremium,
    isPremiumUser,
} from '../controllers/ premium.controller.js';
import { verifyJwt } from '../middlewares/auth.middleware.js';
import express from 'express';

const app = express.Router();

app.route('/').post(verifyJwt, createPremium);
app.route('/:premiumId').delete(verifyJwt, deletePremium);
app.route('/user/:userId').get(verifyJwt, isPremiumUser);

export default app;
