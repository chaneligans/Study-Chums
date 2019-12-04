let checkbox, background,
	loginbox, login_h1, loginbottom,
	or_space, login_divider,
	fas, fas_fa_at, fas_fa_lock, fas_fa_plane,
	wrapper,create_profile_box,
	create_profile_btn,
	h1, h2, h3, h4, h5,
	td, p, li,
	i_left, i_right,
	card, profilecard,
	nav_ul, nav_li,
	footer,
	form,
	input, pref_input,
	tb_ta,
	search, searchTerm, select,
	panel, chatPopupContent,
	resultrow_td,
	editIconPopupContent,
	card_p, profilecard_p;

let localStorage = window.localStorage;

localStorage.setItem('mode',
((localStorage.getItem('mode')||'dark') === 'dark') ? 'dark':'light');
// Set local storage item 'mode' to 'dark' or 'light' depending on if the
// current value of 'mode' in local storage ('dark' by default) === 'dark'

// Executes on page-ready.
// Checks if the user wanted dark mode on or not (defaults to light mode).
$(document).ready(() => {

	// ---------------------------------------------------------------------------
	// The list of vars at the top are assigned here.
	// JQuery selectors can be empty (size 0); these will not throw errors.
	background = $('body');

	loginbox = $('.login-box');
	login_h1 = $('.login-box h1');
	loginbottom = $('.login-bottom');

	or_space = $('#Or_space');
	login_divider = $('.login-divider');

	fas = $('i.fas').slice(1); fas_fa_at = $('i.fas.fa-at');
	fas_fa_lock = $('i.fas.fa-lock');
	fas_fa_plane = $('i.login-icon.fas.fa-paper-plane');

	wrapper = $('#wrapper');

	create_profile_box = $('.create-profile-box');
	create_profile_btn = $('.create-profile-btn');

	h1 = $('h1'); h2 = $('h2'); h3 = $('h3'); h4 = $('h4'); h5 = $('h5');

	td = $('td'); p = $('p'); li = $('li');
	i_left = $('i#leftbutton'); i_right = $('i#rightbutton');

	card = $('.card'); profilecard = $('.profilecard');

	nav_ul = $('nav ul'); nav_li = $('nav li');

	footer = $('footer');

	form = $('form');
	input = $('input'); pref_input = $('input#new_email');
	tb_ta = $('.textbox textarea');
	search = $('.search'); searchTerm = $('.searchTerm'); select = $('select');

	panel = $('.panel'); chatPopupContent = $('.chatPopupContent');

	resultrow_td = $('.resultRow td');

	editIconPopupContent = $('.showEditIconPopupContent');

	card_p = $('.card p'); profilecard_p = $('.profilecard p');
	// ---------------------------------------------------------------------------

	checkbox = $('#dark-switch');

	// set dark-switch 'on'/'off' depending on the 'mode' item in local storage
	checkbox[0].checked = (localStorage.getItem('mode') === 'dark') ? true:false;

	toggleDarkMode(false); // update current view based on the state of 'dark-switch'

	// set event listener for 'dark-switch'
	checkbox.on("click", () => {toggleDarkMode(true)});
});

// This function is meant for chums.js and discover.js.
// Updates vars h2 and h3 to include h2 and h3 tags added from data results.
function refresh_h() {
	// console.log('refresh header css');
	h2 = $('h2'); h3 = $('h3');

	let color_ = ($('#dark-switch')[0].checked) ? 'white':'black';
	h2.css('color', color_);
	h3.css('color', color_);
}

// This function is meant for applications.js.
// Updates var resultrow_td to include tags of class 'resultsRow td'
// and var fas to include tags of class 'fas'
// added from data results.
function refresh_td_fas() {
	// console.log('refresh td css');
	resultrow_td = $('.resultRow td');
	fas = $('i.fas').slice(1);

	let color_ = ($('#dark-switch')[0].checked) ? 'white':'black';
	resultrow_td.css('color', color_);
	fas.css('color', color_);
}

