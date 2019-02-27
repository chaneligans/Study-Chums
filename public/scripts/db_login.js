// Initialize Firebase
var config = {
    apiKey: "AIzaSyDFPHvR2SV7dodysPpvLUfIGp6huuBDf0A",
    authDomain: "study-chums.firebaseapp.com",
    databaseURL: "https://study-chums.firebaseio.com",
    projectId: "study-chums",
    storageBucket: "study-chums.appspot.com",
    messagingSenderId: "644812797355"
};
firebase.initializeApp(config);

const db = firebase.firestore();
db.settings({timestampsInSnapshots: true});

const form = document.querySelector('#login-form'); // a login html?

form.addEventListener('submit', e => {
  db.collection('users').get().then(snapshot => {
    snapshot.doc.forEach(doc => {
      if (form.username === doc.username
        // if a doc's username and password match form inputs, ...
        && form.password === doc.password) {
        db.collection('users')        // then from this collection 'users'
          .doc(doc.id)                // find this document 'doc.id' and...
          .update({ currentlyActive: true });
              // ... update that this user is currently active
        return; // goal reached; end
      } // continue otherwise
    })
  })
});