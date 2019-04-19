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
  
  var email = "chanelmdza@gmail.com"; // sending to chanel to not spam anyone
  var inputEmail; // this is the email they enter in the create profile, so it's possible it could be an invalid email
  var firebaseEmail; // this is the user's facebook email
  
  var recipientID;
  var recipient = change.after.forEach((snapshot) => {
    recipientID = snapshot.key;
    // Firebase email promise
    admin.auth().getUser(snapshot.key).then(user => {
      firebaseEmail = user.email;
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

      // can change .text to .html to make it prettier
      mailOptions.text = `Hello! This is a message from ${APP_NAME}. You have a new match request! \nrecipient: ${recipient} \nid: ${recipientID} \nfirebase email: ${firebaseEmail} \ninputEmail: ${inputEmail}`;

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