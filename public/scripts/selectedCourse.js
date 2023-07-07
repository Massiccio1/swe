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

  fetch('/api/v1/course/subject/' + selectedSubject, { method: 'GET' })
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
      data.courses.forEach(function (course) {
        var tutorInfo = document.createElement('div');
        tutorInfo.textContent =
          course.Subject + ' - ' + course.desc + ' - ' + course.price;
        tutorList.appendChild(tutorInfo);
      });
    })
    .catch(function (error) {
      console.error(error);
    });
});



