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

