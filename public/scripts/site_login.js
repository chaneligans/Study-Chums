function facebookSignIn() {
  console.log("clicked 'facebook sign in'");

  const provider = new firebase.auth.FacebookAuthProvider();
  firebase.auth().signInWithPopup(provider).then(function(result) {
    console.log("Result: ",result);

    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    const token = result.credential.accessToken;

    // The signed-in user info.
    const user = result.user;
    console.log("Successfully signed in " + user.displayName);

    // Redirect after signing in
    if(result.additionalUserInfo.isNewUser) {
      const index = incrementTotalUsers();
      setIndex(user, index);

      setTimeout(() => {
        location.href = "create_profile.html";
      }, 1000);
    } 
    else {
      window.location.href = "home.html";
    }

  }).catch(function(error) {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    const credential = error.credential;
  });
}

function incrementTotalUsers() {
  let totalUsers;
  const totalRef = firebase.database().ref("TotalUsers");
  totalRef.once("value", function(data) {
    totalUsers = data.val().total;
    totalUsers = totalUsers + 1;

    totalRef.update({
      total: totalUsers,
      "total": totalUsers
    }, error => {
      if (error) {
        console.log("Update failed - total to " + totalUsers);
        alert("Something went wrong! Please try again.\nError: " + error);
      } else {
        console.log("Update suceeded - total to " + totalUsers);
      }
    });
  });

  Promise.resolve(totalUsers).then(result => {
    return result-1;
  });
}

function setIndex(user, index) {
  const userRef = firebase.database().ref("Users/" + user.uid);
  userRef.update({
    index: index,
    "index": index,
    "currentIndex": 0,
    currentIndex: 0
  }, error => {
    if (error) {
      console.log("Update failed - index to " + index);
    } else {
      console.log("Update suceeded - index to " + index);
    }
  });
}

function createUserWithEmailAndPassword() {
  const email_in = document.getElementById("email").value;
  const password_in = document.getElementById("password").value;

  firebase.auth().createUserWithEmailAndPassword(email_in, password_in)
  .then(user => {
    const index = incrementTotalUsers();
    setIndex(user, index);

    setTimeout(() => {
      location.href = "create_profile.html";
    }, 1000);
  })
  .catch(function(error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ...
  });
}

function emailAndPasswordSignIn() {

}