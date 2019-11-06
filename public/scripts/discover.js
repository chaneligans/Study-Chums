var dark_fn;

function setDarkFn(fn) {
  dark_fn = fn;
}

function Enter() {
  let Enterkey = document.getElementById("query");
  Enterkey.addEventListener("keyup", function(event) {
    if (event.keyCode === 27) {
      Enterkey.value = "";
    } else {
      Search();
    }
  });
}

function Search() {
  $('html').addClass('waiting');
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      let value = document.getElementById("query").value; // value
      let option = document.getElementById("option").value; // dropdown

      let results = [];

      // execute only if something is there
      if (option === 'name') {
        if (value !== "") {
          SearchName(value);
        }
      } else if (option === 'major') {
        if (value !== "") {
          results = SearchMajor(value);
        }
      } else {
        alert('Invalid!');
      }
      console.log("Search sent to database.");
    } else {
      console.log("Who are you? And why do you have access to this?");
    }
  });
}

function getUserData(childSnapshotValue, childKey) {
  let photo = childSnapshotValue.p1Url + " ";
  let data = [childSnapshotValue.index, photo, childSnapshotValue.name, childSnapshotValue.Major, childKey];
  return data;
}

function SearchName(name_in) {
  let results = [];
  let nameTypes = [name_in, name_in.toLowerCase(), upperCaseWords(name_in)];
  // check each name type (as-is, lowercase, uppercase)
  nameTypes.forEach(name_ => {
    firebase.database().ref('Users/').orderByChild("name")
      .startAt(name_).endAt(name_+"\uf8ff").once('value', function(snapshot) {
        let data;
        snapshot.forEach(function(childSnapshot) {
          let key = childSnapshot.key;
          let childData = childSnapshot.val();
          data = getUserData(childData, key);

          let bool = false;
          results.forEach(result => {
            if (result[4] === data[4]) {
                bool = true;
            }
          });
          if (bool === false) {
            results.push(data);
          }
        });
        Promise.all(results).then(result => {
          // console.log('Results found: ' + result.length);
          if (results.length > 0) {
            showSearchResults(results);
          } else {
            noResultsFound();
          }
        });
      }).catch(function(error) {
        console.log("Error getting results: ", error);
      });
  });
}

function SearchMajor(major_in) {
  let results = [];
  let majorTypes = [major_in, major_in.toLowerCase(), upperCaseWords(major_in)];

  // check each major type (as-is, lowercase, uppercase)
  majorTypes.forEach(major_ => {
    firebase.database().ref('Users/').orderByChild("Major")
      .startAt(major_).endAt(major_+"\uf8ff")
      .once('value', function(snapshot) {
        let data;
        snapshot.forEach(function(childSnapshot) {
          let key = childSnapshot.key;
          let childData = childSnapshot.val();
          data = getUserData(childData, key);
          let bool = false;
          results.forEach((result)=> {
            if (result[4] === data[4]) {
                bool = true;
            }
          });
          if (bool === false) {
            results.push(data);
          }
        });
        Promise.all(results).then(result => {
          // console.log('Results found: ' + result.length);
          // console.log(result);
          if (result.length > 0) {
            showSearchResults(result);
          } else {
            noResultsFound();
          }
        });
      }).catch(function(error) {
        console.log("Error getting results: ", error);
      });
  });
}

function upperCaseWords(msg) {
  let bool = true, mstr = "", i = 0, arr = msg.split(" ");
  arr.forEach(str => {
    if (str !== "" && str !== " ") {
     mstr += str.charAt(0).toUpperCase() + str.slice(1);
     bool = false;
    }
    if (i < arr.length-1) { mstr += " "; }
    i++;
  });
  return bool ? msg : mstr;
}

function showSearchResults(results) {
  firebase.auth().onAuthStateChanged(function(user) {
    let index, img, name, major, count = 1, id = 0, length = results.length;
    let html = '<table id="results">';

    // iterate through and add a table row for each user (result)
    results.forEach(function(result) {
      // console.log(result);

      index = result[0];
      img = result[1];
      name = result[2];
      major = result[3];
      id = result[4];

      if (id != user.uid) {
        html += '<tr class="resultRow">';
        html += '<td class="resultUserImage"><img src="' + img + '"></td>';
        html += '<td class="resultUserName"><a href="view_profile.html" onclick="return saveUserID(\''
        html += id + '\');"><h2 id="resultUserName' + count + '">' + name + '</h2></a></td>';
        html += '<td class="resultUserMajor"><h3 id="resultUserMajor">' + major + '</h3></td>';
        html += '</tr>'

        count++;
      } else {
        if (length == 1) {
          html += '<tr class="resultRow">';
          html += '<td class="resultUserName"><h2>No Results Found</h2></td>';
          html += '</tr>'
        }
      }
    });

    html += '</table>';

    document.getElementById("searchResults").innerHTML = html;
    $("#searchResults").load(html, function() {
      console.log("Load (search results) was performed.");
      dark_fn();
    });
  });
}

function saveUserID(userID) {
  sessionStorage.clear();
  sessionStorage.setItem('userID', userID);
  let storageData = sessionStorage.getItem('userID');
  // console.log("saved user id ..." + storageData);
  return true;
}

function noResultsFound() {
  $("#searchResults").load("../loaded/no_requests.html", function() {
    $('.resultUserName').html("<h2>No Results Found</h2>");
    console.log("Load (search results) was performed.");
    dark_fn();
  });
}