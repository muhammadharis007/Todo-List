let tasks = [];
let currentFilter = "all";

const deleteCompletedButton = document.getElementById("deleteCompletedButton");
deleteCompletedButton.disabled = true;

deleteCompletedButton.addEventListener("click", function () {
  tasks = tasks.filter((task) => !task.completed);
  filterTasks(currentFilter);
  updateDeleteButtonState();
});

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskText = taskInput.value.trim();

  if (taskText !== "") {
    tasks.push({ text: taskText, completed: false, visible: true });
    filterTasks(currentFilter);
    taskInput.value = "";
    updateDeleteButtonState();
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
    checkbox.addEventListener("change", () => {
      toggleCompleted(index);
    });

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
  filterTasks(currentFilter);
  updateDeleteButtonState();
}

function toggleCompleted(index) {
  tasks[index].completed = !tasks[index].completed;
  filterTasks(currentFilter);
  updateDeleteButtonState();
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
      filterTasks(currentFilter);
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

function filterTasks(filter = "all") {
  currentFilter = filter;
  tasks.forEach((task) => {
    task.visible =
      filter === "all" ||
      (filter === "completed" && task.completed) ||
      (filter === "pending" && !task.completed);
  });
  renderTasks();
  updateActiveTab();
}

function updateDeleteButtonState() {
  const hasCompletedTasks = tasks.some((task) => task.completed);
  deleteCompletedButton.disabled = !hasCompletedTasks;
}

function updateActiveTab() {
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => {
    if (tab.id === `${currentFilter}Tab`) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }
  });
}

const themeSwitch = document.getElementById("theme-switch");

themeSwitch.addEventListener("change", function () {
  document.body.classList.toggle("dark");
  document.querySelector(".container").classList.toggle("dark");
  document
    .querySelectorAll(
      "h1, input[type='text'], button, hr, ul, li, .delete-btn, .edit-btn, .tab"
    )
    .forEach((element) => element.classList.toggle("dark"));
});

filterTasks(currentFilter);
