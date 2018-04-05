var cheerio = require( "cheerio" );
var request = require( "request" );
var fs = require("fs");
var sendmail = require('sendmail')();
var nodemailer = require('nodemailer');
var config = require('./config.js');
var fullUrl = "http://www.u-pull-it.co.uk"

var thefile = __dirname+'/file';
var URLS = [
	"https://www.u-pull-it.co.uk/search/catalogue/Breaker-Parts/yard/York/cartype/Vehicles-Under-7.5-Tonnes/make/Volkswagen/model/Golf",
	"https://www.u-pull-it.co.uk/search/catalogue/Breaker-Parts/yard/York/cartype/Vehicles-Under-7.5-Tonnes/make/Volkswagen/model/Bora",
]

URLS.forEach(function(URL){Scrape(URL)});

function Scrape(URL){
	request( {"url":URL, "rejectUnauthorized": false}, function( err, code, data ) {
    	if ( err ) {
		console.log("Error making request" + err);
		return;
	}else{
		console.log(URL);
	}
    	$ = cheerio.load( data );

    	$( "dl.lotInfo + a.viewButton" ).filter( function() {
    		var thisurl = this;
    		fs.readFile(thefile,"utf8", function (err, data) {
			  if (err) throw err;
			  if(data.indexOf(thisurl.attribs.href)===-1){
			  	//email
				console.log(config.fromEmail);
				var transporter = nodemailer.createTransport({
				    service: 'gmail',
				    auth: {
				        user: config.fromEmail,
				        pass: config.fromPass
				    }
				});
				setTimeout(function(){
					transporter.sendMail({
                                    		from: config.fromEmail,
                                    		to: config.toEmail,
                                   		subject: 'New Stock!',
                                    		text: thisurl.attribs.href
                                	}, function(err, info){console.log(err); console.log(info);});
                                	fs.appendFile(thefile, thisurl.attribs.href+'\n', 'utf8');
                                	console.log(thisurl.attribs.href);
				}, Math.floor(Math.random() * 100000));
			  }
			});
    	} );
    	$( "li.pager-next a").filter(function(){
    		var thisNext = this;
    		Scrape(fullUrl + thisNext.attribs.href);
    	});
	} );
}

