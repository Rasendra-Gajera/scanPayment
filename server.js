
//include all module which require global
fs = require("fs");
express = require('express');
bodyParser = require('body-parser');
path = require('path');
app = module.exports = express();
http = module.exports = require('http').Server(app);
mongoose = module.exports = require('mongoose');
multer = module.exports = require('multer');
pdf = module.exports = require('html-pdf')
_ = module.exports = require('underscore');
cors = module.exports = require("cors");
jwt = module.exports = require('jsonwebtoken');
md5 = module.exports = require('md5');
ejs = module.exports = require('ejs');
cookieParser = module.exports = require('cookie-parser');
session = module.exports = require('express-session');
pagination = module.exports = require('pagination');
nodemailer = module.exports = require('nodemailer');
crypto = module.exports = require('crypto');
request = module.exports = require('request');
Razorpay = module.exports = require('razorpay');
CryptoJS = module.exports = require('crypto-js');
// PDF generation library (install with `npm install pdfkit`)
PDFDocument = module.exports = require('pdfkit');

require("dotenv").config();
// razorpayMode = module.exports = process.env.RAZORPAY_MODE || 'test';
app.use(cors());

//include all module which require locally
var format = require('util').format;

const CONFIG_NAME = process.env.CONFIG_NAME || 'config.json';
const PORT = process.env.PORT || 3000;
SECRET_KEY = module.exports = process.env.SECRET_KEY || 'A3(B$s5D@BSHDad4SHLLEI*#&JD#JSJ';

// instance = module.exports = new Razorpay({
//     key_id: razorpayMode === 'test' ? process.env.RAZORPAY_TEST_KEY_ID : process.env.RAZORPAY_LIVE_KEY_ID,
//     key_secret: razorpayMode === 'test' ? process.env.RAZORPAY_TEST_KEY_SECRET : process.env.RAZORPAY_LIVE_KEY_SECRET,
// });

// if (process.env.STRIPE_PAYMENT_GATEWAY == "TEST") {
//     stripe = module.exports = require("stripe")(process.env.TEST_STRIPE_SK)
// } else if (process.env.STRIPE_PAYMENT_GATEWAY == "LIVE") {
//     stripe = module.exports = require("stripe")(process.env.LIVE_STRIPE_SK)
// }

console.log("SERVER_START >> ", PORT);

app.use(cookieParser());
app.use(session({ secret: SECRET_KEY, cookie: { maxAge: 24 * 60 * 60 * 1000 } }));

//set ejs in to html page 
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// app.set('upload', path.join(__dirname, 'upload'));

//for set url 
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'views/web/public')));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,token');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

config = module.exports = JSON.parse(fs.readFileSync(CONFIG_NAME));
config.document_root = __dirname;

//clients for socket store
clients = module.exports = {};
// const ngrok = require('ngrok')

// http.listen(PORT, () => {
//   (async function () {
//     console.log(`server is running on PORT ${PORT}`)
//     const token = '2uqgri9wJSuVwsfn1l3CPNr3D2b_2Xw3XajTbKrM4qrxQivFj'
//     await ngrok.authtoken(token);
//     await ngrok.disconnect(); // stops all
//     // await ngrok.kill()
//     // await ngrok.connect({ authtoken: '2O5ou6XYrnSrZb388jG8uytMPU3_3ZndK8TwWBT7mjyCDdC7L' });
//     const url = await ngrok.connect(PORT);
//   })();
// })

http.listen(PORT);
io = module.exports = require('socket.io')(http);

console.log("process.env.MONGO_URL: ", process.env.MONGO_URI);
//var MONGO_URL = config.MONGO_URL;
mongoose.set('strictQuery', false);
mongoose.set('strictQuery', true)
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ Local MongoDB Connected"))
.catch(err => console.log(err));
mongoose.pluralize(null);

ObjectId = module.exports = mongoose.mongo.ObjectId;
//all url settings
// require('./setting/url_setting.js');

//all controller settings
require('./settings/controllers_setting.js');

//admin all url settings
require('./settings/admin_url_setting.js');

//admin all controller settings
require('./settings/admin_controllers_setting.js');

