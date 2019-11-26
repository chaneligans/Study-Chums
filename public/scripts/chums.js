function setUserData(childSnapshotValue, childKey) {
  let photo = childSnapshotValue.p1Url + " ";
  let data = [childSnapshotValue.index, photo, childSnapshotValue.name, childSnapshotValue.Major, childKey];
  return data;
}

var dark_fn;

function retrieveChums(fn) {
  dark_fn = fn;
  console.log('Called function retrieveChums()');
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      let results = [];
      let applicationsRef = firebase.database().ref('Chums/' + user.uid);
      applicationsRef.once("value", snapshot => {
        snapshot.forEach(childSnapshot => {
          let key = childSnapshot.key;
          let userDataRef = firebase.database().ref('Users/' + key);

          let data = userDataRef.once("value").then(childSnapshotData => {
            let childData = childSnapshotData.val();
            return setUserData(childData, key);
          });
          results.push(Promise.resolve(data).then(() => {return data;}))
        });
        Promise.all(results).then(result => {
          console.log('Results found: ' + result.length);
          if (result.length > 0) {displayChums(result);}
          else {noChumsFound();}
        })
      });
    }
  });
}

function displayChums(results) {
  let html = '<table class="requests">';
  let index, img, name, major, count = 1;
  let id = 0;

  results.forEach(result => {
    index = result[0];
    img = result[1];
    name = result[2];
    major = result[3];
    id = result[4];

    html += '<tr class="resultRow">';
    html += '<td class="resultUserImage"><img src="'+ img +'"></td>';
    html += '<td class="resultUserName">';
    html += '<a href="view_profile.html" onclick="return saveUserID(\''+ id +'\');">'
    html += '<h2 id="resultUserName'+ count +'">'+ name +'</h2></a></td>';
    html += '<td class="resultUserMajor"><h3 id="resultUserMajor">'+ major +'</h3></td>';
    html += '</tr>'

    count++;
  });

  html += '</table>';

  document.getElementById("searchResults").innerHTML = html;
  $("#searchResults").load(html, () => {
    console.log("Load was performed.");
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


function noChumsFound() {
  $("#searchResults").load("../loaded/no_requests.html", () => {
    $('.resultUserName').html("<h2>No Chums Yet!</h2>");
    console.log("Load was performed.");
    dark_fn();
  });

}

