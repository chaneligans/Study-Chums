var roomID = "123Test";



//if user opens existing chatroom
function openChatRoom() {
  //set roomID

}

//if user creates new chatroom
function createChatRoom() {

}

function loadChatHistory() {

}


function sendMessage() {
  let message = document.getElementById("message").value;
  let timestamp = firebase.firestore.FieldValue.serverTimestamp();


  firebase.auth().onAuthStateChanged(user => {
    if(user) {

      let db = firebase.firestore();

      let roomRef = db.collection("ChatRooms").doc(roomID).collection("Messages")
      .add({
        senderID: user.uid,
        message: message,
        time: timestamp,
      })
      .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
      });

    } else {
      console.log('User is not signed in!');
    }

});
}

