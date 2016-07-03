//compress.js
//This file compresses index.html and its dependencies into compressed.html
var Inliner = require('inliner');
var fs = require('fs');

new Inliner('index.html', function (error, html) {
	if (error)
		console.log(error);
	fs.writeFile("compressed.html", html, function(err) {
		if(err)
			console.log(err);
		console.log("Compressed!!! Checkout compressed.html");
	}); 
});