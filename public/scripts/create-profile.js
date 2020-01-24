function updateProfile() {
  $('html').addClass('waiting');
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      let photo_in = document.getElementById("file"),
       name_in = document.getElementById("name").value,
       // email_in = document.getElementById("email").value,
       major_in = document.getElementById("major").value,
       FBprofileLink_in = document.getElementById("FBprofileLink").value,
       bio_in = document.getElementById("bio").value;

      // execute only if something is there
      if (photo_in.value !== "") {updatePhotoURL(user.uid, photo_in);}
      if (name_in !== "") {updateName(user.uid, name_in); addUserToFirestore(name_in);}

      updateEmail(user.uid);
      updateSubscription(user.uid);

      if (major_in !== "") {updateMajor(user.uid, major_in);}
      if (bio_in !== "") {updateBio(user.uid, bio_in)};
      if (FBprofileLink_in !== "") {updateFBProfileLink(user.uid, FBprofileLink_in);}

      if (photo_in.value === "" || name_in === "" || major_in === "" || bio_in === "") {
        alert("Please fill in all required fields.");
      } else {
        alert("Your profile info has been updated!");
        setTimeout(function() {location.href = "home.html";}, 1000);
      }

      console.log("Updates sent to database.");
    } else {
      console.log("Who are you? And why do you have access to this?");
    }
  });
}

