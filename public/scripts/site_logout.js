function siteSignOut() {
    firebase.auth().signOut().then(() => {
      console.log('Signout successful');
      location.href = "index.html";
    }, error => {
        console.log('Signout failed, here\'s why: ' + error);
    });
}