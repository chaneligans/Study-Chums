function showPopUp() {
  console.log('Called function showPopUp()');
  // Get the modal
  var chatPopupId = document.getElementById("chatPopupId");
  chatPopupId.style.display = "block";

  // Get the button that opens the modal
  var btn = document.getElementById("newChatButton");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("closeChatPopup")[0];

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    chatPopupId.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == chatPopupId) {
      chatPopupId.style.display = "none";
    }
  }
}

//if user opens existing chatroom
function openChatRoom(roomID) {
  console.log('Clicked on chat room: ', roomID);
    firebase.auth().onAuthStateChanged(user => {
    if (user) {
      const db = firebase.firestore();
      db.collection("Users").doc(user.uid).update({
      currentChatRoom: roomID,
    });
    clearHead();
    displayHeader();
    clearChat();
    loadChatHistory();
    }
  });
}

//if user creates chatroom
function createChatRoom() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      const db = firebase.firestore();
      var topic = document.getElementById("chatTopic").value;

      if (topic === "") {
        alert('Please enter a topic.')
      }
      else {
        var membersString = sessionStorage.getItem('chatMembers');
        var members = membersString.split(',');
        console.log('Printing from createChatRoom(): Members: '+members+'. members.length(): '+members.length);

        if (members.length < 1 || membersString === "") {
          alert('Please select member(s) for your chatroom.');
        }
        else {
          members.push(user.uid);
          db.collection("ChatRooms")
          .add({
              topic: topic
            })
          .then(function(docRef) {
            console.log("ChatRoom created with key --- ", docRef.id);
            const roomID = docRef.id;

            members.forEach(function(result) {
              var member = String(result);
              addUserToChatRoom(member, roomID, topic)
            });

            db.collection("Users").doc(user.uid).update({
              currentChatRoom: roomID,
            });
              chatPopupId.style.display = "none";
          })
          .catch(function(error) {
            console.error("Error writing document: ", error);
          });
        }
      }
    }
  });
}
//if user want to delete the chatroom
function chatOption(){
    
}
function deleteChatRoom(roomID){
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            //read from db with chatroom id
            //move the chatroom in trash catalog
            //remove in the side bar that move chatroomid to trash in user info
        }
    });
}

function addMultipleUsersToChatRoom() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      const db = firebase.firestore();
      let chatroomID;
      let topic;

      db.collection("Users").doc(user.uid)
      .get().then( userDoc => {
        chatroomID = userDoc.val().currentChatRoom;

        db.collection("ChatRooms").doc(chatroomID)
        .get().then( chatroomDoc => {
          topic = chatroomDoc.val().topic;

          let membersString = sessionStorage.getItem('chatMembers');
          let members = membersString.split(',');
          console.log('Printing from addMultipleUsersToChatRoom(): Members: '+members+'. members.length(): '+members.length);
    
          if (members.length < 1 || membersString === "") {
            alert('Please select member(s) for your chatroom.');
          }
          else {
            members.forEach(function(result) {
              var member = String(result);
              addUserToChatRoom(member, chatroomID, topic)
            });
              chatPopupId.style.display = "none";
          }
        });
      });
    }
  });
}

function loadChatRoomSideBar() {
  firebase.auth().onAuthStateChanged(user => {
    const db = firebase.firestore();
    let chatRoomsRef = db.collection("Users").doc(user.uid).collection("ChatRooms");
    chatRoomsRef.get().then(results => {
      results.forEach(result => {
        console.log('Found chatroom with id:', result.id);
        console.log('Topic:', result.data().topic);

        let userList = [];
        let roomID = result.id;
        let topic = result.data().topic;

        db.collection("ChatRooms").doc(roomID).collection("Users")
          .get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              userList.push({
                name: doc.data().name,
                userID: doc.id,
                topic: topic,
                chatroomID: roomID
              });
            });
            Promise.all(userList).then(results => {
              displayChatRooms(results);
            });
          })
          .catch(function(error) {
            console.log("Error getting documents: ", error);
          });
      });
    });
  });
}

function displayChatRooms(userList) {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      console.log("print the users details: ", userList);
      let names = [];
      let displayName;
      let roomID;

      userList.forEach(result => {
        const name = result.name;
        const userid = result.userID;
        const topic = result.topic;
        roomID = result.chatroomID;

        if (user.uid != userid) {
          names.push(name);
        }
      });

      if(names.length > 1){
        displayName = userList[0].topic;
      } else {
        displayName = names[0];
      }

      // console.log("roomID:"+roomID+"//displayName:"+displayName);

      $(document).ready(function () {
        $("#leftSideRooms").append('<li onclick="openChatRoom(\''+roomID+'\')"><div><h2 class = "leftChatName">'+ displayName + '</h2></div></li>');
      });

    }
    else {
      console.log('User is not signed in!');
    }
  });
}

