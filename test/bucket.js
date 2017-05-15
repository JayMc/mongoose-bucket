var bucket = require('../index');
var expect = require('chai').expect;
var mongoose = require('mongoose');


describe('bucket', function() {
	before(function(done) {
		mongoose.connect('mongodb://localhost/mongoose-bucket-test');

		channelBucketSchema = mongoose.Schema({
			channel_id: String,
		});

		options = {
			limit: 10,
			arrayName: 'bucket',
		};

		channelBucketSchema.plugin(bucket, options);

		ChannelBucket = mongoose.model('BucketSchemaPluginTest', channelBucketSchema);

		// reset collection
		ChannelBucket.remove({}, function() {
			done();
		})

	})

	after(function() {
		mongoose.connection.close()
	})

	it('should save the doc with a bucket', function (done) {
		testChannelBucket = new ChannelBucket({ channel_id: '1234567890' })

		testChannelBucket.save(function (err, doc){
			ChannelBucket.findOne({}, function (err, doc) {
				expect(typeof doc.bucket).to.eql('object')
				done();
			});
		});
	});

	it('should add one to the bucket', function (done) {
		var newComment = {
			body: 'first bucket'
		}
		ChannelBucket.bucketInsert({ channel_id: '1234567890' }, newComment)
			.then(doc => {
				expect(doc.bucket.length).to.eql(1)
				done()
			})
	});

	it('should add many filling the bucket up to limit', function (done) {
		var arr = []
		for (var i = 0; i < 9; i++) {
			arr.push(ChannelBucket.bucketInsert({ channel_id: '1234567890' }, {body: 'Hello' + i}))
		}

		Promise.all(arr).then(function(a) {
			ChannelBucket.findOne({ channel_id: '1234567890' })
				.then(result => {
					expect(result.bucket.length).to.eql(10)
					expect(result.bucket[9].body).to.eql('Hello8')
					done()
				})
		})
	})

	it('should add one more spilling into the next bucket', function (done) {
		var newComment = {
			body: 'next bucket'
		}
		ChannelBucket.bucketInsert({ channel_id: '1234567890' }, newComment)
			.then(doc => {
				ChannelBucket.findOne({'bucket.body': 'next bucket'})
					.then(result => {
						expect(doc.bucket.length).to.eql(1)
						expect(result._id).to.eql(doc._id)
						done()
					})
			})
	});

	it('should add one using callback', function (done) {
		var newComment = {
			body: 'hello from callback'
		}
		ChannelBucket.bucketInsert(
			{ channel_id: '1234567890' },
			newComment,
			function (err, doc) {
				expect(doc.bucket.length).to.eql(2)
				done();
			}
		)
	});

})
