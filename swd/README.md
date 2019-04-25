# Study Chums Test Cases
The JS files in this folder use Mocha with Selenium Webdriver to create the test cases.

## The following are requirements to run:
* Selenium Webdriver (install using 'npm install selenium-webdriver')
* Mocha              (install using 'npm install -g mocha')
* a webdriver (this folder of JS files uses chromedriver)
  * download the driver.exe (the selenium website is a good starting point)
  * unzip and leave it somewhere around root (i.e. C:/ for Windows, etc)
  * go set the folder's location for the .exe file as a path environment variable

NOTE: if you're not using ChromeDriver, change to whichever driver you're using.
Recommendations:
* Google Chrome -----> 'chrome'
* Firefox ---------------> 'firefox'
* Internet Explorer ----> 'ie'
* Safari ----------------> 'safari'

## Fill out the items in 'secret/keys.json'.
It's REALLY important that you DON'T commit your credentials. Don't be that one person.

## To run a JS test:
'mocha <file_name without the '.js' part>'
* 'mocha login'
* 'mocha redirect'