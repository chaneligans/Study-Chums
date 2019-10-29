function sendEmail(email){
    var auth = firebase.auth();
    var emailAddress = "user@example.com";

    auth.sendPasswordResetEmail(emailAddress).then(function() {
    // Email sent.
    }).catch(function(error) {
    // An error happened.
    });
}

function newPassword(){

}
function handler(){
    document.addEventListener('DOMContentLoaded', function() {
  // TODO: Implement getParameterByName()

  // Get the action to complete.
  var mode = getParameterByName('mode');
  // Get the one-time code from the query parameter.
  var actionCode = getParameterByName('oobCode');
  // (Optional) Get the continue URL from the query parameter if available.
  var continueUrl = getParameterByName('continueUrl');
  // (Optional) Get the language code if available.
  var lang = getParameterByName('lang') || 'en';

  // Configure the Firebase SDK.
  // This is the minimum configuration required for the API to be used.
  var config = {
    'apiKey': <API_KEY> // Copy this key from the web initialization
                        // snippet found in the Firebase console.
  };
  var app = firebase.initializeApp(config);
  var auth = app.auth();

  // Handle the user management action.
  switch (mode) {
    case 'resetPassword':
      // Display reset password handler and UI.
      handleResetPassword(auth, actionCode, continueUrl, lang);
      break;
    case 'recoverEmail':
      // Display email recovery handler and UI.
      handleRecoverEmail(auth, actionCode, lang);
      break;
    case 'verifyEmail':
      // Display email verification handler and UI.
      handleVerifyEmail(auth, actionCode, continueUrl, lang);
      break;
    default:
      // Error: invalid mode.
  }
  }, false);
}

function handleResetPassword(auth, actionCode, continueUrl, lang) {
  // Localize the UI to the selected language as determined by the lang
  // parameter.
  var accountEmail;
  // Verify the password reset code is valid.
  auth.verifyPasswordResetCode(actionCode).then(function(email) {
    var accountEmail = email;

    // TODO: Show the reset screen with the user's email and ask the user for
    // the new password.

    // Save the new password.
    auth.confirmPasswordReset(actionCode, newPassword).then(function(resp) {
      // Password reset has been confirmed and new password updated.

      // TODO: Display a link back to the app, or sign-in the user directly
      // if the page belongs to the same domain as the app:
      // auth.signInWithEmailAndPassword(accountEmail, newPassword);

      // TODO: If a continue URL is available, display a button which on
      // click redirects the user back to the app via continueUrl with
      // additional state determined from that URL's parameters.
    }).catch(function(error) {
      // Error occurred during confirmation. The code might have expired or the
      // password is too weak.
    });
  }).catch(function(error) {
    // Invalid or expired action code. Ask user to try to reset the password
    // again.
  });
}