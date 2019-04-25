var assert = require('assert');
var {suite} = require('selenium-webdriver/testing');
var {Builder, Capabilities, until, By} = require('selenium-webdriver');

var expected = 'Study Chums';
var url = 'https://study-chums.firebaseapp.com/'

const delay = t => new Promise(resolve => setTimeout(resolve,t));

// get user credentials
var fs = require('fs');
var file = "secret/keys.json"; //adjust the file here with your own credentials
var json = JSON.parse(fs.readFileSync(file, "utf8"));
var user = json.user;
var pass = json.pass;
var internet = json.internet;

suite(function(env) {
  describe('Swiping through users', function() {

    var browser;
    before(function(done) {
      browser = new Builder().
        withCapabilities(Capabilities[internet]()).build();
      browser.get(url);
      done();
    });
    it('Should expect the login page', function(done) {
      browser.getTitle().then((title) => {
        assert.equal(title, expected);
        console.log('Browser is at login page');
      }, (err)=> {
        console.log('the title did not match the expected: ' + err.message);
      });
      done();
    });
    it('Should expect the title for homepage after logging in', function(done) {
      let loginButton = browser.findElement(By.id('loginbtn'));
      loginButton.click();
      // delay(1000).then(() => {console.log('Logging in...')});

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
            // console.log('Logging in through FB...');
            browser.findElement(By.id('email')).sendKeys(user);
            browser.findElement(By.id('pass')).sendKeys(pass);
            browser.findElement(By.id('loginbutton')).click();
          });
        });

        delay(13000).then(() => {
          // console.log('Waiting...');
          browser.switchTo().window(m);
        });

        delay(18000).then(() => {
          browser.wait(until.titleIs('Home | ' + expected)).then(() => {
            browser.getTitle().then((title) => {
              // console.log('title: ' + title);
              assert.equal(title, 'Home | ' + expected);
              // console.log('Made it to homepage');
            }, (err) => {console.log('title fail (assert) - homepage: ' + err.message)});
          }, (err) => {console.log('title fail (titleIs) - homepage: ' + err.message)});
        });

      });
      done();
    });

    it('Should swipe left twice', function(done) { //visual confirmation
      delay(24000).then(() => {
        browser.findElement(By.id('leftbutton')).click();
      }); //lag may appear here, so the image might not show immediately (image size)

      delay(30000).then(() => {
        browser.findElement(By.id('leftbutton')).click();
      }); // more stable in its punctuality

      done();
    });

    it('Should swipe right twice', function(done) { //visual confirmation
      delay(36000).then(() => {
        browser.findElement(By.id('rightbutton')).click();
      }); //lag may appear here, so the image might not show immediately (image size)

      delay(42000).then(() => {
        browser.findElement(By.id('rightbutton')).click();
      }); // more stable in its punctuality

      done();
    });

    it ('Should click on the "show bio" button', function(done) { //visual confirmation
      delay(44500).then(() => {
        browser.findElement(By.id('biobutton')).click();
      }); // should be instant

      delay(48000).then(() => {
        browser.findElement(By.id('biobutton')).click();
      }); // should also be instant, but it has a 3.5s delay to it

      done();
    });

    it('Should see the login page after logging out', function(done) {
      delay(55000).then(() => {
        // console.log('Logging out...');
        browser.findElement(By.linkText('Sign Out')).click();
      });

      delay(56500).then(() => {
        browser.wait(until.titleIs(expected)).then(() => {
          browser.getTitle().then((title) => {
            // console.log('title: ' + title);
            assert.equal(title, expected);
            // console.log('Made it to login page');
          }, (err) => {console.log('title fail (assert) - login page: ' + err.message)});
        }, (err) => {console.log('title fail (titleIs) - login page: ' + err.message)});
      });

      done();
    });
    after(function(done) {
      delay(60000).then(() => {
        browser.quit();
        console.log('Browser closed');
      });
      done();
    });
  });
})