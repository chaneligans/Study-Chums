$(function enter() {
  let enter = document.getElementById("message");
  enter.addEventListener("keyup", function (event) {
    if (event.keyCode === 27) {
      clearTextBox();
    } else if (event.keyCode === 13) {
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
  span.onclick = function () {
    chatPopupId.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == chatPopupId) {
      chatPopupId.style.display = "none";
    }
  }
}

//if user opens existing chatroom
function openChatRoom(roomID) {
  // console.log('Clicked on chat room: ', roomID);
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      const db = firebase.firestore();
      db.collection("Users").doc(user.uid).update({
        currentChatRoom: roomID,
      });
      clearTextBox();
      reloadHeader();
      reloadChatHistory();
    }
  });
}

//if user creates chatroom
function createChatRoom() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      const db = firebase.firestore();
      let topic = document.getElementById("chatTopicIn").value;

      if (topic === "") {
        alert('Please enter a topic.')
      } else {
        let membersString = sessionStorage.getItem('chatMembers');
        let members = membersString.split(',');

        if (members.length < 1 || membersString === "") {
          alert('Please select member(s) for your chatroom.');
        } else {
          members.push(user.uid);
          // console.log('Printing from createChatRoom(): Members: '
          //           + members + '. members.length(): ' + members.length);
          db.collection("ChatRooms")
          .add({
            topic: topic
          })
          .then(function (docRef) {
            // console.log("ChatRoom created with key --- ", docRef.id);
            let roomID = docRef.id;

            members.forEach(function (result) {
              let member = String(result);
              addUserToChatRoom(member, roomID, topic)
            });

            db.collection("Users").doc(user.uid).update({
              currentChatRoom: roomID,
            }).then(function () {
              openChatRoom(roomID);
            });

            let chatPopupId = document.getElementById("createChatPopup");
            chatPopupId.style.display = "none";
          })
          .catch(function (error) {
            console.error("Error writing document: ", error);
          });
        }
      }
    }
  });
}

// Samantha's new delete function
function deleteChat() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      const db = firebase.firestore();

      // get room id to delete from user's currentChatRoom
      db.collection("Users").doc(user.uid).get().then(userResult => {
        const roomID = userResult.data().currentChatRoom;
        // console.log("Delete --- room id: ", roomID);

        // get chatroom topic
        const chatroomRef = db.collection("ChatRooms").doc(roomID);
        chatroomRef.get().then(chatResult => {
          let topic = chatResult.data().topic;

          //create Trash document
          db.collection("Trash")
          .add({
            topic: topic
          })
          .then(function (docRef) {
            // console.log("Trash document created with key --- ", docRef.id);
            let trashID = docRef.id;

            //get all users in chatroom
            let users = [];
            chatroomRef.collection("Users").get().then(allUsers => {
              allUsers.forEach(doc => {
                users.push({
                  name: doc.data().name,
                  userID: doc.id,
                });
              });
              Promise.all(users).then(allUserList => {
                allUserList.forEach(user => {
                  addUserToTrash(user.userID, user.name, trashID);
                  deleteChatRoomFromUser(user.userID, roomID);

                  //delete user doc from ChatRooms/Users
                  chatroomRef.collection("Users").doc(user.userID)
                  .delete().then(function() {
                    console.log("User document successfully deleted from ChatRoom/Users!");
                  }).catch(function(error) {
                    console.error("Error removing document from ChatRoom/Users! ", error);
                  });
                })

                moveMessageToTrash(roomID, trashID);
                deleteChatRoomData(roomID);

                clearOut();
              });
            });
          });
        });
      });
    }
    else {
      console.log('No user signed in!')
    }
  });
}

function addUserToTrash(userID, name, trashID) {
  const db = firebase.firestore();
  db.collection("Trash").doc(trashID).collection("Users").doc(userID)
  .set({
    name: name
  });
}

function deleteChatRoomFromUser(userID, roomID) {
  // if currentChatRoom is roomID, we need to update it to empty
  const db = firebase.firestore();
  let userData = db.collection("Users").doc(userID);
  userData.get().then(userResult => {
    const currentChatRoom = userResult.data().currentChatRoom;

    if(currentChatRoom == roomID) {
      userData.set({
        currentChatRoom: " ",
      });
    }
  });

  userData.collection("ChatRooms").doc(roomID).delete().then(function() {
    console.log("ChatRoom document successfully deleted from Users/ChatRooms!");
  }).catch(function(error) {
    console.error("Error removing ChatRoom document from Users/ChatRooms: ", error);
  });
}

function deleteChatRoomData(roomID) {
  const db = firebase.firestore();
  db.collection("ChatRooms").doc(roomID).delete().then(function() {
    console.log("ChatRoom document successfully deleted from ChatRooms!");
  }).catch(function(error) {
    console.error("Error removing ChatRoom document from ChatRooms: ", error);
  });
}

