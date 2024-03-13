const dateInput = document.getElementById("date-input");
const taskInput = document.getElementById("task-input");
const durationInput = document.getElementById("duration-input");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const outputArea = document.getElementById("output");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function addTask() {
  const dateValue = dateInput.value
    ? formatDate(new Date(dateInput.value))
    : formatDate(new Date());
  const task = taskInput.value.trim();
  const duration = durationInput.value.trim();

  if (task && duration) {
    const formattedDuration = formatDuration(duration);
    const newTask = { date: dateValue, task, duration: formattedDuration };
    tasks.push(newTask);
    saveTasksToLocalStorage();
    renderTasks();
    dateInput.value = "";
    taskInput.value = "";
    durationInput.value = "";
  }
}

function removeTask(index) {
  tasks.splice(index, 1);
  saveTasksToLocalStorage();
  renderTasks();
}

function renderTasks() {
  taskList.innerHTML = "";
  outputArea.value = "";

  tasks.forEach((task, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${task.date} - ${task.task} - ${task.duration}`;

    const removeBtn = document.createElement("button");
    removeBtn.classList.add("rembtn");
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => removeTask(index));

    listItem.appendChild(removeBtn);
    taskList.appendChild(listItem);

    const formattedTask = `${task.date}\n\nDuration: ${task.duration}\nTask: ${task.task}\n\n---\n\n`;
    outputArea.value += formattedTask;
  });
}

function saveTasksToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function formatDuration(duration) {
  const [hours, minutes, seconds] = duration.split(":").map(Number);
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  const formattedHours = Math.floor(totalSeconds / 3600);
  const formattedMinutes = Math.floor((totalSeconds % 3600) / 60);
  const formattedSeconds = totalSeconds % 60;

  return `${formatTime(formattedHours)}:${formatTime(
    formattedMinutes
  )}:${formatTime(formattedSeconds)}`;
}

function formatTime(time) {
  return time.toString().padStart(2, "0");
}

function formatDate(date) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

function copyToClipboard() {
  const taskList = document.getElementById("output");
  taskList.select();
  document.execCommand("copy");
  taskList.blur();
  document.querySelector(".tip").innerText = "Copied! Have a nice day.";
  setTimeout(() => {
    let t = "Tip: Click taskarea to copy it to clipboard";
    document.querySelector(".tip").innerText = t;
  }, 3000);
}

addBtn.addEventListener("click", addTask);
renderTasks();

document.querySelector("#output").addEventListener("click", (e) => {
  copyToClipboard();
});

function setBgEnabled(st) {
  localStorage.setItem("bg_enabled", st ? "1" : "0");
}

function getBgEnabled() {
  let s = localStorage.getItem("bg_enabled");
  let d = true;
  if (s) {
    d = s === "1" ? true : false;
  }
  return d;
}

window.onload = (e) => {
  if (getBgEnabled()) {
    const img = new Image();
    img.src =
      "https://source.unsplash.com/random/2560x1080/?work,office,asthetic";
    img.onload = () => {
      document.querySelector(
        "body"
      ).style.background = `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url("${img.src}")`;
    };

    document.querySelector(".dbg").innerText = "Disable background";
  } else {
    document.querySelector(".dbg").innerText = "Enable background";
  }

  document.querySelector(".dbg").addEventListener("click", (e) => {
    setBgEnabled(!getBgEnabled());
    if (getBgEnabled()) {
      document.querySelector(".dbg").innerText = "Disable background";

      const img = new Image();
      img.src =
        "https://source.unsplash.com/random/1366x768/?work,office,asthetic";
      img.onload = () => {
        document.querySelector(
          "body"
        ).style.background = `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url("${img.src}")`;
      };
    } else {
      document.body.style.background = "";
      document.querySelector(".dbg").innerText = "Enable background";
    }
  });
};

document.querySelector(".gh").addEventListener("click", (e) => {
  window.location.href = `https://github.com/ashusharmasigdev/worktimesheet`;
});

document.querySelector(".ct").addEventListener("click", (e) => {
  window.location.href = `mailto:ashusharma.sigmadev@gmail.com`;
});
