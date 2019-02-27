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
    const dbRefObject = firebase.database().ref().child('Users');
    
    //Sync object changes
    dbRefObject.on('value', snap => console.log(snap.val()));
    
    
}());