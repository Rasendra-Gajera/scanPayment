
module.exports = {

    GET_DASHBOARD_COUNT: async function (data, callback) {
        var sendData = {
            status: 200,
            err: 0,
            data: data.body,
            msg: ""
        };
        var today = new Date().toISOString()
        today = today.split("T")[0]

        var today = new Date();
        today.setHours(23, 59, 59, 999); // Set time to the start of the day

        var respData = {
            totalUser: "01",
            todaysUser: "00",
            activeUserCount: "01",
            softwareSuccessCount: "01",
            contactUsCount: "01",
            softwareStatusIncompleCount: "01",
        }
        sendData['status'] = 200;
        sendData['err'] = 0;
        sendData['data'] = respData;
        callback(sendData);
    },

}