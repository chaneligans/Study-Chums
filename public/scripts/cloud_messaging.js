// Retrieve Firebase Messaging object.
const messaging = firebase.messaging();

// Add the public key generated from the console here.
messaging.usePublicVapidKey("BKY1_vZpRo8BqgaIc2rAPTR_xWRvrO9rsojLpjUDV6SbINnmbwTagcwsbbUA0J4upByg3CzjwBHLTV1rz8_77Nk");

//Request permission to receive notifications
//The method messaging.requestPermission() displays a consent dialog to let users grant your app permission to receive notifications in the browser. If permission is denied, FCM registration token requests result in an error.
messaging.requestPermission().then(function() {
  console.log('Notification permission granted.');
  // TODO(developer): Retrieve an Instance ID token for use with FCM.
  // ...
}).catch(function(err) {
  console.log('Unable to get permission to notify.', err);
});