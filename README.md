# mongoose-bucket
<p align="center">
	<img height="200" width="200" src="https://raw.githubusercontent.com/JayMc/mongoose-bucket/master/logo.png">
</p>

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
MySchema.bucketInsert(parent_id, newComment, function (err, parentDoc) {

})
```

Promise
```javascript
MySchema.bucketInsert(parent_id, newComment)
	.then(parentDoc => {

	})
	.catch(error => {

	})
```

## get (dev) going
* nvm use
* npm i
* ??
* npm run test
