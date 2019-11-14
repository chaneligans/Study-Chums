function facebookSignIn() {
  console.log("clicked 'facebook sign in'");

  const provider = new firebase.auth.FacebookAuthProvider();
  firebase.auth().signInWithPopup(provider).then(function(result) {
    // console.log("Result: ", result);

    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    const token = result.credential.accessToken;

    // The signed-in user info.
    let user = result.user;
    console.log("Successfully signed in " + user.displayName);

    // Redirect after signing in
    if(result.additionalUserInfo.isNewUser) {
      initializeUserData(user);

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

function initializeUserData(user) {
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

    Promise.resolve(totalUsers).then(result => {
      console.log(result-1);
      setIndex(user, result-1);
    });
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
  const email_in = document.getElementById("create-account-email-input").value;
  const password_in = document.getElementById("create-account-password-input").value;

  firebase.auth().createUserWithEmailAndPassword(email_in, password_in)
  .then(userCreds => {
    initializeUserData(userCreds.user);

    const actionCodeSettings = {
      url: 'https://study-chums.firebaseapp.com/verify_account.html',
      handleCodeInApp: true,
    };
    firebase.auth().sendSignInLinkToEmail(email_in, actionCodeSettings)
    .then(() => {
      console.log("Email verification link successfully sent.");
    })
    .catch(function(error) {
      console.log("Error sending verification email -- ", error.message);
    });

    alert('An verification link has been sent to the given email. Please verify to continue!');
  })
  .catch(function(error) {
    const errorCode = error.code;
    const errorMessage = error.message;

    if(errorCode == 'auth/invalid-email') {
      alert('Email is not vaild.');
    }
    else if(errorCode == "auth/email-already-in-use") {
      alert("Email is already in use. Please sign in.");
    }
    else if(errorCode == 'auth/weak-password') {
      alert('Password is too weak. It should be at least 6 characters.');
    }
    else if(errorCode == 'auth/operation-not-allowed') {
      console.log("Uh oh. Auth via email and password is not enabled.");
    }

    console.log("Error creating new user with email and password --", errorMessage);
    console.log("Error creating new user with email and password --", errorCode);
  });
}

function emailAndPasswordSignIn() {
  const email_in = document.getElementById("login-email-input").value;
  const password_in = document.getElementById("login-password-input").value;

  firebase.auth().signInWithEmailAndPassword(email_in, password_in)
  .then(result => {
    result.user.reload;

    if(result.user.emailVerified) {
      setTimeout(() => {
        location.href = "home.html";
      }, 1000);
    }
    else {
      const actionCodeSettings = {
        url: 'https://study-chums.firebaseapp.com/verify_account.html',
        handleCodeInApp: true,
      };
      firebase.auth().sendSignInLinkToEmail(email_in, actionCodeSettings)
      .then(() => {
        console.log("Email verification link successfully sent.");
        alert('A verification email has been sent. You must verify account before signing in.');
      })
      .catch(function(error) {
        console.log("Error sending verification email -- ", error.message);
      });
    }
  })
  .catch(function(error) {
    const errorCode = error.code;
    const errorMessage = error.message;

    if(errorCode == 'auth/invalid-email') {
      alert('Email is not vaild.');
    }
    else if(errorCode == "auth/user-disabled") {
      alert("User has been disabled.");
    }
    else if(errorCode == 'auth/user-not-found') {
      alert('Email and password combination not found.');
    }
    else if(errorCode == 'auth/wrong-password') {
      alert("Invalid password.");
    }

    console.log("Error signing in user with email and password --", errorMessage);
    console.log("Error signing in user with email and password --", errorCode);
  });
}