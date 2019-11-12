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
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      let results = [];
      let applicationsRef = firebase.database().ref('Applications/' + user.uid + '/Received/');
      applicationsRef.once("value", snapshot => {
        snapshot.forEach(childSnapshot => {
          let key = childSnapshot.key;
          let userDataRef = firebase.database().ref('Users/' + key);
          let data = userDataRef.once("value").then(childSnapshotData => {
            let name = childSnapshotData.val().name;
            childData = childSnapshotData.val();
            return setUserData(childData, key);
          });
          results.push(Promise.resolve(data).then(() => {
            return data;
          }))
        });
        Promise.all(results).then(result => {
          if (result.length > 0) {
            displayReceivedRequests(result);
          } else {
            noRequests_("Received");
          }
        })
      });
    }
  });
}

function retrieveSentRequests() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      let results = [];
      let applicationsRef = firebase.database().ref('Applications/' + user.uid + '/Sent/');
      applicationsRef.once("value", snapshot => {
        snapshot.forEach(childSnapshot => {
          let key = childSnapshot.key;
          let userDataRef = firebase.database().ref('Users/' + key);
          let data = userDataRef.once("value").then(childSnapshotData => {
            let name = childSnapshotData.val().name;
            childData = childSnapshotData.val();
            return setUserData(childData, key);
          });
          results.push(Promise.resolve(data).then(() => {
            return data;
          }))
        });
        Promise.all(results).then(result => {
          if (result.length > 0) {
            displaySentRequests(result);
          } else {
            noRequests_("Sent");
          }
        })
      });
    }
  });
}

function displayReceivedRequests(results) {
  let img, name, major, count, id = 0;
  let html = '<table class="requests">';

  results.forEach(result => {
    index = result[0];
    img = result[1];
    name = result[2];
    major = result[3];
    id = result[4];

    html += '<tr class="resultRow">';
    html += '<td class="resultUserImage"><img src="' + img + '"></td>';
    html += '<td class="resultUserName"><a href="view_profile.html" onclick="return saveUserID(\''
    html += id + '\');"><h2 id="resultUserName' + count + '">' + name + '<br /></h2><h4>' + major + '</h4></a></td>';

    html += '<td class= "resultIcons"><p id="acceptIcon' + id + '"><a onclick="acceptRequest(\''
    html += id + '\');" style="color:black"><i class="fas fa-user-check fa-lg"></i></a></p></td>';

    html += '<td class= "resultIcons"><p id="rejectIcon' + id + '"><a onclick="rejectRequest(\''
    html += id + '\');" style="color:black"><i class="fas fa-trash-alt fa-lg"></i></a></p></td>';
    html += '</tr>'

    count++;
  });

  html += '</table>';

  document.getElementById("receivedRequests").innerHTML = html;
  $("#receivedRequests").load(html, () => {
    console.log("Load was performed (received requests).");
    dark_fn();
  });
}

function displaySentRequests(results) {
  let img, name, major, count, id = 0;
  let html = '<table class="requests">';

  results.forEach(result => {
    index = result[0];
    img = result[1];
    name = result[2];
    major = result[3];
    id = result[4];

    html += '<tr class="resultRow">';
    html += '<td class="resultUserImage"><img src="' + img + '"></td>';
    html += '<td class="resultUserName"><a href="view_profile.html" onclick="return saveUserID(\''
    html += id + '\');"><h2 id="resultUserName' + count + '">' + name + '<br /></h2><h4>' + major + '</h4></a></td>';

    html += '<td class= "resultIcons"><i class="fas fa-spinner fa-sm"></i><p>Request Pending</p></td>';
    html += '</tr>'

    count++;
  });

  html += '</table>';

  document.getElementById("sentRequests").innerHTML = html;
  $("#sentRequests").load(html, () => {
    console.log("Load was performed (sent requests).");
    dark_fn();
  });
}

function saveUserID(userID) {
  sessionStorage.clear();
  sessionStorage.setItem('userID', userID);
  let storageData = sessionStorage.getItem('userID');
  // console.log("saved user id ..." + storageData);
  return true;
}

function noRequests_(Request_type) {
  let request_type = Request_type.toLowerCase();
  let j_query = "#" + request_type + "Requests";
  $(j_query).load("../loaded/no_requests.html", () => {
    $('.resultUserName').html('<h2>No '+Request_type+' Requests Yet!</h2>');
    console.log("Load was performed (no " + request_type + " requests).");
    dark_fn();
  });
}

function acceptRequest(acceptID) {
  let status = "Accepted"
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      let userID = user.uid;

      let userRef = firebase.database().ref('Applications/' + userID + '/Received/');
      userRef.child(acceptID).remove().then(() => {
          console.log("Remove succeeded (accepted_request:user).")
        })
        .catch(error => {
          console.error("Remove failed (accepted_request:user): " + error.message)
        });

      let senderRef = firebase.database().ref('Applications/' + acceptID + '/Sent/');
      senderRef.child(userID).remove().then(() => {
          console.log("Remove succeeded (accepted_request:sender).")
        })
        .catch(error => {
          console.error("Remove failed (accepted_request:sender): " + error.message)
        });

      let chums = "Chums";
      firebase.database().ref('Chums/' + userID + '/' + acceptID).set({
        status: chums
      }, error => {
        if (error) {
          console.errpr("Update to Chum List failed (sender->user): " + error.message);
        } else {
          console.log("Update to Chum List succeeded (sender->user)");
        }
      });

      firebase.database().ref('Chums/' + acceptID + '/' + userID).set({
        status: chums
      }, error => {
        if (error) {
          console.error("Update to Chum List failed (user->sender): " + error.message);
        } else {
          console.log("Update to Chum List succeeded (user->sender)");
        }
      });

      document.getElementById('acceptIcon' + acceptID).innerHTML = "Accepted!";
      // console.log(acceptID);

      document.getElementById('rejectIcon' + acceptID).innerHTML = "";

    } else {
      console.log('Something went wrong!');
    }
  });
}

function rejectRequest(rejectID) {
  let status = "Rejected"
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      let userID = user.uid;

      let userRef = firebase.database().ref('Applications/' + userID + '/Received/');
      userRef.child(rejectID).remove().then(() => {
          console.log("Remove succeeded (rejected_request:user).")
        })
        .catch(error => {
          console.error("Remove failed (rejected_request:user): " + error.message)
        });

      let senderRef = firebase.database().ref('Applications/' + rejectID + '/Sent/');
      senderRef.child(userID).remove().then(() => {
          console.log("Remove succeeded (rejected_request:sender).")
        })
        .catch(error => {
          console.error("Remove failed (rejeceted_request:sender): " + error.message)
        });

      document.getElementById('rejectIcon' + rejectID).innerHTML = "Rejected!";
      document.getElementById('acceptIcon' + rejectID).innerHTML = "";
    } else {
      console.error('Something went wrong!');
    }
  });
}