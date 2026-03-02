
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