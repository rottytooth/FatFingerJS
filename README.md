# FatFinger

**FatFinger** is a JavaScript library expanding JS to allow typos and
misspellings as valid code. Why bother with clean, well-formatted JS when you 
can write this and FatFinger will guess at your intentions?

~~~
    <script type="text/javascript" src="FatFingerJS.js"></script>   
    <script type="text/javoscript"><!-- any misspelling of javascript works here -->
        // here is my inline javascirrrrpt!
        vart x = "herrrllo werld"

        dokkkkumint.rit3(xx)
    </script>
~~~

Don't bother with semi-colons. Open brackets and never close them. Misspell keywords, variables, and functions.

**Why?**
* Neutralize the autocorrect mentality
* Question [forty-five years of advice](https://www.cs.utexas.edu/~EWD/transcriptions/EWD03xx/EWD340.html) against expressiveness in the text of code
* Play against the [compulsiveness of programming](https://www.sac.edu/AcademicProgs/Business/ComputerScience/Pages/Hester_James/HACKER.htm)
* Embrace the chaos of JavaScript

**How to use**

Include fatfinger.js in your project, add a script tag with any misspelling of JavaScript containing your FatFingered code. You'll need to declare all your vars as if option explicit; FatFinger assumes implicit declarations are actually misspelled statements. FatFinger has a poor concept of scope, so it you're doing fancy OO stuff, ask yourself: is there a good reason I haven't made everything global??? If not, this might not be the right library / coding style for you.

**Set-up if you'd like to contribute:**

~~~
npm install -g grunt-cli

npm install grunt --save-dev

npm install grunt-contrib-jshint --save-dev

npm install grunt-contrib-nodeunit --save-dev

npm install grunt-contrib-concat --save-dev
~~~


To update fatfinger.js:
~~~
grunt concat
~~~

To run the tests:
~~~
grunt nodeunit
~~~
