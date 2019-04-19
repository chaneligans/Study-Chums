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
        html += '<td class="resultUserName"><a href="view_profile.html" onclick="return saveUserID(\'' + id + '\');"><h2 id="resultUserName' + count + '">' + name + '<br /></h2><h4>' + major + '</h4></a></td>';
        // html += '<td class="resultUserMajor"><h3 id="resultUserMajor' + count + '">' + major + '</h3></td>';
        html += '<td class= "resultIcons" id="acceptIcon"><a onclick="acceptRequest(\'' + id + '\');"><i class="fas fa-user-check fa-2x"></i></a></td>';
        html += '<td class= "resultIcons" id="rejectIcon"><a onclick="rejectRequest(\'' + id + '\');"><i class="fas fa-trash-alt fa-2x"></i></a></td>';
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

function acceptRequest(acceptID) {
    var status = "Accepted"
    firebase.auth().onAuthStateChanged(function(user) {
        if(user) {
            var userID = user.uid;
            
            var userRef = firebase.database().ref('Applications/' + userID + '/Recieved/');
            userRef.child(acceptID).remove().then(function() {
                console.log("Remove succeeded.")
              })
              .catch(function(error) {
                console.log("Remove failed: " + error.message)
              });

            var senderRef = firebase.database().ref('Applications/' + acceptID + '/Sent/');
            senderRef.child(userID).remove().then(function() {
                console.log("Remove succeeded.")
              })
              .catch(function(error) {
                console.log("Remove failed: " + error.message)
              });

            var chums = "Friends";
            firebase.database().ref('Chums/' + userID + '/' + acceptID + '/').set({
                status: chums
            }, function(error) {
                if (error) {
                  console.log("Update to Chum List failed");
                } else {
                  console.log("Update to Chum List failed");
                }
            });

            firebase.database().ref('Chums/' + acceptID + '/' + userID + '/').set({
                status: chums
            }, function(error) {
                if (error) {
                  console.log("Update to Chum List failed");
                } else {
                  console.log("Update to Chum List failed");
                }
            });

            // document.getElementById("acceptIcon").value = "Accepted!";

        }
        else {
            console.log('Something went wrong!');
        }
    });
}

function rejectRequest() {
    var status = "Rejected"
    firebase.auth().onAuthStateChanged(function(user) {
        if(user) {
            var userID = user.uid;
            
            var userRef = firebase.database().ref('Applications/' + userID + '/Recieved/');
            userRef.child(acceptID).remove().then(function() {
                console.log("Remove succeeded.")
              })
              .catch(function(error) {
                console.log("Remove failed: " + error.message)
              });

            var senderRef = firebase.database().ref('Applications/' + acceptID + '/Sent/');
            senderRef.child(userID).remove().then(function() {
                console.log("Remove succeeded.")
              })
              .catch(function(error) {
                console.log("Remove failed: " + error.message)
              });
        }
        else {
            console.log('Something went wrong!');
        }
    });
}


