/*requires:
- a webdriver <chromedriver> (download and set file folder location as path variable)
- selenium webdriver (npm install selenium-webdriver)
- mocha              (npm install mocha)
*/

var assert = require('assert');
var {suite} = require('selenium-webdriver/testing');
var {Builder, Capabilities, until} = require('selenium-webdriver');

var url = 'https://study-chums.firebaseapp.com/'

var home_extra = 'home.html';
var extras = ['applications.html','chums.html','create_profile.html',
  'discover.html','edit_profile.html','home.html','messages.html',
  'profile.html','view_profile.html'];

var expected = 'Study Chums';

// a delay promise
const delay = t => new Promise(resolve => setTimeout(resolve,t));

// get user credentials
var fs = require('fs');
var file = "secret/keys.json"; //adjust the file here with your own credentials
var internet = JSON.parse(fs.readFileSync(file, "utf8")).internet;

suite(function(env) {

  describe('Redirection - multiple', function() {
    // load dictates how much time to set the delay by (1000 = 1000 ms)
    // load dictated by length of var 'extras'
    let load = extras.length * 2400 + 8000;
    // console.log("base load: " + load + "ms");
    // console.log("final load: " + (load + 4000) + "ms");

    extras.forEach((extra) => {
      var browser = new Builder().
        withCapabilities(Capabilities[internet]()).build();

      it('Redirects from ' + extra, function() {
        browser.get(url + extra).then(() => {
          delay(load).then(() => {
            browser.wait(until.alertIsPresent()).then(() => {
              let alert = browser.switchTo().alert();
              // alert.getText().then((text) => {console.log('Alert text reads: ' + text);});
              alert.accept();
            }, (err) => {
              console.log(extra+': alert text error: '+err.message);
            });
          });

          delay(load + 2000).then(() => {
            browser.wait(until.titleIs(expected)).then(() => {
              browser.getTitle().then((title) => {
                assert.equal(title, expected);
                console.log(extra + ' completed');
              }, (err) => {
                console.log(extra+': the title did not match bc of: '+err.message);
              });
            }, (err) => {
              console.log(extra+': the expected title was not found: '+err.message);
            });
          });

          delay(load + 4000).then(() => {browser.quit();});

        });
      });
    });
  });

});