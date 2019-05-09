var roomID = "123Test";



//if user opens existing chatroom 
function openChatRoom() {
  //set roomID

}

//if user creates new chatroom
function createChatRoom(topic) {
    firebase.auth().onAuthStateChanged(user => {
        if(user){
            const db = firebase.firestore();
            let room;
            //add user self first, and later call the updateUser to add more User
    
            db.collection("ChatRooms").add({
                topic: topic
            })
            .then(function(docRef) {
                console.log("ChatRoom created with key --- ", docRef.id);
                room = docRef.id;
                roomID = room;

                db.collection("Users").doc(user.uid).get(result => {
                  let name = result.data().name;

                  db.collection("ChatRooms").doc(room).collection("Users").doc(user.uid)
                  .set({
                    name: name,
                  });
                });

                db.collection("Users").doc(user.uid).collection("ChatRooms").doc(room).set({
                  topic: topic,
                });
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
        }
    });
    
}
function updateUsers(userId){
      const db = firebase.firestore();
      const userName = getUserName(userId);

      let usersRef = db.collection("ChatRooms").doc(roomID).collection("Users")
      usersRef.doc(userId).set({
          name: userName
      })
      .then(function(docRef) {
          console.log("Document userid successfully written!", docRef.id);
      })
      .catch(function(error) {
          console.error("Error writing document: ", error);
      });
}

function loadChatHistory() {
  let messages = [];
  const db = firebase.firestore();

  db.collection("ChatRooms").doc(roomID).collection("Messages")
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
}

function displayMessages(messages) {
  firebase.auth().onAuthStateChanged(user => {
    if(user) {
      messages.forEach(result => {
        console.log(result.senderID);

        const senderID = result.senderID;
        const senderName = result.senderName;
        const t = result.time;
        const time = t.getHours() + ':' + t.getMinutes() + ', ' + t.getMonth() + "/" + t.getDay() + "/" + t.getFullYear();
        const message = result.message;
  
        if(user.uid == senderID) {

          $(document).ready(function () {
            $("#chat").append('<li class="me"><div class="entete"><h3 class="timestamp">'+ time +'</h3><h2 class="sender">'+ senderName +'</h2></div><div class="message">'+ message +'</div></li>');
          });
          
        } else {
          $(document).ready(function () {
            $("#chat").append('<li class="you"><div class="entete"><h3 class="timestamp">'+ time +'</h3><h2 class="sender">'+ senderName +'</h2></div><div class="message">'+ message +'</div></li>');
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

    } else {
      console.log('User is not signed in!');
    }

});
}

