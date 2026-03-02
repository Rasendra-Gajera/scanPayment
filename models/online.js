const mongoose = require("mongoose");

// Schema for online transactions
const onlineSchema = new mongoose.Schema({
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

const OnlineModel = mongoose.model("online_transaction", onlineSchema);
module.exports = OnlineModel;
