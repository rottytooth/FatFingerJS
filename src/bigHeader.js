/*
FatFingerJS

https://github.com/rottytooth/FatFingerJS
http://esoteric.codes
http://danieltemkin.com


*/



var fatfinger = {};

fatfinger.CompileException = function(message) {
   this.message = message;
};

// globals that JsLint doesn't like for whatever reason
fatfinger.JslintGlobalList = ["window","browser"];

fatfinger.JslintBlindSpot = function(text) {
    // these are for globals that jslint doesn't like (such as window)
    if (fatfinger.JslintGlobalList.indexOf(text) > -1) {
        return true;
    }
    return false;
}

// from parse-js.js (uglify)
fatfinger.array_to_hash = function(a) {
    var ret = {};
    for (var i = 0; i < a.length; ++i)
        ret[a[i]] = true;
    return ret;
};

//FIXME: can we replace these with something es6-friendly, perhaps from esprima?
fatfinger.Keywords = fatfinger.array_to_hash([
    "break",
    "case",
    "catch",
    "const",
    "continue",
    "debugger",
    "default",
    "delete",
    "do",
    "else",
    "finally",
    "for",
    "function",
    "if",
    "in",
    "instanceof",
    "new",
    "return",
    "switch",
    "throw",
    "try",
    "typeof",
    "var",
    "void",
    "while",
    "with"
]);

fatfinger.Keywords_Atom = fatfinger.array_to_hash([
    "false",
    "null",
    "true",
    "undefined"
]);
