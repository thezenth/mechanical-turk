/*eslint-env node */
var express = require('express');
var router = express.Router();
var request = require('request');
var parse5 = require('parse5');
var jsdom = require("jsdom");
var speak = require("speakeasy-nlp");


/* GET home page. */
router.get('/', function(req, res, next) {
	
	var queryUrl = "https://en.wikipedia.org/wiki/Second_Great_Awakening";

	jsdom.env(
	  queryUrl,
	  ["http://code.jquery.com/jquery.js"],
	  function (err, window) {
	  	if(err) {
	  		console.error(err);
	  	} else {
		    var p1 = window.$("p").first().text();
		    
		    // classification of the text
		    var classy = speak.classify(p1);
		    
		    res.render('index', { title: 'Mechancial Turk', paragraph: p1, classification: JSON.stringify(classy) });
	   }
	  }
	);
	//
});

module.exports = router;