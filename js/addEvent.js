function addEvent() {
	let eventName = document.getElementById("eventName").value;
	// let location = document.getElementById("lblresult").value;
	let description = document.getElementById("description").value;
	let start = document.getElementById("start").value;
	let end = document.getElementById("end").value;
	let date = document.getElementById("eventDate").value;
	let phone = document.getElementById("eventPhone").value;
	let type = document.getElementById("eventType").value;
	let rsoId = document.getElementById("rsoId").value;
	console.log("TYPE: ", type);
	if (type != "RSO") {
		rsoId = 0;
	}
	console.log("RSOID type: ", typeof rsoId);

	document.getElementById("addEventResult").innerHTML = "";
	checkForLocation(function (locId) {
		let tmp = {
			Name: eventName,
			LocID: locId,
			Description: description,
			Start: start,
			End: end,
			Date: date,
			Phone: phone,
			type: type,
			uniId: sessionStorage.getItem("uniId"),
			userId: sessionStorage.getItem("userId"),
			rsoId: rsoId,
		};

		let jsonPayload = JSON.stringify(tmp);
		console.log("Payload", jsonPayload);
		localStorage.setItem("Payload", jsonPayload);
		let url = urlBase + "/AddEvent." + extension;

		let xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

		xhr.onload = function () {
			if (xhr.status == 409) {
				alert("Conflicting event times");
				document.getElementById("addEventResult").innerHTML =
					"Conflicting events";
			} else if (xhr.status == 200) {
				window.alert("Event created!");
				createEventCard(tmp);
				loadEvents();
			}
		};

		xhr.onerror = function () {
			document.getElementById("addEventResult").innerHTML =
				"Error occurred";
		};

		xhr.send(jsonPayload);
	});
}

function createEventCard(jsonObject) {
	const boxContainer = document.querySelector(".box-container");
	const newBox = document.createElement("div");
	newBox.classList.add("box", "box-child");
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
            `;
	newBox.dataset.eventId = jsonObject.eventId;
	// Add event listener to the newBox to handle clicks
	newBox.addEventListener("click", function () {
		// Save the event ID to localStorage
		localStorage.setItem("eventId", jsonObject.eventId);
		// Redirect the user to comment.html
		window.location.href = "comments.html";
	});
	boxContainer.appendChild(newBox);
	// Attach removeBox function to delete button inside the new box

	return newBox;
}

function loadEvents() {
	let tmp = {
		userId: sessionStorage.getItem("userId"),
	};

	let jsonPayload = JSON.stringify(tmp);
	console.log("Payload: ", jsonPayload);

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
			console.log("Object: ", jsonObject.event);
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