// main function.
// checks if the user wants dark mode or not on switch flip.
// then it acts on that choice -- on or off (dark/light mode, respectively)
function toggleDarkMode(alert_) {
	let localStorage = window.localStorage;

	checkBox = document.getElementById("dark-switch");

	if (checkBox.checked === true) {
		enableDarkModeSettings();
		localStorage.setItem('mode', 'dark');
		// set mode in local storage to 'dark'

	} else {
		enableLightModeSettings(alert_);
		localStorage.setItem('mode', 'light');
		// set mode in local storage to' light'
	}
}

// Changes CSS to darker hues.
function enableDarkModeSettings() {
	console.log("Dark mode is ON!");

	background.css('background', 'url(images/greybg.png)');

	loginbox.css('background-color','var(--clr-darker_ashen)');
	login_h1.css('color', 'white');

	loginbottom.css('background-color','var(--clr-darker_ashen)');

	or_space.css('color', 'white');
	login_divider.css('border-color', 'white');

	fas.css('color', 'white');
	fas_fa_at.css('color', 'white');
	fas_fa_lock.css('color','white');

	wrapper.css('background-color','rgba(34, 34, 34, 0.8)');

	create_profile_box.css('background-color', 'var(--clr-darker_ashen)');
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

	card.css('background-color','rgba(30, 30, 30, 0.8)');
	profilecard.css('background-color','rgba(30, 30, 30, 0.8)');

	nav_ul.css('background-color','black');
	nav_li.css('background-color', 'var(--clr-transparent_two_black)');

	footer.css('color','white');

	form.css('color', 'white');
	input.css({'color':'white', 'background-color':'var(--clr-darker_ashen)'});
	pref_input.css('background-color', 'var(--clr-ghost_black)')
	tb_ta.css({'color':'white', 'background-color':'var(--clr-darker_ashen)'});

	search.css('color', 'black');
	searchTerm.css({'background-color':'var(--clr-darker_ashen)', 'color':'var(--clr-primary_light)'});
	select.css({'background-color':'var(--clr-darker_ashen)', 'color':'var(--clr-primary_light)'});

	panel.css({'color':'white', 'background-color':'var(--clr-ghost_black)'});
	chatPopupContent.css('background-color', 'var(--clr-darker_ashen)');

	resultrow_td.css('color', 'white');

	editIconPopupContent.css('background-color', "var(--clr-darker_ashen)");

	card_p.css('background-color','var(--clr-ghost_black)');
	profilecard_p.css('background-color','var(--clr-ghost_black)');
}

// Changes CSS to lighter hues.
// The parameter 'alert_' is true when the switch is used;
// 'alert_' is false only during jquery.ready() (at the top of this js file)
function enableLightModeSettings(alert_) {
	if (alert_) {
		// alert("Night-watchers: Prepare your eyes!");
	} // only appears when toggling, not when naviagting to different pages
	console.log("Dark mode is OFF!");

	background.css('background', 'url(images/bluebg.png)');

	loginbox.css('background-color','white');
	login_h1.css('color','black');

	loginbottom.css('background-color','white');

	or_space.css('color','black');
	login_divider.css('border-color','black');

	fas.css('color', 'initial');
	fas_fa_at.css('color', 'black');
	fas_fa_lock.css('color','black');
	fas_fa_plane.css('color', 'white');

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

	card.css('background-color','var(--clr-primary_light)');
	profilecard.css('background-color','var(--clr-primary_light)');

	nav_ul.css('background-color','white');
	nav_li.css('background-color','rgba(255,255,255,0.5)');

	footer.css('color','black');

	form.css('color','black');
	input.css({'color':'black','background-color':'white'});
	pref_input.css('background-color', 'var(--clr-ghost_black)');
	tb_ta.css({'color':'black','background-color':'white'});

	search.css('color', 'white');
	searchTerm.css({'background-color':'white', 'color':'black'});
	select.css({'background-color':'white', 'color':'black'});

	panel.css({'color':'black', 'background-color':'var(--clr-lightfade_white)'});
	chatPopupContent.css('background-color', 'var(--clr-cream_ish)');

	resultrow_td.css('color','black');

	editIconPopupContent.css('background-color', 'white');

	card_p.css('background-color','var(--clr-ghost_black)');
	profilecard_p.css('background-color','var(--clr-ghost_black)');
}
