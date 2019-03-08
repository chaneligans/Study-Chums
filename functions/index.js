const functions = require('firebase-functions');
var firebase = require("firebase");



//$(document).ready(function() {
//    $('.main-btn').click(function() {
//        $('.search-description').slideToggle(100);
//    });
//    $('.search-description li').click(function() {
//        var target = $(this).html();
//        var toRemove = 'By ';
//        var newTarget = target.replace(toRemove, '');
//        //remove spaces
//        newTarget = newTarget.replace(/\s/g, '');
//        $(".search-large").html(newTarget);
//        $('.search-description').hide();
//        $('.main-input').hide();
//        newTarget = newTarget.toLowerCase();
//        $('.main-' + newTarget).show();
//    });
//    $('#main-submit-mobile').click(function() {
//      $('#main-submit').trigger('click');
//    });
//    $(window).resize(function() {
//      replaceMatches();
//    });
//
//    function replaceMatches() {
//      var width = $(window).width();
//      if (width < 516) {
//        $('.main-location').attr('value', 'City or postal code');
//      } else {
//        $('.main-location').attr('value', 'Search by city or postal code');
//      }
//
//    }
//
//    replaceMatches();
//
//    function clearText(thefield) {
//      if (thefield.defaultValue === thefield.value) {
//        thefield.value = ""
//      }
//    }
//
//    function replaceText(thefield) {
//      if (thefield.value === "") {
//        thefield.value = thefield.defaultValue
//      }
//    }
//});

//Call jQuery before below code

// const admin = require('firebase-admin');
// admin.initializeApp();

// write in what happens if something happens to firebase here
// example(s): 
// - emails can be sent via a function from here

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

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
//examples
// exports.addMessage = functions.https.onRequest((req, res) => {
//   const original = req.query.text;
//
//   return admin.database().ref('/messages')
//     .push({original: original}).then((snapshot) => {
//     return res.redirect(303, snapshot.ref.toString());
//   });
// });
//
// exports.makeUppercase = functions.database.ref('/messages/{pushId}/original')
//   .onCreate((snapshot, context) => {
//   const original = snapshot.val();
//   console.log('Uppercasing', context.params.pushId, original);
//   const uppercase original.toUpperCase();
//
//   return snapshot.ref.parent.child('uppercase')
// });
//end of examples
