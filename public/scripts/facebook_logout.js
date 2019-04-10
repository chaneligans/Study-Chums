function facebookSignOut() {
    firebase.auth().signOut().then(function() {
      console.log('Signout successful');
      location.href="index.html";
    }, function(error) {
        console.log('Signout failed')
    });
}