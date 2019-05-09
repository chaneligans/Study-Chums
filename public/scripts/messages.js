var roomID = "123Test";



//if user opens existing chatroom
function openChatRoom() {
  //set roomID

}

//if user creates new chatroom
function createChatRoom() {
  //create new roomID
  //set roomID
  //set topic
  //update users

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

