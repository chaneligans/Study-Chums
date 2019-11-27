function setUserData(childSnapshotValue, childKey) {
  let photo = childSnapshotValue.p1Url + " ";
  let data = [childSnapshotValue.index, photo, childSnapshotValue.name,
              childSnapshotValue.Major, childKey];
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
  let res_html = '';
  let index, img, name, major, count = 1;
  let id = 0;

  results.forEach(result => {
    index = result[0];
    img = result[1];
    name = result[2];
    major = result[3];
    id = result[4];

    res_html += '<tr class="resultRow">';
    res_html += '<td class="resultUserImage"><img src="'+ img +'"></td>';
    res_html += '<td class="resultUserName">';
    res_html += '<a href="view_profile.html" onclick="return saveUserID(\''+ id +'\');">'
    res_html += '<h2 id="resultUserName'+ count +'">'+ name +'</h2></a></td>';
    res_html += '<td class="resultUserMajor"><h3 id="resultUserMajor">'+ major +'</h3></td>';
    res_html += '</tr>'

    count++;
  });

  document.getElementById("searchResults").innerHTML = res_html;
  $("#searchResults").load("../loaded/request_results.html", () => {
    $('#searchResults .requests').html(res_html);
    console.log("Load (chums) was performed.");
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

