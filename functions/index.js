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
  var actualEmail;
  var recipientID;
  var recipient = change.after.forEach((snapshot) => {
    recipientID = snapshot.key;
  });
  console.log("Recipient:",recipientID);
  
  var userDataRef = admin.database().ref();
  
  var recipientEmailRef = userDataRef.child("Users/"+recipientID+"/email");

  recipientEmailRef.on("value", (snapshot) => {
    var key = snapshot.key; 
    if(snapshot.val()) {
      actualEmail = snapshot.val();
    }   
    else {
      console.log("Couldn't get email");
    }         
  });
  
  var mailOptions = {
    from: `${APP_NAME} <noreply@firebase.com>`,
    to: email,
  };
  
  mailOptions.subject = `Welcome to ${APP_NAME}!`;
  
  // can change .text to .html to make it prettier
  mailOptions.text = `Hello! This is a message from ${APP_NAME}. You have a new match request! recipient id: ${recipientID} emaiil: ${actualEmail}`;
//  mailTransport.sendMail(mailOptions, (err, response) =>{
//    if (err) {
//      console.log('Could not send request email to', email);
//    }
//    else{
//      console.log('Request email sent to:', email);
//    }
//  });
  return null;
});