"use strict";

// Fetching all kids data

fetch("/api")
  .then(handleResponse)
  .then((responseData) => {
    document.body.insertAdjacentHTML("afterbegin", tableBlueprint());
    document.body.insertAdjacentHTML("afterbegin", insertModal());
    document.body.insertAdjacentHTML("afterbegin", insertModalEdit());

    console.log("Raw response", responseData);

    const tableBody = document.querySelector("tbody");

    // Sort kids by age and store in separate variables
    const kids0to2 = responseData.data.Kids.filter(
      (kid) => kid.age >= 0 && kid.age < 2
    );
    const kids2to4 = responseData.data.Kids.filter(
      (kid) => kid.age >= 2 && kid.age < 3
    );
    const kids4Plus = responseData.data.Kids.filter((kid) => kid.age >= 3);

    console.log(kids0to2);
    console.log(kids2to4);
    console.log(kids4Plus);

    // Utility variable to number rows in a sequencial order

    let counter = [];

    // Sort kids within each variable alphabetically by name

    function insertAndColorRows(kids, color) {
      kids
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach((el) => {
          el.color = color;
          el.count = 1 + counter.length;
          counter.push("");
          tableBody.insertAdjacentHTML("beforeend", insertTableRows(el));
        });
    }

    insertAndColorRows(kids0to2, "green");
    insertAndColorRows(kids2to4, "blue");
    insertAndColorRows(kids4Plus, "red");

    // These select buttons INSIDE the modal windows. Dont confuse with table buttons.
    const printThisWeek = document.querySelector(".button-print.this-week");
    const printNextWeek = document.querySelector(".button-print.next-week");
    const saveButton = document.querySelector(".modal-footer .save");
    const deleteButton = document.querySelector(".modal-footer .delete");
    const editButtons = document.querySelectorAll(".edit-button");
    const createRecordButton = document.querySelector(".button-newRecord");

    // DELETE button in modal
    document.querySelectorAll(".modal-delete button").forEach((el) =>
      el.addEventListener("click", (e) => {
        const deleteButton = document.querySelector(".modal-footer .delete");
        deleteButton.setAttribute(
          "data-index",
          e.target.getAttribute("data-index")
        );
      })
    );

    // FINAL DELETE button
    deleteButton.addEventListener("click", (e) => {
      deleteRecord(e);
    });

    let editToCreateToggle = "";

    // EDIT button

    editButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        document.querySelector("#editRecord .modal-title").innerHTML =
          "Edit existing record";
        editToCreateToggle = "edit";
        console.log(editToCreateToggle);

        // Filling up existing fields with a data of the record

        // Reset all checkboxes

        flushInputFields();

        const checkboxes = document.querySelectorAll(
          ".modal-body .form-check-input"
        );
        const recordIndex = e.target.getAttribute("data-index");
        const currentRecord = responseData.data.Kids.find(
          (kid) => kid._id === recordIndex
        );
        console.log(currentRecord);

        document
          .querySelector("#editRecord .modal-body #name")
          .setAttribute("placeholder", currentRecord.name);
        document
          .querySelector("#editRecord .modal-body #age")
          .setAttribute("placeholder", currentRecord.age);

        console.log(checkboxes);
        console.log(currentRecord.days);

        checkboxes.forEach((box) => {
          if (currentRecord.days.includes(box.value)) {
            box.checked = true;
          }
        });

        saveButton.setAttribute(
          "data-index",
          e.target.getAttribute("data-index")
        );
      });
    });

    saveButton.addEventListener("click", (e) => {
      console.log("clicked");
      editToCreateToggle == "edit" ? updateExistingRecord(e) : postNewRecord();
    });

    // BUTTON CREATE NEW RECORD

    createRecordButton.addEventListener("click", (e) => {
      flushInputFields();
      editToCreateToggle = "create";
      document.querySelector("#editRecord .modal-title").innerHTML =
        "Create new record";
      console.log(editToCreateToggle);
    });

    // BUTTON SEND TO PRINT

    // Assuming printThisWeek and currentWeek are defined elsewhere in your code

    printThisWeek.addEventListener("click", (e) => {
      fetch(`/api/send-email`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ weekType: "currentWeek" }),
      })
        .then((response) => {
          console.log("RESPONSE", response);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.text();
        })
        .then((responseText) => {
          console.log("Response Text:", responseText);

          // Here we are checking the exact text sent by the server
          if (responseText === "Email sent successfully") {
            alert("Email sent successfully");
          } else {
            console.error("Server responded with:", responseText);
          }
        })
        .catch((error) => {
          console.error("Error sending email: ", error);
        });
    });

    printNextWeek.addEventListener("click", (e) => {
      fetch(`/api/send-email`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ weekType: "nextWeek" }),
      })
        .then((response) => {
          console.log("RESPONSE", response);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.text();
        })
        .then((responseText) => {
          console.log("Response Text:", responseText);

          // Here we are checking the exact text sent by the server
          if (responseText === "Email sent successfully") {
            alert("Email sent successfully");
          } else {
            console.error("Server responded with:", responseText);
          }
        })
        .catch((error) => {
          console.error("Error sending email: ", error);
        });
    });

    //Dont put code below this line
  })
  .catch((err) => {
    console.log("Fetch error: " + err);
  });

