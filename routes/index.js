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
		    var newParagraph = p1; //synonyms replaced later on
		    
		    // classification of the text
		    var classed = speak.classify("The movement began around 1790, gained momentum by 1800 and, after 1820, membership rose rapidly among Baptist and Methodist congregations whose preachers led the movement.");
		    
		    var thesaurusAPIKEY = "WPWGn8trAZDrMa8yrC0f";
		    
		    var waitingForThesaurus = classed.nouns.length;
		    
		    for (var n = 0; n<classed.nouns.length; n++) {

				var noun = classed.nouns[n];		    	
		    	console.log("NOUN:" + noun);
		    	
		    	var thesaurusQueryUrl = `http://thesaurus.altervista.org/thesaurus/v1?word=${noun}&language=en_US&key=${thesaurusAPIKEY}&output=json`;
		    	console.log("THESAURUS URL:" + thesaurusQueryUrl);
		    	
		    	request(thesaurusQueryUrl, function (err, tRes, body) {
		    		if (err) {
		    			console.log("ERROR:" + err);
		    		} else {
		    			//console.log(body);
		    			var parsedTRes = JSON.parse(body);
		    			if(parsedTRes.response) {
			    			console.log("LENGTH: " + parsedTRes.response.length);
				    		if(parsedTRes.response.length > 0) { //check if its actually got anyhting...
				    			console.log(JSON.stringify(parsedTRes.response[0]));
				    			console.log("REPLACING NOUN");
				    			var possibleSyns = parsedTRes['response'][0]['list']['synonyms'].slice('|');
				    			console.log("SYNONYM FOR " + noun + ": " + possibleSyns[0]);
				    			newParagraph.replace(noun, possibleSyns[0]); // change th 0 to random eventually...
				    			console.log("NEW PARAGRAPGH:" + newParagraph);
				    		} else {
				    			console.log("Undefined, or something. I don't know. jesus.");
				    		}
			    		}

			    		//var possibleSyns = parsedTRes['response'][0]['list']['synonyms'].slice('|');
			    		//newParagraph.replace(noun, possibleSyns[0]); // change th 0 to random eventually...
		    		}
		    		
				    waitingForThesaurus--;
				    complete();
		    	});
		    }
		    
		    function complete() {
		    	console.log("COUNT: " + waitingForThesaurus);
		    	if (waitingForThesaurus === 0) {
		    		console.log("RENDERING PAGE");
		    		res.render('index', { title: 'Mechancial Turk', paragraph: p1, classification: JSON.stringify(classed), new_paragraph: newParagraph });
		    	}
		    }
	   }
	  }
	);
	//
});

module.exports = router;