var dark_fn;
function setDarkFn(fn) {
  dark_fn = fn;
}

function setUserData(childSnapshotValue, childKey) {
  let photo = `${childSnapshotValue.p1Url} `;
  let data = [
    childSnapshotValue.index, photo, childSnapshotValue.name,
    childSnapshotValue.Major, childKey
  ];
  return data;
}

function retrieveReceivedRequests() {
  retreiveRequests_("Received");
}

function retrieveSentRequests() {
  retreiveRequests_("Sent");
}

function retreiveRequests_(request_type) {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      let results = [],
      db = firebase.database(),
      applicationsRef = db.ref(`Applications/${user.uid}/${request_type}`);
      applicationsRef.once("value", snapshot => {
        snapshot.forEach(childSnapshot => {
          let key = childSnapshot.key,
          userDataRef = db.ref(`Users/${key}`);
          let data = userDataRef.once("value").then(childSnapshotData => {
            return setUserData(childSnapshotData.val(), key);
          });
          results.push(Promise.resolve(data));
        });
        Promise.all(results).then(result => {
          if (result.length > 0) {displayRequests_(request_type, result);}
          else {noRequests_(request_type);}
        })
      });
    }
  });
}

function displayRequests_(request_type, results) {
  let img, name, major, count = 1, id = 0;
  let res_html = '';

  const sent_ = () => {
    return '<td class= "resultIcons">'
    + '<i class="fas fa-spinner fa-sm"></i>'
    + '<p>Request Pending</p></td>';
  }

  const received_ = id => {
    return `<td class= "resultIcons"><p id="acceptIcon${id}">`
    + `<a onclick="acceptRequest('${id}');" style="color:black">`
    + '<i class="fas fa-user-check fa-lg"></i></a></p></td>'
    + `<td class= "resultIcons"><p id="rejectIcon${id}">`
    + `<a onclick="rejectRequest('${id}');" style="color:black">`
    + '<i class="fas fa-trash-alt fa-lg"></i></a></p></td>';
  }

  results.forEach(result => {
    [index, img, name, major, id] = result;

    res_html += '<tr class="resultRow">'
    + `<td class="resultUserImage"><img src="${img}"></td>`
    + '<td class="resultUserName">'
    + `<a href="view_profile.html" onclick="return saveUserID('${id}');">`
    + `<h2 id="resultUserName${count}">${name}<br/></h2>`
    + `<h4>${major}</h4></a></td>`
    + ((request_type === "Sent") ? sent_():received_(id))
    + '</tr>';

    count++;
  });

  request_type = request_type.toLowerCase();

  document.getElementById(request_type+"Requests").innerHTML = res_html;
  $(`#${request_type}Requests`).load("../loaded/request_results", () => {
    $(`#${request_type}Requests .requests`).html(res_html);
    console.log(`Load was performed (${request_type} requests).`);
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
  let j_query = `#${request_type}Requests`;
  $(j_query).load("../loaded/no_requests.html", () => {
    $('.resultUserName').html(`<h2>No ${Request_type} Requests Yet!</h2>`);
    console.log(`Load was performed (no ${request_type} requests).`);
    dark_fn();
  });
}

function acceptRequest(acceptID) {
  let status = "Accepted";
  requestWas_(status, acceptID);
}

function rejectRequest(rejectID) {
  let status = "Rejected";
  requestWas_(status, rejectID);
}

function requestWas_(Response_type, requesterID) {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      let userID = user.uid;
      let response_type = Response_type.toLowerCase();
      const db = firebase.database();

      let userRef = db.ref(`Applications/${userID}/Received/`);
      userRef.child(requesterID).remove().then(() => {
        console.log(`Remove succeeded (${response_type}_request:user).`)
      })
      .catch(error => {
        console.error(`Remove failed (${response_type}_request:user): ${error.message}`)
      });

      let senderRef = db.ref(`Applications/${requesterID}/Sent/`);
      senderRef.child(userID).remove().then(() => {
        console.log(`Remove succeeded (${response_type}_request:sender).`)
      })
      .catch(error => {
        console.error(`Remove failed (${response_type}_request:sender): ${error.message}`)
      });

      let accept_html = "", reject_html = "";
      if (Response_type === "Accepted") {
        let chums = "Chums";
        db.ref(`Chums/${userID}/${requesterID}`).set({
          status: chums
        }, error => {
          if (error) {
            console.error(`Update to Chum List failed (sender->user): ${error.message}`);
          } else {
            console.log("Update to Chum List succeeded (sender->user)");
          }
        });

        db.ref(`Chums/${requesterID}/${userID}`).set({
          status: chums
        }, error => {
          if (error) {
            console.error(`Update to Chum List failed (user->sender): ${error.message}`);
          } else {
            console.log("Update to Chum List succeeded (user->sender)");
          }
        });

        accept_html = "Accepted!";
      } else {
        reject_html = "Rejected!";
      }

      document.getElementById(`acceptIcon${requesterID}`).innerHTML = accept_html;
      document.getElementById(`rejectIcon${requesterID}`).innerHTML = reject_html;

    } else {
      console.error('Something went wrong!');
    }
  });
}