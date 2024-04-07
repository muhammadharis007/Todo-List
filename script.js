let tasks = [];

loadTasks();
filterTasks();

const deleteCompletedButton = document.getElementById("deleteCompletedButton");
deleteCompletedButton.addEventListener("click", function () {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  filterTasks();
});

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskText = taskInput.value.trim();

  if (taskText !== "") {
    tasks.push({ text: taskText, completed: false, visible: true });
    saveTasks();
    filterTasks();
    taskInput.value = "";
  }
}

document
  .getElementById("taskInput")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      addTask();
    }
  });

function renderTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    if (!task.visible) return;

    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggleCompleted(index));

    const taskText = document.createElement("span");
    taskText.textContent = task.text;
    taskText.style.textDecoration = task.completed ? "line-through" : "none";
    taskText.addEventListener("click", () => toggleCompleted(index));

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-btn");
    deleteButton.innerHTML = "&times;";
    deleteButton.onclick = () => deleteTask(index);

    const editButton = document.createElement("button");
    editButton.classList.add("edit-btn");
    editButton.textContent = "Edit";
    editButton.onclick = () => enableEditMode(taskText, task.text);

    li.appendChild(checkbox);
    li.appendChild(taskText);
    li.appendChild(deleteButton);
    li.appendChild(editButton);

    taskList.appendChild(li);
  });
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  filterTasks();
}

function toggleCompleted(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  filterTasks();
}

function enableEditMode(taskTextElement, currentTaskText) {
  const input = document.createElement("input");
  input.type = "text";
  input.value = currentTaskText;
  input.classList.add("task-input");

  const updateTaskHandler = () => {
    const newText = input.value.trim();
    if (newText !== "") {
      const index = tasks.findIndex((task) => task.text === currentTaskText);
      tasks[index].text = newText;
      saveTasks();
      filterTasks();
    }
  };

  input.addEventListener("blur", updateTaskHandler);
  input.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      updateTaskHandler();
    }
  });

  taskTextElement.replaceWith(input);
  input.focus();
}

function filterTasks() {
  const filter = document.getElementById("filterDropdown").value;
  tasks.forEach((task) => {
    if (filter === "all") {
      task.visible = true;
    } else if (filter === "completed") {
      task.visible = task.completed;
    } else if (filter === "pending") {
      task.visible = !task.completed;
    }
  });
  renderTasks();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
  }
}
