// import functions from firebase / node
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// set email that sends out notification emails
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

// for the subject line
const APP_NAME = 'Study Chums';

// CLOUD FUNCTION sendRequestEmail
// triggers when a user sends a request
// sends an email to the person they requested
exports.sendRequestEmail = functions.database.ref('Applications/{uid}/Sent/{values}').onWrite((change, context) => {

  var currentUserDisplayName; // the user who triggered the function
  var currentUserID = context.auth.uid; // their ID
  var userDataRef = admin.database().ref(); // general reference to the database

  // get current user name
  var userNameRef = userDataRef.child(`Users/${currentUserID}/name`);
  var getUserName = userNameRef.once("value", (snapshot) => {
    currentUserDisplayName = snapshot.val();
  }).then(value => {
    return value;
  }).catch(error => {
    console.log(error);
  });


  var email = "chanelmdza@gmail.com"; // initialized as chanel's email for testing, but replaced later
  var inputEmail; // email in Users/user_id/email
  //var firebaseEmail; // this is the user's facebook email  (no longer needed)

  var recipientName;
  var recipientID;
  var subscriptionPreference;

  // get the user that the request was sent to (recipient)
  var recipient = change.after.forEach((snapshot) => {
    recipientID = snapshot.ref.parent.key;

    // get recipient name
    var recipientNameRef = userDataRef.child(`Users/${snapshot.ref.parent.key}/name`);
    var getRecipientName = recipientNameRef.once("value", (snapshot) => {
      recipientName = snapshot.val();
    }).then(value => {
      return value;
    }).catch(error => {
      console.log(error);
    });

    // get recipient email
    var recipientEmailRef = userDataRef.child(`Users/${snapshot.ref.parent.key}/email`);
    var getRecipientEmail = recipientEmailRef.once("value", (snapshot) => {
      inputEmail = snapshot.val();
    }).then(value => {
      return value;
    }).catch(error => {
      console.log(error);
    });

    // get recipient subscription preference (won't send email if it's false)
    var recipientSubscriptionRef = userDataRef.child(`Subscriptions/${snapshot.ref.parent.key}/subscribed`);
    var getRecipientSubscription = recipientSubscriptionRef.once("value", (snapshot) => {
      subscriptionPreference = snapshot.val();
    }).then(value => {
      return value;
    }).catch(error => {
      console.log(error);
    });

    // Firebase email promise (no longer needed, but keeping here bc it took me hours to get)
    // var getFirebaseEmail = admin.auth().getUser(snapshot.ref.parent.key).then(user => {
    //   firebaseEmail = user.email;
    //   console.log("Firebase email: ", firebaseEmail);
    //   return firebaseEmail;
    // }).catch(error => {
    //   throw new Error("Error fetching user data: ", error);
    // });

    // Get all the information, then send the email
    Promise.all([getRecipientName, getRecipientEmail, getRecipientSubscription]).then(values => {
      email = inputEmail; // replace chanel's email with the actual email

      if (subscriptionPreference === true) {
        // set the options for the email we are about to send
        var mailOptions = {
          from: `${APP_NAME} <noreply@firebase.com>`,
          to: email,
        };

        mailOptions.subject = `You have a new chum request! | ${APP_NAME}`;

        // formatting email is very particular, so CSS has to be inline, and fonts have to be imported manually
        mailOptions.html = "<html><head><style>@font-face { font-family: 'Nunito'; font-style: normal; font-weight: 400; src: local('Nunito Regular'), local('Nunito-Regular'), url(https://fonts.gstatic.com/s/nunito/v10/XRXV3I6Li01BKofIOuaBXso.woff2) format('woff2'); unicode-range: U+0102-0103, U+0110-0111, U+1EA0-1EF9, U+20AB;}@font-face { font-family: 'Nunito'; font-style: normal; font-weight: 400; src: local('Nunito Regular'), local('Nunito-Regular'), url(https://fonts.gstatic.com/s/nunito/v10/XRXV3I6Li01BKofIO-aBXso.woff2) format('woff2'); unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;}@font-face { font-family: 'Nunito'; font-style: normal; font-weight: 400; src: local('Nunito Regular'), local('Nunito-Regular'), url(https://fonts.gstatic.com/s/nunito/v10/XRXV3I6Li01BKofINeaB.woff2) format('woff2'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;}@font-face { font-family: 'Sniglet', sans-serif; font-style: normal; font-weight: 400; src: local('Sniglet Regular'), local('Sniglet-Regular'), url(https://fonts.gstatic.com/s/sniglet/v10/cIf9MaFLtkE3UjaJ9CChYVkH.woff2) format('woff2'); unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;}@font-face { font-family: 'Sniglet', sans-serif; font-style: normal; font-weight: 400; src: local('Sniglet Regular'), local('Sniglet-Regular'), url(https://fonts.gstatic.com/s/sniglet/v10/cIf9MaFLtkE3UjaJ9C6hYQ.woff2) format('woff2'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;}</style></head><body><div id=\"body\" style=\"background-image: url('https://firebasestorage.googleapis.com/v0/b/study-chums.appspot.com/o/img%2Fbluebg.png?alt=media&token=62be1de9-9c75-4212-867d-a09469229df6'); padding: 20px;\"><div id=\"wrapper\" style=\"max-width: 600px; padding: 20px 50px 0px 50px; margin: auto; box-shadow: 1px 1px 10px #d8d8d8; background: #FFF;\"><img src=\"https://firebasestorage.googleapis.com/v0/b/study-chums.appspot.com/o/img%2Flogo.png?alt=media&token=f8d955ee-e722-4b32-a505-d8f57fc0e20b\" style=\"max-width: 100%; margin: 0 auto; display: table;\"><h2 style=\"font-family: 'Sniglet', sans-serif; color: #24A9E0;\">"
          + `Hey, ${recipientName}!</h2>` + "<p style=\"font-family: 'Nunito', sans-serif;\">"
          + `<strong>${currentUserDisplayName}</strong>` + " applied to be your Study Chum! View the request and "
          + `<strong>${currentUserDisplayName}</strong>` + "'s profile by clicking the button below. Happy studying!</p>"
          + "<img src=\"\"><a href=\"https://study-chums.firebaseapp.com/applications.html\" style=\"display: table; margin: 0 auto;\"><img class=\"button\" src=\"https://firebasestorage.googleapis.com/v0/b/study-chums.appspot.com/o/img%2Fbutton.png?alt=media&token=098a5a3f-f363-4b3a-8f67-b11ec4bd1dfe\" style=\"max-width:200px;\"></a><footer style=\"font-family: 'Sniglet', sans-serif; color: #24A9E0; text-align: center; padding: 30px;\">"
          + `This email was sent to ${inputEmail}.<br>`
          + "<a href=\"https://study-chums.firebaseapp.com/preferences.html\" style=\"text-decoration: none; color: #7f7f7f;\">Click here to update your contact preferences.</a></footer></div></div></body></html>";

        // send the mail, logs are found on the firebase console
        mailTransport.sendMail(mailOptions, (err, response) =>{
          if (err) {
            console.log(`Could not send request email to ${email}`);
          }
          else{
            console.log(`Request email sent to ${email}`);
          }
        });
      } else {
        console.log(`Email preference for ${email} is set to false`);
      }

      return values;
    }).catch(error => {
      throw new Error("Error with promise all!!");
    });

  });

  return null;
});

