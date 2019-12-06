function updateEmailPreferences() {
  $('html').addClass('waiting');
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      let email_in = document.getElementById("new_email").value,
       subscribe = document.getElementById("subscribe").checked,
       unsubscribe = document.getElementById("unsubscribe").checked,
       userId = user.uid;

      // execute only if something is there
      if (email_in !== undefined) {updateEmail(user, email_in);}
      if (subscribe) {
        console.log(`${email_in} has subscribed to emails`);
        updateSubscription(userId, true);
      } else {
        console.log(`${email_in} has unsubscribed to emails`);
        updateSubscription(userId, false);
      }
      console.log("Updates sent to database.");
      setTimeout(() => {
        alert("Email preferences updated.");
        location.href = "home.html";
      }, 1000);
    } else {
      console.log("Who are you? And why do you have access to this?");
    }
  });
}

function updateEmail(userId, email_in) {
  let ref = firebase.database().ref(`Users/${userId}`);

  //realtime database
  ref.update({
    email: email_in,
    "email": email_in
  }, error => {
    if (error) {
      console.error(`Update failed - email to ${email_in}: ${error}`);
    } else {
      console.log(`Update succeeded - email to ${email_in}`);
    }
  });
}

function updateSubscription(userId, preference) {
  let ref = firebase.database().ref(`Subscriptions/${userId}`);
  //realtime database
  if (preference === false) {
    ref.update({
      subscribed: false,
      "subscribed": false
    }, error => {
      if (error) {
        console.error(`Update failed - email pref to false: ${error}`);
      } else {
        console.log("Update succeeded - email pref to false");
      }
    });
  } else {
    ref.update({
      subscribed: true,
      "subscribed": true
    }, error => {
      if (error) {
        console.error(`Update failed - email pref to false: ${error}`);
      } else {
        console.log("Update succeeded - email pref to true");
      }
    });
  }
}