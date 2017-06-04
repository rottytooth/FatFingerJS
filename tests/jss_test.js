'use strict';

var javascirpt = require("../javaScirpt.js");
var grunt = require('grunt');
var path = require('path');
var fs = require("fs");

var runTest = function(jsFile, test) {
  var content = fs.readFileSync("tests/" + jsFile);
  var jsonContent = JSON.parse(content);
  for(var i in jsonContent.tests) {
    var codeblock = jsonContent.tests[i];
    console.log("testing " + codeblock.description);
    var results = javascirpt.run(codeblock.original)
    test.equal(results.succeeded, true);
    test.equal(codeblock.transformed.replace(/\s+/g, " "), results.text.replace(/\s+/g, " "));
  }
  test.done();
}

exports.nodeunit = {
  keywords: function(test) {
    runTest("keywords.json", test);
  },
  brackets: function(test) {
    runTest("brackets.json", test);
  }
}
