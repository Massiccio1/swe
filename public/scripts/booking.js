// function loadBookings() {

// const cookies = document.cookie.split("; "); // Ottieni tutti i cookie come array
// let token = null;

// for (let i = 0; i < cookies.length; i++) {
//   const cookie = cookies[i].split("=");
//   if (cookie[0] === "token") {
//     token = cookie[1];
//     break;
//   }
// }
//     var prenotations = document.getElementById("bookings");
//     const url = "/api/v1/prenotations";
  
//     fetch('/api/v1/prenotations', {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`,
//       }
//     })
//       .then((resp) => resp.json())
//       .then((prenotazioni) => {
//         prenotazioni.forEach((prenotazione) => {
//           let li = document.createElement('li');
//           li.textContent = prenotazione.CourseId + ' ' + prenotazione.timeslot;
//           prenotations.appendChild(li);
//         });
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }

//   loadBookings();
  

function test() {
  const prenotations = document.getElementById('bookings');

  fetch('/api/v1/students')
  .then((resp) => resp.json())
  .then((data) => {
    console.log(data);
    data.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item.email;
      prenotations.appendChild(li);
    });
  })
  .catch((error) => {
    console.error(error);
  })
}
