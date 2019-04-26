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
  describe('Accepting a request', function() {
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

        delay(17000).then(() => {
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

    it('Should accept a request', function(done) {
      delay(24000).then(() => {
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

      delay(30000).then(() => {
        var items = [];

        // document.getElementById('recievedRequests').
        //   getElementsByTagName('tr')[0].
        //   getElementsByClassName('resultIcons')[0].childNodes[0];
        //                                         ^- 0=accept, 1=reject

        // browser.findElement(By.id('recievedRequests')).then((block) => {
        //   console.log(block);
        //   block.findElements(By.css('tr')).then((miniblock) => {
        //     console.log(miniblock);
        //     var icons = miniblock.findElements(By.className('resultIcons'));
        //
        //     icons.then((posts) => {
        //       for (var i = 0; i < posts.length; i++) {
        //         if (posts[i].id.lastIndexOf('acceptIcon', 0) === 0) {
        //           items.push(posts[i]);
        //           console.log('icon: ' + posts[i].id);
        //         }
        //       }
        //     });
        //   });
        // });
        var posts = browser.findElements(By.className('resultIcons'));
        posts.then((p)=> {
          console.log(p);
          p.forEach((post)=> {
            console.log(post.findElement(By.css('p')).getId());
          });
        });


        // console.log('accept a request');
        // console.log('decline a request');
      });

      delay(36000).then(() => {
        console.log('end of test');
        browser.findElement(By.linkText('Home')).click();

      });

      done();
    });

    after(function(done) {
      done();
    });
  });
})