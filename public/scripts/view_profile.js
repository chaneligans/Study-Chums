function getUserMajor(id) {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      var Major_val;
      var userDataRef = firebase.database().ref();
      var MajorRef = userDataRef.child("Users/" + id);
      MajorRef.once("value").then(function(snapshot) {
        var key = snapshot.key;
        var childData = snapshot.val();
        Major_val = snapshot.val().Major;
        console.log(Major_val);
        $("#Major").append(Major_val);
        document.getElementById("major").innerHTML = Major_val;
      });
    } else {
      console.log('Something went wrong!');
    }
  });
}


function getUserBio(id) {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      var bio_val;
      var userDataRef = firebase.database().ref();
      var bioRef = userDataRef.child("Users/" + id);
      bioRef.once("value").then(function(snapshot) {
        var key = snapshot.key;
        var childData = snapshot.val();
        bio_val = snapshot.val().bio;
        console.log(bio_val);
        $("#bio").append(bio_val);
        document.getElementById("bio").innerHTML = bio_val;
      });
    } else {
      console.log('Something went wrong!');
    }
  });
}


function getUserEmail(id) {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      var email_val;
      var userDataRef = firebase.database().ref();
      var emailRef = userDataRef.child("Users/" + id);
      emailRef.once("value").then(function(snapshot) {
        var key = snapshot.key;
        var childData = snapshot.val();
        email_val = snapshot.val().email;
        console.log(email_val);
        $("#email").append(email_val);
        document.getElementById("email").innerHTML = email_val;
      });
    } else {
      console.log('Something went wrong!');
    }
  });
}


function getUserName(id) {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      var name_val;
      var userDataRef = firebase.database().ref();
      var nameRef = userDataRef.child("Users/" + id);
      nameRef.once("value").then(function(snapshot) {
        var key = snapshot.key;
        var childData = snapshot.val();
        name_val = snapshot.val().name;
        console.log(name_val);
        document.getElementById("name").innerHTML = name_val;
      });
    } else {
      console.log('Something went wrong!');
    }
  });
}


function getUserP1Url(showGeneric, id) {
  firebase.auth().onAuthStateChanged(function(user) {
    console.log(id);
    if (user) {
      var image_val;
      var userDataRef = firebase.database().ref();
      var imageRef = userDataRef.child("Users/" + id)
      imageRef.once("value").then(function(snapshot) {
        var key = snapshot.key;
        var childData = snapshot.val();
        image_val = snapshot.val().p1Url;
        if (showGeneric) {
          image_val = 'https://firebasestorage.googleapis.com/v0/b/study-chums.appspot.com/o/img%2F404.png?alt=media&token=853ff18e-bca6-4795-b1e8-911b90ad2258';
        } else if (image_val === undefined) {
          image_val = 'https://firebasestorage.googleapis.com/v0/b/study-chums.appspot.com/o/img%2Fa98d336578c49bd121eeb9dc9e51174d.png?alt=media&token=5c470791-f247-4c38-9609-80a4c77128c1';
        }
        document.getElementById('img').src = image_val;
      });
    } else {
      console.log('Something went wrong!');
    }
  });
}


function getStatus(id) {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      var myid = user.uid;
      var status;
      var userDataRef = firebase.database().ref();
      var statusRef = userDataRef.child("Applications/" + myid + "/Sent/" + id);
      statusRef.on("value", function(snapshot) {
        var key = snapshot.key;
        if (snapshot.val()) {
          status = 'Requested';
          console.log(status);

          document.getElementById("status").innerHTML = status;
          $("#status").load(status, function() {
            console.log("Load was performed.");
          });
        } else {
          var ChumsStatusRef = userDataRef.child("Chums/" + myid + "/" + id);
          ChumsStatusRef.on("value", function(snapshot) {
            var key = snapshot.key;
            if (snapshot.val()) {
              let fbProfileLink = firebase.database().ref('Users/' + id).once("value").then(function(snapshot) {
                let fbProfile = snapshot.val().fbProfile;
                return fbProfile
              });
              Promise.resolve(fbProfileLink).then(function(value) {
                console.log(value);
                status = '<a href="' + value + '" target="_blank" style="color:#3b5998"><i class="fab fa-facebook-square fa-lg"></i></a>';

                console.log(document.getElementsByClassName("match-btn"));
                document.getElementsByClassName("match-btn")[0].style.backgroundColor = "white";
                document.getElementsByClassName("match-btn")[0].style.padding = "8px";
                
                document.getElementById("status").innerHTML = status;
                $("#status").load(status, function() {
                  console.log("Load was performed.");
                });
              })
            } else {
              console.log(status + "not chums");
              status = '<a onclick="request(\'' + id + '\');" style="color:white">Request To Match</a>';

              document.getElementById("status").innerHTML = status;
              $("#status").load(status, function() {console.log("Load was performed.");});
            }
          });     
        }
      });
    }
  });
}



function request(id) {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      var myid = user.uid;
      var chumStatus;
      var userDataRef = firebase.database().ref();
      var ChumsStatusRef = userDataRef.child("Chums/" + myid + "/" + id);
      
      ChumsStatusRef.on("value", function(snapshot) {
        var key = snapshot.key;
        if (snapshot.val()) {
          chumStatus = snapshot.val().status;
          console.log(chumStatus + "chum");
        } else {
          console.log(chumStatus + "chum cannot");
        }
      });

      if (chumStatus != "Chums") {
        var status = "Requested";
        firebase.database().ref('Applications/' + myid + '/Sent/' + id).set({
          status: status
        });

        firebase.database().ref('Applications/' + id + '/Received/' + myid).set({
          status: status
        });
        document.getElementsByClassName("match-btn").value = "Requested";
      }
    } else {
      console.log('Something went wrong!');
    }
  });
}