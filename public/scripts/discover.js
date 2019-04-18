
function Search() {
    $('html').addClass('waiting');
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            let value = document.getElementById("query").value;   // value
            let option = document.getElementById("option").value; // dropdown
            
            var results = [];
            
            // execute only if something is there
            if (option === 'name') {
              if (value !== "") {SearchName(value);}
            }
            else if (option === 'major') {
              if (value !== "") {results = SearchMajor(value);}
            }
            else {
              alert('Invalid!');
            }

            console.log("Search sent to database.");
            

            
        } else {
            console.log("Who are you? And why do you have access to this?");
        }
    });
}
      
            
function getUserData(childSnapshotValue, childKey) {
    var photo = childSnapshotValue.p1Url + " ";
    var data = [childSnapshotValue.index, photo, childSnapshotValue.name, childSnapshotValue.Major, childKey];
    return data;
}
function SearchName(name_in){
    var results = [];
    name_in = name_in.toLowerCase();
    //check lowercase first
    firebase.database().ref('Users/').orderByChild("name")
    .equalTo(name_in).once('value',function(snapshot){                
        var data;

        snapshot.forEach(function(childSnapshot) {
            var key = childSnapshot.key;
            var childData = childSnapshot.val();
                      
            data = getUserData(childData, key);
            results.push(data);

        });
        Promise.all(results).then(result => {
            console.log('Results found: ' + result.length);
            if (results.length > 0) {     
                showSearchResults(results);
            }
            else {
                noResultsFound();
            }
        });
    }).catch(function(error) {
        console.log("Error getting results: ", error);
        });
    //check uppercase first
    name_in = name_in.charAt(0).toUpperCase()+name_in.slice(1);
    firebase.database().ref('Users/').orderByChild("name")
    .equalTo(name_in).once('value',function(snapshot){                
        var data;

        snapshot.forEach(function(childSnapshot) {
            var key = childSnapshot.key;
            var childData = childSnapshot.val();
                      
            data = getUserData(childData, key);
            results.push(data);

        });
        Promise.all(results).then(result => {
            console.log('Results found: ' + result.length);
            if (results.length > 0) {     
                showSearchResults(results);
            }
            else {
                noResultsFound();
            }
        });
    }).catch(function(error) {
        console.log("Error getting results: ", error);
        });
}
function SearchMajor(major_in){
    major_in = major_in.toLowerCase();
    //check lowercase first
    var results = [];
    firebase.database().ref('Users/').orderByChild("Major")
        .equalTo(major_in).once('value',function(snapshot){                
            var data;

            snapshot.forEach(function(childSnapshot) {
              var key = childSnapshot.key;
              var childData = childSnapshot.val();
                      
              data = getUserData(childData, key);
              results.push(data);

            });
            Promise.all(results).then(result => {
              console.log('Results found: ' + result.length);
              console.log(result);
              if (result.length > 0) {     
                showSearchResults(result);
              }
              else {
                  noResultsFound();
              }
            });
        }).catch(function(error) {
            console.log("Error getting results: ", error);
          });
    //check uppercase first
    major_in = major_in.charAt(0).toUpperCase()+major_in.slice(1);
    firebase.database().ref('Users/').orderByChild("Major")
        .equalTo(major_in).once('value',function(snapshot){                
            var data;

            snapshot.forEach(function(childSnapshot) {
              var key = childSnapshot.key;
              var childData = childSnapshot.val();
                      
              data = getUserData(childData, key);
              results.push(data);

            });
            Promise.all(results).then(result => {
              console.log('Results found: ' + result.length);
              console.log(result);
              if (result.length > 0) {     
                showSearchResults(result);
              }
              else {
                  noResultsFound();
              }
            });
        }).catch(function(error) {
            console.log("Error getting results: ", error);
        });
}

function showSearchResults(results) {
    firebase.auth().onAuthStateChanged(function(user) {
        var html = '<table id="results">';
        var index;
        var img;
        var name;
        var major;
        var count;
        var id = 0;
        var length = results.length;

        // iterate through and add a table row for each user (result)
        results.forEach(function(result) {
            index = result[0];
            img = result[1];
            name = result[2];
            major = result[3];
            id = result[4];

            if(id != user.uid) {
                
                html += '<tr class="resultRow">';
                html += '<td class="resultUserImage"><img src="' + img + '"></td>';
                html += '<td class="resultUserName"><a href="view_profile.html" onclick="return saveUserID(\'' + id + '\');"><h2 id="resultUserName' + count + '">' + name + '</h2></a></td>';
                html += '<td class="resultUserMajor"><h3 id="resultUserMajor' + count + '">' + major + '</h3></td>';
                html += '</tr>'

                count++;
            }
            else {
                if(length == 1) {
                    html += '<tr class="resultRow">';
                    html += '<td class="resultUserName"><h2>No Results Found</h2></td>';
                    html += '</tr>'
                }
            }
        });

        html += '</table>'; 

        document.getElementById("searchResults").innerHTML = html;
        $( "#searchResults" ).load( html, function() {
            console.log( "Load was performed." );
        });
    });
}

function saveUserID(userID) {
    sessionStorage.clear();
    sessionStorage.setItem('userID', userID);
    var storageData = sessionStorage.getItem('userID');
    console.log("saved user id ..." + storageData);
    return true;
}

function noResultsFound() {
    var html = '<table id="results">';

    html += '<tr class="resultRow">';
    html += '<td class="resultUserName"><h2>No Results Found</h2></td>';
    html += '</tr>'

    html += '</table>'; 

    document.getElementById("searchResults").innerHTML = html;
        $( "#searchResults" ).load( html, function() {
            console.log( "Load was performed." );
        });

}