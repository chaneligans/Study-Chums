var checkbox, background,
	loginbox, login_h1, loginbottom,
  wrapper,
	h1, h2, h3, h4, h5,
  td, p, li,
	i_left, i_right,
  card, profilecard,
  nav_ul,
  footer,
  form, input,
	search, select,
  panel, chatPopupContent;

// executes on page ready
$(document).ready(function() {
  var localStorage = window.localStorage;

  localStorage.setItem('mode', (localStorage.getItem('mode')|| 'dark')
      === 'dark' ? 'dark':'light');
  // set local storage item 'mode' to 'dark' or 'light' depending on
  // if the current item (or 'dark' by default) === 'dark'

  background = $('body');

  loginbox = $('.login-box');
  login_h1 = $('.login-box h1');
  loginbottom = $('.login-bottom');

  wrapper = $('#wrapper');
  h1 = $('h1'); h2 = $('h2'); h3 = $('h3'); h4 = $('h4'); h5 = $('h5');

	td = $('td'); p = $('p'); li = $('li');
	i_left = $('i#leftbutton'); i_right = $('i#rightbutton');

  card = $('.card'); profilecard = $('.profilecard');

  nav_ul = $('nav ul');

	footer = $('footer');

  form = $('form'); input = $('input');
	search = $('.search'); select = $('select');

  panel = $('.panel'); chatPopupContent = $('.chatPopupContent');

	// set dark-switch 'on'/'off' depending on the 'mode' item in local storage
	if (localStorage.getItem('mode') === 'dark') {
    document.getElementById("dark-switch").checked = true;
  } else {
    document.getElementById("dark-switch").checked = false;
  }
  toggleDarkMode(false); // adjust based on the state of 'dark-switch'

	// set event listener for 'dark-switch'
	document.getElementById('dark-switch').addEventListener("click", function() {
		toggleDarkMode(true);
	}, false);
});

// this function is meant for chums.js and discover.js
function refresh_h() {
	console.log('refresh header css');
	h2 = $('h2'); h3 = $('h3');
  if (document.getElementById('dark-switch').checked === true) {
		h2.css('color', 'white');
		h3.css('color', 'white');
	} else {
		h2.css('color', 'black');
		h3.css('color', 'black');
	}
}

function toggleDarkMode(alert_) {
	// console.log("alert shown? "+ alert_);

  var checkBox = document.getElementById("dark-switch");

  var localStorage = window.localStorage;

  if (checkBox.checked == true) {

    enableDarkModeSettings();

    localStorage.setItem('mode', 'dark');
    // set mode in local storage to 'dark'

  } else {
    enableLightModeSettings(alert_);

    localStorage.setItem('mode', 'light');
    // set mode in local storage to' light'
  }
}

function enableDarkModeSettings() {

  console.log("dark mode is on!");

  background.css('background', 'url(images/greybg.png)');

  loginbox.css('background-color','#222222');
  login_h1.css('color', 'white');

  loginbottom.css('background-color','#222222');

  wrapper.css('background-color','rgba(34, 34, 34, 0.9)');

  h1.css('color','white');
  h2.css('color','white');
  h3.css('color','white');
  h4.css('color','white');
  h5.css('color','white');

  td.css('color', 'white');
  p.css('color','white');
  i_left.css('color','white');
	i_right.css('color','white');
  li.css('color','white');

  card.css('background-color','rgba(45, 45, 45, 0.8)');
  profilecard.css('background-color','rgba(45, 45, 45, 0.8)');

  nav_ul.css('background-color','black');

  footer.css('color','white');

  form.css('color', 'white');
  input.css({'color':'white', 'background-color':'#222222'});

	search.css('color', 'black');
	select.css('background-color','#222222');

  panel.css({'color':'white', 'background-color':'rgba(45, 45, 45, 0.8)'});
	chatPopupContent.css('background-color', '#222222');
}

function enableLightModeSettings(alert_) {
	// only appears when toggling, not when naviagting to different pages
	if (alert_) {
		alert("Night-watchers: Prepare your eyes!");
	}
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

  td.css('color','black');
  p.css('color','black');
  i_left.css('color','black');
	i_right.css('color','black');
  li.css('color','black');

  card.css('background-color','rgba(255, 255, 255, 0.8)');
  profilecard.css('background-color','rgba(255, 255, 255, 0.8)');

  nav_ul.css('background-color','white');

  footer.css('color','black');

  form.css('color','black');
  input.css({'color':'black','background-color':'white'});

	search.css('color', 'white');
	select.css('background-color', 'white');

  panel.css({'color':'black', 'background-color':'rgba(255, 255, 255, 0.8)'});
	chatPopupContent.css('background-color', '#eff3f7');
}
