adminUrlHandler = module.exports = require("./admin/login_url");
adminUrlHandler.BindUrl();

dashboardUrlHandler = module.exports = require("./admin/dashboard_url");
dashboardUrlHandler.BindUrl();

onlineUrlHandler = module.exports = require("./admin/online_url");
onlineUrlHandler.BindUrl();

offlineUrlHandler = module.exports = require("./admin/offline_url");
offlineUrlHandler.BindUrl();

walletUrlHandler = module.exports = require("./admin/wallet_url");
walletUrlHandler.BindUrl();