const {
	createUser,
} = require('./auth');

const {
	addPlace,
	getPlaces,
	getFeaturedPlaces,
	getPlace,
	updatePlace,
	PlacesTrigger_updateTags,
} = require('./places');

const {
	getTags,
	getTagPlaces,
	getTag,
	updateTag,
} = require('./tags');

module.exports = {
	'addPlace': addPlace,
	'getPlaces': getPlaces,
	'getFeaturedPlaces': getFeaturedPlaces,
	'getPlace': getPlace,
	'getTags': getTags,
	'getTagPlaces': getTagPlaces,
	'getTag': getTag,
	'updatePlace': updatePlace,
	'updateTag': updateTag,
	'PlacesTrigger_updateTags': PlacesTrigger_updateTags,
	'createUser' : createUser
};
