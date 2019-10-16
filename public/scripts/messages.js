$(function enter() {
  let enter = document.getElementById("message");
  enter.addEventListener("keyup", function(event) {
    if (event.keyCode === 27) {
      clearTextBox();
    }
    else if (event.keyCode === 13){
      sendMessage();
    }
  });
});

function clearTextBox() {
  let enter = document.getElementById("message");
  enter.value = "";
}

function scrollToBottom() {
  $('#chat').scrollTop($('#chat')[0].scrollHeight - $('#chat')[0].clientHeight);
  console.log("Scrolled");
}

function showCreateChatPopup() {
  console.log('Called function showPopUp()');
  // Get the modal
  let chatPopupId = document.getElementById("createChatPopup");
  chatPopupId.style.display = "block";

  // Get the button that opens the modal
  let btn = document.getElementById("openCreateChatPopup");

  // Get the <span> element that closes the modal
  let span = document.getElementById("closeCreateChatPopup");

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
    clearTextBox();
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
      let topic = document.getElementById("chatTopic").value;

      if (topic === "") {
        alert('Please enter a topic.')
      }
      else {
        let membersString = sessionStorage.getItem('chatMembers');
        let members = membersString.split(',');
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
              let member = String(result);
              addUserToChatRoom(member, roomID, topic)
            });

            db.collection("Users").doc(user.uid).update({
              currentChatRoom: roomID,
            }).then(function() {
              reloadChatRoomSideBar();
            });

            let chatPopupId = document.getElementById("createChatPopup");
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
function deleteChatRoom(){
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // move the chatroom in trash catalog

            // reload chatroom sidebar
            const db = firebase.firestore();
//            const FieldValue = require('firebase-admin').firestore.FieldValue
            let userLists = [];
            let roomID;
            db.collection("Users").doc(user.uid).get().then(userResult => {
              // read from db with user's current chatroom id
              roomID = userResult.data().currentChatRoom;
                //need to change currentRoomID IMPORANT!!!!
              console.log("Delete ----roomID ", roomID);
              //userID and name stored
              if(roomID.length > 1) {

                db.collection("ChatRooms").doc(roomID).collection("Users")
                  .get().then(function(querySnapshot) {
                      querySnapshot.forEach(function(doc) {
                          // get users from chatroom collection.
                          userLists.push({
                              name: doc.data().name,
                              userID: doc.id,
                          });
                      });
                    //then delete the chatroom from all users' collection
                      Promise.all(userLists).then(results => {
                        results.forEach(item => {
                            console.log("sdbsbcwbwdbwegbdvwgedvegwvdgvd", item.userID);
                            
                            db.collection("Trash").doc(roomID).collection("Users")
                                .doc(item.userID).set({
                                    name: item.name,
                            });
                            //delete each user's chatroom.roomid
                    //need to delete the subfiled first
//                        let roomRef = db.collection("User").doc(item.userID).collection("ChatRooms").doc(roomID);
//                        let removeTopic = roomRef.update({
//                            topic: firebase.firestore.FieldValue.delete()
//                        });
//                        console.log("Delete ----user topic ");
//                    //and then delete roomid
//                        let deleteRoomid = roomRef.delete();
//                        console.log("Delete ----user chat room ");
                        });
                     });
                  });
                console.log("Delete ----UserList ", userLists);
////                console.log("Delete ----user list0.userID ", userLists[0].name);
//                //then delete the chatroom from all users' collection
//                for(let i = 0; i < userLists.length; i++){
//                    //delete each user's chatroom.roomid
//                    //need to delete the subfiled first
//                    let roomRef = db.collection("User").doc(userLists[i].userID).collection("ChatRooms").doc(roomID);
//                    let removeTopic = roomRef.update({
//                        topic: firebase.firestore.FieldValue.delete()
//                        });
//                    console.log("Delete ----user topic ");
//                    //and then delete roomid
//                    let deleteRoomid = roomRef.delete();
//                    console.log("Delete ----user chat room ");
//                }
                  
              }
                // move the chatroom in trash catalog
            //Get the document from fromPath location.
            let messageList = [];
            console.log("Delete ---- testdhsjbdsbdj ", roomID);

            db.collection("ChatRooms").doc(roomID).collection("Messages")
                .orderBy("time")
                .get().then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        messageList.push({
                            MessageID: doc.id,
                            senderID: doc.data().senderID,
                            senderName: doc.data().senderName,
                            time: doc.data().time.toDate(),
                            message: doc.data().message,
                        });
                    });
                
                    Promise.all(messageList).then(results => {
                        results.forEach(item => {
                            console.log("adding message list to trash", item.MessageID);
                            console.log("adding sendName list to trash", item.senderName); db.collection("Trash").doc(roomID).collection("Messages")
                            .doc(item.MessageID).set({
                                senderID: item.senderID,
                                senderName: item.senderName,
                                message: item.message,
                                time: item.time,
                            });
                        });
                     });
            });
            console.log("Delete ----get messageLists ", messageList);
                //get the topic of chat room
            let topic;
            db.collection("ChatRooms").doc(roomID)
                .get().then( roomDoc => {
                    topic = roomDoc.data().topic;
                console.log("Delete ----get topic chatroom ", topic);
            //Write the document to toPath location. AND  Delete the document from fromPath location.
                
//                //add roomID in trash collection
//                let trashRef = db.collection("Trash").add(roomID);
                //add topic in roomID
                db.collection("Trash").doc(roomID).set({
                    topic: topic,
                })
                console.log("Delete ----add trash topic ");
                //delete the topic in chatroom
                
//            db.collection("ChatRooms").doc(roomID).update({
//                    topic: firebase.firestore.FieldValue.delete()
//            })
//            console.log("Delete ----delete chatroom topic ");
            });
                    //delete message list in chatroom
