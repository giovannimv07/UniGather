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
	// Event listener for edit buttons
	document.addEventListener("click", function (event) {
		if (event.target.classList.contains("edit-comment-btn")) {
			let commentElement = event.target.closest(".comment");
			if (commentElement) {
				let commentContent =
					commentElement.querySelector(".comment-content");
				commentContent.contentEditable = true;
				commentContent.focus();

				// Save changes when editing is finished (e.g., blur or Enter key)
				commentContent.addEventListener("blur", function () {
					EditComment(eventId, id, commentContent.textContent.trim());
				});
				commentContent.addEventListener("keypress", function (event) {
					if (event.key === "Enter") {
						event.preventDefault(); // Prevent line break in contenteditable
						EdiComment(
							eventId,
							id,
							commentContent.textContent.trim()
						);
					}
				});
			}
		}
	});
});

function EditComment(eventId, userId, newText) {
	let tmp = {
		eventId: eventId,
		userId: userId,
		text: newText,
	};
	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + "/EditComment." + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	xhr.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			// Comment updated successfully, handle any UI updates if needed
			console.log("Comment updated in the database");
		}
	};
	xhr.send(jsonPayload);
}

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
					let commentRating = document.createElement("div");
					commentRating.classList.add("comment-rating");
					let ratingLabel = document.createElement("span");
					ratingLabel.classList.add("rating-label");
					ratingLabel.textContent = "Rating: ";
					let starsHTML = "";
					for (let i = 1; i <= 5; i++) {
						if (i <= comment.rating) {
							starsHTML +=
								'<i class="material-icons star-icon">star</i>';
						} else {
							starsHTML +=
								'<i class="material-icons star-icon">star_border</i>';
						}
					}
					commentRating.innerHTML = starsHTML;

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
					commentHeader.appendChild(commentRating);
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
	let rate = document.getElementById("comment-rating").value;
	let rating = parseInt(rate);
	let tmp = {
		eventId: eventId,
		userId: id,
		text: commentText,
		rating: rating,
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
