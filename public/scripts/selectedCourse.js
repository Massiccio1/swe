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

let ready = 0;

findTutorsButton.addEventListener('click', async function() {
	// Get the selected subject from the dropdown
	test();
	var selectedSubject = subjectSelect.value;

	tutorList.innerHTML = '';

	var fetch_url = '/api/v1/course/subject/';
	if (selectedSubject == "0") {
		fetch_url = '/api/v1/course'
	} else {
		fetch_url = fetch_url + selectedSubject;
	}
	let r = await fetch(fetch_url, {
		method: 'GET'
	});
	r = await r.json();
	console.log("r: ", r);
	let names = await add_name(r);
	console.log(names);
	//await new Promise(r => setTimeout(r, 4000));
	convert(names);
});

async function test() {

	return 1;
}

async function add_name(jsonData) {
	let prom = [];
	console.log("len: ", jsonData.length);
	for (let i = 0; i < jsonData.length; i++) {
		tutor = fetch('/api/v1/tutors/' + jsonData[i].TutorId, {
				method: 'GET'
			})
			.then(function(response) {
				if (response.ok) {
					return response.json();
				} else {
					throw new Error('Error fetching courses');
				}
			})
			.then(function(js) {
				jsonData[i].tutorName = js.name;
			})
		prom.push(tutor);
	}
	// jsonData.forEach(async function (field) {
	//   tutor = await fetch('/api/v1/tutors/'+ field.TutorId, { method: 'GET' });
	//   tutor= await tutor.json();
	//   console.log("name of tutor:",tutor.name);
	//   field.tutorName = tutor.name;
	// })
	await Promise.all(prom);
	console.log("data with name:", jsonData);
	console.log("data 0", jsonData[0]);
	console.log("name 0:", jsonData[0].tutorName);

	return jsonData;
}

async function convert(jsonData, filter= ['Subject', 'desc', 'price', 'tutorName']) {

  let index = [];

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
  table.style.border="1px solid";

	// Get the keys (column names) of the first object in the JSON data


	//while(jsonData[0].tutorName === undefined);
	//console.log("js0ndata: ", jsonData);
	//console.log("test name: ", jsonData[0].tutorName);
	let cols = Object.keys(jsonData[0]);
	//console.log("from data: : ", jsonData[0])
	// Create the header element
	let thead = document.createElement("thead");
	let tr = document.createElement("tr");
  let i=0;
	// Loop through the column names and create header cells
	cols.forEach((item) => {

		if (filter.includes(item)) {
			let th = document.createElement("th");
			th.innerText = item; // Set the column name as the text of the header cell
			tr.appendChild(th); // Append the header cell to the header row
      index.push(i);
		}
    i++;
	});
	thead.appendChild(tr); // Append the header row to the header
	table.append(tr) // Append the header to the table

	// Loop through the JSON data and create table rows
  i = 0;
	jsonData.forEach((item) => {

    //console.log("item:", item);

		let tr = document.createElement("tr");
    
		// Get the values of the current object in the JSON data
		let vals = Object.values(item);
		let key = Object.values(item);
    let j=0;
		// Loop through the values and create table cells
		vals.forEach((elem) => {
        
        if(index.includes(j)){
          let td = document.createElement("td");
          
          td.style.border="1px solid";
          td.innerText = elem; // Set the value as the text of the table cell
          tr.appendChild(td); // Append the table cell to the table row 
        }
        
        j++;
		});
    let btn = document.createElement("button");
    btn.innerHTML= "browse this course";
		table.appendChild(tr); // Append the table row to the table
    tr.appendChild(btn); // Append the table cell to the table row
    add_list(btn, jsonData[i]._id);
    i++;
	});
	container.appendChild(table) // Append the table to the container element
};

function add_list(btn, data){
  console.log("adding listener to: ", data);
  btn.addEventListener('click', myFunc, false);
  btn.myParam = data;
  function myFunc(evt){
    fetch('/course/'+data, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      //body: JSON.stringify({ email: email, password: password }),
    })
	.then(location.href = '/course/'+data)
    .catch(error => console.error(error));
  }
}