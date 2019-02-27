
// Initialize Firebase
var config = {
    apiKey: "AIzaSyDFPHvR2SV7dodysPpvLUfIGp6huuBDf0A",
    authDomain: "study-chums.firebaseapp.com",
    databaseURL: "https://study-chums.firebaseio.com",
    projectId: "study-chums",
    storageBucket: "study-chums.appspot.com",
    messagingSenderId: "644812797355"
};
firebase.initializeApp(config);
    

// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
    // Logged into your app and Facebook
        window.location.href = "home.html";

     } else {
        // The person is not logged into your app or we are unable to tell.
        document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
        }
}
// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState() {
    FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
    });
}

window.fbAsyncInit = function() {
    FB.init({
        appId      : '803620283323357',
        cookie     : true,
        xfbml      : true,
        version    : 'v3.2'
    });

    FB.AppEvents.logPageView();   
    // Now that we've initialized the JavaScript SDK, we call 
    // FB.getLoginStatus().  This function gets the state of the
    // person visiting this page and can return one of three states to
    // the callback you provide.  They can be:
    //
    // 1. Logged into your app ('connected')
    // 2. Logged into Facebook, but not your app ('not_authorized')
    // 3. Not logged into Facebook and can't tell if they are logged into
    //    your app or not.
    //
    // These three cases are handled in the callback function.

    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });

};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
 



// sign up with popup window
          
var provider = new firebase.auth.FacebookAuthProvider();
          
function facebookSignIn() {
    firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    console.log("Successfully signed in " + user.displayName)

    }).catch(function(error) {
    // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        });
}
          
function facebookSignOut() {
    firebase.auth().signOut().then(function() {
    console.log('Signout successful');                 
    }, function(error) {
        console.log('Signout failed')
    });
}
       