module.exports = {
	BindUrl: function () {
		var selfInst = this;

		//admin login load
		app.get('/admin', function (req, res) {
			try {
				var respData = {
					title: 'Login',
					config: config
				};
				res.render("login/login.html", respData);
			} catch (err) {
				res.status(404).send(err)
			}
		});

		//admin login post using username and password
		app.post('/admin/login', function (req, res) {
			console.log("check login admin ");
			try {
				data = req.body;
				loginAdminController.LOGIN(data, function (respData) {
					if (respData.err == 0) {
						var data = respData.data;
						if (typeof req.session != "undefined") {
							req.session.userData = data;
						} else {
							console.log("req.session undefined");
						}
					}
					res.status(respData.status).send(respData);
				});
			} catch (err) {
				res.status(404).send(err);
			}
		});

		//check admin login or not
		app.get('/admin/login_check', function (req, res) {
			try {
				validationController.CHECK_SESSION(req.session, function (respData) {
					res.send(respData);
				});
			} catch (err) {
				res.status(404).send(err);
			}
		});

		//admin logout
		app.get('/admin/logout', function (req, res) {
			try {
				//direct make empty value of session
				req.session.userData = {};
				var sendData = {
					status: 200,
					err: 0,
					data: {},
					msg: "Logout Success!",
					config: config
				};
				res.redirect('/admin');
			} catch (err) {
				res.status(404).send(err)
			}
		});
	}
}