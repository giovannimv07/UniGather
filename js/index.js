const urlBase = "http://localhost/UniGather/API";
const extension = "php";

let menuicn = document.querySelector(".menuicn");
let nav = document.querySelector(".navcontainer");

menuicn.addEventListener("click", () => {
	nav.classList.toggle("navclose");
});

function openForm() {
	document.getElementById("myForm").style.display = "block";
}

function closeForm() {
	document.getElementById("myForm").style.display = "none";
}

function togglePopup() {
	const overlay = document.getElementById("popupOverlay");
	overlay.classList.toggle("show");
}

// Function to remove a specific box
function removeBox(event) {
	const box = event.target.closest(".box");
	if (box) {
		box.remove();
	}
}

// Attach removeBox function to delete buttons inside boxes
const deleteButtons = document.querySelectorAll(".delete-button");
deleteButtons.forEach((button) => {
	button.addEventListener("click", removeBox);
});

function displayAdminLvl() {
	const adminLvl = document.getElementById("adminLevelTitle");
	let url = urlBase + "/AdminLevel." + extension;

	// Create a new XMLHttpRequest object
	let xhr = new XMLHttpRequest();

	// Configure the request
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	// Set up event listeners for load and error events
	xhr.onload = function () {
		if (xhr.status == 200) {
			let data = JSON.parse(xhr.responseText);
			if (data.error) {
				// If there's an error, display it
				adminLvl.innerHTML = data.error;
			} else {
				// If there's no error, display the admin level
				switch (data.admin) {
					case "A":
						adminLvl.innerHTML = "Admin Dash";
						break;
					case "SA":
						adminLvl.innerHTML = "SuperAdmin Dash";
						break;
					default:
						adminLvl.innerHTML = "Student Dash";
						break;
				}
			}
		} else {
			// Handle HTTP errors
			console.error("HTTP Error:", xhr.status);
			adminLvl.innerHTML = "Error occurred";
		}
	};

	xhr.onerror = function () {
		// Handle network errors
		console.error("Network Error");
		adminLvl.innerHTML = "Error occurred";
	};

	// Send the request
	xhr.send();
}

function readCookie() {
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for (let i = 0; i < splits.length; i++) {
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if (tokens[0] == "firstName") {
			firstName = tokens[1];
		} else if (tokens[0] == "lastName") {
			lastName = tokens[1];
		} else if (tokens[0] == "userId") {
			userId = parseInt(tokens[1].trim());
		} else if (tokens[0] == "img") {
			profileImage = tokens[1];
		}
	}
}

function doLogout() {
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie =
		"firstName= ,lastName= ,userId= ,email= ,img= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "/";
}

//Processes admin level and returns correct user dashboard title
function adminLvl(admin) {
	if (admin == "A") {
		return "Admin Dashboard";
	} else if (admin == "SA") {
		return "SuperAdmin Dashboard";
	} else {
		return "Student Dashboard";
	}
}

//Looks up current user's Id and return admin level to display
function showLvl() {
	let tmp = {
		userId: sessionStorage.getItem("userId"),
		admin: "",
	};
	let jsonPayload = JSON.stringify(tmp);

	let xhr = new XMLHttpRequest();
	xhr.open("POST", "http://localhost/project/API/AdminLevel.php", true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	xhr.onload = function () {
		//If user is found
		if (xhr.status == 200) {
			let jsonObject = JSON.parse(xhr.responseText);
			if (jsonObject != null) {
				console.log(jsonObject.userId);
				console.log(jsonObject.admin);
				document.getElementById("adminLevel").innerHTML = adminLvl(
					jsonObject.admin
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
	};

	// Send the JSON payload to the server
	xhr.send(jsonPayload);
}
