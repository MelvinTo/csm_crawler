#!/usr/bin/env node

var testrunner = require('qunit'),

path = require('path').normalize( __dirname + '/..');

testrunner.setup({

});

var mockserver = require('./mockserver').app.listen(30045);

testrunner.run([
        {
            code: path + '/lib/csm_crawler.js',
            tests: [
                path + '/test/units/crawl_article.js'
            ]
        }
],function(err, report) {
  console.log('Stopping mockserver...');
  if(err != null) {
  	console.log(err);
  }
  mockserver.close();
  process.exit((err || report.failed !== 0) ? 1 : 0);
});
