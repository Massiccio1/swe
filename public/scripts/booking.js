
const cookies = document.cookie.split("; "); // Ottieni tutti i cookie come array
console.log("cookie: ", cookies)
let token = null;

for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].split("=");
    if (cookie[0] === "token") {
        token = cookie[1];
        break;
    }
}




async function loadBookings() {

  
  var prenotations = document.getElementById("bookings");
  prenotations.innerHTML="";
  const url = "/api/v1/prenotations";

  //test();

	prenotations.innerHTML = '';

	let r = await fetch(url, {
		method: 'GET'
	});
	r = await r.json();
	//console.log("response: ", r);
	let names = await add_name(r);
	console.log("data with names: ",names);
	//await new Promise(r => setTimeout(r, 4000));
  //let sorted = sort_obj_keys(names);
  //console.log("sorted:", sorted);
	convert(names);
}

loadBookings();
//loadBookings();

function test() {
  const prenotations = document.getElementById('test');

  fetch('/api/v1/students')
      .then((resp) => resp.json())
      .then((data) => {
          //console.log(data);
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


{/* <script> function loadBookings() {

const cookies = document.cookie.split("; "); // Ottieni tutti i cookie come array
let token = null;

for (let i = 0; i < cookies.length; i++) {
  const cookie = cookies[i].split("=");
  if (cookie[0] === "token") {
    token = cookie[1];
    break;
  }
}
    var prenotations = document.getElementById("bookings");
    const url = "/api/v1/prenotations";
  
    fetch('/api/v1/prenotations', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
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
  </script> */}

  // async function strip(jsonData, filter=['course','tutoir','student']){
    
  //   jsonData.forEach(element => {
  //     if(element)
  //   });
  // }

  async function add_name(jsonData) {
    let prom = [];
    let stud = [];
    let cour = [];
    var test1 = ['111','www','e','eee','yyy']
    console.log("num of lines: ", jsonData.length);
    for (let i = 0; i < jsonData.length; i++) {
      var tutid = jsonData[i].tutor.split('/').slice(-1);
      tutor = fetch('/api/v1/tutors/' + tutid, {
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
          //console.log("adding tutor name: ", js.name);
          jsonData[i].tutorName = js.name;
        })
      prom.push(tutor);
      var studid = jsonData[i].student.split('/').slice(-1) ;
      //-------------------
      student = fetch('/api/v1/students/' + studid, {
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
        //console.log("adding student email: ", js.email);
        jsonData[i].studentMail = js.email;
      })
    stud.push(student);
    var courid = jsonData[i].course.split('/').slice(-1);
      course = fetch('/api/v1/course/' + courid, {
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
          //console.log("adding tutor name: ", js.name);
          jsonData[i].courseName = js.desc;
        })
      cour.push(course);
    }
    // jsonData.forEach(async function (field) {
    //   tutor = await fetch('/api/v1/tutors/'+ field.TutorId, { method: 'GET' });
    //   tutor= await tutor.json();
    //   console.log("name of tutor:",tutor.name);
    //   field.tutorName = tutor.name;
    // })
    await Promise.all(prom);
    await Promise.all(stud);
    await Promise.all(cour);
    //console.log("data with name:", jsonData);
    //console.log("data 0", jsonData[0]);
    //console.log("name 0:", jsonData[0].tutorName);
  
    return jsonData;
  }
  async function convert(jsonData, filter= ['courseName', 'studentMail', 'timeslot', 'tutorName']) {

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
    let container = document.getElementById("bookings");
  
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
      btn.innerHTML= "delete prenotation";
      table.appendChild(tr); // Append the table row to the table
      // console.log("test splice1: ",jsonData[i].student.split('/').slice(-1))
      // console.log("test splice2: ",jsonData[i].course.split('/').slice(-1))
      // console.log("test splice3: ",jsonData[i].tutor.split('/').slice(-1))
      tr.appendChild(btn); // Append the table cell to the table row
      let data = {_id:jsonData[i].self.split('/').slice(-1),studentId:jsonData[i].student.split('/').slice(-1), courseId:jsonData[i].course.split('/').slice(-1), tutorId:jsonData[i].tutor.split('/').slice(-1), timeslot:jsonData[i].timeslot}
      add_list(btn, data);
      i++;
    });
    container.appendChild(table) // Append the table to the container element
  };
  
  function add_list(btn, data){
    //console.log("adding listener to: ", data);
    btn.addEventListener('click', myFunc, false);
    btn.myParam = data;
    async function myFunc(evt){
      fetch('/api/v1/prenotations/'+data._id, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token, studentId: data.studentId, courseId:data.courseId, tutorId:data.tutorId ,timeslot:data.timeslot}),
      })
        .then(await new Promise(r => setTimeout(r, 200)))
        .then(console.log("deleted with: ",data))
        .then(await loadBookings())
        .catch(error => console.error(error));
    }
  }

  function sort_obj_keys(test_obj) {
    let allKeys = Object.keys(test_obj);

    // sort keys
    allKeys.sort();

    // reverse array to sort in descending order
    allKeys.reverse();
    let temp_obj = {};
    for (let key of allKeys) {
       temp_obj[key] = test_obj[key]
    }
    //console.log("sorted: " , temp_obj)
    return JSON.parse(JSON.stringify(temp_obj));
 }

//  let studentId = req.body.student;
//   let courseId = req.body.course;
//   let tutorId = req.body.tutor;
//   let timeslot = req.body.timeslot;