//test the cloud
(function(){
    //var firebase = require("firebase");
    //Initialize Firebase
    const config = {
        apiKey: "AIzaSyDFPHvR2SV7dodysPpvLUfIGp6huuBDf0A",
        authDomain: "study-chums.firebaseapp.com",
        databaseURL: "https://study-chums.firebaseio.com/",
        storageBucket: "study-chums.appspot.com"
    };
    firebase.initializeApp(config);

    //get elements
    const preObject = document.getElementById('Users');

    //Create reference
    const dbRefObject = firebase.database().ref('study-chums/1');

    console.log("Hello");

    //Sync object changes
    dbRefObject.once('value').then(function(snapshot) {
      console.log("Hello again");
      console.log(snapshot.val())
    });


}());