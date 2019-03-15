function facebookSignOut() {
    firebase.auth().signOut().then(function() {
      FB.logout(function(response) {
      // user is now logged out
      });
        console.log('Signout successful');
    }, function(error) {
        console.log('Signout failed')
    });
}