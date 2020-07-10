const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});
var serviceAccount = require("C:/Users/arnul/OneDrive/Desktop/TravelApp/travel-app-9b55f-firebase-adminsdk-1yhol-71389ab1af.json");


let firebaseConfig = {
	credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://travel-app-9b55f.firebaseio.com"
  };


admin.initializeApp(firebaseConfig);

const { HttpsError } = require('firebase-functions/lib/providers/https');
const increment = admin.firestore.FieldValue.increment(1)
const decrement = admin.firestore.FieldValue.increment(-1)
const firestore = admin.firestore()
const auth = admin.auth()

module.exports = {
	'functions': functions,
	'HttpsError': HttpsError,
	'increment': increment,
	'decrement': decrement,
	'firestore': firestore,
	'auth': auth,
	'cors': cors
};