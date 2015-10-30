var cheerio = require( "cheerio" );
var request = require( "request" );
var fs = require("fs");
var sendmail = require('sendmail')();
var nodemailer = require('nodemailer');
var config = require('./config.js');

var thefile = __dirname+'/file';
var URLS = [
	"http://www.u-pull-it.co.uk/search/catalogue/Breaker-Parts/yard/York/cartype/Vehicles-Under-7.5-Tonnes/make/Volkswagen/model/Golf",
	"http://www.u-pull-it.co.uk/search/catalogue/Breaker-Parts/yard/York/cartype/Vehicles-Under-7.5-Tonnes/make/Volkswagen/model/Bora",
	"http://www.u-pull-it.co.uk/search/catalogue/Breaker-Parts/yard/York/cartype/Vehicles-Under-7.5-Tonnes/make/Mini"
]
URLS.forEach(function(URL){
	request( URL, function( err, code, data ) {
    	if ( err ) return;
    
    	$ = cheerio.load( data );
    
    	var test = $( "dl.lotInfo + a.viewButton" ).filter( function() {
    		var thisurl = this;
    		fs.readFile(thefile,"utf8", function (err, data) {
			  if (err) throw err;
			  if(data.indexOf(thisurl.attribs.href)===-1){
			  	//email
				var transporter = nodemailer.createTransport({
				    service: 'gmail',
				    auth: {
				        user: config.fromEmail,
				        pass: config.fromPass
				    }
				});
				transporter.sendMail({
				    from: config.fromEmail,
				    to: config.toEmail,
				    subject: 'New Stock!',
				    text: thisurl.attribs.href
				});
			  	fs.appendFile(thefile, thisurl.attribs.href+'\n', 'utf8');
			  	console.log(thisurl.attribs.href);
			  }
			});
    	} );
	} );
})

