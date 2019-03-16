function facebookSignIn() {
  console.log("clicked 'facebook sign in'");

  var provider = new firebase.auth.FacebookAuthProvider();
  firebase.auth().signInWithPopup(provider).then(function(result) {
    console.log("Result: ",result);

    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    var token = result.credential.accessToken;

    // The signed-in user info.
    var user = result.user;
    console.log("Successfully signed in " + user.displayName);

    // Redirect after signing in
    if(result.additionalUserInfo.isNewUser) {
        var totalUsers;
        var totalRef = firebase.database().ref("TotalUsers");
        totalRef.once("value", function(data) {
          totalUsers = data.val().total;
          var index_in = totalUsers;
          totalUsers = totalUsers + 1;

          var userRef = firebase.database().ref("Users/" + user.uid);
          userRef.update({
            index: index_in,
            "index": index_in
          }, function(error) {
            if (error) {
              console.log("Update failed - index to " + index_in);
            } else {
              console.log("Update suceeded - index to " + index_in);
            }
          });

          totalRef.update({
            total: totalUsers,
            "total": totalUsers
          }, function(error) {
            if (error) {
              console.log("Update failed - total to " + totalUsers);
              alert("Something went wrong! Please try again.\nError: " + error);
            } else {
              console.log("Update suceeded - total to " + totalUsers);
              setTimeout(function() {
                location.href = "create_profile.html";
              }, 1000);
            }
          });
        });
    } else {
      window.location.href = "home.html";
    }

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