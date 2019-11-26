// Get total user value from the database
function getTotalUsers() {
  return firebase.database().ref("TotalUsers").once("value").catch(err => {return err;});
}

// Load the profile for the homepage
function loadProfile(startIndex) {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      firebase.database().ref("Users/" + user.uid).once("value", snapshot => {
        // let userIndex = snapshot.val().index;

        let total;
        getTotalUsers().then(result => {
          total = result.val().total;
          console.log("Loading Profile of index: " + startIndex);

          loadImage(startIndex);
          loadName(startIndex);
          loadMajor(startIndex);
          loadBio(startIndex);
        });
      });
    } else {
      console.log("No user found.");
    }
  });
}

// Load the next profile (right arrow button)
function nextProfile(update) {
  if (update === undefined) {
    console.log("To the right");
  }
  getProfileToThe_("Right", update);
}

// Load the previous profile (left arrow button)
function previousProfile() {
  console.log("To the left");
  getProfileToThe_("Left", undefined);
}

// Get the next profile to the left or right.
function getProfileToThe_(direction, update) {
  firebase.auth().onAuthStateChanged(async user => {
    if (user) {
      let db = firebase.database();
      let ref = db.ref("Users/" + user.uid);

      let totalUsers = 0;
      try {
        let totalUsersResult = await getTotalUsers();
        totalUsers = totalUsersResult.val().total;
      } catch (err) {
        console.error("Couldn\'t get total Users: "+ err);
      }

      try {
        let result = await getProfileList(db, user.uid, direction);
        let userIndex = result[0];
        let nextIndex = result[1];
        let chums = result[2];

        if (direction === "Right" && update === undefined) {
          nextIndex++;
        }

        let bound = (direction === 'Right') ? (totalUsers-1) : 0;
        let check_Chums = checkChums(nextIndex, chums);
        let bound_arg = boundArgument(direction, nextIndex, totalUsers);

        while(check_Chums || nextIndex === userIndex || bound_arg) {
          console.log('While loop in getProfileToThe_('+ direction +')');
          if (bound_arg) {
            nextIndex = (direction === 'Right') ? 0 : (totalUsers-1);
            check_Chums = checkChums(nextIndex, chums);
          }
          if (check_Chums || nextIndex === userIndex) {
            (direction === 'Right') ? (nextIndex++) : (nextIndex--);
          }
          check_Chums = checkChums(nextIndex, chums);
          bound_arg = boundArgument(direction, nextIndex, totalUsers);
        }

        ref.update({
          currentIndex : nextIndex,
          "currentIndex" : nextIndex
        }, error => {
          if (error) {
            console.error("Update failed - currentIndex to "+ nextIndex);
          } else {
            console.log("Update successful - currentIndex to " + nextIndex);
          }
        });
        console.log("Loading next profile at index "+ nextIndex);
        loadProfile(nextIndex);

      } catch (err) {
        console.error("Couldn\'t get profile list: "+ err);
      }
    } else {
      console.error("No user was found.");
    }
  });
}

// Get a list of data from the database using the user's uid
// and the direction of the pointer button.
function getProfileList(db, uid, direction) {
  let userIndex = 0, nextIndex = 0;
  return new Promise((resolve, reject) => {
    db.ref("Users/"+uid).once("value").then(snapshot => {

      return {
        userIndex : snapshot.val().index
        ,nextIndex : snapshot.val().currentIndex - ((direction==="Left") ? 1:0)
      };

    }).then(values => {
      userIndex = values.userIndex;
      nextIndex = values.nextIndex;

      let chums = [];
      db.ref("Chums/"+uid).once("value").then(chum_ref_snapshot => {
        let chumRef;
        chum_ref_snapshot.forEach(chum => {
          chumRef = db.ref("Users/"+chum.key);
          chums.push(
            chumRef.once("value").then(chum_snapshot => {
              return new Promise((resolve, reject) => {
                setTimeout(() => resolve(chum_snapshot.val().index), 100);
              }).catch(error => {
                console.error("Could not resolve: "+ error);
              });
            })
          );
        });
        return Promise.all(chums);

      }).then(results => {
        resolve([userIndex, nextIndex, results]);
      });
    });
  }).catch(err => {
    console.error('Couldn\'t complete the list: '+ err);
  });
}

