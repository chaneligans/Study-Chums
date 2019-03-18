// Checks if a user is logged in
// Redirects the user to the index if user is not signed in
function checkLogin() {
  firebase.auth().onAuthStateChanged(function(user) {
    if(user) {
      console.log('Signed in');
    }
    else {
      console.log('Not signed in: ' + user);
      alert('You are not signed in. Please log in to continue.');
      location.href = 'index.html';
    }
  });
}