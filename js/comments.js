const urlBase = "http://localhost/UniGather/API";
const extension = "php";

let id = 1;
let fistName = "";
let lastName = "";
let email = "";

document.addEventListener("DOMContentLoaded", function () {
	loadComments();
});

// Load the comments to a specific event.
function loadComments() {
	let tmp = {
		eventId: 1,
		eventName: "Car Wash",
	};

	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + "/comments." + extension;
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
				// Update event information
				document.querySelector(".event-info h2").textContent =
					jsonObject.eventInfo[0].eventName;
				document.querySelector(
					".event-info p:nth-child(2)"
				).textContent = "Location: " + jsonObject.eventInfo[0].location;
				document.querySelector(
					".event-info p:nth-child(3)"
				).textContent = "Date: " + jsonObject.eventInfo[0].date;
				document.querySelector(
					".event-info p:nth-child(4)"
				).textContent = "Time: " + jsonObject.eventInfo[0].time;
				document.querySelector(
					".event-info p:nth-child(5)"
				).textContent =
					"Description: " + jsonObject.eventInfo[0].description;

				// Update comments
				let commentsSection =
					document.querySelector(".comments-section");
				commentsSection.innerHTML = ""; // Clear existing comments
				jsonObject.comments.forEach((comment) => {
					let commentDiv = document.createElement("div");
					commentDiv.classList.add("comment");
					commentDiv.dataset.userId = comment.userId;

					let commentHeader = document.createElement("div");
					commentHeader.classList.add("comment-header");

					let commentUser = document.createElement("div");
					commentUser.classList.add("comment-user");
					commentUser.textContent = comment.firstName;

					let commentActions = document.createElement("div");
					commentActions.classList.add("comment-actions");

					let editBtn = document.createElement("button");
					editBtn.classList.add("edit-comment-btn");
					editBtn.textContent = "Edit";

					let deleteBtn = document.createElement("button");
					deleteBtn.classList.add("delete-comment-btn");
					deleteBtn.textContent = "Delete";

					if (comment.userId === id) {
						// Show edit and delete buttons only for the current user's comments
						commentActions.appendChild(editBtn);
						commentActions.appendChild(deleteBtn);
					}

					commentHeader.appendChild(commentUser);
					commentHeader.appendChild(commentActions);

					let commentContent = document.createElement("div");
					commentContent.classList.add("comment-content");
					commentContent.textContent = comment.text;

					commentDiv.appendChild(commentHeader);
					commentDiv.appendChild(commentContent);

					commentsSection.appendChild(commentDiv);
				});
			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		console.log(err.message);
	}
}
