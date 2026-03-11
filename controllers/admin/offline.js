const OfflineModel = require("../../models/offline");
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
                    card_holder_name: data.card_holder_name,
                    card_number: data.card_number,
                    cvv: data.cvv,
                    expiry_date: data.expiry_date ? new Date(data.expiry_date) : null,
                    amount: Number(data.amount),
                    currency: data.currency || '',
                    transaction_protocol: data.transaction_protocol,
                    auth_code: data.auth_code,
                    updated_at: new Date(),
                };

                const resp = await OfflineModel.updateOne(condition, updateData);
                sendData.data = resp;
                sendData.msg = "Transaction Successfully!";
                callback(sendData);
            } else {
                // create new
                const saveData = {
                    card_holder_name: data.card_holder_name,
                    card_number: data.card_number,
                    cvv: data.cvv,
                    expiry_date: data.expiry_date ? new Date(data.expiry_date) : null,
                    amount: Number(data.amount),
                    currency: data.currency || '',
                    transaction_protocol: data.transaction_protocol,
                    auth_code: data.auth_code,
                    created_at: new Date(),
                    updated_at: new Date(),
                };
                console.log("saveData: ", saveData);

                const resp = await OfflineModel.create(saveData);
                sendData.data = resp;
                sendData.msg = "Transaction Successfully!";
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
                condition.card_holder_name = { $regex: search, $options: "i" };
            }

            console.log("condition: ", condition);
            // use countDocuments for accurate count; find().count() is not a function in Mongoose
            const numRows = await OfflineModel.countDocuments(condition);
            console.log("numRows: ", numRows);
            const records = await OfflineModel.find(condition).skip((start - 1) * limit).limit(limit);
            console.log("records: ", records);

            const resp = commonController.paginationSetup(
                start,
                limit,
                numRows,
                records
            );
            resp.list = records;
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
        const sendData = { status: 200, err: 0, data: {}, msg: "" };
        try {
            const id = data.id;
            const condition = { _id: new ObjectId(id) };

            const record = await OfflineModel.findOne(condition);
            if (record) {
                sendData.data = record;
            } else {
                sendData.err = 1;
                sendData.msg = "No record found.";
            }
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
            const userData = data.userData;

            if (id) {
                const condition = { _id: new ObjectId(id) };
                console.log("condition: ", condition);
                // mark deleted or actually remove as per your design
                const resp = await OfflineModel.updateMany(condition, { deleted: true });
                console.log("resp: ", resp);
                sendData.data = resp;
                sendData.msg = "Offline transaction deleted successfully";
            } else {
                sendData.err = 1;
                sendData.msg = "No record found!";
            }
            callback(sendData);
        } catch (error) {
            console.log(error.message);
            sendData.msg = "Error occured " + error.message;
            sendData.err = 1;
            sendData.status = 500;
            callback(sendData);
        }
    },
};