window.fbAsyncInit = function() {
  FB.init({
    appId      : '803620283323357',
    cookie     : true,
    xfbml      : true,
    version    : 'v3.2'
  });

  FB.AppEvents.logPageView();

};

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.2&appId=803620283323357&autoLogAppEvents=1";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));