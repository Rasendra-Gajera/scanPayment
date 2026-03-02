module.exports = {
	BindUrl: function () {
		var selfInst = this;

		//admin offline
		app.get('/admin/offline', function (req, res) {
			try {
				validationController.CHECK_SESSION(req.session, function (respData) {
					if (respData.err !== 0) {
						res.redirect('/admin');
					} else {
						var respData2 = {
							title: 'Offline Transaction',
							config: config,
							script: {
								available: 1,
								js: 'offline'
							},
							css: {
								available: 0,
								css: 'offline'
							},
							menu: "offline",
							value: respData.data
						};
						res.render("offline/offline.html", respData2);
					}
				});
			} catch (err) {
				console.log(err);
				res.status(404).send(err)
			}
		});

		// list with pagination/search
		app.post('/admin/offline/list/:start/:limit', function (req, res) {
			try {
				validationController.CHECK_SESSION(req.session, function (respData) {
					if (respData.err !== 0) {
						res.status(respData.status).send(respData);
					} else {
						const { start, limit } = req.params;
						const search = req.body.search;
						const sendData = { start: start, limit: limit, search: search };
						offlineAdminController.LIST(sendData, function (resp) {
							res.status(resp.status).send(resp);
						});
					}
				});
			} catch (err) {
				res.status(404).send(err);
			}
		});

		// view single record
		app.post('/admin/offline/view', function (req, res) {
			try {
				validationController.CHECK_SESSION(req.session, function (respData) {
					if (respData.err !== 0) {
						res.status(respData.status).send(respData);
					} else {
						const sendData = req.body;
						offlineAdminController.VIEW(sendData, function (resp) {
							res.status(resp.status).send(resp);
						});
					}
				});
			} catch (err) {
				res.status(404).send(err);
			}
		});

		// save (insert or update)
		app.post('/admin/offline/save', function (req, res) {
			try {
				validationController.CHECK_SESSION(req.session, function (respData) {
					if (respData.err !== 0) {
						res.status(respData.status).send(respData);
					} else {
						console.log("req.body: ", req.body);
						const sendData = req.body;
						offlineAdminController.SAVE(sendData, function (resp) {
							res.status(resp.status).send(resp);
						});
					}
				});
			} catch (err) {
				res.status(404).send(err);
			}
		});

		// delete record
		app.post('/admin/offline/delete', function (req, res) {
			try {
				validationController.CHECK_SESSION(req.session, function (respData) {
					if (respData.err !== 0) {
						res.status(respData.status).send(respData);
					} else {
						console.log("req.body: ", req.body);
						var sendData = req.body;
						sendData.userData = respData.data;
						offlineAdminController.DELETE(sendData, function (resp) {
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