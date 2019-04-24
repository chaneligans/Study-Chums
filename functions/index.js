const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});
const APP_NAME = 'Study Chums';

exports.sendRequestEmail = functions.database.ref('Applications/{uid}/Sent/{values}').onWrite((change, context) => {
  
  var currentUserDisplayName;
  var currentUserID = context.auth.uid;
  var userDataRef = admin.database().ref();
  
  // get current user name
  var userNameRef = userDataRef.child("Users/"+currentUserID+"/name");
  var getUserName = userNameRef.once("value", (snapshot) => {
    currentUserDisplayName = snapshot.val(); 
  }).then(value => {
    return value;
  }).catch(error => {
    console.log(error);
  }); 
  
  
  var email = "chanelmdza@gmail.com"; // sending to chanel to not spam anyone
  var inputEmail; // this is the email they enter in the create profile, so it's possible it could be an invalid email
  var firebaseEmail; // this is the user's facebook email  
  
  var recipientName;
  var recipientID;
  var subscriptionPreference;
  var recipient = change.after.forEach((snapshot) => {
    recipientID = snapshot.ref.parent.key;

    // get recipient user name
    var recipientNameRef = userDataRef.child("Users/"+snapshot.ref.parent.key+"/name");
    var getRecipientName = recipientNameRef.once("value", (snapshot) => {
      recipientName = snapshot.val(); 
    }).then(value => {
      return value;
    }).catch(error => {
      console.log(error);
    }); 
    
    var recipientEmailRef = userDataRef.child("Users/"+snapshot.ref.parent.key+"/email");
    var getRecipientEmail = recipientEmailRef.once("value", (snapshot) => {
      inputEmail = snapshot.val(); 
    }).then(value => {
      return value;
    }).catch(error => {
      console.log(error);
    });
    
    var recipientSubscriptionRef = userDataRef.child("Users/"+snapshot.ref.parent.key+"/subscription");
    var getRecipientSubscription = recipientSubscriptionRef.once("value", (snapshot) => {
      subscriptionPreference = snapshot.val(); 
    }).then(value => {
      return value;
    }).catch(error => {
      console.log(error);
    }); 
    
    
    // Firebase email promise
//    var getFirebaseEmail = admin.auth().getUser(snapshot.ref.parent.key).then(user => {
//      firebaseEmail = user.email;
//      console.log("Firebase email: ", firebaseEmail);
//      return firebaseEmail;
//    }).catch(error => {
//      throw new Error("Error fetching user data: ", error);
//    });
    
    Promise.all([getRecipientName, getRecipientEmail, getRecipientSubscription]).then(values => {
      email = inputEmail;
      
      if (subscriptionPreference === true) {
        // Send mail
        var mailOptions = {
          from: `${APP_NAME} <noreply@firebase.com>`,
          to: email,
        };

        mailOptions.subject = `You have a new match request! | ${APP_NAME}`;

        mailOptions.html = "<html><head><style>@font-face { font-family: 'Nunito'; font-style: normal; font-weight: 400; src: local('Nunito Regular'), local('Nunito-Regular'), url(https://fonts.gstatic.com/s/nunito/v10/XRXV3I6Li01BKofIOuaBXso.woff2) format('woff2'); unicode-range: U+0102-0103, U+0110-0111, U+1EA0-1EF9, U+20AB;}@font-face { font-family: 'Nunito'; font-style: normal; font-weight: 400; src: local('Nunito Regular'), local('Nunito-Regular'), url(https://fonts.gstatic.com/s/nunito/v10/XRXV3I6Li01BKofIO-aBXso.woff2) format('woff2'); unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;}@font-face { font-family: 'Nunito'; font-style: normal; font-weight: 400; src: local('Nunito Regular'), local('Nunito-Regular'), url(https://fonts.gstatic.com/s/nunito/v10/XRXV3I6Li01BKofINeaB.woff2) format('woff2'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;}@font-face { font-family: 'Sniglet'; font-style: normal; font-weight: 400; src: local('Sniglet Regular'), local('Sniglet-Regular'), url(https://fonts.gstatic.com/s/sniglet/v10/cIf9MaFLtkE3UjaJ9CChYVkH.woff2) format('woff2'); unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;}@font-face { font-family: 'Sniglet'; font-style: normal; font-weight: 400; src: local('Sniglet Regular'), local('Sniglet-Regular'), url(https://fonts.gstatic.com/s/sniglet/v10/cIf9MaFLtkE3UjaJ9C6hYQ.woff2) format('woff2'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;}</style></head><body><div id=\"body\" style=\"background-image: url('https://firebasestorage.googleapis.com/v0/b/study-chums.appspot.com/o/img%2Fbluebg.png?alt=media&token=62be1de9-9c75-4212-867d-a09469229df6'); padding: 20px;\"><div id=\"wrapper\" style=\"max-width: 600px; padding: 20px 50px 0px 50px; margin: auto; box-shadow: 1px 1px 10px #d8d8d8; background: #FFF;\"><img src=\"https://firebasestorage.googleapis.com/v0/b/study-chums.appspot.com/o/img%2Flogo.png?alt=media&token=f8d955ee-e722-4b32-a505-d8f57fc0e20b\" style=\"max-width: 100%; margin: 0 auto; display: table;\"><h2 style=\"font-family: 'Sniglet'; color: #24A9E0;\">Hey, " + recipientName + "!</h2><p style=\"font-family: 'Nunito', sans-serif;\"><strong>" + currentUserDisplayName + "</strong> applied to be your Study Chum! View the request and <strong>" + currentUserDisplayName +"</strong>'s profile by clicking the button below. Happy studying!</p><img src=\"\"><a href=\"https://study-chums.firebaseapp.com/applications.html\" style=\"display: table; margin: 0 auto;\"><img class=\"button\" src=\"https://firebasestorage.googleapis.com/v0/b/study-chums.appspot.com/o/img%2Fbutton.png?alt=media&token=098a5a3f-f363-4b3a-8f67-b11ec4bd1dfe\" style=\"max-width:200px;\"></a><footer style=\"font-family: 'Sniglet'; color: #24A9E0; text-align: center; padding: 30px;\">This email was sent to " + email + ".<br><a href=\"https://study-chums.firebaseapp.com/preferences.html\" style=\"text-decoration: none; color: #7f7f7f;\">Click here to update your contact preferences.</a></footer></div></div></body></html>";

        mailTransport.sendMail(mailOptions, (err, response) =>{
          if (err) {
            console.log('Could not send request email to', email);
          }
          else{
            console.log('Request email sent to:', email);
          }
        });  
      } else {
        console.log('Email preference for ' + email + 'is set to false');
      }
      
      return values;
    }).catch(error => {
      throw new Error("Error with promise all!!");
    });
    
  });  
  
  return null;
});