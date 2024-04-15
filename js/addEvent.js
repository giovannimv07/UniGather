const urlBase = "http://localhost/UniGather/API";
const extension = "php";

function addEvent() {
	let eventName = document.getElementById("eventName").value;
	let location = document.getElementById("eventLocation").value;
	let description = document.getElementById("description").value;
	let start = document.getElementById("start").value;
	let end = document.getElementById("end").value;
	let date = document.getElementById("eventDate").value;
	let phone = document.getElementById("eventPhone").value;

	document.getElementById("addEventResult").innerHTML = "";

	let tmp = {
		eventName: eventName,
		location: location,
		description: description,
		start: start,
		end: end,
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
	console.log(jsonObject.location);
	newBox.innerHTML = `
    <div>
    <p class="event-heading">${jsonObject.eventName}</p> 
    <p class="topic">Location: ${jsonObject.LocationName}</p> 
    <p class="Date">Date: ${jsonObject.date}</p>
    <p class="Time">Start: ${jsonObject.start}</p>
    <p class="Time">End: ${jsonObject.end}</p>
    <p class="Phone">Phone: ${jsonObject.phone}</p>
    <p class="info">Info of the event: ${jsonObject.description}</p>
    <div id =”my-map” style = “width:12px; height:12px;”></div>
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
			document.getElementsByClassName(".box-container").innerHTML = "";

			// Loop through the results and create event cards
			for (let i = 0; i < jsonObject.event.length; i++) {
				createEventCard(jsonObject.event[i]);
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

function canUserCreateEvent() {
	let tmp = {
		userId: sessionStorage.getItem("userId"),
		admin: "",
	};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + "/AdminLevel." + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	xhr.onload = function () {
		//If user is found
		if (xhr.status == 200) {
			let jsonObject = JSON.parse(xhr.responseText);
			if (jsonObject != null) {
				let admin = jsonObject.admin;
				if (admin == "A") {
					// If user is admin, toggle the popup form
					togglePopup();
				} else {
					// If user is not admin, show alert
					alert(
						"Only admins are allowed to create events.\n" +
							"You are not authorized to create events."
					);
				}
			} else {
				// Handle error cases (e.g., server error, invalid response)
				console.error(
					"Error fetching admin level:",
					xhr.status,
					xhr.statusText
				);
			}
		}
	};

	// Send the JSON payload to the server
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

	if (
		(eNameErr = locErr = descripErr = phoneErr = timeErr = dateErr) == true
	) {
		return false;
	}

	return true;
}