function moveMessageToTrash(roomID, trashID) {
  const db = firebase.firestore();
  let allMessages = [];
  let messageRef = db.collection("ChatRooms").doc(roomID).collection("Messages");
  messageRef.get().then(messages => {
    messages.forEach(message => {
      allMessages.push({
        messageID: message.id,
      });
    });

    Promise.all(allMessages).then(allMessageList => {
      allMessageList.forEach(message => {
        messageRef.doc(message.messageID).delete().then(function() {
          console.log("Message document successfully deleted from ChatRooms/Messages!");
        }).catch(function(error) {
          console.error("Error removing Message document from ChatRooms/Messages: ", error);
        });
      });
    });
  })
}

function showAddFriendToChatPopup() {
  console.log('Called function showAddFriendToChatPopup()');

  // Get the modal
  let chatPopupId = document.getElementById("addFriendToChatPopup");
  chatPopupId.style.display = "block";

  // Get the <span> element that closes the modal
  let span = document.getElementById("closeAddFriendToChatPopup");

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    chatPopupId.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == chatPopupId) {
      chatPopupId.style.display = "none";
    }
  }
}

function addMultipleUsersToChatRoom() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      const db = firebase.firestore();
      let chatroomID, topic;

      db.collection("Users").doc(user.uid)
      .get().then(userDoc => {
        chatroomID = userDoc.data().currentChatRoom;

        db.collection("ChatRooms").doc(chatroomID)
        .get().then(chatroomDoc => {
          topic = chatroomDoc.data().topic;

          let membersString = sessionStorage.getItem('chatMembers');
          let members = membersString.split(',');
          // console.log('Printing from addMultipleUsersToChatRoom(): Members: '
          //         + members + '. members.length(): ' + members.length);

          if (members.length < 1 || membersString === "") {
            alert('Please select member(s) for your chatroom.');
          } else {
            members.forEach(function (result) {
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

function reloadChatRoomSideBar() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {

      const db = firebase.firestore();
      let chatRoomData = [];

      let reloadSideBar = db.collection("Users").doc(user.uid).collection("ChatRooms")
      .onSnapshot(function(snapshot) {
        snapshot.docChanges().forEach(function(change) {
          if (change.type === "added") {

            let chatroomDoc = change.doc;
            let roomID = change.doc.id;
            let topic = change.doc.data().topic;
            let userList = [];

            db.collection("ChatRooms").doc(roomID).collection("Users")
            .get().then(function(querySnapshot) {
              querySnapshot.forEach(function (doc) {
                userList.push({
                  name: doc.data().name,
                  userID: doc.id,
                  topic: topic,
                  chatroomID: roomID
                });
              });
              Promise.all(userList).then(userResults => {
                displayChatRoom(userResults);
              });

            })
            .catch(function (error) {
              console.log("Error getting documents: ", error);
            });
          }
        });

      });
    }
  });

}

function displayChatRoom(userList) {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      let names = [];
      let displayName, roomID;

      userList.forEach(result => {
        let name = result.name;
        let userID = result.userID;
        let topic = result.topic;
        roomID = result.chatroomID;

        if (user.uid != userID) {
          names.push(name);
        }
      });

      if (names.length > 1) {
        displayName = userList[0].topic;
      } else {
        displayName = names[0];
      }

      $(document).ready(function () {
        $("#leftSideRooms").append(
          '<li onclick="openChatRoom(\'' + roomID
          + '\')"><div><h2 class = "leftChatName">'
          + displayName + '</h2></div></li>');
      });
      console.log('displayChatRoom() was properly called');
      // console.log('userlist:', userList);

    } else {
      console.log('User is not signed in!');
    }
  });
}

function addUserToChatRoom(friendID, roomID, topic) {
  const db = firebase.firestore();

  db.collection("Users").doc(friendID).get().then(friendResult => {

    let friendName = friendResult.data().name;
    let chatRoomRef = db.collection("ChatRooms").doc(roomID).collection("Users");
    chatRoomRef.doc(friendID).set({
      name: friendName
    })
    .catch(function (error) {
      console.error("Error writing to chatrooms: ", error);
    });

    let usersRef = db.collection("Users").doc(friendID).collection("ChatRooms");
    usersRef.doc(roomID).set({
      topic: topic
    })
    .catch(function (error) {
      console.error("Error writing to users: ", error);
    });
  })
  .catch(function (error) {
    console.error("Error retrieving document: ", error);
  });
}

function displayHeader() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      const db = firebase.firestore();
      db.collection("Users").doc(user.uid).get().then(userResult => {
        let roomID = userResult.data().currentChatRoom;

        if (roomID.length > 2) {
          console.log("Valid currentChatRoom Id!");
          let userLists = [];
          let topic;
          db.collection("ChatRooms").doc(roomID).get().then(result => {
            topic = result.data().topic;

            db.collection("ChatRooms").doc(roomID).collection("Users")
            .get().then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                userLists.push({
                  name: doc.data().name,
                  userID: doc.id,
                });
              });
              let names = [];
              let ids = []
              let userImg; 
              let displayName;
              userLists.forEach(result => {
                const name = result.name;
                const userid = result.userID;
                if (user.uid != userid) {
                  names.push(name);
                  ids.push(userid);
                }
              });
              if (names.length > 1) {
                let loadImg = new Promise((resolve, reject) => {
                  let genericGroupIcon = "https://firebasestorage.googleapis.com/v0/b/study-chums.appspot.com/o/img%2Fgroup.png?alt=media&token=49c3242c-4aec-4a70-8195-04963bf5bed5";
                  let icon;
                  let chatDataRef = db.collection("ChatRooms").doc(roomID).get().then(doc => {
                    if (!doc.exists) {
                      console.log('No such document!');
                      icon = genericGroupIcon;
                      reject(icon);
                    } else {
                      if (doc.data().icon === undefined) {
                        icon = genericGroupIcon;
                      }
                      else {
                        icon = doc.data().icon;
                      }
                      resolve(icon);
                    }
                  }).catch(err => {
                    console.log('Error getting document', err);
                    icon = genericGroupIcon;
                    reject(icon);
                  });
                });
                
                loadImg.then((result) => {
                  $("#chatHeader").load("../loaded/message_header.html", function () {
                    $('#chatImage').html('<img class="chatImage" src="' + result + '" alt="' + names + '">');
                    $('#chatTitle').html('<h2 id="chatTitle">' + topic + '</h2>');
                    $('#chatTopic').html('<h3 id="chatTopic">Chums:  ' + names + '</h3>');
                    console.log("Load header (multi) was performed.");
                  });
                });
              } else {
                let loadImg = new Promise((resolve, reject) => {
                  let userDataRef = firebase.database().ref("Users/" + ids[0]);
                  userDataRef.once("value", function(snapshot) {
                    resolve(snapshot.val().p1Url);
                  });
                });
                loadImg.then((result) => {
                  $("#chatHeader").load("../loaded/message_header.html", function () {
                    $('#chatImage').html('<img class="chatImage" src="' + result + '" alt="' + names[0] + '">');
                    $('#chatTitle').html('<h2 id="chatTitle">' + names[0] + '</h2>');
                    $('#chatTopic').html('<h3 id="chatTopic">Topic:  ' + topic + '</h3>');
                    console.log("Load header (single) was performed.");
                  });
                });
              }
            });
          });
        }
      });
    }
  });
}

