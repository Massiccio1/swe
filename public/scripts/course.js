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


function getCurrentURL() {
    return window.location.href
}

// Example
const id = getCurrentURL().split('/').slice(-1);


async function loadCourse() {


    var prenotations = document.getElementById("course");
    prenotations.innerHTML = "";
    const url = "/api/v1/course/" + id;

    //test();

    prenotations.innerHTML = '';

    let r = await fetch(url, {
        method: 'GET'
    });
    r = await r.json();
    //console.log("response: ", r);
    let names = await add_tutor(r);
    console.log("data with names: ", names);
    let check = await check_slot(names);
    console.log("data with check: ", check);
    //await new Promise(r => setTimeout(r, 4000));
    //let sorted = sort_obj_keys(names);
    //console.log("sorted:", sorted);
    convert(check);
}

loadCourse();
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


{
    /* <script> function loadBookings() {

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
      </script> */
}

// async function strip(jsonData, filter=['course','tutoir','student']){

//   jsonData.forEach(element => {
//     if(element)
//   });
// }

async function add_tutor(jsonData) {
    let prom = [];
    var test1 = ['111', 'www', 'e', 'eee', 'yyy']
    var tutid = jsonData.tutor.split('/').slice(-1);
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
        .then(async function(js) {
            console.log("found tutor name: ", js.name);
            jsonData.tutorName = js.name;
            jsonData.slot = js.slot;
        })
    prom.push(tutor);
    // jsonData.forEach(async function (field) {
    //   tutor = await fetch('/api/v1/tutors/'+ field.TutorId, { method: 'GET' });
    //   tutor= await tutor.json();
    //   console.log("name of tutor:",tutor.name);
    //   field.tutorName = tutor.name;
    // })
    await Promise.all(prom);
    //console.log("data with name:", jsonData);
    //console.log("data 0", jsonData[0]);
    //console.log("name 0:", jsonData[0].tutorName);
    return jsonData;
}

async function check_slot(js){
    console.log("check data: ", js)
    // let slot = await fetch('/api/v1/tutors/' + js.tutor.split('/').slice(-1)[0], {
    //     method: 'GET'
    // })
    // slot = await slot.json();
    let pren = await fetch('/api/v1/prenotations/tutor/' + js.tutor.split('/').slice(-1)[0], {
        method: 'GET'
    })
    pren = await pren.json();
    console.log("all slots before : ", js.slot);

    pren.forEach((elem) => {//per opgni prenotazione al tutor

        if (js.slot.includes(elem.timeslot)) {//se lo slot è eccupato
            console.log("slot pieno: ",elem.timeslot)
            const index = js.slot.indexOf(elem.timeslot);
                if (index > -1) { // only splice array when item is found
                    js.slot.splice(index, 1); // 2nd parameter means remove one item only
                }
        }
    });
    console.log("all slots after : ", js.slot);
    console.log("all prenotations for tutor: ", pren);

    return js;
}

async function convert(jsonData, filter = ['Subject', 'desc', 'price', 'slot', 'tutorName']) {

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
    let container = document.getElementById("course");

    // Create the table element
    let table = document.createElement("table");
    table.style.border = "1px solid";

    // Get the keys (column names) of the first object in the JSON data


    //while(jsonData[0].tutorName === undefined);
    //console.log("js0ndata: ", jsonData);
    //console.log("test name: ", jsonData[0].tutorName);
    let cols = Object.keys(jsonData);
    //console.log("from data: : ", jsonData[0])
    // Create the header element
    let thead = document.createElement("thead");
    let tr = document.createElement("tr");
    let i = 0;
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


    //console.log("item:", item);

    let tr2 = document.createElement("tr");

    // Get the values of the current object in the JSON data
    let vals = Object.values(jsonData);
    let key = Object.values(jsonData);
    let j = 0;
    // Loop through the values and create table cells
    vals.forEach((elem) => {

        if (index.includes(j)) {
            let td = document.createElement("td");

            td.style.border = "1px solid";
            td.innerText = elem; // Set the value as the text of the table cell
            tr2.appendChild(td); // Append the table cell to the table row 
        }

        j++;
    });
    // let btn = document.createElement("button");
    // btn.innerHTML= "delete prenotation";
    table.appendChild(tr2); // Append the table row to the table
    // console.log("test splice1: ",jsonData[i].student.split('/').slice(-1))
    // console.log("test splice2: ",jsonData[i].course.split('/').slice(-1))
    // console.log("test splice3: ",jsonData[i].tutor.split('/').slice(-1))
    //tr.appendChild(btn); // Append the table cell to the table row
    //let data = {_id:jsonData[i].self.split('/').slice(-1),studentId:jsonData[i].student.split('/').slice(-1), courseId:jsonData[i].course.split('/').slice(-1), tutorId:jsonData[i].tutor.split('/').slice(-1), timeslot:jsonData[i].timeslot}
    let data = {
        test: test
    }
    //add_list(btn, data);
    i++;
    container.appendChild(table) // Append the table to the container element
    console.log("slots: ", jsonData.slot)


    //----------------------
    add_buttons(jsonData)

};

function add_buttons(jsonData) {
    let container = document.getElementById("course");
    // Create the table element
    let table = document.createElement("table");
    table.style.border = "1px solid";

    let n_buttons = jsonData.slot.length;
    console.log("n bottoni: ", n_buttons)
    //console.log("from data: : ", jsonData[0])
    // Create the header element
    let thead = document.createElement("thead");
    let tr0 = document.createElement("tr");
    tr0.innerHTML = "make a reservation for slot"
    tr0.style.columnSpan = "100"
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    let i = 0;
    for (let j = 0; j < n_buttons; j++) {
        let th = document.createElement("tr");
        let btn = document.createElement("button");
        btn.innerHTML = jsonData.slot[j];
        let data = {
            courseId: jsonData.self.split('/').slice(-1)[0],
            tutorId: jsonData.tutor.split('/').slice(-1)[0],
            timeslot: jsonData.slot[j]
        }

        add_list(btn, data)
        btn.style.fontSize = "20px"
        td.appendChild(th); // Append the header cell to the header row
        th.appendChild(btn); // Append the header cell to the header row
    }
    tr.appendChild(td);
    thead.appendChild(tr0); // Append the header row to the header
    thead.appendChild(tr); // Append the header row to the header
    table.append(tr0) // Append the header to the table
    table.append(tr) // Append the header to the table
    container.appendChild(table)
}

function add_list(btn, data) {
    //console.log("adding listener to: ", data);
    // console.log("course: ", typeof data.courseId);
    // console.log("tut: ", data.tutorId);
    // console.log("course: ", data.timeslot);
    btn.addEventListener('click', myFunc, false);
    btn.myParam = data;
    async function myFunc(evt) {
        await fetch('/api/v1/students/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(function(response) {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Error fetching courses');
                }
            })
            .then(function(js) {
                console.log("current student: ", js.self.split('/').slice(-1)[0]);
                me = js.self.split('/').slice(-1)[0];
            })
            .catch(error => console.error(error));
        console.log("type of me", typeof me);
        fetch('/api/v1/prenotations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: token,
                    student: me,
                    course: data.courseId,
                    tutor: data.tutorId,
                    timeslot: data.timeslot
                }),
            })
            .then(console.log("prenotation with: ", data))
            .then(await new Promise(r => setTimeout(r, 200)))
            .then(await loadCourse())
                //.then(await loadBookings())
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