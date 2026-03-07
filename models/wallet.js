const mongoose = require("mongoose");

// Schema for wallet settings
const walletSchema = new mongoose.Schema({
    selected_network: {
        type: String,
        required: true,
        trim: true,
    },
    current_wallet: {
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

const WalletModel = mongoose.model("wallet_setting", walletSchema);
module.exports = WalletModel;