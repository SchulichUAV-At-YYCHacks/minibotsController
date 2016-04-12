//compress.js

var Inliner = require('inliner');
var fs = require('fs');

new Inliner('index.html', function (error, html) {
	// compressed and inlined HTML page
	if (error)
		console.log(error);
	fs.writeFile("compressed.html", html, function(err) {
		if(err)
			console.log(err);
		console.log("Compressed!!! Checkout compressed.html");
	}); 
});