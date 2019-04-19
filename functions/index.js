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

exports.sendRequestEmail = functions.database.ref('Applications/{uid}/Sent').onWrite((change, context) => {
  
  var currentUserDisplayName;
  var currentUserID = context.auth.uid;
  admin.auth().getUser(currentUserID).then(user => {
    currentUserDisplayName = user.displayName;
    return currentUserDisplayName;
  }).catch(error => {
    throw new Error("Couldn't get currentUserDisplayName");
  });
  
  var email = "chanelmdza@gmail.com"; // sending to chanel to not spam anyone
  var inputEmail; // this is the email they enter in the create profile, so it's possible it could be an invalid email
  var firebaseEmail; // this is the user's facebook email
  
  var recipientName;
  var recipientID;
  var recipient = change.after.forEach((snapshot) => {
    recipientID = snapshot.key;
    // Firebase email promise
    admin.auth().getUser(snapshot.key).then(user => {
      firebaseEmail = user.email;
      recipientName = user.displayName;
      return firebaseEmail;
    }).catch(error => {
      throw new Error("[Line 31] Error fetching user data: ", error);
    });
  });
    
  var userDataRef = admin.database().ref();
  var recipientEmailRef = userDataRef.child("Users/"+recipientID+"/email");

  // Input email promise
  var getInputEmail = recipientEmailRef.once("value", (snapshot) => {
    inputEmail = snapshot.val(); 
  }).then(value => {
    return value;
  }).catch(error => {
    console.log(error);
  });  
  
  getInputEmail.then(value => {
    if (value) {
      
      // Send mail
      var mailOptions = {
        from: `${APP_NAME} <noreply@firebase.com>`,
        to: email,
      };

      mailOptions.subject = `You have a new match request! | ${APP_NAME}`;

      mailOptions.html = "<html><head><link href=\"https://fonts.googleapis.com/css?family=Nunito|Sniglet\" rel=\"stylesheet\" type=\"text/css\"></head><body><div id=\"body\" style=\"background-image: url('https://firebasestorage.googleapis.com/v0/b/study-chums.appspot.com/o/img%2Fbluebg.png?alt=media&token=62be1de9-9c75-4212-867d-a09469229df6'); padding: 20px;\"><div id=\"wrapper\" style=\"max-width: 600px; padding: 20px 50px 0px 50px; margin: auto; box-shadow: 1px 1px 10px #d8d8d8; background: #FFF;\"><h1 style=\"font-family: 'Sniglet'; color: #24A9E0; text-align: center; font-size: 60px; line-height: 50%;\">Study Chums</h1><h2 style=\"font-family: 'Sniglet'; color: #24A9E0;\">Hey, " + recipientName + "!</h2><p style=\"font-family: 'Nunito', sans-serif;\">" + currentUserDisplayName +" applied to be your Study Chum! View the request and " + currentUserDisplayName + "'s profile by clicking the button below. Happy studying!</p><img src=\"\"><span class=\"button\"><a href=\"https://study-chums.firebaseapp.com/applications.html\" style=\"font-family: 'Sniglet'; color: #24A9E0; background-color: #e8e8e8; padding: 15px; text-decoration: none; display: table; margin: 0 auto;\">View Requests</a></span><footer style=\"font-family: 'Sniglet'; color: #24A9E0; text-align: center; padding: 30px;\"><a href=\"https://study-chums.firebaseapp.com/preferences.html\" style=\"text-decoration: none; color: #7f7f7f;\">Click here to update your contact preferences.</a></footer></div></div></body></html>";

      mailTransport.sendMail(mailOptions, (err, response) =>{
        if (err) {
          console.log('Could not send request email to', email);
        }
        else{
          console.log('Request email sent to:', email);
        }
      });
      return value;
    }
    else {
      throw new Error("Couldnt get input email!");
    }
  }).catch(error => {
    console.log(error.message);
  });    
  
  return null;
});