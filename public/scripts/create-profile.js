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
      if (photo_in.value !== "")  {updatePhotoURL(this.userId, photo_in);}

      if (name_in !== "") {updateName(this.userId, name_in);}

      if (email_in !== "") {updateEmail(this.userId, email_in);}

      if (major_in !== "")   {updateMajor(this.userId, major_in);}

      if (bio_in !== "")   {updateBio(this.userId, bio_in);}

      if (photo_in.value === "" || name_in === "" || email_in === "" || major_in === "" || bio_in === "") {
          alert("Please fill in all fields.");
      }
      else if (photo_in.value === "") {
        setTimeout(function() {
          location.href = "home.html";
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
          
          var max_width = 800;
          var max_height = 800;

          var file = photo.files[0];
          var fileName = photo.files[0].name;
          
          var fileReader = new FileReader();
          fileReader.readAsArrayBuffer(file);
          fileReader.onload = function(event) {
            
            var blob = new Blob([event.target.result]);
            var blobURL = window.URL.createObjectURL(blob);
            
            var newImage = new Image();
            newImage.src = blobURL;
            
            newImage.onload = function() {
              var updateImage = new Promise(
                function(resolve, reject) {
                  if (newImage) {
                    var canvas = document.createElement('canvas');
                    var width = newImage.width;
                    var height = newImage.height;
                    
                    console.log("Old values: " + width + ", " + height);

                    if (width > height) {
                      if (width > max_width) {
                        height = Math.round(height *= max_width / width);
                        width = max_width;
                      }
                    }
                    else {
                      if (height > max_height) {
                        width = Math.round(width *= max_height / height);
                        height = max_height;
                      }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    
                    console.log("New values: " + canvas.width + ", " + canvas.height);

                    var context = canvas.getContext("2d");
                    context.drawImage(newImage, 0, 0, width, height);
                    
                    var canvasDataURL = canvas.toDataURL("imge/jpeg", 0.7);
                    
                    var arr = canvasDataURL.split(','), mime = arr[0].match(/:(.*?);/)[1], bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
                    while(n--){
                      u8arr[n] = bstr.charCodeAt(n);
                    }
                    file = new Blob([u8arr], {type:mime});
                    
                    console.log(file);
                    resolve("It worked!");
                    console.log('Finished updating image');
                  }
                  else{
                    reject("Sorry");
                  }
                }
              );
              
              var tryUpdateImage = function () {
                updateImage.then(function (fulfilled) {
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
                          location.href="home.html";
                        }
                      });
                    });
                  });
                  console.log(fulfilled);
                }).catch(function (error) {
                  console.log(error);
                })
              }
              
              tryUpdateImage();
            }
          }
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