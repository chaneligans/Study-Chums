const functions = require('firebase-functions');
const admin = require("firebase-admin");
admin.initializeApp();

// exports.redirectToLogin = functions.http.onRequest((request, response) => {
//   // check if user is logged in***
//   // if so, redirect to homepage and login into their account to pull up their data
//   // if not, redirect to index
//
//   admin.database.ref('Users').get()
//   .then(snapshot => {
//     const data = snapshot.val();
//     let currentUser = admin.auth().currentUser; // may need to change this later
//     if (currentUser !== null) {
//       data.forEach(child => {
//         // check uid against current user id
//         if (child.uid === currentUser) {
//           // redirect to homepage with login credentials
//
//           response.redirect('../public/home.html');
//         } else {
//
//         }
//       });
//     }
//   }).catch(error => {
//     console.log(error);
//     console.log("Redirecting to login page...");
//     // redirect to login page
//     response.redirect('../public/index.html');
//   });
//
//   reponse.send(null);
// });

// *** is the user logged into Facebook?

