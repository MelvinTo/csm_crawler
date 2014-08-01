var Crawler = require("crawler").Crawler;
var _ = require('underscore');

var website = "http://chuansongme.com";

var c = new Crawler({
"maxConnections":1,

// This will be called for each crawled page
"callback": undefined,
});

var crawler_article_page = new function(error, result, $) {

};

var crawler_main_page = function(error, result, $) {
	_.map($('a'), function(a) {
		var href = a.href;
		var pattern = "^" + website + "/n/"; // article url pattern
		// console.log(href);
		if (href.match(pattern)) {
			// crawl each article url
			console.log("crawling url: " + href);
			c.queue([{
				"uri":href,
				// The global callback won't be called
				"callback":function(error,result, $) {
				    console.log("Grabbed",result.body.length,"bytes:" + result.body);
				}
			}]);
		}
	});
};



// Queue just one URL, with default callback
c.queue([{
	"uri":website,
	// The global callback won't be called
	"callback": crawler_main_page,
}]);