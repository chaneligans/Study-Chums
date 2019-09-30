function showPopUp() {
    document.getElementById("popup").style.display = "block";
}

function closeForm() {
    document.getElementById("popup").style.display = "none";
}

//if user opens existing chatroom 
function openChatRoom(roomID) {
  db.collection("Users").doc(user.uid).update({
    currentChatRoom: roomID,
  });

  loadChatHistory();
}

//if user creates new chatroom
//todo #1: take input for topic
function createChatRoom() {
    //todo #1
    const topic = "Comp Sci";
    firebase.auth().onAuthStateChanged(user => {
        if(user){
            const db = firebase.firestore();
    
            db.collection("ChatRooms").add({
                topic: topic
            })
            .then(function(docRef) {
                console.log("ChatRoom created with key --- ", docRef.id);
                const roomID = docRef.id;

                //todo #2
                db.collection("Users").doc(user.uid).get().then(result => {
                  let name = result.data().name;

                  db.collection("ChatRooms").doc(roomID).collection("Users").doc(user.uid)
                  .set({
                    name: name,
                  });
                });

                db.collection("Users").doc(user.uid).collection("ChatRooms").doc(roomID).set({
                  topic: topic,
                });

                db.collection("Users").doc(user.uid).update({
                  currentChatRoom: roomID,
                });
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
        }
    });
    
}

function loadChatRoom(){
    firebase.auth().onAuthStateChanged(user => {
        const db = firebase.firestore();
        let chatRoomsRef = db.collection("Users").doc(user.uid).collection("ChatRooms");
        chatRoomsRef.get().then(results => {
            results.forEach(result =>{
                console.log('Found chatrooms with me id:', result.id);
                
                let userLists = [];
                let roomID = result.id;
                db.collection("ChatRooms").doc(roomID).collection("Users")
                    .get().then(function(querySnapshot) {
                        querySnapshot.forEach(function(doc) {
                            console.log(doc.id, " => ", doc.data());
                            userLists.push({
                                name: doc.data().name,
                                userID: doc.id,
                            });
                        });
                        Promise.all(userLists).then(results => {
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
function displayChatRooms(userLists){
    firebase.auth().onAuthStateChanged(user => {
        if(user) {
            console.log("print the users details: ", userLists);
            let names = [];
            userLists.forEach(result => {
                console.log('2223231212121212121!');
                const name = result.name;
                const userid = result.userID;
                if(user.uid != userid){
                    names.push(name);
                    console.log("print the user id: ", userid);
                }
            });
            $(document).ready(function () {
                $("#leftSideRooms").append('<li><img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/chat_avatar_01.jpg"><div><h2 class = "leftChatName">'+ names + '</h2></div></li>');
            });
            
        } else {
        console.log('User is not signed in!');
        }
  });
}

function addUserToChatRoom(friendId, topic){
  firebase.auth().onAuthStateChanged(user => {
    if(user){
      const db = firebase.firestore();

      db.collection("Users").doc(user.uid).get().then(userResult => { 
        let roomID = userResult.data().currentChatRoom;

        db.collection("Users").doc(friendId).get().then(friendResult => { 

          const friendName = friendResult.data().name;

          let chatRoomRef = db.collection("ChatRooms").doc(roomID).collection("Users");
          chatRoomRef.doc(userId).set({
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
      });
    }
  });
}

//todo: update in real-time
//todo: clear chat then load and display messages
function loadChatHistory() {
  firebase.auth().onAuthStateChanged(user => {
    const db = firebase.firestore();

    db.collection("Users").doc(user.uid).get().then(result => {
      let roomID = result.data().currentChatRoom;
      let messages = [];

      db.collection("ChatRooms").doc(roomID).collection("Messages")
      .orderBy("time")
      .get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              console.log(doc.id, " => ", doc.data());
              messages.push({
                senderID: doc.data().senderID,
                senderName: doc.data().senderName,
                time: doc.data().time.toDate(),
                message: doc.data().message,
              });
          });

          Promise.all(messages).then(results => {
            displayMessages(results);
          });
      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      });
    });

  
  });
}

function displayMessages(messages) {
  firebase.auth().onAuthStateChanged(user => {
    if(user) {
      messages.forEach(result => {

        const senderID = result.senderID;
        const senderName = result.senderName;
        const t = result.time;
        const time = t.getMonth() + "/" + t.getDay() + "/" + t.getFullYear() + ', ' + t.getHours() + ':' + t.getMinutes();
        const message = result.message;
  
        if(user.uid == senderID) {

          $(document).ready(function () {
            $("#chat").append('<li class="me"><div class="entete"><h3 class="timestamp">'+ time +'</h3><h2 class="sender">You</h2></div><div class="message">'+ message +'</div></li>');
          });
          
        } else {
          $(document).ready(function () {
            $("#chat").append('<li class="you"><div class="entete"><h3 class="timestamp">'+ time +'</h3><h2 class="sender">' + senderName +'</h2></div><div class="message">'+ message +'</div></li>');
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
    if(user) {
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

