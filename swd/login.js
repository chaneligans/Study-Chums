/*requires:
- a webdriver <chromedriver> (download and set file folder location as path variable)
- selenium webdriver (npm install selenium-webdriver)
- mocha              (npm install mocha)
*/

var assert = require('assert');
var {suite} = require('selenium-webdriver/testing');
var {Builder, Capabilities, until, By} = require('selenium-webdriver');

var url = 'https://@study-chums.firebaseapp.com/'
var expected = 'Study Chums';

const delay = t => new Promise(resolve => setTimeout(resolve,t));

// user credentials (i'm not disclosing mine; make your own secret/keys.json)
var fs = require('fs');
var json = JSON.parse(fs.readFileSync("secret/keys.json", "utf8"));
var user = json.user;
var pass = json.pass;

// run the suite
suite(function(env) {

  describe('Login to Study Chums', function() {
    var browser;

    before(function(done) {

      browser = new Builder().
        withCapabilities(Capabilities.chrome()).build();

      browser.get(url);
      delay(500).then(() => {
        console.log('Opening in browser: ' + url);
      });
      done();
    });

    it('Should expect the login page', function(done) {
      browser.getTitle().then((title) => {
        assert.equal(title, expected);
        console.log('browser is at login page');
      }, (err)=> {
        console.log('the title did not match the expected: ' + err.message);
      });
      done();
    });

    it('Should expect the title for homepage after logging in', function(done) {
      let loginButton = browser.findElement(By.id('loginbtn'));
      loginButton.click();
      delay(1000).then(() => {console.log('Logging in...')});

      let main = browser.getWindowHandle();

      main.then((m) => {
        // console.log("main: " + m);

        delay(5000).then(() => {
          var popup_handle;
          browser.getAllWindowHandles().then((wh) => {
            for (var handle of wh) {
              // console.log("handle: " + handle);
              if (handle !== m) {popup_handle = handle;} }
            browser.switchTo().window(popup_handle);
            // console.log("popup: " + popup_handle);
          })
        });

        delay(5500).then(() => {
          browser.wait(until.elementLocated(By.id('homelink')), 2500).
          then(() => {
            console.log('Logging in through FB...');
            browser.findElement(By.id('email')).sendKeys(user);
            browser.findElement(By.id('pass')).sendKeys(pass);
            browser.findElement(By.id('loginbutton')).click();
          });
        });

        delay(13000).then(() => {
          console.log('Waiting...');
          browser.switchTo().window(m);
        });

        delay(18000).then(() => {
          browser.wait(until.titleIs('Home | ' + expected)).then(() => {
            browser.getTitle().then((title) => {
              // console.log('title: ' + title);
              assert.equal(title, 'Home | ' + expected);
              console.log('Made it to homepage');
            }, (err) => {console.log('title fail (assert) - homepage: ' + err.message)});
          }, (err) => {console.log('title fail (titleIs) - homepage: ' + err.message)});
        });

      });
      done();
    })

    it('Should see the login page after logging out', function(done) {
      delay(42500).then(() => {
        console.log('Logging out...');
        browser.findElement(By.linkText('Sign Out')).click();
      });

      delay(43000).then(() => {
        browser.wait(until.titleIs(expected)).then(() => {
          browser.getTitle().then((title) => {
            // console.log('title: ' + title);
            assert.equal(title, expected);
            console.log('Made it to login page');
          }, (err) => {console.log('title fail (assert) - login page: ' + err.message)});
        }, (err) => {console.log('title fail (titleIs) - login page: ' + err.message)});
      });

      done();
    })

    after(function(done) {
      delay(50000).then(() => {
        browser.quit();
        console.log('Browser closed');
      });
      done();
    });
  });

});
