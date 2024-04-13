const urlBase = "http://localhost/UniGather/API";
const extension = "php";

let id = 1;
let eventId = 1;
let firstName = "";
let lastName = "";
let email = "";

document.addEventListener("DOMContentLoaded", function () {
	loadComments();
	document
		.getElementById("add-comment-btn")
		.addEventListener("click", addComment);
	// Add event listener for edit comment buttons
	document.querySelectorAll(".edit-comment-btn").forEach(function (btn) {
		btn.addEventListener("click", function () {
			let commentDiv = btn.closest(".comment");
			let commentContent = commentDiv.querySelector(".comment-content");
			let newText = prompt(
				"Enter the edited comment:",
				commentContent.textContent.trim()
			);
			if (newText !== null && newText.trim() !== "") {
				editComment(id, eventId, newText);
			}
		});
	});
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
					deleteBtn.addEventListener("click", function () {
						deleteComment(comment.userId);
					});

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

// Edit a comment
function editComment(userId, eventId, newText) {
	let tmp = {
		userId: userId,
		eventId: eventId,
		text: newText,
	};

	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + "/EditComment." + extension;
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
				// Reload comments after editing a comment
				loadComments();
			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		console.log(err.message);
	}
}

// Delete a comment
function deleteComment(userId) {
	let tmp = {
		userId: userId,
		eventId: eventId,
	};

	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + "/DeleteComment." + extension;
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
				// Reload comments after deleting a comment
				loadComments();
			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		console.log(err.message);
	}
}

// Add a new comment
function addComment() {
	let commentText = document.getElementById("comment-content").value;

	let tmp = {
		eventId: eventId,
		userId: id,
		text: commentText,
	};

	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + "/AddComment." + extension;
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
				// Reload comments after adding a new comment
				loadComments();
				document.getElementById("comment-content").value = ""; // Clear the input field
			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		console.log(err.message);
	}
}
