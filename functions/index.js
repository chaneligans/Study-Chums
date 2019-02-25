const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// var config = {
//   apiKey: "AIzaSyDFPHvR2SV7dodysPpvLUfIGp6huuBDf0A",
//   authDomain: "study-chums.firebaseapp.com",
//   databaseURL: "https://study-chums.firebaseio.com",
//   projectId: "study-chums",
//   storageBucket: "study-chums.appspot.com",
//   messagingSenderId: "644812797355"
// };
//
// firebase.initializeApp(config);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// exports.addMessage = functions.https.onRequest((req, res) => {
//   const original = req.query.text;
//
//   return admin.database().ref('/messages')
//     .push({original: original}).then((snapshot) => {
//     return res.redirect(303, snapshot.ref.toString());
//   });
// });

//write new user data to firebase
function writeNewUserData(uid, _username, _email, _name, _pass) {
  firebase.database().ref('users/' + uid).set({
    currentlyActive: false,
    email: _email,
    name: _name,
    pass: _pass,
    username: _username
    // encrypt items later, and figure out keys for them later
  }, function(error) {
    if (error) {
      //write failed...
      console.log("Write to database failed!");
      // leave them where they are
      // maybe highlight incorrect input lines?
    } else {
      //write succeeded!
      console.log("Write to database succeeded!");
      // send them back to the login page afterward
    }
  });
}

  // delete user data from firebase
  function removeUserData(uid) {
    firebase.database().ref('users/' + uid).remove().then(function() {
      console.log("Data deletion for uid:" + uid + " successful!");
    }).catch(function(error) {
      console.error("Error in data deletion for uid:" + uid);
    });
  }

  // find the user's data within firebase and determine the input's validity.
  function locateUserWithinDatabase(uid, _username, _pass) {
    firebase.database().ref('users/' + uid).once('value').then(function(snapshot) {
      if (snapshot.exists()) {
        console.log("This uid exists in the database.");
        var username_ = (snapshot.val() && snapshot.val().username);
        var pass_ = (snapshot.val() && snapshot.val().pass);
        if ((_username === username_) && (_pass === pass_)) {
          console.log("This user is who they say they are.");
          // proceed with stuff (good end)

        } else {
          console.log("The given username and/or password is incorrect.");
          // (bad end)
        }
      } else {
        console.log("This uid does not exist in the database.");
        // (bad end)
      }
    });
  }
