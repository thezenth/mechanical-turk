/*eslint-env node */
var express = require('express');
var router = express.Router();
var request = require('request');
var parse5 = require('parse5');
var jsdom = require("jsdom");

/* GET home page. */
router.get('/', function(req, res, next) {
	
	var queryUrl = "https://en.wikipedia.org/wiki/Second_Great_Awakening";

	jsdom.env(
	  queryUrl,
	  ["http://code.jquery.com/jquery.js"],
	  function (err, window) {
	    var p1 = window.$("p").first().text();
	    
	    console.log("there have been", window.$("a").length - 4, "io.js releases!");
	  }
	);
	//res.render('index', { title: 'Mechancial Turk', paragraph: display });
});

module.exports = router;