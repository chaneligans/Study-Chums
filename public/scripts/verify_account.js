function verifyEmail() {
  let email_in = document.getElementById("verify-account-email-input").value;
  if (!email_in) {
    alert('Please enter email!');
    console.log('try again');
    return;
  }

  // Confirm the link is a sign-in with email link.
  if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
    let email_in = document.getElementById("verify-account-email-input").value;
    if (!email_in) {
      alert('Please enter email!');
      console.log('seriously, try again');
      return;
    }

    firebase.auth().signInWithEmailLink(email_in, window.location.href)
    .then(result => {
      alert("Your email has been verified! You will now be directed to the Home page...");
      result.user.reload;

      setTimeout(() => {
        location.href = "create_profile.html";
      }, 3000);
    })
    .catch(error => {
      console.log(`Error verifying email -- ${error.message}`);
    });
  }
}