window.fbAsyncInit = function() {
  FB.init(fb_config);

  FB.AppEvents.logPageView();

  ((d, s, id) => {
    let js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
      return;
    }
    js = d.createElement(s);
    js.async = true;
    js.defer = true;
    js.id = id;

    let a = fb_config.appID,
      x = (fb_config.xfbml) ? 1 : 0,
      v = fb_config.version;

    js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=" + x +
      "&version=" + v + "&appId=" + a + "&autoLogAppEvents=1";
    fjs.parentNode.insertBefore(js, fjs);
  })(document, 'script', 'facebook-jssdk');
};

// ((d, s, id) => {
//   let js, fjs = d.getElementsByTagName(s)[0];
//   if (d.getElementById(id)) {
//     return;
//   }
//   js = d.createElement(s);
//   js.async = true;
//   js.defer = true;
//   js.id = id;
//
//   let a = fb_config.appID,
//     x = (fb_config.xfbml) ? 1 : 0,
//     v = fb_config.version;
//
//   js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=" + x +
//     "&version=" + v + "&appId=" + a + "&autoLogAppEvents=1";
//   fjs.parentNode.insertBefore(js, fjs);
// })(document, 'script', 'facebook-jssdk');