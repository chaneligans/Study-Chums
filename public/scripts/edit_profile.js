function updateProfile() {
  $('html').addClass('waiting');
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      let photo_in = document.getElementById("file");
      let name_in = document.getElementById("name").value;
      let email_in = document.getElementById("email").value;
      let major_in = document.getElementById("major").value;
      let bio_in = document.getElementById("bio").value;

      this.userId = user.uid;

      // execute only if something is there
      if (photo_in.value !== "")    {updatePhotoURL(this.userId, photo_in);}

      if (name_in !== "") {updateName(this.userId, name_in);}

      if (email_in !== "") {updateEmail(this.userId, email_in);}

      if (major_in !== "")   {updateMajor(this.userId, major_in);}

      if (bio_in !== "")   {updateBio(this.userId, bio_in);}

      if (photo_in.value === "") {
        setTimeout(function() {
            location.href = "profile.html";
        }, 1000);
      }
      console.log("Updates sent to database.");
    } else {
      console.log("Who are you? And why do you have access to this?");
    }                              
  });
}

function updatePhotoURL(uid, photo) {
  firebase.auth().onAuthStateChanged(function(user) {
    console.log("Updating photo for user id ", user.uid);
    // update photo for this 'user' with file_in

    this.userId = user.uid;

    let ref = firebase.database().ref("Users/" + this.userId);
    let fs = firebase.firestore();

    var photoUrl = 'Something went wrong!!!';

    var file = photo.files[0];
    var fileName = photo.files[0].name;

    console.log('Attempting to upload file ' + fileName);
    var storageRef = firebase.storage().ref('img/'+this.userId+'/'+this.userId);
    var uploadTask = storageRef.put(file);    

    uploadTask.on('state_changed', function(snapshot) {
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    }, function(error) {
      console.log('Unsuccessful file upload');
    }, function() {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        console.log('File available at', downloadURL);
        photoUrl = downloadURL;
        //realtime database
        ref.update({
          p1Url: photoUrl,
          "p1Url": photoUrl
        }, function(error) {
          if (error) {
            console.log("Update failed - p1Url to " + photo);
          } else {
            console.log("Update succeeded - p1Url to " + photo);
            location.href="profile.html";
          }
        });
      });
    });
  });
}

function updateName(user, name_in) {
  firebase.auth().onAuthStateChanged(function(user) {
    console.log("Updating name for user id ", user.uid);
    // update name for this 'user' with name_in

    let ref = firebase.database().ref("Users/" + this.userId);
    let fs = firebase.firestore();
    this.userId = user.uid;

    //realtime database
    ref.update({
      name: name_in,
      "name": name_in
    }, function(error) {
      if (error) {
        console.log("Update failed - name to " + name_in);
      } else {
        console.log("Update suceeded - name to " + name_in);
      }
    });
  });
} 

function updateEmail(user, email_in) {
  firebase.auth().onAuthStateChanged(function(user) {
    console.log("Updating email for user id ", user.uid);
    // update email for this 'user' with email_in

    let ref = firebase.database().ref("Users/" + this.userId);
    let fs = firebase.firestore();
    this.userId = user.uid;

    //realtime database
    ref.update({
      email: email_in,
      "email": email_in
    }, function(error) {
      if (error) {
        console.log("Update failed - email to " + email_in);
      } else {
        console.log("Update suceeded - email to " + email_in);
      }
    });
  });
} 

function updateMajor(user, major_in) {
  firebase.auth().onAuthStateChanged(function(user) {
    console.log("Updating major for user id ", user.uid);
    // update major for this 'user' with major_in

    let ref = firebase.database().ref("Users/" + this.userId);
    let fs = firebase.firestore();
    this.userId = user.uid;
    //realtime database
    ref.update({
      Major: major_in,
      "Major": major_in
    }, function(error){
      if (error) {
        console.log("Update failed - major to " + major_in);
      } else {
        console.log("Update succeeded - major to " + major_in)
      }
    });
  });
}

function updateBio(user, bio_in) {
  firebase.auth().onAuthStateChanged(function(user) {
    console.log("Updating bio for user id ", user.uid);
    // update bio for this 'user' with bio_in

    let ref = firebase.database().ref("Users/" + this.userId);
    let fs = firebase.firestore();
    this.userId = user.uid;
    //realtime database
    ref.update({
      bio: bio_in,
      "bio": bio_in
    }, function(error){
      if (error) {
        console.log("Update failed - bio to " + bio_in);
      } else {
        console.log("Update succeeded - bio to " + bio_in)
      }
    });
  });
}