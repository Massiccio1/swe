function myFunction() {
  var x = document.getElementById("loginPassword");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }
  
  function login() {

    var email = document.getElementById("loginEmail").value;
    var password = document.getElementById("loginPassword").value;
    // Validate inputs
    if (email === '' || password === '') {
      alert("Please enter both email and password.");
      return;
    }
  
    fetch('/api/v1/authentications_tutor/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then((resp) => resp.json())
      .then(function (data) {
        if (data.success) {
          // Redirect to the desired page
          window.location.href = '/tutors/secure/home/';
        } else {
          // Display the error message from the server-side
          alert(data.message);
          // return;
        }
      })
      .catch(error => console.error(error));
  }