function myFunction() {
    var x = document.getElementById("signUpPassword");
      if (x.type === "password") {
        x.type = "text";
      } else {
        x.type = "password";
      }
    }
    
    function signUp() {
      
      var name = document.getElementById("signUpName").value;
      var email = document.getElementById("signUpEmail").value;
      var password = document.getElementById("signUpPassword").value;
    
      fetch('/api/v1/tutors/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: password, name: name }),
      })
        .then((resp) => resp.json())
        .then(function (data) {
          if (data.success) {
            // Redirect to the desired page
            window.location.href = '/welcome/';
          } else {
            // Display the error message from the server-side
            alert(data.message);
            // return;
          }
        })
        .catch(error => console.error(error));
    }