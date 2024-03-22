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
                </div>`;
            boxContainer.appendChild(newBox);
        }

        // Attach addBox function to button-34
        document.querySelector('.button-34').addEventListener('click', addBox);
