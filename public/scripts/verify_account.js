function verifyEmail() {
    // Confirm the link is a sign-in with email link.
    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
        let email_in = document.getElementById("verify-account-email-input").value;
        if(!email_in) {
            alert('Please enter email!');
        }

        firebase.auth().signInWithEmailLink(email_in, window.location.href)
        .then(result => {
            alert("Your email has been verified! You will now be directed to the Home page...");
            setTimeout(() => {
              location.href = "create_profile.html";
            }, 2000);
        })
        .catch(function(error) {
            console.log("Error verifying email -- ", error.message);
        });
    }
}