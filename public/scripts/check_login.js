// Checks if a user is logged in
// Redirects the user to the index if user is not signed in
function checkLogin() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      console.log('Signed in');
    } else {
      console.log('Not signed in: ' + user);

      setTimeout(() => {
        alert('You are not signed in. Please log in to continue.');
        window.location.href = 'index.html';
      }, 1000);

    }
  });
}

// Redirects the user to the home page if they are signed in (For index.html only)
function checkIndexLogin() {
  firebase.auth().onAuthStateChanged(user => {
    if(user) {
      console.log('Signed in');
      window.location.href = 'home.html';
    }
  });
}