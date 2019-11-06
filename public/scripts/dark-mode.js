var checkbox, background,
	loginbox, login_h1, loginbottom,
	or_space,
	fas_fa_at, fas_fa_lock,
	wrapper,create_profile_box,
	create_profile_btn,
	h1, h2, h3, h4, h5,
	td, p, li,
	i_left, i_right,
	card, profilecard,
	nav_ul, nav_li,
	footer,
	form, input, tb_ta,
	search, select,
	panel, chatPopupContent,
	resultrow_td;

// executes on page ready. checks if the user wants dark mode (defaults to light mode)
$(document).ready(function() {
	let localStorage = window.localStorage;

	localStorage.setItem('mode', (localStorage.getItem('mode')|| 'dark')
	=== 'dark' ? 'dark':'light');
	// set local storage item 'mode' to 'dark' or 'light' depending on
	// if the current item (or 'dark' by default) === 'dark'

	background = $('body');

	loginbox = $('.login-box');
	login_h1 = $('.login-box h1');
	loginbottom = $('.login-bottom');

	or_space = $('#Or_space');

	fas_fa_at = $('i.fas.fa-at');
	fas_fa_lock = $('i.fas.fa-lock');

	wrapper = $('#wrapper');

	create_profile_box = $('.create-profile-box');
	create_profile_btn = $('.create-profile-btn');

	h1 = $('h1'); h2 = $('h2'); h3 = $('h3'); h4 = $('h4'); h5 = $('h5');

	td = $('td'); p = $('p'); li = $('li');
	i_left = $('i#leftbutton'); i_right = $('i#rightbutton');

	card = $('.card'); profilecard = $('.profilecard');

	nav_ul = $('nav ul'); nav_li = $('nav li');

	footer = $('footer');

	form = $('form'); input = $('input'); tb_ta = $('.textbox textarea');
	search = $('.search'); select = $('select');

	panel = $('.panel'); chatPopupContent = $('.chatPopupContent');

	resultrow_td = $('.resultRow td');

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

// this function is meant for applications.js
function refresh_td() {
	console.log('refresh td css');
	resultrow_td = $('.resultRow td');
	if (document.getElementById('dark-switch').checked === true) {
		resultrow_td.css('color','white');
	} else {
		resultrow_td.css('color','black');
	}
}

// main function. checks if the user wants dark mode on switch flip. acts on that choice
function toggleDarkMode(alert_) {
	// console.log("alert shown? "+ alert_);

	let localStorage = window.localStorage;

	checkBox = document.getElementById("dark-switch");

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

// modifies css to darker hues.
function enableDarkModeSettings() {

	console.log("dark mode is on!");

	background.css('background', 'url(images/greybg.png)');

	loginbox.css('background-color','#222222');
	login_h1.css('color', 'white');

	loginbottom.css('background-color','#222222');

	or_space.css('color', 'white');

	fas_fa_at.css('color', 'white');
	fas_fa_lock.css('color','white');

	wrapper.css('background-color','rgba(34, 34, 34, 0.9)');

	create_profile_box.css('background-color', '#222222');
	create_profile_btn.css('color','white');

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
	nav_li.css('background-color', 'rgba(0,0,0,0)');

	footer.css('color','white');

	form.css('color', 'white');
	input.css({'color':'white', 'background-color':''});
	tb_ta.css({'color':'white', 'background-color':'#222222'});

	search.css('color', 'black');
	select.css('background-color','#222222');

	panel.css({'color':'white', 'background-color':'rgba(45, 45, 45, 0.8)'});
	chatPopupContent.css('background-color', '#222222');

	resultrow_td.css('color', 'white');
}

// adjusts css to lighter hues.
// the parameter 'alert_' is true when the switch is used;
// 'alert_' is false only during the jquery ready() (at the top of this js file)
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

	or_space.css('color','black');

	fas_fa_at.css('color', 'black');
	fas_fa_lock.css('color','black');

	wrapper.css('background-color','rgba(255,255,255,0.9)');

	create_profile_box.css('background-color', 'white');
	create_profile_btn.css('color','black');

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
	nav_li.css('background-color','rgba(255,255,255,0.5)');

	footer.css('color','black');

	form.css('color','black');
	input.css({'color':'black','background-color':'white'});
	tb_ta.css({'color':'black','background-color':'white'});

	search.css('color', 'white');
	select.css('background-color', 'white');

	panel.css({'color':'black', 'background-color':'rgba(255, 255, 255, 0.8)'});
	chatPopupContent.css('background-color', '#eff3f7');

	resultrow_td.css('color','black');
}
