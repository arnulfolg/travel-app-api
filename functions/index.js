const {
	addPlace,
	getPlaces,
	getPlace,
	updatePlace,
	PlacesTrigger_updateTags,
} = require('./places');

const {
	getTags,
	getTag,
	updateTag,
} = require('./tags');

module.exports = {
	'addPlace': addPlace,
	'getPlaces': getPlaces,
	'getPlace': getPlace,
	'getTags': getTags,
	'getTag': getTag,
	'updatePlace': updatePlace,
	'updateTag': updateTag,
	'PlacesTrigger_updateTags': PlacesTrigger_updateTags
};
