function setUserData(childSnapshotValue, childKey) {
    var photo = childSnapshotValue.p1Url + " ";
    var data = [childSnapshotValue.index, photo, childSnapshotValue.name, childSnapshotValue.Major, childKey];
    return data;
}

function retrieveRequests(){
    firebase.auth().onAuthStateChanged(function(user) {
        if(user) {
            var results = [];
            var applicationsRef = firebase.database().ref('Applications/' + user.uid + '/Received/');
            applicationsRef.once("value", function(snapshot){                
                    var data;
                    snapshot.forEach(function(childSnapshot) {
                        var key = childSnapshot.key;
                        console.log(key);
                        var userDataRef = firebase.database().ref('Users/' + key);

                        var data = userDataRef.once("value").then(function(childSnapshotData){
                            console.log("hi");
                            var name = childSnapshotData.val().name;
                            childData = childSnapshotData.val();
                            return setUserData(childData, key);

                        });
                        results.push(Promise.resolve(data).then( function() {
                            console.log(data);
                            return data;
                        }))
                    });
                    Promise.all(results).then(result => {
                        console.log('Results found: ' + result.length);
                        console.log(result);
                        if (result.length > 0) {     
                        displayRequests(result);
                        }
                        else {
                            noRequestsFound();
                        }
                    })
                });
            }
        
    });
}

function displayRequests(results) {
    var html = '<table id="results">';
    var index;
    var img;
    var name;
    var major;
    var count;
    var id = 0;

    results.forEach(function(result) {
        index = result[0];
        img = result[1];
        name = result[2];
        major = result[3];
        id = result[4];

        html += '<tr class="resultRow">';
        html += '<td class="resultUserImage"><img src="' + img + '"></td>';
        html += '<td class="resultUserName"><a href="view_profile.html" onclick="return saveUserID(\'' + id + '\');"><h2 id="resultUserName' + count + '">' + name + '</h2></a></td>';
        html += '<td class="resultUserMajor"><h3 id="resultUserMajor' + count + '">' + major + '</h3></td>';
        html += '</tr>'
    
        count++;
    });

    html += '</table>'; 

    document.getElementById("searchResults").innerHTML = html;
    $( "#searchResults" ).load( html, function() {
        console.log( "Load was performed." );
    });
}

function saveUserID(userID) {
    sessionStorage.clear();
    sessionStorage.setItem('userID', userID);
    var storageData = sessionStorage.getItem('userID');
    console.log("saved user id ..." + storageData);
    return true;
}

function noRequestsFound() {
    var html = '<table id="results">';

    html += '<tr class="resultRow">';
    html += '<td class="resultUserName"><h2>No Chum Requests Yet!</h2></td>';
    html += '</tr>'

    html += '</table>'; 

    document.getElementById("searchResults").innerHTML = html;
        $( "#searchResults" ).load( html, function() {
            console.log( "Load was performed." );
        });

}