// CLOUD FUNCTION sendAcceptEmail
// sends an email to the person who sent the request IF their request was accepted
// notifys the person (request sender) that their request was accepted
// triggered when the request is removed from the database (the request gets removed when it is accepted or declined)
exports.sendAcceptEmail = functions.database.ref('Applications/{uid}/Sent/{values}').onDelete((change, context) => {

  var email = "chanelmdza@gmail.com"; // initial email for testing, replaced later
  var inputEmail; // email found in Users/{id}/email

  var currentUserID = change.key; // the person who accepted/denied the request
  var senderID = change.ref.parent.parent.key; // the person who is getting accepted/denied
  var userDataRef = admin.database().ref();

  // get the result of the request
  // chumStatus will be "Chums" if it was accepted, "null" if it was declined
  var chumStatus;
  var chumsRef = userDataRef.child(`Chums/${currentUserID}/${senderID}/status`);
  var getChumStatus = chumsRef.once("value", (snapshot) => {
    chumStatus = snapshot.val();
    console.log(`Status: ${snapshot.val()}`);
  }).then(value => {
    return value;
  }).catch(error => {
    console.log(error);
  });

  // get current user name (the person who accepted the request)
  var currentUserDisplayName;
  var userNameRef = userDataRef.child(`Users/${currentUserID}/name`);
  var getUserName = userNameRef.once("value", (snapshot) => {
    currentUserDisplayName = snapshot.val();
  }).then(value => {
    return value;
  }).catch(error => {
    console.log(error);
  });

  // get recipient user name (the person who is getting accepted/denied)
  var recipientName;
  var recipientNameRef = userDataRef.child(`Users/${senderID}/name`);
  var getRecipientName = recipientNameRef.once("value", (snapshot) => {
    recipientName = snapshot.val();
  }).then(value => {
    return value;
  }).catch(error => {
    console.log(error);
  });

  // get recipient email
  var recipientEmailRef = userDataRef.child(`Users/${senderID}/email`);
  var getRecipientEmail = recipientEmailRef.once("value", (snapshot) => {
    inputEmail = snapshot.val();
  }).then(value => {
    return value;
  }).catch(error => {
    console.log(error);
  });

  // get recipient subscription status
  var subscriptionPreference;
  var recipientSubscriptionRef = userDataRef.child(`Subscriptions/${senderID}/subscribed`);
  var getRecipientSubscription = recipientSubscriptionRef.once("value", (snapshot) => {
    subscriptionPreference = snapshot.val();
  }).then(value => {
    return value;
  }).catch(error => {
    console.log(error);
  });

  // get all the information necessary (execute promises above) before sending the email
  Promise.all([getChumStatus, getUserName, getRecipientName, getRecipientEmail, getRecipientSubscription]).then(values => {
    email = inputEmail; // replace email with the correct one

    // request was accepted
    if (chumStatus === "Chums") {
      console.log('Yall r chums');

      if (subscriptionPreference === true) {
        var mailOptions = {
          from: `${APP_NAME} <noreply@firebase.com>`,
          to: email,
        };

        mailOptions.subject = `You have a new Study Chum! | ${APP_NAME}`;

        mailOptions.html = "<html><head><style>@font-face { font-family: 'Nunito'; font-style: normal; font-weight: 400; src: local('Nunito Regular'), local('Nunito-Regular'), url(https://fonts.gstatic.com/s/nunito/v10/XRXV3I6Li01BKofIOuaBXso.woff2) format('woff2'); unicode-range: U+0102-0103, U+0110-0111, U+1EA0-1EF9, U+20AB;}@font-face { font-family: 'Nunito'; font-style: normal; font-weight: 400; src: local('Nunito Regular'), local('Nunito-Regular'), url(https://fonts.gstatic.com/s/nunito/v10/XRXV3I6Li01BKofIO-aBXso.woff2) format('woff2'); unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;}@font-face { font-family: 'Nunito'; font-style: normal; font-weight: 400; src: local('Nunito Regular'), local('Nunito-Regular'), url(https://fonts.gstatic.com/s/nunito/v10/XRXV3I6Li01BKofINeaB.woff2) format('woff2'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;}@font-face { font-family: 'Sniglet', sans-serif; font-style: normal; font-weight: 400; src: local('Sniglet Regular'), local('Sniglet-Regular'), url(https://fonts.gstatic.com/s/sniglet/v10/cIf9MaFLtkE3UjaJ9CChYVkH.woff2) format('woff2'); unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;}@font-face { font-family: 'Sniglet', sans-serif; font-style: normal; font-weight: 400; src: local('Sniglet Regular'), local('Sniglet-Regular'), url(https://fonts.gstatic.com/s/sniglet/v10/cIf9MaFLtkE3UjaJ9C6hYQ.woff2) format('woff2'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;}</style></head><body><div id=\"body\" style=\"background-image: url('https://firebasestorage.googleapis.com/v0/b/study-chums.appspot.com/o/img%2Fbluebg.png?alt=media&token=62be1de9-9c75-4212-867d-a09469229df6'); padding: 20px;\"><div id=\"wrapper\" style=\"max-width: 600px; padding: 20px 50px 0px 50px; margin: auto; box-shadow: 1px 1px 10px #d8d8d8; background: #FFF;\"><img src=\"https://firebasestorage.googleapis.com/v0/b/study-chums.appspot.com/o/img%2Flogo.png?alt=media&token=f8d955ee-e722-4b32-a505-d8f57fc0e20b\" style=\"max-width: 100%; margin: 0 auto; display: table;\"><h2 style=\"font-family: 'Sniglet', sans-serif; color: #24A9E0;\">"
          + `Hey, ${recipientName}!</h2>`+ "<p style=\"font-family: 'Nunito', sans-serif;\">"
          + `<strong>${currentUserDisplayName}</strong>` + " is now your Study Chum! View your Study Chums, as well as "
          + `<strong>${currentUserDisplayName}</strong>` + "'s profile, and send them a message by clicking the button below. Happy studying!</p>"
          + "<img src=\"\"><a href=\"https://study-chums.firebaseapp.com/chums.html\" style=\"display: table; margin: 0 auto;\"><img class=\"button\" src=\"https://firebasestorage.googleapis.com/v0/b/study-chums.appspot.com/o/img%2Fchums.png?alt=media&token=f3435cbb-79b1-4ed2-b1af-e8856e75bb17\" style=\"max-width:200px;\"></a><footer style=\"font-family: 'Sniglet', sans-serif; color: #24A9E0; text-align: center; padding: 30px;\">"
          + `This email was sent to ${inputEmail}.<br>`
          + "<a href=\"https://study-chums.firebaseapp.com/preferences.html\" style=\"text-decoration: none; color: #7f7f7f;\">Click here to update your contact preferences.</a></footer></div></div></body></html>";

        mailTransport.sendMail(mailOptions, (err, response) =>{
          if (err) {
            console.log(`Could not send acceptance email to ${email}`);
          }
          else{
            console.log(`Acceptance email sent to ${email}`);
          }
        });
      } else {
        console.log(`Email preference for ${email} is set to false`);
      }
    } else {
      // request was denied or something else
      console.log(`yall r not chums: ${chumStatus}`);
    }

    return values;
  }).catch(error => {
    throw new Error("Error with promise all!!");
  });


  return null;
});

//cloud function to send push notifications
exports.sendMessageNotification = functions.firestore.document('ChatRooms/{chatRoomID}/Messages/{messageID}').onCreate((snap, context) => {
  //send notification to each user
  const roomID = context.params.chatRoomID;
  const payload = {
    notification: {
      title: `New Message from ${snap.data().senderName}`,
      body: snap.data().message,
      //icons:
      click_action: `https://study-chums.firebaseapp.com/messages`,
    }
  };

  return admin.firestore().collection('ChatRooms').doc(roomID).collection('Tokens')
    .get().then(snapshots => {
      let tokens = [];
      snapshots.forEach((snapshot) => {
        tokens.push(snapshot.data().token);
      });
      return admin.messaging().sendToDevice(tokens, payload);
    })
});