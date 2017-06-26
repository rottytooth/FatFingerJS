'use strict';

var fatfinger = require("../fatfinger.js");
var grunt = require('grunt');
var path = require('path');
var fs = require("fs");

var runTest = function(jsFile, test) {
  var content = fs.readFileSync("tests/" + jsFile);
  var jsonContent = JSON.parse(content);
  for(var i in jsonContent.tests) {
    var codeblock = jsonContent.tests[i];
    console.log("testing " + codeblock.description);
    var results = fatfinger.run(codeblock.original);

    // does it parse successfully
    test.equal(results.succeeded, true);

    // does it look like the expected result, ignoring all whitespace
    test.equal(codeblock.transformed.replace(/\s+/g, ""), results.text.replace(/\s+/g, ""));
  }
  test.done();
}

exports.nodeunit = {
  keywords: function(test) {
    runTest("keywords.json", test);
  },
  brackets: function(test) {
    runTest("brackets.json", test);
  },
  varnames: function(test) {
    runTest("varnames.json", test);
  },
  functions: function(test) {
    runTest("functions.json", test);
  }
}
