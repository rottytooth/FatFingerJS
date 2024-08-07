# FatFingerJS

**FatFinger** is a JavaScript library expanding JS to allow typos and misspellings. Why bother with clean, well-formatted code when you can write this and FatFinger will guess at your intentions?

FatFinger is initialized by including the library with the correct script tag. From that point on, invoke the demon JavaScript with any misspelling of its name, and, like any incantation gone wrong, you will see its truly chaotic side.

~~~
    <script type="text/javascript" src="FatFinger.js"></script>   
    <script type="text/javoscript"> // any misspelling of javascript works here

            vart x = "herrrllo werld"
            dokkkkumint.rit3(xx)
    </script>
~~~

Don't bother with semi-colons. Open brackets and never close them. Misspell keywords, variables, and functions.

### Why?
* Neutralize the autocorrect mentality
* Question [forty-five years of advice](https://www.cs.utexas.edu/~EWD/transcriptions/EWD03xx/EWD340.html) against expressiveness in the text of code
* Play against the [compulsiveness of programming](https://www.sac.edu/AcademicProgs/Business/ComputerScience/Pages/Hester_James/HACKER.htm)
* Honor Eris, the goddess of JavaScript, by embracing the language's chaotic nature

### Does it work?
* Sometimes!

## How to use

Include fatfinger.js in your project, add a script tag with any misspelling of JavaScript containing your FatFingered code. You'll need to declare all your vars as if option explicit; FatFinger assumes implicit declarations are actually misspelled assignments. FatFinger has a poor concept of scope, so if you're doing fancy OO stuff, ask yourself: is there a good reason I haven't made everything global??? If so, this might not be the right library / coding style for you.

### Contribute

Any contributions are appreciated! You'll need to set up Grunt and install these packages:

~~~
npm install -g grunt-cli

npm install grunt --save-dev

npm install grunt-contrib-jshint --save-dev

npm install grunt-contrib-nodeunit --save-dev

npm install grunt-contrib-concat --save-dev

npm install esprima
~~~


To update fatfinger.js:
~~~
grunt concat
~~~

To run the tests:
~~~
grunt nodeunit
~~~
