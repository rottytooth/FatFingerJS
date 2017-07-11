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
