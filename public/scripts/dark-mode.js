let checkbox, background,
  loginbox, login_h1, loginbottom,
  or_space, login_divider,
  fas, fas_fa_at, fas_fa_lock, fas_fa_plane, fab_fa_weixin,
  wrapper, create_profile_box,
  create_profile_btn,
  h1, h2, h3, h4, h5,
  td, p, li, a_,
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
  card_p, profilecard_p,
  switch_label;

let localStorage = window.localStorage,
  screen_width = window.width,
	color;

localStorage.setItem('mode',
  ((localStorage.getItem('mode') || 'light') === 'light') ? 'light' : 'dark');
// Set local storage item 'mode' to 'dark' or 'light' depending on if the
// current value of 'mode' in local storage ('light' by default) === 'light'

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

  fas = $('i.fas').slice(1);
  fas_fa_at = $('i.fas.fa-at');
  fas_fa_lock = $('i.fas.fa-lock');
  fas_fa_plane = $('i.login-icon.fas.fa-paper-plane');
  fab_fa_weixin = $('.fab.fa-weixin');

  wrapper = $('#wrapper');

  create_profile_box = $('.create-profile-box');
  create_profile_btn = $('.create-profile-btn');

  h1 = $('h1');
  h2 = $('h2');
  h3 = $('h3');
  h4 = $('h4');
  h5 = $('h5');

  td = $('td');
  p = $('p');
  li = $('li');
  a_ = $('a');
  i_left = $('i#leftbutton');
  i_right = $('i#rightbutton');

  card = $('.card');
  profilecard = $('.profilecard');

  nav_ul = $('nav ul');
  nav_li = $('nav li');

  footer = $('footer');

  form = $('form');
  input = $('input');
  pref_input = $('input#new_email');
  tb_ta = $('.textbox textarea');
  search = $('.search');
  searchTerm = $('.searchTerm');
  select = $('select');

  panel = $('.panel');
  chatPopupContent = $('.chatPopupContent');

  resultrow_td = $('.resultRow td');

  editIconPopupContent = $('.showEditIconPopupContent');

  card_p = $('.card p');
  profilecard_p = $('.profilecard p');

  switch_label = $('.onoffswitch-label');
  // ---------------------------------------------------------------------------

  checkbox = $('#dark-switch');

  // set dark-switch 'on'/'off' depending on the 'mode' item in local storage
  checkbox[0].checked = (localStorage.getItem('mode') === 'dark') ? true : false;

  // set event listener for 'dark-switch'
  checkbox.on("click", () => {
    toggleDarkMode(true)
  });
  screen_width = $(document).width();
  $(window).on("resize", () => {
    screen_width = $(document).width();
    toggleDarkMode(true);
  });

  screen_width = $(document).width();
  toggleDarkMode(false); // update current view based on the state of 'dark-switch'
});

// This function is meant for chums.js, messages.js, and discover.js.
// Updates vars h2 and h3 to include h2 and h3 tags added from data results.
function refresh_h() {
  // console.log('refresh header css');
  h2 = $('h2');
  h3 = $('h3');

  color_ = ($('#dark-switch')[0].checked) ? 'var(--clr-white)' : 'var(--clr-black)';
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

  color_ = ($('#dark-switch')[0].checked) ? 'var(--clr-white)' : 'var(--clr-black)';
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

  background.css('--back-image', 'url(images/greybg.png)');

  loginbox.css('background-color', 'var(--clr-darker_ashen)');
  login_h1.css('color', 'var(--clr-white)');

  loginbottom.css('background-color', 'var(--clr-darker_ashen)');

  or_space.css('color', 'var(--clr-white)');
  login_divider.css('border-color', 'var(--clr-white)');

  fas.css('color', 'var(--clr-white)');
  fas_fa_at.css('color', 'var(--clr-white)');
  fas_fa_lock.css('color', 'var(--clr-white)');
  fab_fa_weixin.css('color', 'var(--clr-white)');

  wrapper.css('background-color', 'var(--clr-ghost_grey)');

  create_profile_box.css('background-color', 'var(--clr-darker_ashen)');
  create_profile_btn.css('color', 'var(--clr-white)');

  h1.css('color', 'var(--clr-white)');
  h2.css('color', 'var(--clr-white)');
  h3.css('color', 'var(--clr-white)');
  h4.css('color', 'var(--clr-white)');
  h5.css('color', 'var(--clr-white)');

  td.css('color', 'var(--clr-white)');
  p.css('color', 'var(--clr-white)');
  i_left.css('color', 'var(--clr-white)');
  i_right.css('color', 'var(--clr-white)');
  li.css('color', 'var(--clr-white)');

  a_.hover(function() {
    $(this).css('color', 'var(--clr-hover)');
  }, function() {
    $(this).css('color', 'var(--clr-primary)');
  });

  h2.hover(function() {
    $(this).css('color', 'var(--clr-primary)');
  }, function() {
    $(this).css('color', 'var(--clr-white)');
  });

  card.css('background-color', 'var(--clr-ghost_grey)');
  profilecard.css('background-color', 'var(--clr-ghost_grey)');

  nav_ul.css('background-color', 'var(--clr-black)');
  if (screen_width <= 830) {
    nav_li.css('background-color', 'var(--clr-transparent_two_black)');
  } else {
    nav_li.css('background-color', 'var(--clr-ghost)');
  }

  footer.css('color', 'var(--clr-white)');

  form.css('color', 'var(--clr-white)');
  input.css({
    'color': 'var(--clr-white)',
    'background-color': 'var(--clr-darker_ashen)'
  });
  pref_input.css('background-color', 'var(--clr-ghost)')
  tb_ta.css({
    'color': 'var(--clr-white)',
    'background-color': 'var(--clr-darker_ashen)'
  });

  search.css('color', 'var(--clr-black)');
  searchTerm.css({
    'background-color': 'var(--clr-darker_ashen)',
    'color': 'var(--clr-primary_light)'
  });
  select.css({
    'background-color': 'var(--clr-darker_ashen)',
    'color': 'var(--clr-primary_light)'
  });

  panel.css({
    'color': 'var(--clr-white)',
    'background-color': 'var(--clr-ghost)'
  });
  chatPopupContent.css('background-color', 'var(--clr-darker_ashen)');

  resultrow_td.css('color', 'var(--clr-white)');

  editIconPopupContent.css('background-color', "var(--clr-darker_ashen)");

  card_p.css('background-color', 'var(--clr-ghost)');
  profilecard_p.css('background-color', 'var(--clr-ghost)');

  switch_label.hover(function() {
    $(this).css('--border-color', 'var(--clr-hover)');
  }, function() {
    $(this).css('--border-color', 'var(--clr-dark_ashen)');
  });
}

