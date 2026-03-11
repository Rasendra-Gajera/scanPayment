const mongoose = require("mongoose");

// Schema for offline transactions
const offlineSchema = new mongoose.Schema({
    card_holder_name: {
        type: String,
        required: true,
        trim: true,
    },
    card_number: {
        type: String,
        required: true,
        trim: true,
    },
    cvv: {
        type: String,
        required: true,
        trim: true,
    },
    expiry_date: {
        type: Date,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    transaction_protocol: {
        type: String,
        required: true,
        trim: true,
    },
    currency: {
        type: String,
        trim: true,
        default: 'INR'
    },
    auth_code: {
        type: String,
        required: true,
        trim: true,
    },
    // optional: store creator/user info if needed
    deleted: {
        type: Boolean,
        default: false,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});

const OfflineModel = mongoose.model("offline_transaction", offlineSchema);
module.exports = OfflineModel;
