const {
	functions,
	HttpsError,
	firestore,
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

const getUserPlace = functions.https.onRequest((req, res) => {
	cors(req, res, async () => {
		if (req.method !== "GET") {
			throw new functions.https.HttpsError(
				'unavailable',
				'Wrong Method'
			)
		}

		await firestore.collection("users")
		.where("uid", "==", req.query.uid)
		.where("pid", "==", req.query.pid)
			.get()
			.then(function (docs) {
				let result = {}
				docs.forEach(function (doc) {
					result = doc.data();
					result["id"] = doc.id
				});

				res.json(result);
			})
			.catch(function (error) {
				console.log("Error reading data base: ", error);
			});
	})

});


const saveUserPlace = functions.https.onRequest((req, res) => {
	cors(req, res, async () => {
		if (req.method !== "POST") {
			throw new functions.https.HttpsError(
				'unavailable',
				'Wrong Method'
			)
		}

		if(req.body.docid == null){
			firestore.collection("users")
			.add({
				uid: req.body.uid,
				pid: req.body.pid,
				likeStatus: req.body.likeStatus,
				wantToVisit: req.body.wantToVisit,
				hadVisited: req.body.hadVisited
			})
			res.json({ result: `${req.method} request made with data` });
		}else{
			firestore.collection("users").doc(req.body.docid)
			.set({
				uid: req.body.uid,
				pid: req.body.pid,
				likeStatus: req.body.likeStatus,
				wantToVisit: req.body.wantToVisit,
				hadVisited: req.body.hadVisited
			})
			res.json({ result: `${req.method} request made with data` });
		}


	})

});


module.exports = {
	'createUser': createUser,
	'saveUserPlace': saveUserPlace,
	'getUserPlace': getUserPlace
};