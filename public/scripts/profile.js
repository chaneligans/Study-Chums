function getUserMajor() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      let Major_val;
      let userDataRef = firebase.database().ref();
      let MajorRef = userDataRef.child("Users/" + user.uid);
      MajorRef.once("value").then(function(snapshot){
        let key = snapshot.key;
        let childData = snapshot.val();
        Major_val = snapshot.val().Major;
        // console.log(Major_val);
        $("#Major").append(Major_val);
        document.getElementById("major").innerHTML = Major_val;
      });
    } else {
      console.log('Something went wrong!');
    }
  });
}

function getUserBio() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      let bio_val;
      let userDataRef = firebase.database().ref();
      let bioRef = userDataRef.child("Users/" + user.uid);
      bioRef.once("value").then(function(snapshot){
        let key = snapshot.key;
        let childData = snapshot.val();
        bio_val = snapshot.val().bio;
        // console.log(bio_val);
        $("#bio").append(bio_val);
        document.getElementById("bio").innerHTML = bio_val;
      });
    }
    else {
      console.log('Something went wrong!');
    }
  });
}

function getUserEmail() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      let email_val;
      let userDataRef = firebase.database().ref();
      let emailRef = userDataRef.child("Users/" + user.uid);
      emailRef.once("value").then(function(snapshot){
        let key = snapshot.key;
        let childData = snapshot.val();
        email_val = snapshot.val().email;
        // console.log(email_val);
        $("#email").append(email_val);
        document.getElementById("email").innerHTML = email_val;
      });
    }
    else {
      console.log('Something went wrong!');
    }
  });
}

function getUserName() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      let name_val;
      let userDataRef = firebase.database().ref();
      let nameRef = userDataRef.child("Users/" + user.uid);
      nameRef.once("value").then(function(snapshot){
        let key = snapshot.key;
        let childData = snapshot.val();
        name_val = snapshot.val().name;
        // console.log(name_val);
        document.getElementById("name").innerHTML = name_val;
      });
    }
    else {
      console.log('Something went wrong!');
    }
  });
}

function getUserP1Url(showGeneric) {
  firebase.auth().onAuthStateChanged(function(user) {
    // console.log(user.uid);
    if (user) {
      let image_val;
      let userDataRef = firebase.database().ref();
      let imageRef = userDataRef.child("Users/"+ user.uid)
      imageRef.once("value").then(function(snapshot){
        let key = snapshot.key;
        let childData = snapshot.val();
        image_val = snapshot.val().p1Url;
        if (showGeneric) {
          image_val = 'https://firebasestorage.googleapis.com/v0/b/study-chums.appspot.com/'
                      + 'o/img%2F404.png?alt=media&token=853ff18e-bca6-4795-b1e8-911b90ad2258';
        } else if (image_val === undefined) {
          image_val = 'https://firebasestorage.googleapis.com/v0/b/study-chums.appspot.com/'
                      + 'o/img%2Fa98d336578c49bd121eeb9dc9e51174d.png?'
                      + 'alt=media&token=5c470791-f247-4c38-9609-80a4c77128c1';
          alert('Please upload a profile image.');
          location.href = 'edit_profile.html';
        }
        document.getElementById('img').src = image_val;
      });
    }
    else {
      console.log('Something went wrong!');
    }
  });
}