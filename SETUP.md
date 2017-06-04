
Grunt set-up (for testing / contributing):


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