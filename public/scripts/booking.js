function loadBookings() {
    var prenotations = document.getElementById("bookings");
    const url = "/api/v1/prenotations";
  
    fetch(url,{
      'x-access-token': loggedUser.token,
      'X-User-Id': loggedUser.id
    })
      .then((resp) => resp.json())
      .then((prenotazioni) => {
        prenotazioni.forEach((prenotazione) => {
          let li = document.createElement('li');
          li.textContent = prenotazione.CourseId + ' ' + prenotazione.timeslot;
          prenotations.appendChild(li);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  
  loadBookings();
  