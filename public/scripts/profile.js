function getUserMajor() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      let userDataRef = firebase.database().ref(),
       MajorRef = userDataRef.child(`Users/${user.uid}`);
      MajorRef.once("value").then(snapshot => {
        let Major_val = snapshot.val().Major;
        $("#Major").append(Major_val);
        document.getElementById("major").innerHTML = Major_val;
      });
    } else {
      console.log('Something went wrong!');
    }
  });
}

function getUserBio() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      let userDataRef = firebase.database().ref(),
       bioRef = userDataRef.child(`Users/${user.uid}`);
      bioRef.once("value").then(snapshot => {
        let bio_val = snapshot.val().bio;
        $("#bio").append(bio_val);
        document.getElementById("bio").innerHTML = bio_val;
      });
    } else {
      console.log('Something went wrong!');
    }
  });
}

function getUserEmail() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      let userDataRef = firebase.database().ref(),
       emailRef = userDataRef.child(`Users/${user.uid}`);
      emailRef.once("value").then(snapshot => {
        let email_val = snapshot.val().email;
        $("#email").append(email_val);
        document.getElementById("email").innerHTML = email_val;
      });
    } else {
      console.log('Something went wrong!');
    }
  });
}

function getUserName() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      let userDataRef = firebase.database().ref(),
       nameRef = userDataRef.child(`Users/${user.uid}`);
      nameRef.once("value").then(snapshot => {
        let name_val = snapshot.val().name;
        document.getElementById("name").innerHTML = name_val;
      });
    } else {
      console.log('Something went wrong!');
    }
  });
}

function getUserP1Url(showGeneric) {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      let userDataRef = firebase.database().ref(),
      imageRef = userDataRef.child(`Users/${user.uid}`);
      imageRef.once("value").then(snapshot => {
        let image_val = snapshot.val().p1Url;
        if (showGeneric) {
          image_val = 'https://firebasestorage.googleapis.com/'
          + 'v0/b/study-chums.appspot.com/'
          + 'o/img%2F404.png?'
          + 'alt=media&token=853ff18e-bca6-4795-b1e8-911b90ad2258';

        } else if (image_val === undefined) {
          image_val = 'https://firebasestorage.googleapis.com/'
          + 'v0/b/study-chums.appspot.com/'
          + 'o/img%2Fa98d336578c49bd121eeb9dc9e51174d.png?'
          + 'alt=media&token=5c470791-f247-4c38-9609-80a4c77128c1';

          alert('Please upload a profile image.');
          location.href = 'edit_profile.html';
        }
        document.getElementById('img').src = image_val;
      });
    } else {
      console.log('Something went wrong!');
    }
  });
}