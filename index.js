var mongoose = require('mongoose');

var defaultOptions = {
	limit: 100, // items per bucket
	arrayName: 'bucket',
}

module.exports = exports = function (schema, options = defaultOptions) {

	schema.add({
		[options.arrayName]: [],
		count: Number,
		bucketCreatedAt: Date,
		bucketModifiedAt: Date,
	});

	schema.pre('save', function (next) {
		if (this.isNew) {
			this.count = 0
		}
		next();
	});

	// model methods
	schema.statics.bucketInsert = function (query, data, cb = null) {
		data._id = mongoose.Types.ObjectId();
		data.createdAt = new Date()
		var queryEnhanced = Object.assign({}, query, {
			count: {
				$lt: options.limit,
			}
		});
		var dataEnhanced = Object.assign({}, {
			'$inc': { 'count': 1 },
			'bucketModifiedAt': new Date(),
			'$push': {
				[options.arrayName]: data,
			},
		});
		return this.findOneAndUpdate(
			queryEnhanced,
			dataEnhanced,
			{
				upsert: true,
				new: true,
				sort: { 'bucketModifiedAt': -1 },
			},
			cb
		);
	}

};
