const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});

admin.initializeApp();

const { HttpsError } = require('firebase-functions/lib/providers/https');
const increment = admin.firestore.FieldValue.increment(1)
const decrement = admin.firestore.FieldValue.increment(-1)
const firestore = admin.firestore()

module.exports = {
	'functions': functions,
	'HttpsError': HttpsError,
	'increment': increment,
	'decrement': decrement,
	'firestore': firestore,
	'cors': cors
};