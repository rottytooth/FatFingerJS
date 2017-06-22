# JavaScirpt

**Write JS with your fists!**

Write JS in any old sloppy way and **JavaScirpt** *(JAva-SERP't)* will guess (sometimes well, sometimes very poorly) what it is you're trying to do. Why write clean JS when you can do this and it works?

~~~
    <script type="text/javascript" src="javascirpt.js"></script>   
    <script type="text/javoscript"><!-- any misspelling of javascript works here -->
        // here is my inline javascirrrrpt!
        vart x = "herrrllo werld"

        dokkkkumint.rit3(xx)
    </script>
~~~

Don't bother with semi-colons. Open brackets and never close them. Misspell keywords, variables, and method names. JavaScirpt has a poor concept of scope, so it you're doing fancy OO stuff, ask yourself: is there a good reason I haven't made everything global???

To use, just include javascirpt.js in your project, add a script tag with any misspelling of JavaScript, and write your sloppy, shitty JS.

You'll need to declare vars as if option explicit, so that JavaScirpt can fix typos that might otherwise look like new declarations.

*Project is still under construction / testing.*

**Set-up if you'd like to contribute:**

~~~
npm install -g grunt-cli

npm install grunt --save-dev

npm install grunt-contrib-jshint --save-dev

npm install grunt-contrib-nodeunit --save-dev

npm install grunt-contrib-concat --save-dev
~~~


To update javascirpt.js:
~~~
grunt concat
~~~

To run the tests:
~~~
grunt nodeunit
~~~

Number of times I misspelled *JavaScirpt* as *JavaScript* while creating this: **6**
