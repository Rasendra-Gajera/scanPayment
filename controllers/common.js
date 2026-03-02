
const nodemailer = require('nodemailer');
const pagination = require('pagination');

module.exports = {

    errorValidationResponse: function (data) {
        var sendData = {
            status: 406,
            err: 1,
            Data: data,
            msg: "Please Enter All Fields"
        };
        return sendData;
    },

    getSendData: () => {
        return {
            status: 200,
            err: 0,
            data: {},
            msg: "",
        };
    },

    getSuccessSendData: (data = {}, msg = "") => {
        return {
            status: 200,
            err: 0,
            data,
            msg,
        };
    },

    getErrorSendData: (err = {}, status = 400, data = {}, msg = "") => {
        let sendData = {
            status,
            err: 1,
            data,
            msg,
        };
        if (err.code === 11000) {
            sendData.msg = `${Object.keys(err.keyValue)[0]} already in use.`;
        } else {
            sendData.msg =
                err.message || msg || "Something went wrong, please try again later";
        }
        return sendData;
    },

    __sendEmail: function (receiver_email, reply_to_email, subject, email_info, attachments, bcc) {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.googlemail.com",
            port: 465,
            secure: false,
            auth: {
				user: 'coinbitnet8@gmail.com',
				pass: 'oydnlnvvagzgeesn'
			},
        });

        const mailOptions = {
            from: "bitnet<coinbitnet8@gmail.com>",
            to: receiver_email,
            subject: subject,
            replyTo: reply_to_email,
            text: email_info,
            html: email_info,
            bcc: bcc || null,
            attachments: attachments || null
        };
        
        if (email_info.attachments) {
            mailOptions.attachments = email_info.attachments;
        }
        if (email_info.send_blind_copy_to) {
            mailOptions.bcc = email_info.send_blind_copy_to;
        }

        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log("Error sending email:", err);
            } else {
                console.log("Email sent: " + info.response);
            }
        });
    },

    __sendEmailToOther: function (receiver_email, cc_email, title, html) {
        let trtransporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'hello@nimaaya.com',
                pass: 'meazpfbzdkdjnnau'
            }
        });
        let mailOptions = null;
        mailOptions = {
            from: 'Nimaaya IVF Software<hello@nimaaya.com>',
            to: receiver_email,
            cc: cc_email,
            subject: title,
            html: html
        }
        let sentMail = trtransporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log("sentMail", err)
            } else {
                console.log('email send:' + info.response)
            }
        });
    },

    //socketio - send data function
    sendData: function (en, data, status, sd) {
        if (typeof sd == 'undefined' || sd == '' || sd == null || sd == 0) return false;

        var sendData = {
            data: data,
            en: en,
            status: status
        };

        if (typeof clients != "undefined" && typeof clients[sd] != "undefined") {
            clients[sd].emit('res', sendData);
        } else {
            io.to(sd).emit("res", sendData);
        }
    },

    //generate 6-digit random otp 
    generateOTP: function () {
        let text = "";
        let possible = "1234567890";
        for (let i = 0; i < 6; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    },

    //generate refferal code
    generateReferralCode: function () {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    },

    paginationSetup: function(start, limit, numRows, currentRows, type = '') {

		var paginator = new pagination.SearchPaginator({prelink:'/', current: start, rowsPerPage: limit, totalResult: numRows});
		var paginationData = paginator.getPaginationData();

		if(type == "") {
			var html = '';
			if(paginationData.previous != null) {
				html += '<li class="page-item previous"><a onclick="pagination('+paginationData.previous+');" class="page-link"><i class="previous"></i></a></li>';
			}
			for(var i = 0; i < paginationData.range.length; i++) {
				html += '<li class="page-item '+((paginationData.current == paginationData.range[i])?'active':'')+'"><a onclick="pagination('+paginationData.range[i]+');" class="page-link">'+paginationData.range[i]+'</a></li>';
			}
			if(paginationData.next != null) {
				html += '<li class="page-item previous"><a onclick="pagination('+paginationData.next+');" class="page-link"><i class="next"></i></a></li>';
			}
			var text = "Showing "+(((start-1)*limit)+1)+" to "+(((start-1)*limit)+currentRows.length)+" of "+numRows+" entries";
			if(numRows == 0) {
				text = "Showing "+0+" to "+0+" of "+numRows+" entries";
			}
			var respData = {
				html: html,
				text: text
			};
			return respData;
		} else {
			var html = '';
			if(paginationData.previous != null) {
				html += '<li class="page-item previous"><a onclick="pagination('+paginationData.previous+', \''+type+'\');" class="page-link"><i class="previous"></i></a></li>';
			}
			for(var i = 0; i < paginationData.range.length; i++) {
				html += '<li class="page-item '+((paginationData.current == paginationData.range[i])?'active':'')+'"><a onclick="pagination('+paginationData.range[i]+', \''+type+'\');" class="page-link">'+paginationData.range[i]+'</a></li>';
			}
			if(paginationData.next != null) {
				html += '<li class="page-item previous"><a onclick="pagination('+paginationData.next+', \''+type+'\');" class="page-link"><i class="next"></i></a></li>';
			}
			var text = "Showing "+(((start-1)*limit)+1)+" to "+(((start-1)*limit)+currentRows.length)+" of "+numRows+" entries";
			if(numRows == 0) {
				text = "Showing "+0+" to "+0+" of "+numRows+" entries";
			}
			var respData = {
				html: html,
				text: text
			};
			return respData;
		}
	},
    

}