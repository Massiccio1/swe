function myFunction() {
  var x = document.getElementById("loginPassword");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }
  
  function login() {
    // Get the form object
    //var form = document.getElementById("loginForm");

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
// function login()
// {
//     //get the form object
//     var email = document.getElementById("emailLogin").value;
//     var password = document.getElementById("passwordLogin").value;
//     // console.log(email);

//     fetch('/api/v1/authentications_tutor/', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify( { email: email, password: password } ),
//     })
//     .then((resp) => resp.json()) // Transform the data into json
//     .then(function(data) { // Here you get the data to modify as you please
//         //console.log(data);
//         loggedUser.token = data.token;
//         loggedUser.email = data.email;
//         loggedUser.id = data.id;
//         loggedUser.self = data.self;
//         // loggedUser.id = loggedUser.self.substring(loggedUser.self.lastIndexOf('/') + 1);
//         document.getElementById("loggedUser").textContent = loggedUser.email;
//         if (data.success) {
//             // Redirect to the desired URL
//             window.location.href = '/tutors/secure/home/';
//           } else {
//             // Handle authentication failure
//             console.error(data.message);
//             // Display an error message to the user
//           }
//     })
//     .catch( error => console.error(error) ); // If there is any error you will catch them here

// };