// HELPER FUNCTIONS

// DOM HELPER FUNCTIONS

function flushInputFields() {
  const checkboxes = document.querySelectorAll(".modal-body .form-check-input");
  const nameInput = document.querySelector("#editRecord .modal-body #name");
  const ageInput = document.querySelector("#editRecord .modal-body #age");

  nameInput.setAttribute("placeholder", "Enter name");
  ageInput.setAttribute("placeholder", "Enter Age");
  checkboxes.forEach((box) => {
    box.checked = false;
  });
}

function tableBlueprint() {
  return `
  <body>
  <table class="table table-striped container-fluid table-responsive">
    <colgroup>
      <col style="width: 5%" />
      <col style="width: 25%" />
      <col style="width: 5%" />
      <col style="width: 35%" />
      <col />
      <col />
    </colgroup>
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">NAME</th>
        <th scope="col" class="text-center">AGE</th>
        <th scope="col" class="text-center">DAYS</th>
        <th scope="col"></th>
        <th scope="col">
          <button class="btn btn-danger btn-primary btn-sm button-print this-week">PRINT THIS WEEK</button>
          <button class="btn btn-danger btn-primary btn-sm button-print next-week">PRINT NEXT WEEK</button>
        </th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  </table>
    `;
}

function insertTableRows(data, counter) {
  const html = `
  <tr>
  <th scope="row">${data.count}</th>
  <td style="color: ${data.color}">${data.name}</td>
  <td class="text-center">${data.age}</td>
  <td>
    <div class="h-100 text-center d-flex justify-content-between">
      <div class="col day monday">${
        data.days.includes("Mo") ? "Mo" : "&#10005"
      }</div>
      <div class="col day tuesday">${
        data.days.includes("Tu") ? "Tu" : "&#10005"
      }</div>
      <div class="col day wednesday">${
        data.days.includes("We") ? "We" : "&#10005"
      }</div>
      <div class="col day thursday">${
        data.days.includes("Th") ? "Th" : "&#10005"
      }</div>
      <div class="col day friday">${
        data.days.includes("Fr") ? "Fr" : "&#10005"
      }</div>
    </div>
  </td>
  <td class="text-center edit">
    <button type="button" data-index="${
      data._id
    }" class="btn btn-primary btn-sm edit-button" data-toggle="modal" data-target="#editRecord">
      EDIT
    </button>
  </td>
  <td class="text-center modal-delete">
    <button type="button" data-index="${
      data._id
    }" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#deleteWarning">
      DELETE
    </button>
  </td>
</tr>`;
  return html;
}

function insertModal() {
  return `
  <div class="modal fade" id="deleteWarning" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Warning</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        You are going to delete a record, would you like to proceed?
      </div>
      <div class="modal-footer justify-content-between">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Go Back</button>
        <button type="button" class="btn btn-primary delete">Delete</button>
      </div>
    </div>
  </div>
</div>
`;
}

