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

const form = document.querySelector('#register-form'); //a register.html?

form.addEventListener('submit', (e) => {
  e.preventDefault();
  db.collection('users').add({
    name: form.name.value,
    username: form.username.value,
    password: form.password.value,
    email: form.email.value,
    currentlyActive: false
  }).then(ref => {
    console.log("New document with ID: " + ref.id);
  });

  //empty the input forms
  form.name.value = '';
  form.username.value = '';
  form.password.value = '';
  form.email.value = '';
  //...
});
