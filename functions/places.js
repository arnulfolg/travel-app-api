const {
	functions,
	HttpsError,
	increment,
	firestore,
} = require('./admin');

const addPlace = functions.https.onRequest(async (req, res) => {
	if (req.method !== "POST") {
		throw new functions.https.HttpsError(
			'unavailable',
			'Wrong Method'
		)
	}

	await firestore.collection("places").where("place", "==", req.body.place)
		.get()
		.then(function (docs) {
			if (docs.size > 0) {
				res.json({ result: `Doc already exists` });
				throw new functions.https.HttpsError(
					'failed-precondition',
					'Place already exists ' + docs.size
				)
			} else {
				firestore.collection('places').add({
					place: req.body.place,
					description: req.body.description,
					categories: req.body.categories
				});
				res.json({ result: `${req.method} request made with data` });
			}
		})
		.catch(function (error) {
			console.log("Error reading data base: ", error);
		});

});

const getPlaces = functions.https.onRequest(async (req, res) => {
	if (req.method !== "GET") {
		throw new functions.https.HttpsError(
			'unavailable',
			'Wrong Method'
		)
	}

	await firestore.collection("places")
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

const getPlace = functions.https.onRequest(async (req, res) => {
	if (req.method !== "GET") {
		throw new functions.https.HttpsError(
			'unavailable',
			'Wrong Method'
		)
	}

	await firestore.collection("places").where("place", "==", req.body.place)
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
});

const updatePlace = functions.https.onRequest(async (req, res) => {
	if (req.method !== "PATCH") {
		throw new functions.https.HttpsError(
			'unavailable',
			'Wrong Method'
		)
	}

	firestore.collection('places').doc(req.body.id).update({
		place: req.body.place,
		description: req.body.description,
		image: req.body.image
	});

	res.json({ result: `Place updated` });
});

// Trigger
const PlacesTrigger_updateTags = functions.firestore.document('/places/{documentId}')
	.onCreate((snap, context) => {
		const categories = snap.data().categories;

		categories.forEach((element) => {
			firestore.collection("tags").where("name", "==", element)
				.get()
				.then(function (docs) {
					if (docs.size > 0) {
						let tagID;
						docs.forEach(function (doc) {
							tagID = doc.id
						});
						firestore.collection('tags').doc(tagID).update({
							numPlaces: increment
						});
					} else {
						firestore.collection('tags').add({
							name: element,
							numPlaces: 1
						});
					}
				})
		})
		return true;
	});


module.exports = {
	'addPlace': addPlace,
	'getPlaces': getPlaces,
	'getPlace': getPlace,
	'updatePlace': updatePlace,
	'PlacesTrigger_updateTags': PlacesTrigger_updateTags
};