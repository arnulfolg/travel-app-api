const {
	functions,
	HttpsError,
	firestore,
} = require('./admin');


const getTags = functions.https.onRequest(async (req, res) => {
	if (req.method !== "GET") {
		throw new functions.https.HttpsError(
			'unavailable',
			'Wrong Method'
		)
	}

	await firestore.collection("tags")
		.get()
		.then(function (docs) {
			let result = []
			docs.forEach(function (doc) {
				result.push(doc.data());
			});
			res.json(result);
		})
		.catch(function (error) {
			console.log("Error reading data base: ", error);
		});
});

const getTag = functions.https.onRequest(async (req, res) => {
	if (req.method !== "GET") {
		throw new functions.https.HttpsError(
			'unavailable',
			'Wrong Method'
		)
	}

	await firestore.collection("tags").where("name", "==", req.body.tag)
		.get()
		.then(function (docs) {
			let result = {}
			docs.forEach(function (doc) {
				result = doc.data();
			});

			res.json(result);
		})
		.catch(function (error) {
			console.log("Error reading data base: ", error);
		});
});

const updateTag = functions.https.onRequest(async (req, res) => {
	if (req.method !== "PATCH") {
		throw new functions.https.HttpsError(
			'unavailable',
			'Wrong Method'
		)
	}


	res.json({ result: `Tag updated` });
});


module.exports = {
	'getTags': getTags,
	'getTag': getTag,
	'updateTag': updateTag,
};