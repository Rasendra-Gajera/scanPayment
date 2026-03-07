const WalletModel = require("../../models/wallet");
const commonController = require("../common");      // adjust path as needed
const ObjectId = require("mongodb").ObjectId;

module.exports = {
    SAVE: async function (data, callback) {
        console.log("data: ", data);
        const sendData = { status: 200, err: 0, data: {}, msg: "" };
        try {
            const id = data.id;
            console.log("id: ", id);

            if (id && id !== "") {
                // update existing
                const condition = { _id: new ObjectId(id) };
                const updateData = {
                    selected_network: data.selected_network,
                    current_wallet: data.current_wallet,
                    updated_at: new Date(),
                };

                const resp = await WalletModel.updateOne(condition, updateData);
                sendData.data = resp;
                sendData.msg = "Wallet setting updated!";
                callback(sendData);
            } else {
                // create new
                const saveData = {
                    selected_network: data.selected_network,
                    current_wallet: data.current_wallet,
                    created_at: new Date(),
                    updated_at: new Date(),
                };
                console.log("saveData: ", saveData);

                const resp = await WalletModel.create(saveData);
                sendData.data = resp;
                sendData.msg = "New wallet setting added";
                callback(sendData);
            }
        } catch (error) {
            console.log(error.message);
            sendData.msg = "Error occured " + error.message;
            sendData.err = 1;
            sendData.status = 500;
            callback(sendData);
        }
    },

    LIST: async function (data, callback) {
        console.log("data: ", data);
        const sendData = { status: 200, err: 0, data: {}, msg: "" };
        try {
            const start = parseInt(data.start);
            const limit = parseInt(data.limit);
            const search = data.search;
            const condition = {};

            if (search && search !== "") {
                // you can choose which fields to search
                condition.selected_network = { $regex: search, $options: "i" };
            }

            console.log("condition: ", condition);
            // use countDocuments for accurate count; find().count() is not a function in Mongoose
            const numRows = await WalletModel.countDocuments(condition);
            const records = await WalletModel.find(condition).skip((start - 1) * limit).limit(limit);

            const resp = commonController.paginationSetup(
                start,
                limit,
                numRows,
                records,
                "admin/wallet/list"
            );
            sendData.data = resp;
            callback(sendData);
        } catch (error) {
            console.log(error.message);
            sendData.msg = "Error occured " + error.message;
            sendData.err = 1;
            sendData.status = 500;
            callback(sendData);
        }
    },

    VIEW: async function (data, callback) {
        console.log("data: ", data);
        const sendData = { status: 200, err: 0, data: {}, msg: "" };
        try {
            const id = data.id;
            const condition = { _id: new ObjectId(id) };
            const resp = await WalletModel.findOne(condition);
            sendData.data = resp;
            callback(sendData);
        } catch (error) {
            console.log(error.message);
            sendData.msg = "Error occured " + error.message;
            sendData.err = 1;
            sendData.status = 500;
            callback(sendData);
        }
    },

    DELETE: async function (data, callback) {
        console.log("data: ", data);
        const sendData = { status: 200, err: 0, data: {}, msg: "" };
        try {
            const id = data.id;
            const condition = { _id: new ObjectId(id) };
            const updateData = { deleted: true, updated_at: new Date() };
            const resp = await WalletModel.updateOne(condition, updateData);
            sendData.data = resp;
            sendData.msg = "Wallet setting deleted!";
            callback(sendData);
        } catch (error) {
            console.log(error.message);
            sendData.msg = "Error occured " + error.message;
            sendData.err = 1;
            sendData.status = 500;
            callback(sendData);
        }
    }
};