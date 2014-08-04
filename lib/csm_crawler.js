var Crawler = require("crawler").Crawler;
var _ = require('underscore');
var segment = require("nodejieba");
segment.loadDict("./node_modules/nodejieba/dict/jieba.dict.utf8", "./node_modules/nodejieba/dict/hmm_model.utf8");

var website = "http://chuansongme.com";

exports.VERSION = "0.0.1";

exports.CSMCrawler = function(options) {

    var self = this;

    self.callbacks = {};

    var c = new Crawler({
		"maxConnections":1,
		"interval":1000,
		// This will be called for each crawled page
		"callback": undefined,
		onDrain: function() {
			self.onDrain();
		}
	});

    self.onDrain = function() {
    	if (self.callbacks["drain"] != null) {
    		self.callbacks["drain"]();
    	};
    }

    self.on = function(name, func) {
    	self.callbacks[name] = func;
    }

    // console.log(options);
    // if (options != null && typeof options.onDrain != undefined) {
    // 	self.onDrain = options.onDrain;
    // };

	self.crawl_callback_article_page = function(error, result, $) {
		// console.log(result.body);
		// console.log(typeof $('p').text());
		// _.map($('p:first'), function(p) {
		// 	console.log(p.text());
		// });

		segment.cut($('p').text(), function(wordList) {
			keywords = {};

			for (index = 0; index < wordList.length; ++index) {
				var word = wordList[index];
				if(self.check_stopwords(word) == 0) {
    				keywords[word] = 1;
    			}
			}

			unique_keywords = _.keys(keywords);
			console.log("keyword count: " + unique_keywords.length);
			self.callbacks["keyword"](unique_keywords);
//			self.onKeyword(unique_keywords);
		});
	};

	self.crawl_callback_main_page = function(error, result, $) {
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

	self.crawl_main_page = function() {
		// Queue just one URL, with default callback
		c.queue([{
			"uri":website,
			// The global callback won't be called
			"callback": self.crawl_callback_main_page,
		}]);
	}

	self.crawl_article = function(url) {
		console.log("crawling url:" + url)
		// Queue just one URL, with default callback
		c.queue([{
			"uri":url,
			// The global callback won't be called
			"callback": self.crawl_callback_article_page,
		}]);
	}

	self.stopwords = [];
	self.load_stopwords = function() {
		var fs = require('fs'),
    	readline = require('readline');

		var rd = readline.createInterface({
    		input: fs.createReadStream('./stop_words/chinese_stop_words.utf8.lst'),
    		output: process.stdout,
    		terminal: false
		});

		rd.on('line', function(line) {
    		self.stopwords.push(line);
		});

		rd.on('close', function() {
			console.log("stopwords count: " + self.stopwords.length);
			self.callbacks["ready"] && self.callbacks["ready"]();
		});
	}

	self.check_stopwords = function(word) {
		var index;
		
		for (index = 0; index < self.stopwords.length; ++index) {
			if(word == self.stopwords[index]) {
				// console.log("matched");
				return 1;
			}
		}
		return 0;
	}

	self.initCrawler = function() {
		self.load_stopwords();
	}
}


