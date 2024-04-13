const urlBase = "http://localhost/project/API";
const extension = "php";

function addEvent() {
  let eventName = document.getElementById("eventName").value;
  let location = document.getElementById("eventLocation").value;
  let description = document.getElementById("description").value;
  let time = document.getElementById("eventTime").value;
  let date = document.getElementById("eventDate").value;
  let phone = document.getElementById("eventPhone").value;

  document.getElementById("addEventResult").innerHTML = "";

  let tmp = {
    eventName: eventName,
    location: location,
    description: description,
    time: time,
    date: date,
    phone: phone,
  };

  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + "/AddEvent." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  xhr.onload = function () {
    if (xhr.status == 409) {
      document.getElementById("addEventResult").innerHTML =
        "Event already exists";
    } else if (xhr.status == 200) {
      window.alert("Event created!");
      createEventCard(tmp);
      loadEvents();
    }
  };

  xhr.onerror = function () {
    document.getElementById("addEventResult").innerHTML = "Error occurred";
  };

  xhr.send(jsonPayload);
}

function createEventCard(jsonObject) {
  const boxContainer = document.querySelector(".box-container");
  const newBox = document.createElement("div");
  newBox.classList.add("box", "box-child");
  newBox.innerHTML = `
    <div class="text">
    <h2 class="event-heading">${jsonObject.Name}</h2> 
    <p class="topic">${jsonObject.Location}</p> 
    <p class="Date-and-Time">Date and Time: ${jsonObject.Date} ${jsonObject.Time}</p>
    <p class="Phone">Phone: ${jsonObject.Phone}</p>
    <p class="info">Info of the event: ${jsonObject.Description}</p>
  </div>
  <button class="delete-button">Delete Event</button>
            `;
  boxContainer.appendChild(newBox);
  // Attach removeBox function to delete button inside the new box

  return newBox;
}

function loadEvents() {
  let tmp = {
    search: "",
    eventID: 1,
  };

  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + "/SearchEvents." + extension;
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  xhr.onload = function () {
    if (xhr.status == 200) {
      let jsonObject = JSON.parse(xhr.responseText);
      if (jsonObject.error) {
        console.log(jsonObject.error);
        return;
      }

      // Clear existing event cards
      document.getElementById("eventContainer").innerHTML = "";

      // Loop through the results and create event cards
      for (let i = 0; i < jsonObject.results.length; i++) {
        createEventCard(jsonObject.results[i]);
      }
    } else {
      console.error("Failed to load events:", xhr.status, xhr.statusText);
    }
  };

  xhr.onerror = function () {
    console.error("Error occurred while loading events.");
  };

  xhr.send(jsonPayload);
}

function validAddEvent(eventName, location, description, time, date, phone) {
  let eNameErr = (locErr = descripErr = phoneErr = timeErr = dateErr = true);

  if (eventName.value == "") {
    console.log("EVENT NAME IS BLANK");
    eventName.style.borderColor = "red";
  } else {
    console.log("EVENT NAME VALID");
    eNameErr = false;
  }

  if (description.value == "") {
    console.log("DESCRIPTION IS BLANK");
    description.style.borderColor = "red";
  } else {
    console.log("Description is valid.");
    descripErr = false;
  }

  if (location.value == "") {
    console.log("LOCATION IS BLANK");
    location.style.borderColor = "red";
  } else {
    console.log("Location is valid.");
    locErr = false;
  }

  if (phone.value == "") {
    console.log("PHONE IS BLANK");
    phone.style.borderColor = "red";
  } else {
    let regex = /^[2-9]\d{2}-\d{3}-\d{4}$/;

    if (regex.test(phone.value) == false) {
      console.log("PHONE IS NOT VALID");
      phone.style.borderColor = "red";
    } else {
      console.log("PHONE IS VALID");
      phoneErr = false;
    }
  }

  if (time.value == "") {
    console.log("TIME IS BLANK");
    time.style.borderColor = "red";
  } else {
    // Validate the time format using a regular expression (assuming HH:MM format)
    let regex = /^\d{2}:\d{2}$/;

    if (!regex.test(time.value)) {
      console.log("TIME IS NOT VALID");
      time.style.borderColor = "red";
    } else {
      console.log("TIME IS VALID");
      time.style.borderColor = "green";
      timeErr = false; // Assuming timeErr is a variable used to track validation result
    }
  }

  if (date.value == "") {
    console.log("DATE IS BLANK");
    date.style.borderColor = "red";
  } else {
    let regex = /^\d{4}-\d{2}-\d{2}$/;

    if (regex.test(date.value) == false) {
      console.log("DATE IS NOT VALID");
      date.style.borderColor = "red";
    } else {
      date.style.borderColor = "green";
      console.log("DATE IS VALID");
      dateErr = false;
    }
  }

  if ((eNameErr = locErr = descripErr = phoneErr = timeErr = dateErr) == true) {
    return false;
  }

  return true;
}
