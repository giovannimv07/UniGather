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

function addBox() {
	const boxContainer = document.querySelector(".box-container");
	const newBox = document.createElement("div");
	newBox.classList.add("box", "box-child");
	newBox.innerHTML = `
                <div class="text"> 
                    <h2 class="event-heading">New Box</h2> 
                    <p class="topic">University Name</p> 
                    <p class="topic">RSO hosting</p> 
                    <p class="location">Location here </p>
                    <p class="info">Info of the event would go here blah</p>
                    <button class="delete-button">Delete Event</button>
                </div>`;
	boxContainer.appendChild(newBox);
	// Attach removeBox function to delete button inside the new box
	newBox.querySelector(".delete-button").addEventListener("click", removeBox);
}

// Attach addBox function to button-34
document.querySelector(".button-34").addEventListener("click", addBox);

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
