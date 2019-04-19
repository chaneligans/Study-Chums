The JS files in this folder use mochaJS with selenium webdriver to create the test cases.

The following are requirements to run:
- selenium webdriver (install using 'npm install selenium-webdriver')
- mocha              (install using 'npm install -g mocha')
- a webdriver (this folder of JS files uses chromedriver)
 >> download the driver.exe (the selenium website is a good starting point)
 >> unzip and leave it somewhere around root (i.e. C:/ for Windows, etc)
 >> go set the folder's location for the .exe file as the path env variable

 NOTE: if you're not using chromedriver, change to whichever driver you need
 Recommendations:
  - Google Chrome -----> Capabilities.chrome()
  - Firefox -----------> Capabilities.firefox()
  - Internet Explorer -> Capabilities.ie()
  - Safari ------------> Capabilities.safari()

*** fill out the items in 'secret/keys.json' with your FB credentials
>> DON'T COMMIT THIS FILE, WHATEVER YOU DO. (BC SECURITY)

To run a JS test:
'mocha <file_name>'
(i.e. 'mocha login', 'mocha redirect')