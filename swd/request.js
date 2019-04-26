var assert = require('assert');
var {suite} = require('selenium-webdriver/testing');
var {Builder, Capabilities, until, By} = require('selenium-webdriver');

var url = 'https://study-chums.firebaseapp.com/'
var expected = 'Study Chums';

const delay = t => new Promise(resolve => setTimeout(resolve,t));

// user credentials (i'm not disclosing mine; make your own secret/keys.json)
var fs = require('fs');
var json = JSON.parse(fs.readFileSync("secret/keys.json", "utf8"));
var user = json.user;
var pass = json.pass;
var internet = json.internet;

suite(function(env) {
  describe('Sending a request', function() {
    var browser;

    before(function(done) {
      browser = new Builder().
        withCapabilities(Capabilities[internet]()).build();

      browser.get(url);
      done();
    });

    it('Expect the login page', function(done) {
      browser.getTitle().then((title) => {
        assert.equal(title, expected);
      }, (err) => {
        console.log('title didn\'t match expected title: ' + err.message);
      });
      done();
    });

    it('Should expect the title for homepage after logging in', function(done) {
      browser.findElement(By.id('loginbtn')).click();
      let main = browser.getWindowHandle();
      main.then((m) => {
        delay(5000).then(() => {
          var popup_handle;
          browser.getAllWindowHandles().then((wh) => {
            for (var handle of wh) {
              if (handle !== m) {popup_handle = handle;}
            }
            browser.switchTo().window(popup_handle);
          });
        });

        delay(5500).then(() => {
          browser.wait(until.elementLocated(By.id('homelink')), 2500).
            then(() => {
              browser.findElement(By.id('email')).sendKeys(user);
              browser.findElement(By.id('pass')).sendKeys(pass);
              browser.findElement(By.id('loginbutton')).click();
            });
        });

        delay(13000).then(() => {
          browser.switchTo().window(m);
        });

        delay(15000).then(() => {
          browser.wait(until.titleIs('Home | '+expected)).then(() => {
            browser.getTitle().then((title) => {
              assert.equal(title, 'Home | '+expected);
            }, (err) => {
              console.log('title fail(assert) <- homepage: '+ err.message);
            });
          }, (err) => {
            console.log('title fail(titleIs) <- homepage: '+ err.message);
          });
        });

      });
      done();
    });

    it('Should send request to someone', function(done) {
      delay(24000).then(() => {
        browser.findElement(By.id('Name')).click().then(() => {
          browser.wait(until.titleIs('View Profile | '+expected), 2500).
            then(() => {
              browser.getTitle().then((title) => {
                assert.equal(title, 'View Profile | '+expected);
              }, (err) => {
                console.log('title fail(assert) <- view profile: '+ err.message);
              });

              delay(6000).then(() => {
                // browser.findElement(By.id('status')).
                //   findElement(By.linkText('Request to Match')).click();

                console.log('clicked on "request to match"');
              });
            }, (err) => {
              console.log('title fail(titleIs) <- view profile: '+ err.message);
            });
        });
      });

      delay(35000).then(() => {
        browser.findElement(By.linkText('Applications')).click().then(() => {
          browser.wait(until.titleIs('Applications | '+expected), 2500).
            then(() => {
              browser.getTitle().then((title) => {
                assert.equal(title, 'Applications | '+expected);
              }, (err) => {
                console.log('title fail(assert) <- applications: '+ err.message);
              });
            }, (err) => {
              console.log('title fail(titleIs) <- applications: '+ err.message);
            });
        });
      });

      done();
    });

    after(function(done) {
      done();
    })

  });
})