const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const loginTokenModel = require("../../models/login_token.js");
const { getSendData, getErrorSendData } = require("../common.js");
const jwtKey = process.env.JWT_SECRET || "your_long_and_random_secret_key_here"; // TODO: Move this to .env file

module.exports = {
  DECODE: async function (req, callback) {
    let sendData = getSendData(); //response data
    sendData.status = 401;
    sendData.msg = "token Expired";

    if (!req.headers.authorization) {
      sendData.status = 406;
      sendData.msg = "No access token provided";
    } else {
      try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, jwtKey);
        console.log("decoded: >>", decoded);
        if (decoded) {
          var condition = {
            user_id: new ObjectId(decoded.user_id),
            token: token,
          };

          var tokenData = await loginTokenModel.find(condition);
          const data = {
            user_id: decoded.user_id,
            token: token,
            iat: decoded.iat,
            exp: decoded.exp,
          };

          if (tokenData.length > 0) {
            if (typeof decoded.user_id != "undefined") {
              sendData.status = 200;
              sendData.data = data;
              sendData.msg = "";
            } else {
              sendData.msg = "Access token invalid";
            }
          }
        }
      } catch (err) {
        console.log("error: ", err);
        sendData = getErrorSendData(err, 401, {});
      }
    }
    callback(sendData);
  },
};
