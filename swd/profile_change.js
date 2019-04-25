var assert = require('assert');
var {suite} = require('selenium-webdriver/testing');
var {Builder, Capabilities, until, By} = require('selenium-webdriver');

var expected = 'Study Chums';
var url = 'https://study-chums.firebaseapp.com/'

var testNameInputOne = ''; //set your name input of choice 1
var testNameInputTwo = ''; //set your name input of choice 2

const delay = t => new Promise(resolve => setTimeout(resolve,t));

// get user credentials
var fs = require('fs');
var file = "secret/keys.json"; //adjust the file here with your own credentials
var json = JSON.parse(fs.readFileSync(file, "utf8"));
var user = json.user;
var pass = json.pass;

suite(function(env) {

  var browser;
  before(function(done) {
    browser = new Builder().
      withCapabilities(Capabilities.chrome()).build();
    browser.get(url);
    done();
  });
  it('Should expect the login page', function(done) {
    browser.wait(until.titleIs(expected)).then(() =>{
      browser.getTitle().then((title) => {
        assert.equal(title, expected);
        console.log('browser is at login page');
      }, (err)=> {
        console.log('the title did not match the expected: ' + err.message);
      });
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

      delay(15000).then(() => {
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
  })

  it('Should click on the "Profile" item and see your Profile page', function(done) {
    delay(24000).then(() => {
      browser.findElement(By.linkText('Profile')).click();
      browser.wait(until.titleIs('Profile | ' + expected)).then(() => {
        browser.getTitle().then((title) => {
          assert.equal(title, 'Profile | ' + expected);
          console.log('Moved to profile page')
        }, (err) => {console.log('title fail (assert) - profile page: ' + err.message)});
      }, (err) => {console.log('title fail (titleIs) - profile page: ' + err.message)});
    });
    done();
  });
  it('Should edit your profile', function(done) {

    //first edit
    delay(30000).then(() => {
      browser.findElement(By.linkText('Edit Profile')).click();
      browser.wait(until.titleIs('Edit Profile | '+expected)).then(() => {
        browser.getTitle().then((title) => {
          assert.equal(title, 'Edit Profile | '+expected);
          console.log('Editing profile...');
          browser.findElement(By.id('name')).sendKeys(testNameInputOne);
        }, (err) => {console.log('title fail (assert) - edit profile: ' + err.message)});
      }, (err) => {console.log('title fail (titleIs) - edit profile: ' + err.message)});
    });
    delay(34000).then(() => {
      browser.findElement(By.id('applyToProfile')).click();
      console.log('Edit applied');
    });

    // pauses for visual confirmation

    //second edit
    delay(42000).then(() => {
      browser.findElement(By.linkText('Edit Profile')).click();
      browser.wait(until.titleIs('Edit Profile | '+expected)).then(() => {
        browser.getTitle().then((title) => {
          assert.equal(title, 'Edit Profile | '+expected);
          console.log('Edit profile again');
          browser.findElement(By.id('name')).sendKeys(testNameInputTwo);
        }, (err) => {console.log('title fail (assert) - edit profile: ' + err.message)});
      }, (err) => {console.log('title fail (titleIs) - edit profile: ' + err.message)});
    });
    delay(46000).then(() => {
      browser.findElement(By.id('applyToProfile')).click();
      console.log('Edit applied');
    });

    // pauses for visual confirmation

    done();
  });

  it('Should see the login page after logging out', function(done) {
    delay(52500).then(() => {
      console.log('Logging out...');
      browser.findElement(By.linkText('Sign Out')).click();
    });

    delay(53000).then(() => {
      browser.wait(until.titleIs(expected)).then(() => {
        browser.getTitle().then((title) => {
          // console.log('title: ' + title);
          assert.equal(title, expected);
          console.log('Made it to login page');
        }, (err) => {console.log('title fail (assert) - login page: ' + err.message)});
      }, (err) => {console.log('title fail (titleIs) - login page: ' + err.message)});
    });

    done();
  });
  after(function(done) {
    delay(58000).then(() => {
      browser.quit();
      console.log('Browser closed');
    });
    done();
  });
})