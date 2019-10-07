// TODO: clean up images/blackbg.png so it looks nicer
// (or find another picture entirely)
// TODO: clean up code for optimizations

var checkbox, background,
	loginbox, login_h1, loginbottom,
  wrapper,
	h1, h2, h3, h4, h5,
  p, i, li,
  card, profilecard,
  nav_ul,
  footer,
  form, input,
  panel;


$(document).ready(function() {
  var localStorage = window.localStorage;

  localStorage.setItem('mode', (localStorage.getItem('mode')|| 'dark')
      === 'dark' ? 'dark':'light');
  // set local storage item 'mode' to 'dark' or 'light' depending on
  // if the current item (or 'dark' by default) === 'dark'

  if (localStorage.getItem('mode') === 'dark') {
    document.getElementById("dark-switch").checked = true;
  } else {
    document.getElementById("dark-switch").checked = false;
  }

  background = $('body');

  loginbox = $('.login-box');
  login_h1 = $('.login-box h1');
  loginbottom = $('.login-bottom');

  wrapper = $('#wrapper');
  h1 = $('h1'); h2 = $('h2'); h3 = $('h3'); h4 = $('h4'); h5 = $('h5');
  p = $('p'); i = $('i'); li = $('li');

  card = $('.card'); profilecard = $('.profilecard');

  nav_ul = $('nav ul');

	footer = $('footer');

  form = $('form');
  input = $('input');

  panel = $('.panel');


  toggleDarkMode(); // adjust based on the state of 'dark-switch'
});

function toggleDarkMode() {
  var checkBox = document.getElementById("dark-switch");

  var localStorage = window.localStorage;

  if (checkBox.checked == true) {

    enableDarkModeSettings();

    localStorage.setItem('mode', 'dark');
    // set mode in local storage to 'dark'

  } else {
    enableLightModeSettings();

    localStorage.setItem('mode', 'light');
    // set mode in local storage to' light'
  }
}

function enableDarkModeSettings() {

  console.log("dark mode is on!");

  background.css('background', 'url(images/blackbg.png)');

  loginbox.css('background-color','#222222');
  login_h1.css('color', 'white');

  loginbottom.css('background-color','#222222');

  wrapper.css('background-color','rgba(34, 34, 34, 0.9)');

  h1.css('color','white');
  h2.css('color','white');
  h3.css('color','white');
  h4.css('color','white');
  h5.css('color','white');
  p.css('color','white');
  i.css('color','white');
  li.css('color','white');

  card.css('background-color','rgba(45, 45, 45, 0.8)');
  profilecard.css('background-color','rgba(45, 45, 45, 0.8)');

  nav_ul.css('background-color','black');

  footer.css('color','white');

  form.css('color', 'white');
  input.css('color', 'white');

  panel.css({'color':'white', 'background-color':'rgba(45, 45, 45, 0.8)'});
}

function enableLightModeSettings() {

  alert("Night-watchers: Prepare your eyes!");
  console.log("dark mode is off!");

  background.css('background', 'url(images/bluebg.png)');

  loginbox.css('background-color','white');
  login_h1.css('color','black');

  loginbottom.css('background-color','white');

  wrapper.css('background-color','rgba(255,255,255,0.9)');

  h1.css('color','black');
  h2.css('color','black');
  h3.css('color','black');
  h4.css('color','black');
  h5.css('color','black');
  p.css('color','black');
  i.css('color','black');
  li.css('color','black');

  card.css('background-color','rgba(255, 255, 255, 0.8)');
  profilecard.css('background-color','rgba(255, 255, 255, 0.8)');

  nav_ul.css('background-color','white');

  footer.css('color','black');

  form.css('color','black');
  input.css('color','black');

  panel.css({'color':'black', 'background-color':'rgba(255, 255, 255, 0.8)'});
}
