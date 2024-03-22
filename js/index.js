let menuicn = document.querySelector(".menuicn"); 
let nav = document.querySelector(".navcontainer"); 

menuicn.addEventListener("click", () => { 
	nav.classList.toggle("navclose"); 
})

 function addBox() {
            const boxContainer = document.querySelector('.box-container');
            const newBox = document.createElement('div');
            newBox.classList.add('box', 'box-child');
            newBox.innerHTML = `
                <div class="text"> 
                    <h2 class="event-heading">New Box</h2> 
                    <h2 class="topic">Content</h2> 
                    <button class="delete-box">Delete</button>
                </div>`;
            boxContainer.appendChild(newBox);
             // Attach removeBox function to delete button inside the new box
    newBox.querySelector('.delete-box').addEventListener('click', removeBox);
        }

        // Attach addBox function to button-34
        document.querySelector('.button-34').addEventListener('click', addBox);
        
        
        // Function to remove a specific box
        function removeBox(event) {
            const box = event.target.closest('.box');
            if (box) {
                box.remove();
            }
        }

        // Attach removeBox function to delete buttons inside boxes
        const deleteButtons = document.querySelectorAll('.delete-box');
        deleteButtons.forEach(button => {
            button.addEventListener('click', removeBox);
        });