module.exports = {
	BindUrl: function () {
		var selfInst = this;

		//admin dashboard
		app.get('/admin/dashboard', function (req, res) {
			try {
				validationController.CHECK_SESSION(req.session, function (respData) {
					if (respData.err !== 0) {
						res.redirect('/admin');
					} else {
						dashboardAdminController.GET_DASHBOARD_COUNT({}, function (respData) {
							console.log("respData: ", respData);
							if (respData.err !== 0) {
								res.redirect('/admin');
							} else {
								var respData2 = {
									title: 'Dashboard',
									config: config,
									script: {
										available: 1,
										js: 'dashboard'
									},
									css: {
										available: 0,
										css: 'dashboard'
									},
									menu: "dashboard",
									value: respData.data
								};
								res.render("dashboard/dashboard.html", respData2);
							}
						});
					}
				});
			} catch (err) {
				console.log(err);
				res.status(404).send(err)
			}
		});

		
	}
}