function insertModalEdit() {
  return `
  <div class="modal fade" id="editRecord" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle"></h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
       
        <form>
          <div class="form-group">
            <label for="name">Name:</label>
            <input
              type="text"
              class="form-control"
              id="name"
              aria-describedby="kidName"
              placeholder="Enter full name"
            />
          </div>

          <div class="form-group">
            <label for="age">Age:</label>
            <input
              type="number"
              class="form-control"
              id="age"
              aria-describedby="kidName"
              placeholder="Enter age"
            />
          </div>

          <div class="form-group">
            <label for="days">Days:</label>
            <div class="d-flex justify-content-center">
              <div class="form-check mr-5 form-check-inline flex-column">
                <label class="form-check-label mb-3" for="monday">Mo</label>
                <input class="form-check-input" type="checkbox" id="monday" name="days" value="Mo">
              </div>
              <div class="form-check mr-5 form-check-inline flex-column">
                <label class="form-check-label mb-3" for="tuesday">Tu</label>
                <input class="form-check-input" type="checkbox" id="tuesday" name="days" value="Tu">
              </div>
              <div class="form-check mr-5 form-check-inline flex-column">
                <label class="form-check-label mb-3" for="wednesday">We</label>
                <input class="form-check-input" type="checkbox" id="wednesday" name="days" value="We">
              </div>
              <div class="form-check mr-5 form-check-inline flex-column">
                <label class="form-check-label mb-3" for="thursday">Th</label>
                <input class="form-check-input" type="checkbox" id="thursday" name="days" value="Th">
              </div>
              <div class="form-check mr-5 form-check-inline flex-column">
                <label class="form-check-label mb-3" for="friday">Fr</label>
                <input class="form-check-input" type="checkbox" id="friday" name="days" value="Fr">
              </div>
            </div>
          </div>
          <div class="modal-footer justify-content-between">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Go Back</button>
            <button type="submit" class="btn btn-primary save" data-index = "" >Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
`;
}

function insertConfirmationDelete() {
  return `
      <div class = modal-1>
          <div class = modal-header>
              <button class = close> ${"&#10005"}
              </button>
          </div>
          <div class = "modal-body delete">
                  <div>
                    <h3> Are you sure you want to delete this record? </h3>
                   </div>
                  <div class = action >
                      <button class = "submit" type="submit">DELETE</button>
                      <button class = "abort">GO BACK</button>
              </form>
          </div>
          <div class = modal-footer> 
          </div>
      </div>`;
}

// CRUD helper functions

function handleResponse(response) {
  if (!response.ok) {
    throw new Error("Problem with the request");
  }
  return response.json();
}

//DELETE
function deleteRecord(e) {
  const kidId = e.target.getAttribute("data-index");

  fetch(`/api?id=${kidId}`, {
    method: "DELETE",
  }).then(() => location.reload());
}

// UPDATE RECORD
function updateExistingRecord(e) {
  const kidId = e.target.getAttribute("data-index");
  console.log(kidId);
  const form = document.querySelector("#editRecord form");
  console.log(form);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.querySelector("#name").value;
    const age = form.querySelector("#age").value;
    const newDays = Array.from(
      form.querySelectorAll('input[name="days"]:checked')
    ).map((checkbox) => checkbox.value);

    console.log("NEW DAYS", newDays);

    function daysSchema() {
      this.Monday = newDays.includes("Mo") ? "Mo" : "";
      this.Tuesday = newDays.includes("Tu") ? "Tu" : "";
      this.Wednesday = newDays.includes("We") ? "We" : "";
      this.Thursday = newDays.includes("Th") ? "Th" : "";
      this.Friday = newDays.includes("Fr") ? "Fr" : "";
    }

    const daysObject = new daysSchema();
    const days = Object.values(daysObject).filter(Boolean);
    console.log(days);
    const formData = { name, age, days };

    fetch(`/api?id=${kidId}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then(handleResponse)
      .then((data) => {
        console.log("Form submitted succesfully:", data);
      })
      .then(() => location.reload());
  });
}

// POST NEW

function postNewRecord() {
  const form = document.querySelector("#editRecord form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.querySelector("#name").value;
    const age = form.querySelector("#age").value;
    const days = Array.from(
      document.querySelectorAll('input[name="days"]:checked')
    ).map((checkbox) => checkbox.value);

    //Merging existing days with new input
    const formData = { name, age, days };

    fetch(`/api`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then(handleResponse)
      .then((data) => {
        console.log("Form submitted succesfully:", data);
      })
      .then(() => location.reload());
  });
}

// UPDATE RECORD
