function setUserData(childSnapshotValue, childKey) {
    var photo = childSnapshotValue.p1Url + " ";
    var data = [childSnapshotValue.index, photo, childSnapshotValue.name, childSnapshotValue.Major, childKey];
    return data;
}

function retrieveReceivedRequests(){
    firebase.auth().onAuthStateChanged(function(user) {
        if(user) {
            var results = [];
            var applicationsRef = firebase.database().ref('Applications/' + user.uid + '/Received/');
            applicationsRef.once("value", function(snapshot){                
                    var data;
                    snapshot.forEach(function(childSnapshot) {
                        var key = childSnapshot.key;
                        var userDataRef = firebase.database().ref('Users/' + key);

                        var data = userDataRef.once("value").then(function(childSnapshotData){
                            var name = childSnapshotData.val().name;
                            childData = childSnapshotData.val();
                            return setUserData(childData, key);

                        });
                        results.push(Promise.resolve(data).then( function() {
                            return data;
                        }))
                    });
                    Promise.all(results).then(result => {
                        console.log('Results found: ' + result.length);
                        if (result.length > 0) {     
                            displayReceivedRequests(result);
                        }
                        else {
                            noRequestsFound();
                        }
                    })
                });
            }
        
    });
}

function retrieveSentRequests() {
    firebase.auth().onAuthStateChanged(function(user) {
        if(user) {
            var results = [];
            var applicationsRef = firebase.database().ref('Applications/' + user.uid + '/Sent/');
            applicationsRef.once("value", function(snapshot){                
                    var data;
                    snapshot.forEach(function(childSnapshot) {
                        var key = childSnapshot.key;
                        var userDataRef = firebase.database().ref('Users/' + key);

                        var data = userDataRef.once("value").then(function(childSnapshotData){
                            var name = childSnapshotData.val().name;
                            childData = childSnapshotData.val();
                            return setUserData(childData, key);

                        });
                        results.push(Promise.resolve(data).then( function() {
                            return data;
                        }))
                    });
                    Promise.all(results).then(result => {
                        console.log('Results found: ' + result.length);
                        if (result.length > 0) {     
                            displaySentRequests(result);
                        }
                        else {
                            noRequestsFound();
                        }
                    })
                });
            }
        
    });
}

function displayReceivedRequests(results) {
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
        
        html += '<td class= "resultIcons"><p id="acceptIcon' + id + '"><a onclick="acceptRequest(\'' + id + '\');"><i class="fas fa-user-check fa-2x"></i></a></p></td>';
        html += '<td class= "resultIcons"><p id="rejectIcon' + id + '"><a onclick="rejectRequest(\'' + id + '\');"><i class="fas fa-trash-alt fa-2x"></i></a></p></td>';
        html += '</tr>'
    
        count++;
    });

    html += '</table>'; 

    document.getElementById("searchResults").innerHTML = html;
    $( "#searchResults" ).load( html, function() {
        console.log( "Load was performed." );
    });
}

function displaySentRequests(result) {
    
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

            document.getElementById('acceptIcon' + acceptID).innerHTML = "Accepted!";
            console.log(acceptID);

        }
        else {
            console.log('Something went wrong!');
        }
    });
}

function rejectRequest(rejectID) {
    var status = "Rejected"
    firebase.auth().onAuthStateChanged(function(user) {
        if(user) {
            var userID = user.uid;
            
            var userRef = firebase.database().ref('Applications/' + userID + '/Recieved/');
            userRef.child(rejectID).remove().then(function() {
                console.log("Remove succeeded.")
              })
              .catch(function(error) {
                console.log("Remove failed: " + error.message)
              });

            var senderRef = firebase.database().ref('Applications/' + rejectID + '/Sent/');
            senderRef.child(userID).remove().then(function() {
                console.log("Remove succeeded.")
              })
              .catch(function(error) {
                console.log("Remove failed: " + error.message)
              });

              document.getElementById('rejectIcon' + rejectID).innerHTML = "Rejected!";
        }
        else {
            console.log('Something went wrong!');
        }
    });
}