// Determine the upper/lower bound boolean based on the direction of the pointer button.
function boundArgument(direction, nextIndex, total) {
  if (direction === 'Right') {
    return nextIndex > (total - 1);
  } else {
    return nextIndex < 0;
  }
}

// checks if a chum index is nextIndex and returns true if so, and false otherwise.
function checkChums(nextIndex, chums) {
  chums.forEach(chum => {
    if (nextIndex === chum) {return true;}
  });
  return false;
}

// Pulls the user's profile picture from the database and displays it
function loadImage(startIndex) {
  let userDataRef = firebase.database().ref("Users");
  userDataRef.orderByChild("index").equalTo(startIndex)
  .once("value", snapshot => {
    let key, image_val;
    snapshot.forEach(childSnapshot => {
      key = childSnapshot.key;
      image_val = childSnapshot.val().p1Url;

      // If image_val is undefined, the user does not have a profile picture.
      // Therefore, we replace it with a generic avatar:
      if (image_val === undefined) {
        console.log('Undefined image');
        image_val = 'https://firebasestorage.googleapis.com/'
                  + 'v0/b/study-chums.appspot.com/'
                  + 'o/img%2Fa98d336578c49bd121eeb9dc9e51174d.png?'
                  + 'alt=media&token=5c470791-f247-4c38-9609-80a4c77128c1';
      }
      $("#image").append(image_val);
      document.getElementById('imageBox').src = image_val;
    });
  });
}

// Load the user's name
function loadName(startIndex) {
  userDataRef = firebase.database().ref("Users");
  userDataRef.orderByChild("index").equalTo(startIndex)
  .once("value", snapshot => {
    let key, name_val;
    snapshot.forEach(childSnapshot => {
      key = childSnapshot.key;
      name_val = childSnapshot.val().name;
      $("#name").append(name_val);
      document.getElementById("Name").innerHTML = name_val;
    })
  });
}

// Load the user's major
function loadMajor(startIndex) {
  userDataRef = firebase.database().ref("Users");
  userDataRef.orderByChild("index").equalTo(startIndex)
  .once("value", snapshot => {
    let key, Major_val;
    snapshot.forEach(childSnapshot => {
      key = childSnapshot.key;
      Major_val = childSnapshot.val().Major;
      $("#Major").append(Major_val);
      document.getElementById("Major").innerHTML = Major_val;
    });
  });
}

// Load the user's biography
function loadBio(startIndex) {
  userDataRef = firebase.database().ref("Users");
  userDataRef.orderByChild("index").equalTo(startIndex)
  .once("value", snapshot => {
      let key, bio_val;
      snapshot.forEach(childSnapshot => {
          key = childSnapshot.key;
          bio_val = childSnapshot.val().bio;
          $("#bio").append(bio_val);
          document.getElementById("bio").innerHTML = bio_val;
      });
  });
}

// Saves the userID to session storage
function saveUserID() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      let db = firebase.database();
      userDataRef = db.ref("Users/" + user.uid);
      userDataRef.once("value", snapshot => {
        let currentIndex = snapshot.val().currentIndex;

        db.ref("Users").orderByChild("index").equalTo(currentIndex)
        .once("value", data => {
          let userId;
          data.forEach(childData => {
            userId = childData.key;
            sessionStorage.clear();
            sessionStorage.setItem('userID', userId);
            // let storageData = sessionStorage.getItem('userID');

            window.location.pathname = 'view_profile.html';
          });
        });
      });
    }
  });
}