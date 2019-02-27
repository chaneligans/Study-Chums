//test the cloud


(function(){
    //var firebase = require("firebase");
    //Initialize Firebase
    const config = {
        apiKey: "AIzaSyDFPHvR2SV7dodysPpvLUfIGp6huuBDf0A",
        authDomain: "study-chums.firebaseapp.com",
        databaseURL: "https://study-chums.firebaseio.com/",
        projectId: 'study-chums',
        storageBucket: "study-chums.appspot.com"
    };
    firebase.initializeApp(config);

//    var database = firebase.database();
//
//    var userId = firebase.auth().currentUser.uid;
//    return firebase.database().ref('/S/' + userId).once('value').then(function(snapshot) {
//  var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
//  // ...
//});


    //get elements
    const preObject = document.getElementById('Users');

    //Create reference

    const dbRefObject = firebase.database().ref().child('Users/1');

    //Sync object changes
    dbRefObject.on('value',snap =>{
        preObject.innerText = JSON.stringify(snap.val(),null, 3);
    });

    //firestore
    const fsRefObject = firebase.firestore().collection('users');
    //prints to console each document in a collection (users)
    fsRefObject.get().then(snapshot => {
      snapshot.forEach(doc => {
        console.log(doc.id, "=>", doc.data());
      });
    });

}());