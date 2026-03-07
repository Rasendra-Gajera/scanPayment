module.exports = {
	BindUrl: function () {
		var selfInst = this;

		//admin wallet
		app.get('/admin/wallet', function (req, res) {
            console.log("in wallet");
			try {
				validationController.CHECK_SESSION(req.session, function (respData) {
					if (respData.err !== 0) {
						res.redirect('/admin');
					} else {
                        var respData2 = {
                            title: 'Wallet Setting',
                            config: config,
                            script: {
                                available: 1,
                                js: 'wallet'
                            },
                            css: {
                                available: 0,
                                css: 'wallet'
                            },
                            menu: "wallet",
                            value: respData.data
                        };
                        res.render("wallet/wallet.html", respData2);
					}
				});
			} catch (err) {
				console.log(err);
				res.status(404).send(err)
			}
		});

// list with pagination/search
		app.post('/admin/wallet/list/:start/:limit', function (req, res) {
			try {
				validationController.CHECK_SESSION(req.session, function (respData) {
					if (respData.err !== 0) {
						res.status(respData.status).send(respData);
					} else {
						const { start, limit } = req.params;
						const search = req.body.search;
						const sendData = { start: start, limit: limit, search: search };
						walletAdminController.LIST(sendData, function (resp) {
							res.status(resp.status).send(resp);
						});
					}
				});
			} catch (err) {
				res.status(404).send(err);
			}
		});

		// view single record
		app.post('/admin/wallet/view', function (req, res) {
			try {
				validationController.CHECK_SESSION(req.session, function (respData) {
					if (respData.err !== 0) {
						res.status(respData.status).send(respData);
					} else {
						const sendData = req.body;
						walletAdminController.VIEW(sendData, function (resp) {
							res.status(resp.status).send(resp);
						});
					}
				});
			} catch (err) {
				res.status(404).send(err);
			}
		});

		// save (insert or update)
		app.post('/admin/wallet/save', function (req, res) {
			try {
				validationController.CHECK_SESSION(req.session, function (respData) {
					if (respData.err !== 0) {
						res.status(respData.status).send(respData);
					} else {
						console.log("req.body: ", req.body);
						const sendData = req.body;
						walletAdminController.SAVE(sendData, function (resp) {
							res.status(resp.status).send(resp);
						});
					}
				});
			} catch (err) {
				res.status(404).send(err);
			}
		});

		// delete record
		app.post('/admin/wallet/delete', function (req, res) {
			try {
				validationController.CHECK_SESSION(req.session, function (respData) {
					if (respData.err !== 0) {
						res.status(respData.status).send(respData);
					} else {
						console.log("req.body: ", req.body);
						var sendData = req.body;
						walletAdminController.DELETE(sendData, function (resp) {
							res.status(resp.status).send(resp);
						});
					}
				});
			} catch (err) {
				res.status(404).send(err);
			}
		});
	}
};