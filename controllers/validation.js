module.exports = {
	//check admin session is available or not
	CHECK_SESSION: function(data, callback) {
		//send data
		var sendData = {
			status : 200,
			err : 0,
			data : {},
			msg : ""
		};
		// console.log(data.userData);
		if(typeof data.userData != "undefined" && typeof data.userData._id != "undefined" && data.userData._id != "") {
			sendData['data'] = data.userData;
			sendData['msg'] = "user login";
		} else {
			sendData['msg'] = "user not login!";
			sendData['err'] = 2;
		}
		callback(sendData);
	}
}