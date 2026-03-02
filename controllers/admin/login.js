const adminModel = require("../../models/admin_login");
module.exports = {
    //LOGIN
    LOGIN: async function (data, callback) {
        console.log("login data>>>>>>: ", data);
        //send data
        var sendData = {
            status: 200,
            err: 0,
            data: {},
            msg: ""
        };
        //condition
        var condition = {
            "username": data.username,
            "password": md5(data.password)
        };
        console.log("condition: ", condition);
        var usersData = await adminModel.find(condition);
        console.log("usersData: ", usersData);
        if (usersData.length < 0) {
            sendData['status'] = 406;
            sendData['err'] = 1;
            sendData['data'] = err;
            sendData['msg'] = "Something is wrong. Try again!";
            callback(sendData);
        } else {
            if (usersData.length > 0) {
                usersData = usersData[0];
                
                //if user is exist
                sendData['data'] = usersData;
                callback(sendData);
            } else {
                sendData['status'] = 200;
                sendData['err'] = 1;
                sendData['data'] = {};
                sendData['msg'] = "Username and Password doesn't match.";
                callback(sendData);
            }
        }
    }
}