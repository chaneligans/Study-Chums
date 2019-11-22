var dark_fn;
function setDarkFn(fn) {
  dark_fn = fn;
}

$(function enter() {
  let enter = document.getElementById("message");
  enter.addEventListener("keyup", event => {
    switch(event.keyCode) {
      case 13: sendMessage(); break; // on enter key
      case 27: clearTextBox(); break; // on escape key
      default: // nothing
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
  console.log('Called function showCreateChatPopup()');
  document.getElementById("chatOptionsDropdown").classList.remove("show");
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
      firebase.firestore().collection("Users").doc(user.uid)
      .update({
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
          // console.log('Printing from createChatRoom():\nMembers: ['
          //           + members + ']\nmembers.length(): ' + members.length);
          db.collection("ChatRooms")
          .add({
            topic: topic
          })
          .then(docRef => {
            // console.log("ChatRoom created with key --- ", docRef.id);
            let roomID = docRef.id;

            members.forEach(result => {
              let member = String(result);
              addUserToChatRoom(member, roomID, topic)
            });

            db.collection("Users").doc(user.uid)
            .update({
              currentChatRoom: roomID,
            }).then(() => {
              openChatRoom(roomID);
            });

            let chatPopupId = document.getElementById("createChatPopup");
            chatPopupId.style.display = "none";
            document.getElementById("chatTopicIn").value = "";
          })
          .catch(error => {
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
      db.collection("Users").doc(user.uid)
      .get().then(userResult => {
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
          .then(docRef => {
            // console.log("Trash document created with key --- ", docRef.id);
            let trashID = docRef.id;

            //get all users in chatroom
            let users = [];
            chatroomRef.collection("Users")
            .get().then(allUsers => {
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
                  .delete().then(() => {
                    console.log("User document successfully deleted from ChatRoom/Users!");
                  }).catch(error => {
                    console.error("Error removing document from ChatRoom/Users! ", error);
                  });
                })

                // chatroomRef.collection("Tokens").delete().then(() => {
                //   console.log("Tokens collection successfully deleted from ChatRoom!");
                // }).catch(error => {
                //   console.error("Error removing ChatRoom/Tokens! ", error);
                // });

                moveMessageToTrash(roomID, trashID);
                deleteChatRoomData(roomID);

                clearOut();
                displayHeader();

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
  firebase.firestore().collection("Trash").doc(trashID).collection("Users").doc(userID)
  .set({
    name: name
  });
}

function deleteChatRoomFromUser(userID, roomID) {
  // if currentChatRoom is roomID, we need to update it to empty
  let userData = firebase.firestore().collection("Users").doc(userID);
  userData.get().then(userResult => {
    const currentChatRoom = userResult.data().currentChatRoom;

    if(currentChatRoom === roomID) {
      userData.update({
        currentChatRoom: " ",
      });
    }
  });

  userData.collection("ChatRooms").doc(roomID)
  .delete().then(() => {
    console.log("ChatRoom document successfully deleted from Users/ChatRooms!");
  }).catch(error => {
    console.error("Error removing ChatRoom document from Users/ChatRooms: ", error);
  });
}

function deleteChatRoomData(roomID) {
  firebase.firestore().collection("ChatRooms").doc(roomID)
  .delete().then(() => {
    console.log("ChatRoom document successfully deleted from ChatRooms!");
  }).catch(error => {
    console.error("Error removing ChatRoom document from ChatRooms: ", error);
  });
}

function moveMessageToTrash(roomID, trashID) {
  let allMessages = [];
  let messageRef = firebase.firestore().collection("ChatRooms").doc(roomID).collection("Messages");
  messageRef.get().then(messages => {
    messages.forEach(message => {
      allMessages.push({
        messageID: message.id,
      });
    });

    Promise.all(allMessages).then(allMessageList => {
      allMessageList.forEach(message => {
        messageRef.doc(message.messageID)
        .delete().then(() => {
          console.log("Message document successfully deleted from ChatRooms/Messages!");
        }).catch(error => {
          console.error("Error removing Message document from ChatRooms/Messages: ", error);
        });
      });
    });
  })
}

function showAddFriendToChatPopup() {
  console.log('Called function showAddFriendToChatPopup()');

  document.getElementById("chatOptionsDropdown").classList.remove("show");

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
            members.forEach(result => {
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
  firebase.auth().onAuthStateChanged(user => {
    if (user) {

      const db = firebase.firestore();
      let chatRoomData = [];

      let reloadSideBar = db.collection("Users").doc(user.uid).collection("ChatRooms")
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          // console.log(change.type, "//", change.doc.id, "//" ,change.doc.data());

          if (change.type === "added") {

            let chatroomDoc = change.doc;
            let roomID = change.doc.id;
            let topic = change.doc.data().topic;
            let userList = [];

            let roomListener = db.collection("ChatRooms").doc(roomID).collection("Users")
            .get().then(querySnapshot => {
              querySnapshot.forEach(doc => {
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
            .catch(error => {
              console.log("Error getting documents: ", error);
            });
          } // end of if (change.type === 'added')

          if (change.type === "removed") {
            // remove sidebar item from sidebar

            let id = change.doc.id;
            let topic = change.doc.data().topic;

            let sidebar_list = $('li').splice(8);
            let li_index = -1; // the item to be removed

            sidebar_list.forEach((li_item, i) => {
              let li_topic = li_item.innerText;
              let li_id = li_item.outerHTML.replace(')','(').split('(')[1].split('\'')[1];
              if (id === li_id && topic === li_topic) {
                li_index = i; // set the item that needs to be removed
              }
            });

            if (li_index !== -1) {
              $('#leftSideRooms')[0].children[li_index].remove();

              // then change 'currentChatRoom' to a relevant chatroom or "" if none
              let adjustedSideBar = $('li').splice(8);
              let newRoomID;
              if (adjustedSideBar.length > 0) {
                let first_item = adjustedSideBar[0];
                newRoomID = first_item.outerHTML.replace(')','(').split('(')[1].split('\'')[1];
              } else {
                newRoomID = " ";
              }

              db.collection("Users").doc(user.uid)
              .update({
                currentChatRoom: newRoomID,
                "currentChatRoom": newRoomID
              })
              .then(() => {
                console.log('currentChatRoom was redirected.');
              });
            }

            // then reload header and chat history (regardless)
            reloadHeader();
            reloadChatHistory();

          } // end of if (change.type === 'removed')
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
        roomID = result.chatroomID;

        if (user.uid != userID) {
          names.push(name);
        }
      });

      displayName = (names.length > 1) ? userList[0].topic : names[0];

      $(document).ready(() => {
        $("#leftSideRooms").append(
          '<li onclick="openChatRoom(\''+ roomID +'\')">'
          + '<h2 class = "leftChatName">'+ displayName +'</h2></li>');
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

  // db_find(db, ["Users", friendID])
  db.collection("Users").doc(friendID)
  .get().then(friendResult => {

    let friendName = friendResult.data().name;
    // let chatRoomRef = db_find(db, ["ChatRooms", roomID, "Users"]);
    let chatRoomRef = db.collection("ChatRooms").doc(roomID).collection("Users");
    chatRoomRef.doc(friendID).set({
      name: friendName
    })
    .catch(error => {
      console.error("Error writing to chatrooms: ", error);
    });

    // let usersRef = db_find(db, ["Users", friendID, "ChatRooms"]);
    let usersRef = db.collection("Users").doc(friendID).collection("ChatRooms");
    usersRef.doc(roomID).set({
      topic: topic
    })
    .catch(error => {
      console.error("Error writing to users: ", error);
    });
  })
  .catch(error => {
    console.error("Error retrieving document: ", error);
  });
}

function showEditIconPopup() {
  console.log('Called function showEditIconPopup()');

    document.getElementById("chatOptionsDropdown").classList.remove("show");

  // Get the modal
  let chatPopupId = document.getElementById("showEditIconPopup");
  chatPopupId.style.display = "block";

  // Get the <span> element that closes the modal
  let span = document.getElementById("closeShowEditIconPopup");

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

function editGroupIcon() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      const db = firebase.firestore();
      let photo = document.getElementById("newIconInput");
      let photoUrl = 'Something went wrong!!!';
      let max_width = 300;
      let max_height = 300;
      let file = photo.files[0];
      let fileName = photo.files[0].name;

      let fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = function(event) {

        let blob = new Blob([event.target.result]);
        let blobURL = window.URL.createObjectURL(blob);

        let newImage = new Image();
        newImage.src = blobURL;

        newImage.onload = function() {
          let updateImage = new Promise((resolve, reject) => {
            if (newImage) {
              let canvas = document.createElement('canvas');
              let width = newImage.width;
              let height = newImage.height;

              if (width > height) {
                if (width > max_width) {
                  height = Math.round(height *= max_width / width);
                  width = max_width;
                }
              } else {
                if (height > max_height) {
                  width = Math.round(width *= max_height / height);
                  height = max_height;
                }
              }

              canvas.width = width;
              canvas.height = height;

              let context = canvas.getContext("2d");
              context.drawImage(newImage, 0, 0, width, height);

              let canvasDataURL = canvas.toDataURL("imge/jpeg", 0.7);

              let arr = canvasDataURL.split(','),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n);
              while (n--) {u8arr[n] = bstr.charCodeAt(n);}
              file = new Blob([u8arr], {type: mime});

              // console.log(file);
              resolve("It worked!");
              console.log('Finished updating image');
            } else {
              reject("Failed to resize image.");
            }
          });

          let tryToUpdateImage = new Promise((resolve, reject) => {
            updateImage.then(fulfilled => {
              // db_find(db, ["Users", user.uid])
              db.collection("Users").doc(user.uid)
              .get().then(doc => {
                console.log('Attempting to upload file ' + fileName);
                let storageRef = firebase.storage().ref('img/groupicons/' + doc.data().currentChatRoom);
                let uploadTask = storageRef.put(file);

                uploadTask.on('state_changed', snapshot => {
                  let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  console.log('Upload is ' + progress + '% done');
                  document.getElementById("editIconProgress").innerHTML = progress;
                  switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                      console.log('Upload is paused');
                      break;
                    case firebase.storage.TaskState.RUNNING: // or 'running'
                      console.log('Upload is running');
                      break;
                  }
                }, error => {
                  console.log('Unsuccessful file upload', error);
                }, () => {
                  // Handle successful uploads on complete
                  uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                    // console.log('File available at', downloadURL);
                    photoUrl = downloadURL;
                    // db_find(db, ["Users", user.uid])
                    db.collection("Users").doc(user.uid)
                    .get().then(userDoc => {
                      let chatroomID = userDoc.data().currentChatRoom;
                      // db_find(db, ["ChatRooms", chatroomID])
                      db.collection("ChatRooms").doc(chatroomID)
                      .get().then(result => {
                        let topic = result.data().topic;
                        db.collection("ChatRooms").doc(chatroomID).set({
                          icon: photoUrl,
                          topic: topic
                        }), {merge: true};
                      });
                      resolve(fulfilled);
                      console.log(fulfilled);
                    });
                  });
                });
              });
            }).catch(error => {
              console.log(error);
              reject(error);
            })
          });
          tryToUpdateImage.then(res => {
            console.log('res: '+res);
            let chatPopupId = document.getElementById("showEditIconPopup");
            chatPopupId.style.display = "none";
            displayHeader();
            $('.showEditIconPopupContent p #editIconProgress').text("--");
          });
        }
      }
    }
  });
}

function displayHeader() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      const db = firebase.firestore();
      // db_find(db, ["Users", user.uid])
      db.collection("Users").doc(user.uid)
      .get().then(userResult => {
        let roomID = userResult.data().currentChatRoom;

        if (roomID.length > 2) {
          console.log("Valid currentChatRoom Id!");
          let userLists = [];
          let topic;
          // let chatroomRef = db_find(db, ["ChatRooms", roomID]);
          let chatroomRef = db.collection("ChatRooms").doc(roomID);
          chatroomRef.get().then(result => {
            let res_data = result.data();
            if (res_data === undefined) {
              noChatroomsFound();
              return;
            }
            // else {
              topic = res_data.topic;

              chatroomRef.collection("Users").get().then(querySnapshot => {
                querySnapshot.forEach(doc => {
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
                    let genericGroupIcon = "../images/group.png";
                    let icon;
                    // let chatDataRef = db_find(db, ["ChatRooms", roomID])
                    let chatDataRef = db.collection("ChatRooms").doc(roomID)
                    .get().then(doc => {
                      if (!doc.exists) {
                        console.log('No such document!');
                        icon = genericGroupIcon;
                        reject(icon);
                      } else {
                        if (doc.data().icon === undefined) {
                          icon = genericGroupIcon;
                        } else {
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

                  loadImg.then(result => {
                    $("#chatHeader").load("../loaded/message_header.html", () => {
                      $('#chatImage').html('<img class="chatImage" src="'+ result +'" alt="'+ names +'">');
                      $('#chatTitle').html('<h2 id="chatTitle">'+ topic +'</h2>');
                      $('#chatTopic').html('<h3 id="chatTopic">Chums:  '+ names +'</h3>');
                      console.log("Load header (multi) was performed.");
                      dark_fn();
                    });
                  });
                } else {
                  let loadImg = new Promise((resolve, reject) => {
                    // let userDataRef = db_find(firebase.database(), ["Users", ids[0]]);
                    let userDataRef = firebase.database().ref("Users/"+ids[0]);
                    userDataRef.once("value", snapshot => {
                      resolve(snapshot.val().p1Url);
                    });
                  });
                  loadImg.then((result) => {
                    $("#chatHeader").load("../loaded/message_header.html", () => {
                      $('#chatImage').html('<img class="chatImage" src="'+ result +'" alt="'+ names[0] +'">');
                      $('#chatTitle').html('<h2 id="chatTitle">'+ names[0] +'</h2>');
                      $('#chatTopic').html('<h3 id="chatTopic">Topic:  '+ topic +'</h3>');
                      console.log("Load header (single) was performed.");
                      dark_fn();
                    });
                  });
                }
              });
            // }
          });
        } else {
          noChatroomsFound();
        }
      });
    }
  });
}

function toggleChatOptions() {
  let dropdown = document.getElementById("chatOptionsDropdown");
  let dropOptions = document.getElementById("chatOptions");
  let dropEllipsis = $('#chatOptions .fas.fa-ellipsis-h')[0];
  // console.log("toggleChatOptions");
  window.onclick = function(event) {
    if (event.target != dropOptions && event.target != dropEllipsis) {
      dropdown.classList.remove("show");
    } else {
      dropdown.classList.add("show");
    }
  }
}

function clearOut() {
  clear_("Header");
  clear_("Chat");
}

function clear_(clear_type) {
  let j_query = (clear_type === 'Header') ? "#chat"+clear_type : "#chat";
  $(j_query).load("../loaded/empty.html", () => {
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

    // db_find(db, ["Users", user.uid])
    db.collection("Users").doc(user.uid)
    .get().then(result => {
      let roomID = result.data().currentChatRoom;

      if (roomID.length > 1) {
        let initial_messages = [];
        let update_messages = [];

        // db_find(db, ["ChatRooms", roomID, "Messages"])
        db.collection("ChatRooms").doc(roomID).collection("Messages")
        .orderBy("time")
        .get().then(querySnapshot => {
          querySnapshot.forEach(doc => {
            initial_messages.push({
              senderID: doc.data().senderID,
              senderName: doc.data().senderName,
              time: doc.data().time.toDate(),
              // time: firebase.firestore.FieldValue.serverTimestamp(),
              message: doc.data().message,
            });
          });

          Promise.all(initial_messages).then(results => {
            displayMessages(results);
          });
        });

        // db_find(db, ["ChatRooms", roomID, "Messages"])
        db.collection("ChatRooms").doc(roomID).collection("Messages")
        .orderBy("time")
        .onSnapshot(querySnapshot => {
          update_messages = [];
          querySnapshot.docChanges().forEach(change => {
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
            }
            // else if (change.type === "added") {
            //   // console.log(change.doc.id, " ++ ", change.doc.data());
            //   update_messages.push({
            //     senderID: change.doc.data().senderID,
            //     senderName: change.doc.data().senderName,
            //     time: timestamp.toDate(),
            //     message: change.doc.data().message,
            //   });
            // }
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
          $(document).ready(() => {
            $("#chat").append(
              '<li class="me"><div class="entete"><h3 class="timestamp">'+time
              + '</h3><h2 class="sender">You</h2></div><div class="message">'
              + message + '</div></li>');
            scrollToBottom();
          });
        } else {
          $(document).ready(() => {
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
        let ref = db.collection("ChatRooms").doc(roomID);

        let userRef = ref.collection("Users").doc(user.uid).get().then(doc => {
          if (doc.exists) {
            let senderName = doc.data().name;
            let roomRef = ref.collection("Messages").add({
              senderID: user.uid,
              senderName: senderName,
              message: message,
              time: timestamp,
            })
            .then(docRef => {
              // console.log("Document written with ID: ", docRef.id);
              document.getElementById("message").value = "";
            })
            .catch(error => {
              console.error("Error adding document: ", error);
            });
          } else {
            console.log("User is not stored in chat!");
          }
        }).catch(error => {
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
  $("#searchResults").load("../loaded/no_requests.html", () => {
    $('.resultUserName').html("<h2>No Chums Yet!</h2>");
    console.log("Load was performed (no chums found).");
  });
}

function noChatroomsFound() {
  console.log('No chatrooms found.');
  $('#chatHeader').load("../loaded/message_header_empty.html", function() {
    console.log("Load (empty header) was performed.");
    dark_fn();
  });
}

function retrievePopupBoxChums(htmlID) {
  console.log('Called function retrievePopupBoxChums()');
  sessionStorage.clear(); // using to save chat members
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      let results = [];
      let db = firebase.database();
      let applicationsRef = db.ref('Chums/' + user.uid);
      applicationsRef.once("value", snapshot => {
        snapshot.forEach(childSnapshot => {
          let key = childSnapshot.key;
          let userDataRef = db.ref('Users/' + key);

          let data = userDataRef.once("value").then(childSnapshotData => {
            let childData = childSnapshotData.val();
            return setUserData(childData, key);
          });
          results.push(Promise.resolve(data).then(() => {
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
  let html = '<table id="popupChums">';

  results.forEach(result => {
    index = result[0];
    img = result[1];
    name = result[2];
    major = result[3];
    id = result[4];
    row = 'row' + id;

    if (img === "undefined ") { // set img to the generic image
      img = 'https://firebasestorage.googleapis.com/v0/b/study-chums.appspot.com/o/'
      + 'img%2Fa98d336578c49bd121eeb9dc9e51174d.png?'
      + 'alt=media&token=5c470791-f247-4c38-9609-80a4c77128c1';
    }

    chums.push(row);

    html += '<tr id="'+ row +'" class="popupRow" onclick="selectChum(this,\''+ id +'\')">';
    html += '<td class="popupUserImage"><img src="'+img+'"></td>';
    html += '<td class="popupUserName">';
    html += '<p id="popupUserName'+count+'">'+ name +'</p></td>';
    html += '<td class="popupUserMajor">';
    html += '<p id="popupUserMajor'+count+'">'+ major +'</p></td>';
    html += '</tr>'

    count++;
  });

  html += '</table>';

  document.getElementById(htmlID).innerHTML = html;
  $(htmlID).load(html, () => {
    console.log("Load was performed.");
  });

}

function selectChum(row, id) {
  let members = sessionStorage.getItem('chatMembers');
  if (members == null || members === false) {
    members = [];
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
  // console.log('Printing from selectChum(): Members:', members);
  return members;
}