function addUserToChatRoom(friendID, roomID, topic) {
  const db = firebase.firestore();

    db.collection("Users").doc(friendID).get().then(friendResult => {

        const friendName = friendResult.data().name;

        let chatRoomRef = db.collection("ChatRooms").doc(roomID).collection("Users");
        chatRoomRef.doc(friendID).set({
          name: friendName
        });

        let usersRef = db.collection("Users").doc(friendID).collection("ChatRooms");
        usersRef.doc(roomID).set({
          topic: topic
        });
      })
      .catch(function(error) {
        console.error("Error retrieving document: ", error);
      });
}

function displayHeader(){
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            const db = firebase.firestore();
            db.collection("Users").doc(user.uid).get().then(userResult => {
              let roomID = userResult.data().currentChatRoom;

              if(roomID.length > 1) {
                let userLists = [];
                let topic;
                db.collection("ChatRooms").doc(roomID).get().then(result => {
                    topic = result.data().topic;

                  db.collection("ChatRooms").doc(roomID).collection("Users")
                  .get().then(function(querySnapshot) {
                      querySnapshot.forEach(function(doc) {
                          userLists.push({
                              name: doc.data().name,
                              userID: doc.id,
                          });
                      });
                      let names = [];
                      let displayName;
                      userLists.forEach(result => {
                          const name = result.name;
                          const userid = result.userID;
                          if (user.uid != userid) {
                              names.push(name);
                              console.log("print the user Header id: ", userid);
                          }
                      });
                      if(names.length > 1){
                          displayName = topic;
                          var html = '<div><h2 id="chatTitle">' + displayName + '</h2><h3 id="chatTopic">Chums:  '+ names +'</h3><div class = "dropdown"><button id="chatOptions" onclick="myFunction()"><i class="fas fa-ellipsis-h"></i></button><div id="myDropdown" class="dropdown-content"><a href="#delete">Delete Chat</a><a href="#add">Add new Chums</a></div></div></div>';
                          document.getElementById("chatHeader").innerHTML = html;
                          $("#chatHeader").load(html, function() {
                             console.log("Load chatroom was performed.");
                          });
                      }else{
                          displayName = names[0];
                          var html = '<div><h2 id="chatTitle">' + displayName + '</h2><h3 id="chatTopic">Topic:  '+ topic +'</h3><div class = "dropdown"><button id="chatOptions" onclick="myFunction()"><i class="fas fa-ellipsis-h"></i></button><div id="myDropdown" class="dropdown-content"><a href="#delete">Delete Chat</a><a href="#add">Add new Chums</a></div></div></div>';
                          document.getElementById("chatHeader").innerHTML = html;
                          console.log(userLists);
                          $("#chatHeader").load(html, function() {
                            console.log("Load chatroom was performed.");
                          });
                      }
                  });
              });
              }
          });
        }
    });
}
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}
function clearHead() {
  var html="<p></p>";
  document.getElementById("chatHeader").innerHTML = html;
  $("#chatHeader").load(html, function() {
    console.log("Load was performed.");
  });
}

function clearChat() {
  var html="<p></p>";
  document.getElementById("chat").innerHTML = html;
  $("#chat").load(html, function() {
    console.log("Load was performed.");
  });
}

function loadChatHistory() {
  firebase.auth().onAuthStateChanged(user => {
    const db = firebase.firestore();

    db.collection("Users").doc(user.uid).get().then(result => {
      const roomID = result.data().currentChatRoom;

      if(roomID.length > 1) {
        var initial_messages = [];
        var update_messages = [];
        db.collection("ChatRooms").doc(roomID).collection("Messages")
          .orderBy("time")
          .get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              initial_messages.push({
                senderID: doc.data().senderID,
                senderName: doc.data().senderName,
                time: doc.data().time.toDate(),
                message: doc.data().message,
              });
            });

            Promise.all(initial_messages).then(results => {
              console.log("274");
              displayMessages(results);
            });
          })

        db.collection("ChatRooms").doc(roomID).collection("Messages")
          .orderBy("time")
          .onSnapshot(function(querySnapshot) {
          update_messages = [];
            querySnapshot.docChanges().forEach(function(change) {
              if (change.type == "modified") {
                console.log(change.doc.id, " => ", change.doc.data());
                update_messages.push({
                  senderID: change.doc.data().senderID,
                  senderName: change.doc.data().senderName,
                  time: change.doc.data().time.toDate(),
                  message: change.doc.data().message,
                });
              }
            });

            Promise.all(update_messages).then(results => {
              console.log(update_messages.length);
              displayMessages(results);
            });
          })
      }
    });
  });
}

