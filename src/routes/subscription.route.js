
import { createSubscription, deleteSubscription, getAllSubscription, isSubscribedChannel } from '../controllers/subscription.controller.js';
import { verifyJwt } from '../middlewares/auth.middleware.js';
import express from 'express';

const app = express.Router();

app.route('/:channelId').post(verifyJwt, createSubscription).delete(verifyJwt, deleteSubscription);
app.route('/user/:channelId').get(verifyJwt, isSubscribedChannel);
app.route('/channel/:channelId').get(getAllSubscription);

export default app;
