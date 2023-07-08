
var loggedUser = {}


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
    
      fetch('/api/v1/authentications/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: password }),
      })
        .then((resp) => resp.json())
        .then(function (data) {
          if (data.success) {
            loggedUser = data;
            // Redirect to the desired page
            window.location.href = '/students/secure/home/';
          } else {
            // Display the error message from the server-side
            alert(data.message);
            // return;
          }
        })
        .catch(error => console.error(error));
    }