// Changes CSS to lighter hues.
// The parameter 'alert_' is true when the switch is used;
// 'alert_' is false only during jquery.ready() (at the top of this js file)
function enableLightModeSettings(alert_) {
  if (alert_) {
    // alert("Night-watchers: Prepare your eyes!");
  } // only appears when toggling, not when naviagting to different pages
  console.log("Dark mode is OFF!");

  background.css('--back-image', 'url(images/bluebg.png)');

  loginbox.css('background-color', 'var(--clr-white)');
  login_h1.css('color', 'var(--clr-black)');

  loginbottom.css('background-color', 'var(--clr-white)');

  or_space.css('color', 'var(--clr-black)');
  login_divider.css('border-color', 'var(--clr-black)');

  fas.css('color', 'initial');
  fas_fa_at.css('color', 'var(--clr-black)');
  fas_fa_lock.css('color', 'var(--clr-black)');
  fas_fa_plane.css('color', 'var(--clr-white)');
  fab_fa_weixin.css('color', 'var(--clr-darker_ashen)');

  wrapper.css('background-color', 'var(--clr-lightfade_white)');

  create_profile_box.css('background-color', 'var(--clr-white)');
  create_profile_btn.css('color', 'var(--clr-black)');

  h1.css('color', 'var(--clr-black)');
  h2.css('color', 'var(--clr-black)');
  h3.css('color', 'var(--clr-black)');
  h4.css('color', 'var(--clr-black)');
  h5.css('color', 'var(--clr-black)');

  td.css('color', 'var(--clr-black)');
  p.css('color', 'var(--clr-black)');
  i_left.css('color', 'var(--clr-black)');
  i_right.css('color', 'var(--clr-black)');
  li.css('color', 'var(--clr-black)');

  a_.hover(function() {
    $(this).css('color', 'var(--clr-light-blue)');
  }, function() {
    $(this).css('color', 'var(--clr-primary)');
  });

  h2.hover(function() {
    $(this).css('color', 'var(--clr-primary)');
  }, function() {
    $(this).css('color', 'var(--clr-black)');
  });

  card.css('background-color', 'var(--clr-primary_light)');
  profilecard.css('background-color', 'var(--clr-primary_light)');

  footer.css('color', 'var(--clr-black)');

  form.css('color', 'var(--clr-black)');
  input.css({
    'color': 'var(--clr-black)',
    'background-color': 'var(--clr-white)'
  });
  pref_input.css('background-color', 'var(--clr-ghost)');
  tb_ta.css({
    'color': 'var(--clr-black)',
    'background-color': 'var(--clr-white)'
  });

  search.css('color', 'var(--clr-white)');
  searchTerm.css({
    'background-color': 'var(--clr-white)',
    'color': 'var(--clr-black)'
  });
  select.css({
    'background-color': 'var(--clr-white)',
    'color': 'var(--clr-black)'
  });

  panel.css({
    'color': 'var(--clr-black)',
    'background-color': 'var(--clr-lightfade_white)'
  });
  chatPopupContent.css('background-color', 'var(--clr-cream_ish)');

  resultrow_td.css('color', 'var(--clr-black)');

  editIconPopupContent.css('background-color', 'var(--clr-white)');

  card_p.css('background-color', 'var(--clr-ghost)');
  profilecard_p.css('background-color', 'var(--clr-ghost)');

  switch_label.hover(function() {
    $(this).css('--border-color', 'var(--clr-fuchsia)');
  }, function() {
    $(this).css('--border-color', 'var(--clr-dark_ashen)');
  });
}