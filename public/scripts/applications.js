var dark_fn;

function setDarkFn(fn) {
  dark_fn = fn;
}

function setUserData(childSnapshotValue, childKey) {
  let photo = childSnapshotValue.p1Url + " ";
  let data = [childSnapshotValue.index, photo, childSnapshotValue.name, childSnapshotValue.Major, childKey];
  return data;
}

function retrieveReceivedRequests() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      let results = [];
      let applicationsRef = firebase.database().ref('Applications/' + user.uid + '/Received/');
      applicationsRef.once("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          let key = childSnapshot.key;
          let userDataRef = firebase.database().ref('Users/' + key);

          let data = userDataRef.once("value").then(function(childSnapshotData) {
            let name = childSnapshotData.val().name;
            childData = childSnapshotData.val();
            return setUserData(childData, key);

          });
          results.push(Promise.resolve(data).then(function() {
            return data;
          }))
        });
        Promise.all(results).then(result => {
          console.log('Results found: ' + result.length);
          if (result.length > 0) {
            displayReceivedRequests(result);
          } else {
            noReceievedRequestsFound()
          }
        })
      });
    }

  });
}

function retrieveSentRequests() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      let results = [];
      let applicationsRef = firebase.database().ref('Applications/' + user.uid + '/Sent/');
      applicationsRef.once("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          let key = childSnapshot.key;
          let userDataRef = firebase.database().ref('Users/' + key);

          let data = userDataRef.once("value").then(function(childSnapshotData) {
            let name = childSnapshotData.val().name;
            childData = childSnapshotData.val();
            return setUserData(childData, key);

          });
          results.push(Promise.resolve(data).then(function() {
            return data;
          }))
        });
        Promise.all(results).then(result => {
          console.log('Results found: ' + result.length);
          if (result.length > 0) {
            displaySentRequests(result);
          } else {
            noSentRequestsFound()
          }
        })
      });
    }

  });
}

function displayReceivedRequests(results) {
  let html = '<table class="requests">';
  let img;
  let name;
  let major;
  let count;
  let id = 0;

  results.forEach(function(result) {
    index = result[0];
    img = result[1];
    name = result[2];
    major = result[3];
    id = result[4];

    html += '<tr class="resultRow">';
    html += '<td class="resultUserImage"><img src="' + img + '"></td>';
    html += '<td class="resultUserName"><a href="view_profile.html" onclick="return saveUserID(\'' + id + '\');"><h2 id="resultUserName' + count + '">' + name + '<br /></h2><h4>' + major + '</h4></a></td>';

    html += '<td class= "resultIcons"><p id="acceptIcon' + id + '"><a onclick="acceptRequest(\'' + id + '\');" style="color:black"><i class="fas fa-user-check fa-lg"></i></a></p></td>';
    html += '<td class= "resultIcons"><p id="rejectIcon' + id + '"><a onclick="rejectRequest(\'' + id + '\');" style="color:black"><i class="fas fa-trash-alt fa-lg"></i></a></p></td>';
    html += '</tr>'

    count++;
  });

  html += '</table>';

  document.getElementById("recievedRequests").innerHTML = html;
  $("#recievedRequests").load(html, function() {
    console.log("Load was performed.");
    dark_fn();
  });
}

function displaySentRequests(results) {
  let html = '<table class="requests">';
  let img;
  let name;
  let major;
  let count;
  let id = 0;

  results.forEach(function(result) {
    index = result[0];
    img = result[1];
    name = result[2];
    major = result[3];
    id = result[4];

    html += '<tr class="resultRow">';
    html += '<td class="resultUserImage"><img src="' + img + '"></td>';
    html += '<td class="resultUserName"><a href="view_profile.html" onclick="return saveUserID(\'' + id + '\');"><h2 id="resultUserName' + count + '">' + name + '<br /></h2><h4>' + major + '</h4></a></td>';

    html += '<td class= "resultIcons"><i class="fas fa-spinner fa-sm"></i><p>Request Pending</p></td>';
    html += '</tr>'

    count++;
  });

  html += '</table>';

  document.getElementById("sentRequests").innerHTML = html;
  $("#sentRequests").load(html, function() {
    console.log("Load was performed.");
    dark_fn();
  });
}

function saveUserID(userID) {
  sessionStorage.clear();
  sessionStorage.setItem('userID', userID);
  let storageData = sessionStorage.getItem('userID');
  console.log("saved user id ..." + storageData);
  return true;
}

function noReceievedRequestsFound() {
  let html = '<table class="requests">';

  html += '<tr class="resultRow">';
  html += '<td class="resultUserName"><h2>No Chum Requests Yet!</h2></td>';
  html += '</tr>'

  html += '</table>';

  document.getElementById("recievedRequests").innerHTML = html;
  $("#recievedRequests").load(html, function() {
    console.log("Load was performed.");
    dark_fn();
  });

}

function noSentRequestsFound() {
  let html = '<table class="requests">';

  html += '<tr class="resultRow">';
  html += '<td class="resultUserName"><h2>No Sent Requests Yet!</h2></td>';
  html += '</tr>'

  html += '</table>';

  document.getElementById("sentRequests").innerHTML = html;
  $("#sentRequests").load(html, function() {
    console.log("Load was performed.");
    dark_fn();
  });

}

function acceptRequest(acceptID) {
  let status = "Accepted"
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      let userID = user.uid;

      let userRef = firebase.database().ref('Applications/' + userID + '/Received/');
      userRef.child(acceptID).remove().then(function() {
          console.log("Remove succeeded.")
        })
        .catch(function(error) {
          console.log("Remove failed: " + error.message)
        });

      let senderRef = firebase.database().ref('Applications/' + acceptID + '/Sent/');
      senderRef.child(userID).remove().then(function() {
          console.log("Remove succeeded.")
        })
        .catch(function(error) {
          console.log("Remove failed: " + error.message)
        });

      let chums = "Chums";
      firebase.database().ref('Chums/' + userID + '/' + acceptID).set({
        status: chums
      }, function(error) {
        if (error) {
          console.log("Update to Chum List failed");
        } else {
          console.log("Update to Chum List succeeded");
        }
      });

      firebase.database().ref('Chums/' + acceptID + '/' + userID).set({
        status: chums
      }, function(error) {
        if (error) {
          console.log("Update to Chum List failed");
        } else {
          console.log("Update to Chum List succeeded");
        }
      });

      document.getElementById('acceptIcon' + acceptID).innerHTML = "Accepted!";
      console.log(acceptID);

      document.getElementById('rejectIcon' + acceptID).innerHTML = "";

    } else {
      console.log('Something went wrong!');
    }
  });
}

function rejectRequest(rejectID) {
  let status = "Rejected"
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      let userID = user.uid;

      let userRef = firebase.database().ref('Applications/' + userID + '/Received/');
      userRef.child(rejectID).remove().then(function() {
          console.log("Remove succeeded.")
        })
        .catch(function(error) {
          console.log("Remove failed: " + error.message)
        });

      let senderRef = firebase.database().ref('Applications/' + rejectID + '/Sent/');
      senderRef.child(userID).remove().then(function() {
          console.log("Remove succeeded.")
        })
        .catch(function(error) {
          console.log("Remove failed: " + error.message)
        });

      document.getElementById('rejectIcon' + rejectID).innerHTML = "Rejected!";
      document.getElementById('acceptIcon' + rejectID).innerHTML = "";
    } else {
      console.log('Something went wrong!');
    }
  });
}