//                db.collection("ChatRooms").doc(roomID).collection("Messages").doc(messageList[i].MessageID).update({
//                        message: firebase.firestore.FieldValue.delete(),
//                        senderID: firebase.firestore.FieldValue.delete(),
//                        senderName: firebase.firestore.FieldValue.delete(),
//                        time: firebase.firestore.FieldValue.delete()
//                });
//                console.log("Delete ----delete chatroom messages "); db.collection("ChatRooms").doc(roomID).collection("Messages").doc(messageList[i].MessageID).delete();
//                console.log("Delete ----delete chatroom message id ");
            
                //test
//            db.collection("ChatRooms").doc(roomID).collection("Messages").delete();
//            console.log("Delete ----delete chatroom message collection ");
                //add userList
            for(let i = 0; i<userLists.length; i++){
                db.collection("Trash").doc(roomID).collection("Users")
                    .doc(userLists[i].userID).set({
                        name: userLists[i].name,
                    });
                console.log("Delete ----add trash users ");
                    //delete Userlist in chatroom
//                db.collection("ChatRooms").doc(roomID).collection("Users").doc(userLists[i].userID).update({
//                        name: firebase.firestore.FieldValue.delete()
//                });
//                console.log("Delete ----delete chatroom users name "); db.collection("ChatRooms").doc(roomID).collection("Users").doc(userLists[i].userID).delete();
//                console.log("Delete ----delete chatroom userid ");
            }
                //test
//            db.collection("ChatRooms").doc(roomID).collection("Users").delete();
//            console.log("Delete ----delete chatroom user collection ");
//                
//            //Delete the document from fromPath location.
//            db.collection("ChatRooms").doc(roomID).delete();
//            onsole.log("Delete ----delete chatroom roomID ");
//            
//            //reload message page
//            onsole.log("reload chatroom bar and message, currentChatroom should be null");
//            openChatRoom(null);
                
            });
            reloadChatRoomSideBar();
        }
    });
}

function showAddFriendToChatPopup() {
  console.log('Called function showAddFriendToChatPopup()');

  // Get the modal
  let chatPopupId = document.getElementById("addFriendToChatPopup");
  chatPopupId.style.display = "block";

  // Get the <span> element that closes the modal
  let span = document.getElementById("closeAddFriendToChatPopup");

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

function addMultipleUsersToChatRoom() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      const db = firebase.firestore();
      let chatroomID;
      let topic;

      db.collection("Users").doc(user.uid)
      .get().then( userDoc => {
        chatroomID = userDoc.data().currentChatRoom;

        db.collection("ChatRooms").doc(chatroomID)
        .get().then( chatroomDoc => {
          topic = chatroomDoc.data().topic;

          let membersString = sessionStorage.getItem('chatMembers');
          let members = membersString.split(',');
          console.log('Printing from addMultipleUsersToChatRoom(): Members: '+members+'. members.length(): '+members.length);

          if (members.length < 1 || membersString === "") {
            alert('Please select member(s) for your chatroom.');
          }
          else {
            members.forEach(function(result) {
              let member = String(result);
              addUserToChatRoom(member, chatroomID, topic)
            });
            let chatPopupId = document.getElementById("addFriendToChatPopup");
            chatPopupId.style.display = "none";

            displayHeader();
          }
        });
      });
    }
  });
}

// empties the side bar of the current list and loads the side bar again
// this is the last thing to do in the process of:
// - making a new chatroom
// - deleting a chatroom
function reloadChatRoomSideBar() {
  // clear current chat room side bar
  $('#leftSideRooms').empty();
  loadChatRoomSideBar();
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
                          var html = '<div><h2 id="chatTitle">' + displayName + '</h2><h3 id="chatTopic">Chums:  '+ names +'</h3><div class = "dropdown"><button id="chatOptions" onclick="myFunction()"><i class="fas fa-ellipsis-h"></i></button><div id="myDropdown" class="dropdown-content"><a onclick="deleteChatRoom();" href="#delete">Delete Chat</a><a onclick="showAddFriendToChatPopup();" href="#add">Add new Chums</a></div></div></div>';
                          document.getElementById("chatHeader").innerHTML = html;
                          $("#chatHeader").load(html, function() {
                             console.log("Load chatroom was performed.");
                          });
                      }else{
                          displayName = names[0];
                          var html = '<div><h2 id="chatTitle">' + displayName + '</h2><h3 id="chatTopic">Topic:  '+ topic +'</h3><div class = "dropdown"><button id="chatOptions" onclick="myFunction()"><i class="fas fa-ellipsis-h"></i></button><div id="myDropdown" class="dropdown-content"><a onclick="deleteChatRoom();" href="#delete">Delete Chat</a><a onclick="showAddFriendToChatPopup();" href="#add">Add new Chums</a></div></div></div>';
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
            scrollToBottom();
          });

        } else {
          $(document).ready(function() {
            $("#chat").append('<li class="you"><div class="entete"><h3 class="timestamp">' + time + '</h3>  <h2 class="sender">' + senderName + '</h2></div><div class="message">' + message + '</div></li>');
            scrollToBottom();
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

function retrievePopupBoxChums(htmlID) {
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
            displayPopupBoxChums(result, htmlID);
          } else {
            noChumsFound();
          }
        })
      });
    }
  });
}

function displayPopupBoxChums(results, htmlID) {
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

  document.getElementById(htmlID).innerHTML = html;
  $(htmlID).load(html, function() {
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

  // console.log(members);
  if (members[0] === "") {
    members.shift();
    // console.log('members:', members);
  }

  sessionStorage.setItem('chatMembers', members);
  console.log('Printing from selectChum(): Members:', members);
  return members
}