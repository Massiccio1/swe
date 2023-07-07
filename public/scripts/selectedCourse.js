// // Wait for the DOM to be ready
// document.addEventListener('DOMContentLoaded', function() {
//     // Get the necessary elements
//     var subjectSelect = document.getElementById('subjectSelect');
//     var findTutorsButton = document.getElementById('findTutors');
//     var tutorList = document.getElementById('tutorList');
  
//     // Tutor example array
//     var tutors = [
//       { name: 'Tutor 1', subject: 'Math' },
//       { name: 'Tutor 2', subject: 'Biology' },
//       { name: 'Tutor 3', subject: 'Math' },
//       { name: 'Tutor 4', subject: 'Physics' },
//       { name: 'Tutor 5', subject: 'Chemistry' }
//     ];
  
//     // Add event listener to the button click
//     findTutorsButton.addEventListener('click', function() {
//       // Get the selected subject
//       var selectedSubject = subjectSelect.value;
  
//       // Clear the previous tutor list
//       tutorList.innerHTML = '';
  
//       // Filter tutors based on the selected subject
//       var filteredTutors = selectedSubject === '0'
//         ? tutors // If 'All subjects' selected, show all tutors
//         : tutors.filter(function(tutor) {
//             return tutor.subject === selectedSubject;
//           });
  
//       // Display the filtered tutors
//       filteredTutors.forEach(function(tutor) {
//         // Create a div element for each tutor and append it to the tutorList
//         var tutorDiv = document.createElement('div');
//         tutorDiv.textContent = tutor.name;
//         tutorList.appendChild(tutorDiv);
//       });
//     });
//   });  
// var subjectSelect = document.getElementById('subjectSelect');
// var findTutorsButton = document.getElementById('findTutors');
// var tutorList = document.getElementById('tutorList');

// findTutorsButton.addEventListener("click", function() {
//     // Get the selected subject from the dropdown
//     var selectedSubject = subjectSelect.value;

//     tutorList.innerHTML = '';
//     fetch('/api/courses/' + selectedSubject, {method: 'GET'});
//   });


var subjectSelect = document.getElementById('subjectSelect');
var findTutorsButton = document.getElementById('findTutorsButton');
var tutorList = document.getElementById('tutorList');

findTutorsButton.addEventListener('click', function () {
  // Get the selected subject from the dropdown
  var selectedSubject = subjectSelect.value;

  tutorList.innerHTML = '';

<<<<<<< HEAD
  // if(selectedSubject = "0"){
  //   fetch('/api/v1/course')
  //   .then(function (response) {
  //     if (response.ok) {
  //       return response.json();
  //     } else {
  //       throw new Error('Error fetching courses');
  //     }
  //   })
  //   .then(function (data) {
  //     // Process the retrieved courses
  //     console.log(data);
  //     data.courses.forEach(function (course) {
  //       var tutorInfo = document.createElement('div');
  //       tutorInfo.textContent =
  //         course.Subject + ' - ' + course.desc + ' - ' + course.price;
  //       tutorList.appendChild(tutorInfo);
  //     });
  //   })
  //   .catch(function (error) {
  //     console.error(error);
  //   });}
  // else
  fetch('/api/v1/course/subject/' + selectedSubject, { method: 'GET' })
=======
  var fetch_url='/api/v1/course/subject/';
  if(selectedSubject=="0"){
    fetch_url = '/api/v1/course'
  }else{
    fetch_url = fetch_url + selectedSubject;
  }
  fetch(fetch_url, { method: 'GET' })
>>>>>>> frontend_max
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Error fetching courses');
      }
    })
    .then(function (data) {
      // Process the retrieved courses
      console.log(data);
<<<<<<< HEAD
      data.courses.forEach(function (course) {
        var tutorInfo = document.createElement('div');
        tutorInfo.textContent =
          course.Subject + ' - ' + course.desc + ' - ' + course.price;
        tutorList.appendChild(tutorInfo);
      });
=======
      data.forEach(function (course) {
        console.log("single course: ",course)
        tutorName = fetch('api/v1/tutors/'+ course.tutorId, { method: 'GET' })
          .then(function (response) {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error('Error fetching courses');
            }
          })
          .then(function(innerData){
            return innerData.name;
          });
        });
      console.log("tutor name: ",tutorName);
      convert(data);
      // data.courses.forEach(function (course) {
      //   var tutorInfo = document.createElement('div');
      //   tutorInfo.textContent =
      //     course.TutorId + ' - ' + course.desc + ' - ' + course.price;
      //   tutorList.appendChild(tutorInfo);
      // });
>>>>>>> frontend_max
    })
    .catch(function (error) {
      console.error(error);
    });
});

function convert(jsonData) {
         
  // Sample JSON data
  // let jsonData = [
  //    {
  //       name: "Saurabh",
  //       age: "20",
  //       city: "Prayagraj"
  //    },
  //    {
  //       name: "Vipin",
  //       age: 23,
  //       city: "Lucknow",
  //    },
  //    {
  //       name: "Saksham",
  //       age: 21,
  //       city: "Noida"
  //    }
  // ];
  
  // Get the container element where the table will be inserted
  let container = document.getElementById("tutorList");
  
  // Create the table element
  let table = document.createElement("table");
  
  // Get the keys (column names) of the first object in the JSON data
  let cols = Object.keys(jsonData[0]);
  
  // Create the header element
  let thead = document.createElement("thead");
  let tr = document.createElement("tr");
  
  // Loop through the column names and create header cells
  cols.forEach((item) => {
     let th = document.createElement("th");
     th.innerText = item; // Set the column name as the text of the header cell
     tr.appendChild(th); // Append the header cell to the header row
  });
  thead.appendChild(tr); // Append the header row to the header
  table.append(tr) // Append the header to the table
  
  // Loop through the JSON data and create table rows
  jsonData.forEach((item) => {
     let tr = document.createElement("tr");
     
     // Get the values of the current object in the JSON data
     let vals = Object.values(item);
     
     // Loop through the values and create table cells
     vals.forEach((elem) => {
        let td = document.createElement("td");
        td.innerText = elem; // Set the value as the text of the table cell
        tr.appendChild(td); // Append the table cell to the table row
     });
     table.appendChild(tr); // Append the table row to the table
  });
  container.appendChild(table) // Append the table to the container element
};