function toggleChatOptions() {
  document.getElementById("chatOptionsDropdown").classList.toggle("show");
}

function clearOut() {
  clear_("Header");
  clear_("Chat");
}

function clear_(clear_type) {
  let j_query = (clear_type === 'Header') ? "#chat"+clear_type : "#chat";
  $(j_query).load("../loaded/empty.html", function() {
    console.log("Load for clear_("+clear_type+") was performed.");
  });
}

function reloadHeader() {
  clear_("Header");
  displayHeader();
}

function reloadChatHistory() {
  clear_("Chat");
  loadChatHistory();
}

function loadChatHistory() {
  firebase.auth().onAuthStateChanged(user => {
    const db = firebase.firestore();

    db.collection("Users").doc(user.uid).get().then(result => {
      let roomID = result.data().currentChatRoom;

      if (roomID.length > 1) {
        let initial_messages = [];
        let update_messages = [];
        db.collection("ChatRooms").doc(roomID).collection("Messages")
        .orderBy("time")
        .get().then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            initial_messages.push({
              senderID: doc.data().senderID,
              senderName: doc.data().senderName,
              // time: doc.data().time.toDate(),
              time: firebase.firestore.FieldValue.serverTimestamp(),
              message: doc.data().message,
            });
          });
        });

        db.collection("ChatRooms").doc(roomID).collection("Messages")
        .orderBy("time")
        .onSnapshot(function (querySnapshot) {
          update_messages = [];
          querySnapshot.docChanges().forEach(function (change) {
            // console.log(change);

            let timestamp = change.doc.data().time;
            if (timestamp === null) {
              timestamp = firebase.firestore.FieldValue.serverTimestamp();
            }

            if (change.type === "modified") {
              // console.log(change.doc.id, " => ", change.doc.data());
              update_messages.push({
                senderID: change.doc.data().senderID,
                senderName: change.doc.data().senderName,
                time: timestamp.toDate(),
                message: change.doc.data().message,
              });
            } else if (change.type === "added") {
              // console.log(change.doc.id, " ++ ", change.doc.data());
              update_messages.push({
                senderID: change.doc.data().senderID,
                senderName: change.doc.data().senderName,
                time: timestamp.toDate(),
                message: change.doc.data().message,
              });
            }
          });

          Promise.all(update_messages).then(results => {
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
        const senderID = result.senderID;
        const senderName = " " + result.senderName;
        const time = moment(result.time).format('LLL');
        const message = result.message;

        if (user.uid === senderID) {
          $(document).ready(function () {
            $("#chat").append(
              '<li class="me"><div class="entete"><h3 class="timestamp">'+time
              + '</h3><h2 class="sender">You</h2></div><div class="message">'
              + message + '</div></li>');
            scrollToBottom();
          });
        } else {
          $(document).ready(function () {
            $("#chat").append(
              '<li class="you"><div class="entete"><h3 class="timestamp">'+time
              + '</h3>  <h2 class="sender">' + senderName
              + '</h2></div><div class="message">' + message + '</div></li>');
            scrollToBottom();
          });
        }
      });
      console.log('All messages are displayed.');
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
        .get().then(function (doc) {
          if (doc.exists) {
            let senderName = doc.data().name;
            let roomRef = db.collection("ChatRooms").doc(roomID).collection("Messages")
            .add({
              senderID: user.uid,
              senderName: senderName,
              message: message,
              time: timestamp,
            })
            .then(function (docRef) {
              // console.log("Document written with ID: ", docRef.id);
              document.getElementById("message").value = "";
            })
            .catch(function (error) {
              console.error("Error adding document: ", error);
            });
          } else {
            console.log("User is not stored in chat!");
          }
        }).catch(function (error) {
          console.log("Error getting document:", error);
        });
      });
    } else {
      console.log('User is not signed in!');
    }
  });
}

