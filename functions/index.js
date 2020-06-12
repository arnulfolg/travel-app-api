const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { HttpsError } = require('firebase-functions/lib/providers/https');
admin.initializeApp();

const increment = admin.firestore.FieldValue.increment(1)

exports.addPlace = functions.https.onRequest(async (req, res) => {
	if(req.method !== "POST"){
		throw new functions.https.HttpsError(
			'unavailable',
			'Wrong Method'
		) 
	}

	await admin.firestore().collection("places").where("place", "==", req.body.place)
		.get()
		.then(function (docs) {
			if(docs.size>0){
				res.json({ result: `Doc already exists` });
				throw new functions.https.HttpsError(
					'failed-precondition',
					'Place already exists ' + docs.size
				) 
			}else{
				admin.firestore().collection('places').add({
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

exports.getPlace = functions.https.onRequest(async (req, res) => {
	if (req.method !== "GET") {
		throw new functions.https.HttpsError(
			'unavailable',
			'Wrong Method'
		)
	}

	await admin.firestore().collection("places").where("place", "==", req.body.place)
		.get()
		.then(function (docs) {
			let result = {}
			docs.forEach(function (doc) {
				result= doc.data();
				result["id"] = doc.id
			});

			res.json(result);
		})
		.catch(function (error) {
			console.log("Error reading data base: ", error);
		});
});

exports.getTags = functions.https.onRequest(async (req, res) => {
	if (req.method !== "GET") {
		throw new functions.https.HttpsError(
			'unavailable',
			'Wrong Method'
		)
	}

	await admin.firestore().collection("tags")
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

exports.getTag = functions.https.onRequest(async (req, res) => {
	if (req.method !== "GET") {
		throw new functions.https.HttpsError(
			'unavailable',
			'Wrong Method'
		)
	}

	await admin.firestore().collection("tags").where("name", "==", req.body.tag)
		.get()
		.then(function (docs) {
			let result = {}
			docs.forEach(function (doc) {
				result= doc.data();
			});

			res.json(result);
		})
		.catch(function (error) {
			console.log("Error reading data base: ", error);
		});
});

exports.updateTags = functions.firestore.document('/places/{documentId}')
	.onCreate((snap, context) => {
		const categories = snap.data().categories;
		
		categories.forEach((element) =>{
			admin.firestore().collection("tags").where("name", "==", element)
				.get()
				.then(function (docs) {
					if (docs.size > 0) {
						let tagID;
						docs.forEach(function (doc) {
							tagID= doc.id
						});
						admin.firestore().collection('tags').doc(tagID).update({
							numPlaces: increment
						});
					} else {
						admin.firestore().collection('tags').add({
							name: element,
							numPlaces: 1
						});
					}
				})
		})
		return true;
	});
