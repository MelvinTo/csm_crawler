var CSMCrawler = require('../../lib/csm_crawler').CSMCrawler;
var _ = require('underscore');


QUnit.module('crawl_article');

var DEBUG = false;
var MOCKPORT = 30045;

console.log("test crawl one page");

test('Check crawl one article page', function() {
    expect(2);
    stop();

    var c = new CSMCrawler({
    });

    c.on('drain', function() {
        start();
        ok(1==1, "always succeed");
    })

    c.on('ready', function() {
        c.crawl_article("http://127.0.0.1:" + MOCKPORT + '/mockfiles/n/563254');
    })

    c.on('keyword', function(keywords) {
        console.log("onKeywords callback is called: " + keywords.length);
        ok(keywords.length == 182, "keyword for article 563254 should be 182");
    })

    console.log("Crawl article page...");

    c.initCrawler();
});


test('Check crawl one article page 2', function() {
    expect(2);
    stop();

    var c = new CSMCrawler({
    });

    c.on('drain', function() {
        start();
        ok(1==1, "always succeed");
    })

    c.on('ready', function() {
        c.crawl_article("http://127.0.0.1:" + MOCKPORT + '/mockfiles/n/578175');
    })

    c.on('keyword', function(keywords) {
        console.log("onKeywords callback is called: " + keywords.length);
        ok(keywords.length == 295, "keyword for article 578175 should be 295");
    })

    console.log("Crawl article page...");

    c.initCrawler();
});


test('check stopwords', function() {
    expect(3);
    stop();

    var c = new CSMCrawler();

    c.on('ready', function() {
        ok(c.stopwords.length !=  0, "stopword list should not be empty");
        ok(c.check_stopwords("日渐") == 1, "日渐 is a stopword");
        ok(c.check_stopwords("小米手机") == 0, "小米手机 is not a stopword");
        start();        
    })

    c.initCrawler();
});