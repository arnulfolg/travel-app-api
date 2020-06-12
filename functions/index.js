const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { HttpsError } = require('firebase-functions/lib/providers/https');
admin.initializeApp();

exports.addPlace = functions.https.onRequest(async (req, res) => {
	if(req.method !== "POST"){
		throw new functions.https.HttpsError(
			'unavailable',
			'Wrong Method'
		) 
	}
	const newPlace = await admin.firestore().collection('places').add({
		place: req.body.place,
		description: req.body.description,
		categories: req.body.categories
	});
	res.json({ result: `${req.method} request made with data ${newPlace.id}` });
});

exports.updateTags = functions.firestore.document('/places/{documentId}')
	.onCreate((snap, context) => {
		const cats = snap.data().categories;
		const place = snap.data().place;
		
		cats.forEach((element) =>{
			admin.firestore().collection('tags').add({
				name: element,
				places: [context.params.documentId]
			});
		})

		return true;
	});
