var request = {
    files: FormData,
    name: String,
    courseId: String,
    loggedUser: {
      email: "my-email@test.com"
    }
  };

  document
    .getElementById("material-name")
    .addEventListener("input", function(e) {
      request.name = e.target.value;
    });

  document
    .getElementById("file-input")
    .addEventListener("change", function(e) {
      if (!request.name) {
        alert("Input course name first!");
        return;
      }

      if (e.target.files[0]) {
        request.files = new FormData();
        request.files.append(request.name, e.target.files[0]);
      }
    });

  document.getElementById("upload-btn").addEventListener("click", upload);

  function upload() {
    if (!request.name) {
      alert("Validation failed. Input teaching material name!");
    }

    if (request.files.length == 0) {
      alert("Validation failed. Choose teaching material file!");
    }

    request.courseId = document.getElementById("course-id").value;

    fetch("/me/teaching-material/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(request)
    })
      .then(function(response) {
        if (response.ok) {
          console.log("Material has been uploaded");
          return;
        }
        throw new Error("Upload failed.");
      })
      .catch(function(error) {
        console.log(error);
      });
  }