var dark_fn;
function setDarkFn(fn) {
  dark_fn = fn;
}

function Enter() {
  let Enterkey = document.getElementById("query");
  let Option = document.getElementById("option");

  Enterkey.addEventListener("keyup", event => {
    switch (event.keyCode) {
      case 13: Search(); break;            // enter key
      case 27: Enterkey.value = ""; break; // escape key
      default: Search();
    }
  });

  // will Search() on selector change
  Option.addEventListener("change", event => Search());
}

function Search() {
  $('html').addClass('waiting');
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      let value = document.getElementById("query").value; // value
      let option = document.getElementById("option").value; // dropdown

      let results = [];

      // execute only if something is there
      if (value !== "") {
        switch (option) {
          case 'name':
            console.log('Searching by name...');
            Search_('name', value);
            break;
          case 'major':
            console.log('Searching by major...')
            Search_('Major', value);
            break;
          default: Search_(undefined, value);
          // general option; shouldn't happen normally
        }
      } else {
        // alert('Invalid!');
        blankSearchQuery();
      }

      // console.log("Search sent to database.");
    } else {
      console.log("Who are you? And why do you have access to this?");
    }
  });
}

function Search_(searchType, input) {
  let results = [];
  let nameTypes = [input, input.toLowerCase(), upperCaseWords(input)];
  // check each name type (as-is, lowercase, uppercase)

  let db_Users_by_searchType = firebase.database().ref('Users/');
  if (searchType !== undefined) {
    db_Users_by_searchType = db_Users_by_searchType.orderByChild(searchType);
  }

  (async () => {
    await asyncForEach(nameTypes, async name_ => {
      try { // check db for each name type
        let subset = await getSearchSubset(db_Users_by_searchType, name_);
        subset.forEach(sub_res => {
          if (isDuplicateOf_In_(sub_res[4], results) === false) {
            results.push(sub_res);
          } // add subset results to results if a subresult is not already there
        });
      } catch (err) {
        console.err(err);
      }
    });

    results = [...new Set(results)];
    // manipulates the results s.t. it's unique elements only

    console.log(`Results found: ${results.length}`);
    if (results.length > 0) {showSearchResults(results);}
    else {noResultsFound();}

  })();
}

// an asynchronous forEach. Bc arr.forEach(callback) is not Promise-aware.
async function asyncForEach(arr, callback) {
  for (let index = 0; index < arr.length; index++) {
    await callback(arr[index], index, arr);
  }
}

// given a firebase realtime-database Reference and a name_type of a search query,
// return a promise that resolves with a list of search results,
// and rejects if no result exists.
function getSearchSubset(source, name_) {
  return new Promise((resolve, reject) => {
    let subset = [];

    source.startAt(name_).endAt(name_+"\uf8ff").once('value')
    .then(snapshot => {
      if (snapshot.exists) {
        let key, userData;
        snapshot.forEach(childSnapshot => {
          key = childSnapshot.key;
          userData = getUserData(childSnapshot.val(), key);

          if (isDuplicateOf_In_(userData[4], subset) === false) {
            subset.push(userData);
          }
        });
        resolve(subset);

      } else {
        reject(`There were no results for this type of the query -- ${name_}`);
      }
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

function getUserData(childSnapshotValue, childKey) {
  let photo = childSnapshotValue.p1Url + " ";
  let data = [childSnapshotValue.index, photo, childSnapshotValue.name,
    childSnapshotValue.Major, childKey];
  return data;
}

// given an object to look for and a given_list to look in for the object,
// return true if the object is in the given_list, and false otherwise
function isDuplicateOf_In_(source, given_list) {
  let bool = false;
  given_list.forEach(given_item => {
    if (given_item[4] === source) { bool = true; }
  });
  return bool;
}

function showSearchResults(results) {
  firebase.auth().onAuthStateChanged(user => {
    let index, img, name, major, id, count = 1,length = results.length;
    let res_html = "";

    // iterate through and add a table row for each user (result)
    results.forEach(result => {
      [index, img, name, major, id] = result;

      if (img === "undefined ") { // set img to the generic image
        img = 'https://firebasestorage.googleapis.com/'
        + 'v0/b/study-chums.appspot.com/o/'
        + 'img%2Fa98d336578c49bd121eeb9dc9e51174d.png?'
        + 'alt=media&token=5c470791-f247-4c38-9609-80a4c77128c1';
      }

      if (id !== user.uid) {
        res_html += '<tr class="resultRow">';
        res_html += `<td class="resultUserImage"><img src="${img}"></td>`;
        res_html += '<td class="resultUserName"><a href="view_profile.html"';
        res_html += `onclick="return saveUserID(${id});">`;
        res_html += `<h2 id="resultUserName${count}">${name}</h2></a></td>`;
        res_html += '<td class="resultUserMajor">';
        res_html += `<h3 id="resultUserMajor">${major}</h3></td>`;
        res_html += '</tr>';

        count++;

      } else {
        if (length === 1) {
          res_html += '<tr class="resultRow">';
          res_html += '<td class="resultUserName"><h2>No Results Found</h2></td>';
          res_html += '</tr>';
        }
      }
    });

    $("#searchResults").load("../loaded/search_results.html", () => {
      $('#results').html(res_html);
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
  $("#searchResults").load("../loaded/no_requests.html", () => {
    $('.resultUserName').html("<h2>No Results Found</h2>");
    console.log("Load (search results) was performed.");
    dark_fn();
  });
}

function blankSearchQuery() {
  $("#searchResults").load("../loaded/blank.html", () => {
    console.log("No search query found.");
  });
}