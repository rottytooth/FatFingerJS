
fatfinger.inlineScriptRunner =
(function() {

    function findFatFingerBlocks() {
        var matchingElements = [];
        var allElements = document.getElementsByTagName('script');
        var good_re = /text\/j*/i
        var dont_match = /text\/javascript/i
        
        for (var i = 0, n = allElements.length; i < n; i++)
        {
            if (allElements[i].getAttribute('type') !== null && 
                good_re.test(allElements[i].getAttribute('type')) &&
                !dont_match.test(allElements[i].getAttribute('type')) 
               ) {
                // Element exists with attribute. Add to array.
                matchingElements.push(allElements[i].text);
            }
        }
        return matchingElements;
    }

    function run() {
                
        var js_blocks = findFatFingerBlocks();

        var js = "";

        if (js_blocks.constructor === Array) {
            for (var idx = 0; idx < js_blocks.length; idx++) {

                var result = fatfinger.run(js_blocks[idx]); 

                if (result.succeeded) {
                    js += result.text;
                }
            }
        }

        eval(js);
    }
    
    return {"run" : run};
})(fatfinger);

// if we're in a browser, activate the script runner
if (typeof document !== 'undefined')
    document.addEventListener('DOMContentLoaded', fatfinger.inlineScriptRunner.run, false);
