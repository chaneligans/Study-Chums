// Retrieve Firebase Messaging object.
const messaging = firebase.messaging();
const firestore = firebase.firestore();
const auth = firebase.auth();

// Add the public key generated from the console here.
messaging.usePublicVapidKey("BKY1_vZpRo8BqgaIc2rAPTR_xWRvrO9rsojLpjUDV6SbINnmbwTagcwsbbUA0J4upByg3CzjwBHLTV1rz8_77Nk");
messaging.onTokenRefresh(handleTokenRefresh);

//Request permission to receive notifications
//The method messaging.requestPermission() displays a consent dialog to let users grant your app permission to receive notifications in the browser. If permission is denied, FCM registration token requests result in an error.
messaging.requestPermission()
.then(() => handleTokenRefresh())
.catch(err => {
  console.log('User did not give permission.', err);
});

function handleTokenRefresh() {
  return messaging.getToken()
    .then((token) => {
      console.log(token);
      firebase.auth().onAuthStateChanged(user => {
        firestore.collection("Users").doc(user.uid).collection("ChatRooms")
        .get().then((chatRooms) => {
          chatRooms.forEach(room => {
            firestore.collection("ChatRooms").doc(room.id).collection("Tokens").doc(user.uid)
            .set({
              token: token,
            })
          });
        })
     });
    })
    .catch(err => {
      console.log('Unable to get permission or token to notify.', err);
    });
}

// function handleUnsubsribe() {
//   messaging.getToken()
//     .then((token) => messaging.deleteToken(token))
//     .then(() => {
//       firestore.collection("Users").doc(auth.currentUser.uid).collection("ChatRooms")
//       .get.then((chatRooms) => {
//         chatRooms.forEach(room => {

//         });

//       })
//     })
//     .catch(err => {
//       console.log('Unable to get permission or token to notify.', err);
//     });
// }
