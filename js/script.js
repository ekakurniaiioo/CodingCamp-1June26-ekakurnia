const timeElement = document.getElementById("time");
const dateElement = document.getElementById("date");
const greetingElement = document.getElementById("greeting");
const nameInput = document.getElementById("nameInput");
const themeToggle = document.getElementById("themeToggle");

const timerElement = document.getElementById("timer");
const startTimerButton = document.getElementById("startTimer");
const stopTimerButton = document.getElementById("stopTimer");
const resetTimerButton = document.getElementById("resetTimer");

const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const taskMessage = document.getElementById("taskMessage");

const linkNameInput = document.getElementById("linkNameInput");
const linkUrlInput = document.getElementById("linkUrlInput");
const addLinkButton = document.getElementById("addLink");
const quickLinks = document.getElementById("quickLinks");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let links = JSON.parse(localStorage.getItem("links")) || [];
let userName = localStorage.getItem("userName") || "";
let theme = localStorage.getItem("theme") || "light";

let timerSeconds = 25 * 60;
let timerInterval = null;

function updateClock() {
    const now = new Date();

    timeElement.textContent = now.toLocaleTimeString("en-US", {
        hour12: false,
    });

    dateElement.textContent = now.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    const hour = now.getHours();
    let greeting = "Good Evening";

    if (hour < 12) {
        greeting = "Good Morning";
    } else if (hour < 18) {
        greeting = "Good Afternoon";
    }

    greetingElement.textContent = userName
        ? `${greeting}, ${userName}`
        : greeting;
}

function applyTheme() {
    if (theme === "dark") {
        document.body.classList.add("dark");
        themeToggle.textContent = "Light Mode";
    } else {
        document.body.classList.remove("dark");
        themeToggle.textContent = "Dark Mode";
    }
}

themeToggle.addEventListener("click", function () {
    theme = theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", theme);
    applyTheme();
});

nameInput.value = userName;

nameInput.addEventListener("input", function () {
    userName = nameInput.value.trim();
    localStorage.setItem("userName", userName);
    updateClock();
});

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach(function (task, index) {
        const li = document.createElement("li");
        li.className = task.done ? "task-item done" : "task-item";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.done;

        checkbox.addEventListener("change", function () {
            tasks[index].done = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        const span = document.createElement("span");
        span.textContent = task.text;

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "small";

        editButton.addEventListener("click", function () {
            const newTask = prompt("Edit task:", task.text);

            if (!newTask || !newTask.trim()) {
                return;
            }

            const isDuplicate = tasks.some(function (item, taskIndex) {
                return (
                    item.text.toLowerCase() === newTask.trim().toLowerCase() &&
                    taskIndex !== index
                );
            });

            if (isDuplicate) {
                alert("Task already exists!");
                return;
            }

            tasks[index].text = newTask.trim();
            saveTasks();
            renderTasks();
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "small delete";

        deleteButton.addEventListener("click", function () {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(editButton);
        li.appendChild(deleteButton);

        taskList.appendChild(li);
    });
}

function addTask() {
    const taskText = taskInput.value.trim();
    taskMessage.textContent = "";

    if (!taskText) {
        taskMessage.textContent = "Task cannot be empty.";
        return;
    }

    const isDuplicate = tasks.some(function (task) {
        return task.text.toLowerCase() === taskText.toLowerCase();
    });

    if (isDuplicate) {
        taskMessage.textContent = "This task already exists.";
        return;
    }

    tasks.push({
        text: taskText,
        done: false,
    });

    taskInput.value = "";
    saveTasks();
    renderTasks();
}

addTaskButton.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});

function formatTimer(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
        remainingSeconds
    ).padStart(2, "0")}`;
}

function updateTimerDisplay() {
    timerElement.textContent = formatTimer(timerSeconds);
}

startTimerButton.addEventListener("click", function () {
    if (timerInterval) {
        return;
    }

    timerInterval = setInterval(function () {
        if (timerSeconds > 0) {
            timerSeconds--;
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            timerInterval = null;
            alert("Focus session finished!");
        }
    }, 1000);
});

stopTimerButton.addEventListener("click", function () {
    clearInterval(timerInterval);
    timerInterval = null;
});

resetTimerButton.addEventListener("click", function () {
    clearInterval(timerInterval);
    timerInterval = null;
    timerSeconds = 25 * 60;
    updateTimerDisplay();
});

function saveLinks() {
    localStorage.setItem("links", JSON.stringify(links));
}

function renderLinks() {
    quickLinks.innerHTML = "";

    links.forEach(function (link, index) {
        const div = document.createElement("div");
        div.className = "link-item";

        const anchor = document.createElement("a");
        anchor.href = link.url;
        anchor.target = "_blank";
        anchor.textContent = link.name;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "×";

        deleteButton.addEventListener("click", function () {
            links.splice(index, 1);
            saveLinks();
            renderLinks();
        });

        div.appendChild(anchor);
        div.appendChild(deleteButton);
        quickLinks.appendChild(div);
    });
}

function addLink() {
    const name = linkNameInput.value.trim();
    let url = linkUrlInput.value.trim();

    if (!name || !url) {
        alert("Please fill link name and URL.");
        return;
    }

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = `https://${url}`;
    }

    links.push({
        name: name,
        url: url,
    });

    linkNameInput.value = "";
    linkUrlInput.value = "";

    saveLinks();
    renderLinks();
}

addLinkButton.addEventListener("click", addLink);

setInterval(updateClock, 1000);

applyTheme();
updateClock();
updateTimerDisplay();
renderTasks();
renderLinks();