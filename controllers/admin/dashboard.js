
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


    RECEIPT: async function (data, callback) {
        console.log("data111111111111111111111111: ", data);
        try {
            const sendData = {
                status: 200,
                err: 0,
                msg: "",
                data: {}
            };

            //--------------------------------------------------

            function randomNumber(length) {
                let txt = "";
                const nums = "0123456789";
                
                for (let i = 0; i < length; i++) {
                    txt += nums[Math.floor(Math.random() * nums.length)];
                }
                return txt;
            }

            //--------------------------------------------------

            function randomString(length) {
                let txt = "";
                const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

                for (let i = 0; i < length; i++) {
                    txt += chars[Math.floor(Math.random() * chars.length)];
                }

                return txt;
            }

            //--------------------------------------------------

            function maskCard(card) {
                if (!card) return "";
                card = card.toString();
                return "********" + card.slice(-4);
            }

            //--------------------------------------------------

            const now = new Date();
            console.log("data: ", data);
            //--------------------------------------------------
            console.log("sendData: ", sendData);
            sendData.data = {
                date: now.toLocaleDateString(),
                time: now.toLocaleTimeString(),
                invoice_no: "****" + randomNumber(3),
                mid: "****6377",
                tid: "****2667",
                transaction_id: "#" + randomString(8),
                reference: randomString(4),
                receipt_no: "**" + randomNumber(2),
                message_no: "**" + randomNumber(2),
                card_holder_name: data.card_holder_name || "",
                card_number: maskCard(data.card_number),
                expiry_date: data.expiry_date || "",
                cvv: data.cvv ? "***" : "",
                amount: Number(data.amount || 0).toFixed(2),
                currency_symbol: data.currency_symbol || "₹",
                auth_code: data.auth_code || "",
                transaction_protocol: data.transaction_protocol || "",
                response_code: "000 APPROVED",
                entry_mode: "Manual",
                currency: data.currency || ""
            };

            callback(sendData);
        } catch (error) {
            callback({
                status: 500,
                err: 1,
                msg: error.message,
                data: {}
            });
        }
    },
}