// Get total user value from the database
function getTotalUsers() {
  var databaseRef = firebase.database().ref("TotalUsers");  
  return databaseRef.once("value", function(data) {
  });
}

// Load the profile for the homepage
function loadProfile(startIndex) {
  firebase.auth().onAuthStateChanged(function(user) {
    if(user) {
      var userIndex;
      firebase.database().ref("Users/" + user.uid).once("value", function(snapshot) {
        userIndex = snapshot.val().index;

        var total;
        getTotalUsers().then((result)=> {
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
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      firebase.database().ref("Users/" + user.uid).once("value", function(snapshot) {
        let ref = firebase.database().ref("Users/" + user.uid);

        console.log(user.uid);

        var userIndex;
        var prevIndex;
        userIndex = snapshot.val().index;
        nextIndex = snapshot.val().currentIndex;

        // if it is undefined, go to the next user
        // it would not be undefined when update === false
        // in that case, it should not go to the next user and load
        // the profile at the user's current viewing index
        if (update === undefined) {
          nextIndex++;
        }

        var total;
        getTotalUsers().then((result)=> {
          total = result.val().total;  

          // Ensure the user does not view their own profile, and the
          // indices loop through back to the beginning
          while (nextIndex === userIndex || nextIndex > total - 1) {
            console.log('While loop on nextProfile()');
            if (nextIndex > total - 1) {
              nextIndex = 0;
            }
            if (nextIndex === userIndex){
              nextIndex = nextIndex + 1;
            }
          }

          // update the user's current viewing index
          ref.update({
            currentIndex: nextIndex,
            "currentIndex": nextIndex
          }, function(error) {
            if (error) {
              console.log("Update failed - currentIndex to " + nextIndex);
            } else {
              console.log("Update suceeded - currentIndex to " + nextIndex);
            }
          });

          console.log('Loading next profile at index ' + nextIndex);
          loadProfile(nextIndex);
        });

      });
    }
    else {
      console.log('No user found');
    }
  });
}

// Load the previous profile (left arrow button)
function previousProfile() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      firebase.database().ref("Users/" + user.uid).once("value", function(snapshot) {
        let ref = firebase.database().ref("Users/" + user.uid);

        var userIndex;
        var prevIndex;
        userIndex = snapshot.val().index;
        nextIndex = snapshot.val().currentIndex - 1;

        var total;
        getTotalUsers().then((result)=> {
          total = result.val().total;   

          // Ensure the user does not view their own profile, and the
          // indices loop through back to the end
          while (nextIndex === userIndex || nextIndex < 0) {
            console.log('While loop on previousProfile()');
            if (nextIndex < 0) {
              nextIndex = total - 1;
            }
            if (nextIndex === userIndex){
              nextIndex = nextIndex - 1;
            }
          }

          ref.update({
            currentIndex: nextIndex,
            "currentIndex": nextIndex
          }, function(error) {
            if (error) {
              console.log("Update failed - currentIndex to " + nextIndex);
            } else {
              console.log("Update suceeded - currentIndex to " + nextIndex);
            }
          });
          console.log('Loading next profile at index ' + nextIndex);
          loadProfile(nextIndex);
        });
      });
    }
    else {
      console.log('No user found');
    }
  });
}

// pulls the user's profile picture from the database and displays it
function loadImage(startIndex) {
  var image_val;
  console.log(startIndex);
  var userDataRef = firebase.database().ref("Users");
  userDataRef.orderByChild("index").equalTo(startIndex).once("value", function(snapshot){
    var key;
    snapshot.forEach(function (childSnapshot){
      key = childSnapshot.key;
      var childData = childSnapshot.val();              
      image_val = childSnapshot.val().p1Url;

      // if image_val is undefined, the user does not have a pfp
      // therefore, we replace it with a generic avatar
      if (image_val === undefined) {
        console.log('Undefined image');
        image_val = 'https://firebasestorage.googleapis.com/v0/b/study-chums.appspot.com/o/img%2Fa98d336578c49bd121eeb9dc9e51174d.png?alt=media&token=5c470791-f247-4c38-9609-80a4c77128c1';
      }
      console.log(image_val);
      $("#image").append(image_val);
      document.getElementById('imageBox').src = image_val;
    });
  });
}

// load the user's name
function loadName(startIndex) {
  var name_val;
  userDataRef = firebase.database().ref("Users");
  userDataRef.orderByChild("index").equalTo(startIndex).once("value", function(snapshot) {
    var key;
    snapshot.forEach(function (childSnapshot){
      key = childSnapshot.key;
      var childData = childSnapshot.val();              
      name_val = childSnapshot.val().name;
      console.log(name_val);
      $("#name").append(name_val);
      document.getElementById("Name").innerHTML=name_val; 
    })
  });
}

// load the user's major
function loadMajor(startIndex) {
  var Major_val;
  userDataRef = firebase.database().ref("Users");
  userDataRef.orderByChild("index").equalTo(startIndex).once("value", function(snapshot){
    var key;
    snapshot.forEach(function(childSnapshot){
      key = childSnapshot.key;
      var childData = childSnapshot.val();              
      Major_val = childSnapshot.val().Major;
      console.log(Major_val);
      $("#Major").append(Major_val);
      document.getElementById("Major").innerHTML= Major_val; 
    });
  });
}

// load the user's biography
function loadBio(startIndex){
  var bio_val;
  userDataRef = firebase.database().ref("Users");
  userDataRef.orderByChild("index").equalTo(startIndex).once("value", function(snapshot) {
      var key;
      snapshot.forEach(function(childSnapshot){
          key = childSnapshot.key;
          var childData = childSnapshot.val();              
          bio_val = childSnapshot.val().bio;
          console.log(bio_val);
          $("#bio").append(bio_val);
         // $("#id").append(id_val);
          document.getElementById("bio").innerHTML=bio_val; 
      });
  });
}

function saveUserID() {
  firebase.auth().onAuthStateChanged(function(user) {
    if(user){
      userDataRef = firebase.database().ref("Users/" + user.uid);
      var currentIndex;
      userDataRef.once("value", function(snapshot) {
        currentIndex = snapshot.val().currentIndex;
        var userId;

        firebase.database().ref("Users").orderByChild("index").equalTo(currentIndex).once("value", function(data){
          data.forEach(function(childData){
            userId = childData.key;
            sessionStorage.clear();
            sessionStorage.setItem('userID', userId);
            var storageData = sessionStorage.getItem('userID');
            console.log("saved user id ..." + storageData);     
            
            window.location.pathname = 'view_profile.html';
          });
        });
      });
    }
  });
}