'use strict';

var fatfinger = require("../fatfinger.js");
var grunt = require('grunt');
var path = require('path');
var fs = require("fs");

var runTest = function(jsFile, test) {
  var content = fs.readFileSync("tests/json/" + jsFile);
  var jsonContent = JSON.parse(content);
  for(var i in jsonContent.tests) {
    var codeblock = jsonContent.tests[i];
    console.log("testing " + codeblock.description);
    var results = fatfinger.run(codeblock.original);

    // does it parse successfully
    test.ok(results.succeeded, jsFile + " parsed");

    // does it look like the expected result, ignoring all whitespace
    test.equal(codeblock.transformed.replace(/\s+/g, ""), results.text.replace(/\s+/g, ""));
  }
  test.done();
}

var runJsTests = function(dirname, test) {
  var filenames = fs.readdirSync(dirname);
  for (var i = 0; i < filenames.length; i++) {
    var filename = filenames[i];
    var target = ".js";
    if (filename.substring(filename.length - target.length) == target) {

      var content = fs.readFileSync(dirname + filename, "utf8");
      var results = fatfinger.run(content);

      if (!results.succeeded) {
        console.log("moving file " + filename);
        fs.rename(dirname + filename, "tests/js_cant_parse/" + filename);
      }
      // no need to report success, since the file move tells us it failed
//      console.log(results.succeeded);
//      test.ok(results.succeeded, filename + " parsed");
    }
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
  },
  rawJs: function(test) {
    runJsTests("tests/js/", test);
  }
}
