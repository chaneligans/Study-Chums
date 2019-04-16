function List(){
    
}



function getUserPiURL(ways, id){
    firebase.auth().onAuthStateChanged(function(user) {
      console.log(id);
      if (user) {
        var db = firebase.database().ref("Applications/" + myid + ways + id);
        var image_val;
        var userDataRef = firebase.database().ref();
        var imageRef = userDataRef.child("Applications/" + myid + ways + id)
        imageRef.once("value").then(function(snapshot){
          var key = snapshot.key;
          var childData = snapshot.val();              
          image_val = snapshot.val().p1Url;
          if (showGeneric) {
            image_val = 'https://firebasestorage.googleapis.com/v0/b/study-chums.appspot.com/o/img%2F404.png?alt=media&token=853ff18e-bca6-4795-b1e8-911b90ad2258';
          }
          else if (image_val === undefined) {
            image_val = 'https://firebasestorage.googleapis.com/v0/b/study-chums.appspot.com/o/img%2Fa98d336578c49bd121eeb9dc9e51174d.png?alt=media&token=5c470791-f247-4c38-9609-80a4c77128c1';
            alert('Please upload a profile image.');
            location.href = 'edit_profile.html';
          }
          document.getElementById('img').src = image_val;
        });
      }
      else {
        console.log('Something went wrong!');
      }
    });
    
}

function getUserName(ways,id){
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        var db = firebase.database().ref("Applications/" + myid + ways + id);
        var name_val;
        var userDataRef = firebase.database().ref();
        var nameRef = userDataRef.child("Applications/" + myid + ways + id);
        nameRef.once("value").then(function(snapshot){
          var key = snapshot.key;
          var childData = snapshot.val();              
          name_val = snapshot.val().name;
          console.log(name_val);
          document.getElementById("name").innerHTML = name_val;
        });
      }
      else {
        console.log('Something went wrong!');
      }
    });
}

function getMatchStatus(ways, id){
    firebase.auth().onAuthStateChanged(function(user) {
        if(user){
            var myid = user.uid;
            var status;
            var userDataRef = firebase.database().ref();
            var statusRef = userDataRef.child("Applications/" + myid + "/Sent/" + id);
            statusRef.on("value", function(snapshot){
                var key = snapshot.key; 
                if(snapshot.val()) {
                    status = snapshot.val().status;
                    console.log(status);
                    document.getElementById("status").innerHTML = status;
                } 
                else {
                    status = "Request to Match";
                    document.getElementById("status").innerHTML = status;
                }         
            });   
        } 
    });
}