function updatePhotoURL(uid, photo) {
  firebase.auth().onAuthStateChanged(user => {
    // console.log("Updating photo for user id ", user.uid);
    // update photo for this 'user' with file_in

    if (uid === user.uid) {
      let ref = firebase.database().ref(`Users/${user.uid}`);
      let photoUrl = 'Something went wrong!!!';

      let max_width = 400, max_height = 400;

      let file = photo.files[0],
       fileName = file.name;

      let fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = function(event) {

        let blob = new Blob([event.target.result]),
         blobURL = window.URL.createObjectURL(blob);

        let newImage = new Image();
        newImage.src = blobURL;

        newImage.onload = function() {
          let updateImage = new Promise((resolve, reject) => {
            if (newImage) {
              let canvas = document.createElement('canvas');
              let width = newImage.width, height = newImage.height;
              // console.log("Old values: " + width + ", " + height);

              if (width > height) {
                if (width > max_width) {
                  height = Math.round(height *= max_width / width);
                  width = max_width;
                }
              } else {
                if (height > max_height) {
                  width = Math.round(width *= max_height / height);
                  height = max_height;
                }
              }

              canvas.width = width; canvas.height = height;
              // console.log("New values: " + canvas.width + ", " + canvas.height);

              let context = canvas.getContext("2d");
              context.drawImage(newImage, 0, 0, width, height);

              let canvasDataURL = canvas.toDataURL("imge/jpeg", 0.7);

              let arr = canvasDataURL.split(','),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n);
              while (n--) {u8arr[n] = bstr.charCodeAt(n);}
              file = new Blob([u8arr], {type: mime});

              // console.log(file);
              resolve("It worked!");
              console.log('Finished updating image');
            } else {
              reject("Failed to resize image.");
            }
          });

          let tryToUpdateImage = function() {
            updateImage.then(fulfilled => {
              // console.log('Attempting to upload file ' + fileName);
              let storageRef = firebase.storage().ref(`img/${user.uid}/${user.uid}`);
              let uploadTask = storageRef.put(file);

              uploadTask.on('state_changed', snapshot => {
                let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Upload is ${progress}% done`);
                switch (snapshot.state) {
                  case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                  case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
                }
              }, error => {
                console.log('Unsuccessful file upload');
              }, () => {
                // Handle successful uploads on complete
                uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                  // console.log('File available at', downloadURL);
                  photoUrl = downloadURL;
                  //realtime database
                  ref.update({
                    p1Url: photoUrl,
                    "p1Url": photoUrl
                  }, error => {
                    if (error) {
                      console.console.error(`Update failed - p1Url to ${photo}: ${error}`);
                    } else {
                      console.log(`Update succeeded - p1Url to ${photo}`);
                      location.href = "home.html";
                    }
                  });
                });
              });
              console.log(fulfilled);
            }).catch(error => console.log(error))
          }
          tryToUpdateImage();
        }
      }
    }
  });
}

function updateName(uid, name_in) {
  firebase.auth().onAuthStateChanged(user => {
    // console.log("Updating name for user id ", user.uid);
    // update name for this 'user' with name_in
    if (uid === user.uid) {
      //realtime database
      let ref = firebase.database().ref(`Users/${user.uid}`);
      ref.update({
        name: name_in,
        "name": name_in
      }, error => {
        if (error) {
          console.log(`Update failed - name to ${name_in}: ${error}`);
        } else {
          console.log(`Update succeeded - name to ${name_in}`)
        }
      });
    }
  });
}

function updateEmail(uid) {
  firebase.auth().onAuthStateChanged(user => {
    // console.log("Updating email for user id ", user.uid);
    // update email for this 'user' with email_in
    if (uid === user.uid) {
      let email_in = user.email;
      //realtime database
      let ref = firebase.database().ref(`Users/${user.uid}`);
      ref.update({
        email: email_in,
        "email": email_in
      }, error => {
        if (error) {
          console.log(`Update failed - email to ${email_in}: ${error}`);
        } else {
          console.log(`Update succeeded - email to ${email_in}`)
        }
      });
    }
  });
}

function updateMajor(uid, major_in) {
  firebase.auth().onAuthStateChanged(user => {
    // console.log("Updating major for user id ", user.uid);
    // update major for this 'user' with major_in
    if (uid === user.uid) {
      //realtime database
      let ref = firebase.database().ref(`Users/${user.uid}`);
      ref.update({
        Major: major_in,
        "Major": major_in
      }, error => {
        if (error) {
          console.log(`Update failed - major to ${major_in}: ${error}`);
        } else {
          console.log(`Update succeeded - major to ${major_in}`)
        }
      });
    }
  });
}

function updateBio(uid, bio_in) {
  firebase.auth().onAuthStateChanged(user => {
    // console.log("Updating bio for user id ", user.uid);
    // update bio for this 'user' with bio_in
    if (uid === user.uid) {
      //realtime database
      let ref = firebase.database().ref(`Users/${user.uid}`);
      ref.update({
        bio: bio_in,
        "bio": bio_in
      }, error => {
        if (error) {
          console.log(`Update failed - bio to ${bio_in}: ${error}`);
        } else {
          console.log(`Update succeeded - bio to ${bio_in}`)
        }
      });
    }
  });
}

function updateFBProfileLink(uid, FBprofileLink_in) {
  firebase.auth().onAuthStateChanged(user => {
    // console.log("Updating FB profile for user id ", user.uid);
    if (uid === user.uid) {
      //realtime database
      let ref = firebase.database().ref(`Users/${user.uid}`);
      ref.update({
        fbProfile: FBprofileLink_in,
        "fbProfile": FBprofileLink_in
      }, error => {
        if (error) {
          console.log(`Update failed - fbProfile to ${FBprofileLink_in}: ${error}`);
        } else {
          console.log(`Update succeeded - fbProfile to ${FBprofileLink_in}`)
        }
      });
    }
  });
}

function updateSubscription(uid) {
  firebase.auth().onAuthStateChanged(user => {
    // console.log("Updating subscription preferences for user id ", user.uid);
    if (uid === user.uid) {
      //realtime database
      let ref = firebase.database().ref(`Subscriptions/${user.uid}`);
      ref.update({
        subscribed: true,
        "subscribed": true
      }, error => {
        if (error) {
          console.log(`Update failed - email pref to true: ${error}`);
        } else {
          console.log("Update succeeded - email pref to true");
        }
      });
    }
  });
}

function addUserToFirestore(name) {
  firebase.auth().onAuthStateChanged(user => {
    const db = firebase.firestore();

    db.doc(`Users/${user.uid}`).set({
      name: name,
      "name": name,
      currentChatRoom: " ",
      "currentChatRoom": " "
    })
    .catch(error => {
      if (error) {
        console.error(`Error adding User data to Firestore -- ${error}`);
      } else {
        console.log('Successfully added User data to Firestore');
      }
    });
  });
}
