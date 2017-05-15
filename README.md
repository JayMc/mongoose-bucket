# mongoose-bucket

## Basic usage (setup)
```javascript
MySchema = mongoose.Schema({
	parent_id: String,
});

MySchema.plugin(bucket, /* options */);
```

## options
```javascript
const options = {
	limit: 100, // number of items per bucket
	arrayName: 'bucket', // name of the array containing the subdocs
}
```

## Basic usage (save to next bucket)
Callback
```javascript
MySchema.bucketInsert(parent_id, newComment, function (err, doc) {

})
```

Promise
```javascript
MySchema.bucketInsert(parent_id, newComment)
	.then(result => {

	})
	.catch(error => {

	})
```

## get (dev) going
* nvm use
* npm i
* ??
* npm run test
