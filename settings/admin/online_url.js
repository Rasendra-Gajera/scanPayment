module.exports = {
	BindUrl: function () {
		var selfInst = this;

		//admin online
		app.get('/admin/online', function (req, res) {
            console.log("in");
			try {
				validationController.CHECK_SESSION(req.session, function (respData) {
					if (respData.err !== 0) {
						res.redirect('/admin');
					} else {
                        var respData2 = {
                            title: 'Online Transaction',
                            config: config,
                            script: {
                                available: 1,
                                js: 'online'
                            },
                            css: {
                                available: 0,
                                css: 'online'
                            },
                            menu: "online",
                            value: respData.data
                        };
                        res.render("online/online.html", respData2);
					}
				});
			} catch (err) {
				console.log(err);
				res.status(404).send(err)
			}
		});
// list with pagination/search
		app.post('/admin/online/list/:start/:limit', function (req, res) {
			try {
				validationController.CHECK_SESSION(req.session, function (respData) {
					if (respData.err !== 0) {
						res.status(respData.status).send(respData);
					} else {
						const { start, limit } = req.params;
						const search = req.body.search;
						const sendData = { start: start, limit: limit, search: search };
						onlineAdminController.LIST(sendData, function (resp) {
							res.status(resp.status).send(resp);
						});
					}
				});
			} catch (err) {
				res.status(404).send(err);
			}
		});

		// view single record
		app.post('/admin/online/view', function (req, res) {
			try {
				validationController.CHECK_SESSION(req.session, function (respData) {
					if (respData.err !== 0) {
						res.status(respData.status).send(respData);
					} else {
						const sendData = req.body;
						onlineAdminController.VIEW(sendData, function (resp) {
							res.status(resp.status).send(resp);
						});
					}
				});
			} catch (err) {
				res.status(404).send(err);
			}
		});

		// save (insert or update)
		app.post('/admin/online/save', function (req, res) {
			try {
				validationController.CHECK_SESSION(req.session, function (respData) {
					if (respData.err !== 0) {
						res.status(respData.status).send(respData);
					} else {
						console.log("req.body: ", req.body);
						const sendData = req.body;
						onlineAdminController.SAVE(sendData, function (resp) {
							res.status(resp.status).send(resp);
						});
					}
				});
			} catch (err) {
				res.status(404).send(err);
			}
		});

		// delete record
		app.post('/admin/online/delete', function (req, res) {
			try {
				validationController.CHECK_SESSION(req.session, function (respData) {
					if (respData.err !== 0) {
						res.status(respData.status).send(respData);
					} else {
						console.log("req.body: ", req.body);
						var sendData = req.body;
						sendData.userData = respData.data;
						onlineAdminController.DELETE(sendData, function (resp) {
							res.status(resp.status).send(resp);
						});
					}
				});
			} catch (err) {
				res.status(404).send(err);
			}
		});
	}
}