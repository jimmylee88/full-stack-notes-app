document.addEventListener("DOMContentLoaded", () => {
  const dataList = document.getElementById("data-list");
  const dataForm = document.getElementById("data-form");
  const dataInput = document.getElementById("data-input");

  // Function to fetch data from the backend
  const fetchData = async () => {
    try {
      const response = await fetch("/data");
      const data = await response.json();
      dataList.innerHTML = ""; // Clear the list before rendering

      data.forEach((item) => {
        const li = document.createElement("li");
        li.setAttribute("data-note-id", item.id);

        const itemText = `<p class="noteContent" contenteditable="false">${item.text}</p>`;
        const deleteBtn = `<button class="delete-note" data-id="${item.id}">❌</button>`;
        const editBtn = `<button class="edit-note" data-id="${item.id}">✏️</button>`;

        li.innerHTML = itemText + editBtn + deleteBtn;
        dataList.appendChild(li);
      });

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Handle form submission to add new data
  dataForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const newData = { text: dataInput.value};

    try {
      const response = await fetch("/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });

      if (response.ok) {
        dataInput.value = ""; // Clear input field
        fetchData(); // Refresh the list
      }
    } catch (error) {
      console.error("Error adding data:", error);
    }
  });

  // Handle clicks within the dataList container
  dataList.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-note')) {
      const noteId = event.target.dataset.id;
      const listItem = event.target.closest('li');

      if (noteId && listItem) {
        handleDelete(noteId, listItem);
      }
    }
  })

  // Fetch data on page load
  fetchData();
});

// Sends the Delete request using fetch
const handleDelete = async (id, listItemElement) => {
  try {
    const response = await fetch(`/data/${id}`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json'
      }
      });

      if (response.ok) {
        listItemElement.remove();
        console.log(`Note ${id} deleted successfully`);
      } else {
        console.error(`Failed to delete note ${id}.`)
      }
    } catch (error) {
      console.error("Error with deleting the note", error);
    }
  };