function setUserData(childSnapshotValue, childKey) {
  let photo = childSnapshotValue.p1Url + " ";
  let data = [childSnapshotValue.index, photo, childSnapshotValue.name, childSnapshotValue.Major, childKey];
  return data;
}

function noChumsFound() {
  $("#searchResults").load("../loaded/no_requests.html", function () {
    $('.resultUserName').html("<h2>No Chums Yet!</h2>");
    console.log("Load was performed (no chums found).");
  });
}

function retrievePopupBoxChums(htmlID) {
  console.log('Called function retrievePopupBoxChums()');
  sessionStorage.clear(); // using to save chat members
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      let results = [];
      let applicationsRef = firebase.database().ref('Chums/' + user.uid);
      applicationsRef.once("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          let key = childSnapshot.key;
          let userDataRef = firebase.database().ref('Users/' + key);

          let data = userDataRef.once("value").then(function (childSnapshotData) {
            let childData = childSnapshotData.val();
            return setUserData(childData, key);
          });
          results.push(Promise.resolve(data).then(function () {
            return data;
          }))
        });
        Promise.all(results).then(result => {
          // console.log('Results found: ' + result.length);
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
  let index, img, name, major, count, row, id = 0, chums = [];
  let html = '<table class="requests">';

  results.forEach(function (result) {
    index = result[0];
    img = result[1];
    name = result[2];
    major = result[3];
    id = result[4];
    row = 'row' + id;
    chums.push(row);

    html += '<tr id="' + row + '" class="popupRow" onclick="selectChum(this,\'' + id + '\')">';
    html += '<td class="popupUserImage"><img src="' + img + '"></td>';
    html += '<td class="popupUserName"><h2 id="popupUserName' + count + '">' + name + '</h2></td>';
    html += '<td class="popupUserMajor"><h3 id="popupUserMajor' + count + '">' + major + '</h3></td>';
    html += '</tr>'

    count++;
  });

  html += '</table>';

  document.getElementById(htmlID).innerHTML = html;
  $(htmlID).load(html, function () {
    console.log("Load was performed.");
  });

}

function selectChum(row, id) {
  let members = sessionStorage.getItem('chatMembers');
  if (members == null || members === false) {
    members = [];
    console.log('members is null');
  }
  try {
    let index = members.indexOf(id);
    if (index > -1) {
      row.style.backgroundColor = '#FFF';
      members.splice(index, 1);
    } else {
      members.push(id);
      row.style.backgroundColor = '#E1E3E8';
    }
  } catch (TypeError) {
    members = members.split(',');

    let index = members.indexOf(id);
    if (index > -1) {
      row.style.backgroundColor = '#FFF';
      members.splice(index, 1);
    } else {
      members.push(id);
      row.style.backgroundColor = '#E1E3E8';
    }
  }

  if (members[0] === "") {
    members.shift();
  }

  sessionStorage.setItem('chatMembers', members);
  console.log('Printing from selectChum(): Members:', members);
  return members;
}
