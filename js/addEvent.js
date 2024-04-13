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
  let eventSuccess = false;

  try {
    xhr.onreadystatechange = function () {
      if (this.status == 409) {
        document.getElementById("addEventResult").innerHTML =
          "Event already exists";
        return;
      }

      if (this.status == 200) {
        if (!eventSuccess) {
          window.alert("Event created!");
          eventSuccess = true;
        }

        window.alert("Event created!");
        console.log("Event has been added!");
        showLogin();
      }
    };

    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("addEventResult").innerHTML = err.message;
  }
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