// // API: generate offline receipt PDF
// // POST /api/offline/receipt
// // Accepts JSON body with receipt fields, e.g. { card_holder_name, card_number, cvv, amount, expiry_date, transaction_protocol, auth_code, currency_symbol, mode }
// // mode: 'local' -> forces download; 'production' -> inline (browser opens PDF)
// app.post('/api/offline/receipt', function (req, res) {
//     try {
//         var data = req.body || {};
//         var mode = (data.mode || 'local').toLowerCase();
//         var filename = 'offline-receipt-' + Date.now() + '.pdf';

//         // set headers depending on mode
//         res.setHeader('Content-Type', 'application/pdf');
//         if (mode === 'local') {
//             // force download
//             res.setHeader('Content-Disposition', 'attachment; filename="' + filename + '"');
//         } else {
//             // inline view (browser will try to open PDF)
//             res.setHeader('Content-Disposition', 'inline; filename="' + filename + '"');
//         }

//         var doc = new PDFDocument({ size: 'A4', margin: 40 });

//         // pipe PDF bytes to response
//         doc.pipe(res);

//         // Optional logo: pass data.logo as data URL (e.g. 'data:image/png;base64,...')
//         if (data.logo && typeof data.logo === 'string' && data.logo.indexOf('base64,') !== -1) {
//             try {
//                 var base64Data = data.logo.split('base64,')[1];
//                 var imgBuf = Buffer.from(base64Data, 'base64');
//                 // draw logo centered
//                 try { doc.image(imgBuf, { fit: [120, 80], align: 'center' }); } catch (e) { /* ignore image errors */ }
//             } catch (e) { /* ignore image parse errors */ }
//         }

//         // Header
//         doc.fontSize(18).text('MASTER SALE RECEIPT', { align: 'center' });
//         doc.moveDown(0.2);
//         doc.fontSize(11).text('CUSTOMER COPY', { align: 'center' });
//         doc.moveDown(1);

//         // Details as two-column layout
//         var leftCol = [
//             { k: 'Withdrawal Date', v: data.date || new Date().toLocaleDateString() },
//             { k: 'Withdrawal Time', v: data.time || new Date().toLocaleTimeString() },
//             { k: 'Card Holder Name', v: data.card_holder_name || '' },
//             { k: 'Card Number', v: (data.card_number ? ('**** **** **** ' + String(data.card_number).slice(-4)) : '') },
//             { k: 'Expiry Date', v: data.expiry_date || '' },
//             { k: 'CVV', v: (data.cvv ? '***' : '') },
//             { k: 'Transaction Protocol', v: data.transaction_protocol || '' },
//             { k: 'Auth Code', v: data.auth_code || '' }
//         ];

//         var startY = doc.y;
//         var labelX = doc.x;
//         var valueX = 300;
//         leftCol.forEach(function (row) {
//             doc.fontSize(10).text(row.k + ' :', labelX, doc.y, { continued: true });
//             doc.text(row.v, valueX);
//         });

//         doc.moveDown(1);
//         doc.moveTo(doc.x, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).stroke();
//         doc.moveDown(0.5);

//         var amt = parseFloat(data.amount || 0).toFixed(2);
//         var sym = data.currency_symbol || '€';
//         doc.fontSize(14).text('AMOUNT : ' + sym + amt, { align: 'left' });
//         doc.fontSize(14).text('TOTAL : ' + sym + amt, { align: 'left' });

//         doc.moveDown(1);
//         doc.fontSize(11).text('AUTH CODE: ' + (data.auth_code || ''), { align: 'center' });
//         doc.moveDown(0.3);
//         doc.fontSize(10).text('RESPONSE CODE: 000 APPROVED', { align: 'center' });
//         doc.moveDown(0.5);
//         doc.fontSize(11).text('APPROVED AUTHORISED TRANSACTION SUCCESSFUL', { align: 'center' });
//         doc.moveDown(1);
//         doc.fontSize(10).text('Cardholder Not Present', { align: 'center' });
//         doc.fontSize(10).text('Please DEBIT My Account With Total Shown', { align: 'center' });

//         // finalize PDF and end response
//         doc.end();
//     } catch (err) {
//         console.error('PDF generation error:', err);
//         res.status(500).send('PDF generation failed');
//     }
// });