function displayMessages(messages) {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      messages.forEach(result => {
        console.log("Resutltt:" +result);

        const senderID = result.senderID;
        const senderName = " " + result.senderName;
        const time = moment(result.time).format('LLL');
        const message = result.message;

        if (user.uid === senderID) {

          $(document).ready(function() {
            $("#chat").append('<li class="me"><div class="entete"><h3 class="timestamp">' + time + '</h3><h2 class="sender">You</h2></div><div class="message">' + message + '</div></li>');
          });

        } else {
          $(document).ready(function() {
            $("#chat").append('<li class="you"><div class="entete"><h3 class="timestamp">' + time + '</h3>  <h2 class="sender">' + senderName + '</h2></div><div class="message">' + message + '</div></li>');
          });
        }

      })
    } else {
      console.log('User is not signed in!');
    }
  });
}

function sendMessage() {
  const message = document.getElementById("message").value;
  const timestamp = firebase.firestore.FieldValue.serverTimestamp();

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      const db = firebase.firestore();

      db.collection("Users").doc(user.uid).get().then(result => {
        let roomID = result.data().currentChatRoom;

        let userRef = db.collection("ChatRooms").doc(roomID).collection("Users").doc(user.uid)
          .get().then(function(doc) {
            if (doc.exists) {
              let senderName = doc.data().name;
              let roomRef = db.collection("ChatRooms").doc(roomID).collection("Messages")
                .add({
                  senderID: user.uid,
                  senderName: senderName,
                  message: message,
                  time: timestamp,
                })
                .then(function(docRef) {
                  console.log("Document written with ID: ", docRef.id);
                  document.getElementById("message").value = "";
                })
                .catch(function(error) {
                  console.error("Error adding document: ", error);
                });

            } else {
              console.log("User is not stored in chat!");
            }
          }).catch(function(error) {
            console.log("Error getting document:", error);
          });
      });

    } else {
      console.log('User is not signed in!');
    }
  });
}

function setUserData(childSnapshotValue, childKey) {
  var photo = childSnapshotValue.p1Url + " ";
  var data = [childSnapshotValue.index, photo, childSnapshotValue.name, childSnapshotValue.Major, childKey];
  return data;
}

function noChumsFound() {
  var html = '<table class="requests">';
  html += '<tr class="resultRow">';
  html += '<td class="resultUserName"><h2>No Chums Yet!</h2></td>';
  html += '</tr>'
  html += '</table>';

  document.getElementById("searchResults").innerHTML = html;
  $("#searchResults").load(html, function() {
    console.log("Load was performed.");
  });

}

function retrievePopupBoxChums() {
  console.log('Called function retrievePopupBoxChums()');
  sessionStorage.clear(); // using to save chat members
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      let results = [];
      let applicationsRef = firebase.database().ref('Chums/' + user.uid);
      applicationsRef.once("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          let key = childSnapshot.key;
          let userDataRef = firebase.database().ref('Users/' + key);

          let data = userDataRef.once("value").then(function(childSnapshotData) {
            let childData = childSnapshotData.val();
            return setUserData(childData, key);
          });
          results.push(Promise.resolve(data).then(function() {
            return data;
          }))
        });
        Promise.all(results).then(result => {
          console.log('Results found: ' + result.length);
          if (result.length > 0) {
            displayPopupBoxChums(result);
          } else {
            noChumsFound();
          }
        })
      });
    }
  });
}

function displayPopupBoxChums(results) {
  console.log('Called function displayPopupBoxChums()');
  sessionStorage.clear(); // using to save chat members
  var html = '<table class="requests">';
  var index, img, name, major, count, row;
  var id = 0;
  var chums = [];

  results.forEach(function(result) {
    index = result[0];
    img = result[1];
    name = result[2];
    major = result[3];
    id = result[4];
    row = 'row' + id;
    chums.push(row);

    html += '<tr id="' + row + '" class="popupRow" onclick="selectChum(this,\'' + id + '\')">';
    html += '<td class="popupUserImage"><img src="' + img + '"></td>';
    html += '<td class="popupUserName"><<h2 id="popupUserName' + count + '">' + name + '</h2></td>';
    html += '<td class="popupUserMajor"><h3 id="popupUserMajor' + count + '">' + major + '</h3></td>';
    html += '</tr>'

    count++;

  });

  html += '</table>';

  document.getElementById("popupResults").innerHTML = html;
  $("#popupResults").load(html, function() {
    console.log("Load was performed.");
  });

}

function selectChum(row, id) {
  console.log('clicked chum ' + id);
  var members = sessionStorage.getItem('chatMembers');
  if (members == null || members === false) {
    members = [];
    console.log('members is null');
  }
  try {
    var index = members.indexOf(id);
    if (index > -1) {
      row.style.backgroundColor = '#FFF';
      members.splice(index, 1);
    } else {
      members.push(id);
      row.style.backgroundColor = '#E1E3E8';
    }
  } catch (TypeError) {
    members = members.split(',');
    var index = members.indexOf(id);
    if (index > -1) {
      row.style.backgroundColor = '#FFF';
      members.splice(index, 1);
    } else {
      members.push(id);
      row.style.backgroundColor = '#E1E3E8';
    }
  }
  sessionStorage.setItem('chatMembers', members);
  console.log('Printing from selectChum(): Members:', members);
  return members
}