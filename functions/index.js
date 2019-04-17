const functions = require('firebase-functions');
const admin = require("firebase-admin");
admin.initializeApp();

var nodemailer = require('nodemailer');

exports.sendMail = functions.https.onRequest((req, res) => {
  var transporter = nodemailer.createTransport(
  /*smtps://username@gmail.com:password@smtp.gmail.com*/
  );

  var mailOptions ={
    to: /*receive@gmail.com*/,
    subject: 'Test mail',
    html: 'testing email'
  }
  transporter.sendMail(mailOptions, function(err, res) {
    if (err) {
      res.end('Mail not sent.');
    } else {
      res.end('Mail sent.');
    }
  });
});
// to send message, use the url:
// https://us-central1-study-chums.cloudfunctions.net/sendMail

// TODO: how to get the emails of sender and receiver from html to here?





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
