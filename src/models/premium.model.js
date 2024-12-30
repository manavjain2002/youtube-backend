import mongoose from 'mongoose';

function getDate(){
    const today = new Date();
    today.setMonth(today.getMonth() + 3);
    return today
}


const PremiumSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        startingDate: {
            type: Date,
            default: new Date().getTime(), // current timestamp
        },
        closingDate: {
            type: Date,
            default: getDate(), // 3 months
        },
        referralCode: {
            type: String,
        },
        amountPaid: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    },
);

export const Premium = mongoose.model('Premium', PremiumSchema);
