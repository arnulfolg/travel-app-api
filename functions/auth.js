const {
	functions,
	HttpsError,
	auth,
	cors,
} = require('./admin');


const createUser = functions.https.onRequest((req, res) => {
	cors(req, res, async () => {
		if (req.method !== "POST") {
			throw new functions.https.HttpsError(
				'unavailable',
				'Wrong Method'
			)
		}

		await auth.createUser({
				email: req.body.email,
				emailVerified: false,
				password: req.body.password,
				disabled: false
			})
			.then(function (userRecord) {
				// See the UserRecord reference doc for the contents of userRecord.
				res.json({ result: `Successfully created new user:` + userRecord.uid });
			})
			.catch(function (error) {
				console.log("Error creating new user:", error);
			});
	})

});

module.exports = {
	'createUser': createUser
};