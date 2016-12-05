/*eslint-env node */
var express = require('express');
var router = express.Router();
var request = require('request');
var parse5 = require('parse5');

/* GET home page. */
router.get('/', function(req, res, next) {
	
	var queryUrl = "https://en.wikipedia.org/wiki/Second_Great_Awakening";
	request(queryUrl, function(err, qRes, body) {
		var document = parse5.parse(body);
		
		var display = document.childNodes[1]['html']['body'][3][4][3][5];
		
		res.render('index', { title: 'Mechancial Turk', paragraph: display });
	});

	

});

module.exports = router;