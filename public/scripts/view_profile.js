function getUserMajor(id) {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      let Major_val;
      let userDataRef = firebase.database().ref(),
       MajorRef = userDataRef.child("Users/"+ id);
      MajorRef.once("value").then(snapshot => {
        Major_val = snapshot.val().Major;
        $("#Major").append(Major_val);
        document.getElementById("major").innerHTML = Major_val;
      });
    } else {
      console.log('Something went wrong!');
    }
  });
}

function getUserBio(id) {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      let bio_val;
      let userDataRef = firebase.database().ref(),
       bioRef = userDataRef.child("Users/"+ id);
      bioRef.once("value").then(snapshot => {
        bio_val = snapshot.val().bio;
        $("#bio").append(bio_val);
        document.getElementById("bio").innerHTML = bio_val;
      });
    } else {
      console.log('Something went wrong!');
    }
  });
}

function getUserEmail(id) {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      let email_val;
      let userDataRef = firebase.database().ref(),
       emailRef = userDataRef.child("Users/"+ id);
      emailRef.once("value").then(snapshot => {
        email_val = snapshot.val().email;
        // console.log(email_val);
        $("#email").append(email_val);
        document.getElementById("email").innerHTML = email_val;
      });
    } else {
      console.log('Something went wrong!');
    }
  });
}

function getUserName(id) {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      let name_val;
      let userDataRef = firebase.database().ref(),
       nameRef = userDataRef.child("Users/"+ id);
      nameRef.once("value").then(snapshot => {
        name_val = snapshot.val().name;
        document.getElementById("name").innerHTML = name_val;
      });
    } else {
      console.log('Something went wrong!');
    }
  });
}

function getUserP1Url(showGeneric, id) {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      let image_val;
      let userDataRef = firebase.database().ref(),
       imageRef = userDataRef.child("Users/"+ id)
      imageRef.once("value").then(snapshot => {
        image_val = snapshot.val().p1Url;

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
        }
        document.getElementById('img').src = image_val;
      });
    } else {
      console.log('Something went wrong!');
    }
  });
}

function getStatus(id) {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      let status;
      let myid = user.uid,
       db = firebase.database(),
       userDataRef = db.ref(),
       statusRef = userDataRef.child("Applications/"+ myid +"/Sent/"+ id);

      statusRef.on("value", snapshot => {
        if (snapshot.val()) {
          console.log("not yet chums");
          status = 'Requested';
          document.getElementById("status").innerHTML = status;
          $("#status").load("../loaded/blank.html", () => {
            $('#status').html(status);
            console.log("Load (status) was performed.");
          });

        } else {
          let ChumsStatusRef = userDataRef.child("Chums/"+ myid +"/"+ id);
          ChumsStatusRef.on("value", snapshot => {
            if (snapshot.val()) {
              let fbProfileLink = db.ref('Users/'+ id).once("value")
              .then(fbpl_snapshot => {
                return fbpl_snapshot.val().fbProfile;
              });

              Promise.resolve(fbProfileLink).then(value => {
                // console.log(value);

                if(value.length() > 2) {
                  status = '<a href="'+ value +'" target="_blank" style="color:#3b5998">'
                  + '<i class="fab fa-facebook-square fa-lg"></i></a>';
  
                  $('.match-btn').css({'backgroundColor':'white', 'padding':'8px'});
  
                  document.getElementById("status").innerHTML = status;
                  $("#status").load("../loaded/blank.html", () => {
                    $('#status').html(status);
                    console.log("Load (profile of chum) was performed.");
                  });
                }
              })
            } else {
              console.log("currently not chums");
              status = '<a onclick="makeChumRequest(\'' + id + '\');" '
              + 'style="color:white">Request To Match</a>';

              document.getElementById("status").innerHTML = status;
              $("#status").load("../loaded/blank.html", () => {
                $('#status').html(status);
                console.log("Load (profile of not chum) was performed.");
              });
            }
          });
        }
      });
    }
  });
}

function makeChumRequest(id) {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      let chumStatus;
      let myid = user.uid,
       db = firebase.database(),
       userDataRef = db.ref(),
       ChumsStatusRef = userDataRef.child("Chums/"+ myid +"/"+ id);

      ChumsStatusRef.on("value", snapshot => {
        if (snapshot.val()) {
          chumStatus = snapshot.val().status;
          console.log(chumStatus + ", chum can");
        } else {
          console.log(chumStatus + ", chum cannot");
        }
      });

      if (chumStatus !== "Chums") {
        let status = "Requested";
        db.ref('Applications/'+ myid +'/Sent/'+ id).set({
          status: status
        });

        db.ref('Applications/'+ id +'/Received/'+ myid).set({
          status: status
        });
        document.getElementById("status").innerHTML = status;
      }
    } else {
      console.log('Something went wrong!');
    }
  });
}