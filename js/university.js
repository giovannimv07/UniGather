const urlBase = "http://localhost/UniGather/API";
const extension = "php";

let id = 1;
let uni = 1;
let firstName = "";
let lastName = "";
let email = "";

document.addEventListener("DOMContentLoaded", function () {
	loadRSO();
	document
		.querySelector(".btn-open-popup")
		.addEventListener("click", togglePopup);
	// document
	// 	.querySelector(".btn-close-popup")
	// 	.addEventListener("click", togglePopup);
});

function loadRSO() {
	let tmp = {
		uniId: uni,
	};
	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + "/RSO." + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
				if (jsonObject.error) {
					console.log(jsonObject.error);
					return;
				}
				// Update University information
				document.querySelector(".university-info h2").textContent =
					jsonObject.uniInfo[0].name;
				document.querySelector(
					".university-info p:nth-child(2)"
				).textContent = "Location: " + jsonObject.uniInfo[0].location;
				document.querySelector(
					".university-info p:nth-child(3)"
				).textContent =
					"Description: " + jsonObject.uniInfo[0].description;
				document.querySelector(
					".university-info p:nth-child(4)"
				).textContent =
					"Number of students: " + jsonObject.uniInfo[0].students;

				// Update RSO Cards
				let rsoContainer = document.querySelector(".rso-cards");
				rsoContainer.innerHTML = ""; // Clear previous cards
				jsonObject.rsos.forEach((rso) => {
					let card = document.createElement("div");
					card.classList.add("card");
					card.dataset.rosId = rso.rsoId;

					let header = document.createElement("div");
					header.classList.add("card-header");
					header.innerHTML = `<h3>${rso.name}</h3><p class="students">${rso.students} Students</p>`;
					card.appendChild(header);

					let content = document.createElement("div");
					content.classList.add("card-content");
					content.innerHTML = `<p>Description: ${rso.description}</p>`;
					card.appendChild(content);

					// Create the Join button with onclick event
					let joinButton = document.createElement("button");
					joinButton.classList.add("add-button");
					joinButton.textContent = "Join";
					joinButton.onclick = function () {
						joinRSO(joinButton, rso.rsoId); // Pass the RSO ID to joinRSO function
					};

					card.appendChild(joinButton);
					rsoContainer.appendChild(card);

					RSOMember(joinButton, rso.rsoId);
				});
			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		console.log(err.message);
	}
}

function RSOMember(button, rsoId) {
	let tmp = {
		rsoId: rsoId,
		userId: id,
	};

	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + "/RSOMember." + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
				if (jsonObject.error) {
					console.log(jsonObject.error);
					return;
				}
				if (jsonObject.member) {
					button.textContent = "Joined";
					button.style.backgroundColor = "grey";
				}
			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		console.log(err.message);
	}
}

function joinRSO(button, rsoId) {
	let member = button.textContent.trim() === "Join" ? "a" : "l";
	let tmp = {
		rsoId: rsoId,
		userId: id,
		type: member,
	};

	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + "/Member." + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
				if (jsonObject.error) {
					console.log(jsonObject.error);
					return;
				}
				if (member == "a") {
					button.textContent = "Joined";
					button.style.backgroundColor = "grey";
				} else {
					button.textContent = "Join";
					button.style.backgroundColor = "yellow";
				}
				loadRSO();
			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		console.log(err.message);
	}
}

function togglePopup() {
	var popup = document.getElementById("popupOverlay");
	popup.style.display =
		popup.style.display == "none" || popup.style.display == ""
			? "block"
			: "none";
}

function createRSO() {
	// Get input values from the form
	let rsoName = document.getElementById("rsoName").value;
	// let member1Name = document.getElementById("member1Name").value;
	let member1Id = parseInt(document.getElementById("member1Id").value);
	// let member2Name = document.getElementById("member2Name").value;
	let member2Id = parseInt(document.getElementById("member2Id").value);
	// let member3Name = document.getElementById("member3Name").value;
	let member3Id = parseInt(document.getElementById("member3Id").value);
	// let member4Name = document.getElementById("member4Name").value;
	let member4Id = parseInt(document.getElementById("member4Id").value);
	let description = document.getElementById("description").value;
	let admin = document.getElementById("Admin").value;
	checkMembers(member1Id, member2Id, member3Id, member4Id, function (valid) {
		if (!valid) {
			alert("All members must belong to the same university.");
			return;
		}
		switch (admin) {
			case "1":
				makeAdmin(member1Id);
				break;
			case "2":
				makeAdmin(member2Id);
				break;
			case "3":
				makeAdmin(member3Id);
				break;
			default:
				makeAdmin(member4Id);
		}

		// Create a JSON payload with the RSO details
		let rsoData = {
			name: rsoName,
			uniId: uni,
			members: 4,
			info: description,
		};
		// members: [
		// 	{ id: member1Id },
		// 	{ id: member2Id },
		// 	{ id: member3Id },
		// 	{ id: member4Id },
		// ],

		// Send the JSON payload to your server-side PHP script for RSO creation
		let url = urlBase + "/AddRSO." + extension;
		let xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try {
			xhr.onreadystatechange = function () {
				if (this.readyState == 4 && this.status == 200) {
					let jsonObject = JSON.parse(xhr.responseText);
					if (jsonObject.error) {
						console.log(jsonObject.error);
						return;
					}
					// Handle success response from server
					alert("RSO created successfully!");
					togglePopup(); // Close the popup after RSO creation
					loadRSO(); // Refresh RSO data on the page
				}
			};
			xhr.send(JSON.stringify(rsoData)); // Send JSON payload to server
		} catch (err) {
			console.log(err.message);
		}
	});
}

function checkMembers(id1, id2, id3, id4, callback) {
	let tmp = {
		user1: id1,
		user2: id2,
		user3: id3,
		user4: id4,
	};

	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + "/CheckMembers." + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
				callback(jsonObject.valid);
			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		console.log(err.message);
	}
}

function makeAdmin(admin) {
	let tmp = {
		userId: admin,
	};

	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + "/makeAdmin." + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
				if (jsonObject.error) {
					console.log(jsonObject.error);
					return;
				}
			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		console.log(err.message);
	}
}
