function updateEmailPreferences() {
  $('html').addClass('waiting');
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      let email_in = document.getElementById("email").value;
      let subscribe = document.getElementById("subscribe").checked;
      let unsubscribe = document.getElementById("unsubscribe").checked;

      this.userId = user.uid;

      // execute only if something is there
      if (email_in !== undefined) {
        updateEmail(this.userId, email_in);}
      if (subscribe) {
        console.log(email_in + ' has subscribed to emails');
        updateSubscription(this.userId, true);
      }
      else {
        console.log(email_in + ' has unsubscribed to emails');
        updateSubscription(this.userId, false);
      }
      console.log("Updates sent to database.");
      setTimeout(function() {
        alert("Email preferences updated.");
        location.href = "home.html";
      }, 1000);
    } else {
      console.log("Who are you? And why do you have access to this?");
    }                              
  });
}

function updateEmail(user, email_in) {
  firebase.auth().onAuthStateChanged(function(user) {
    console.log("Updating email for user id ", user.uid);
    // update email for this 'user' with email_in

    let ref = firebase.database().ref("Users/" + this.userId);
    this.userId = user.uid;

    //realtime database
    ref.update({
      email: email_in,
      "email": email_in
    }, function(error) {
      if (error) {
        console.log("Update failed - email to " + email_in);
      } else {
        console.log("Update suceeded - email to " + email_in);
      }
    });
  });
}  


function updateSubscription(user, preference) {
  firebase.auth().onAuthStateChanged(function(user) {
    console.log("Updating subscription preferences for user id ", user.uid);

    let ref = firebase.database().ref("Subscriptions/" + this.userId);
    this.userId = user.uid;
    //realtime database
    if (preference === false) {
      ref.update({
        subscribed: false,
        "subscribed": false
      }, function(error){
        if (error) {
          console.log("Update failed - email pref to false");
        } else {
          console.log("Update succeeded - email pref to false");
        }
      }); 
    } else {
      ref.update({
        subscribed: true,
        "subscribed": true
      }, function(error){
        if (error) {
          console.log("Update failed - email pref to true");
        } else {
          console.log("Update succeeded - email pref to true");
        }
      });
    }
  });
}