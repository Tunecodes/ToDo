let currentFolder = "All Tasks";

class Task {
  constructor(title, dis, date, prio) {
    this.title = title;
    this.dis = dis;
    this.date = date;
    this.prio = prio;
  }
}

function addProject() {
  const addProject = document.querySelector(".add-project");
  const projectDia = document.querySelector(".project-dialog");
  addProject.addEventListener("click", () => {
    projectDia.showModal();
  });
}

function openTask() {
  const addTask = document.querySelector(".new-task");
  const taskDia = document.querySelector(".task-dialog");
  addTask.addEventListener("click", () => taskDia.showModal());
}

function createProject() {
  const form = document.querySelector(".project-form");
  const dialog = document.querySelector(".project-dialog");
  const close = document.querySelector(".project-close");

  function storeProject(folder) {
    if (localStorage.getItem(folder) === null) {
      localStorage.setItem(folder, JSON.stringify([]));
      dialog.close();
      createFolder(folder);
      deleteProject();
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const folder = document.querySelector(".project-name");
    storeProject(folder.value);
    selectedFolder();
  });

  close.addEventListener("click", () => {
    dialog.close();
  });
}

function renderFolder() {
  for (let i = 0; i < localStorage.length; i++) {
    createFolder(localStorage.key(i));
  }
}

function clearTasks(){
  const con = document.querySelector(".task-con");
  con.innerHTML = "";
}

function renderTask(folder) {
  const tasks = JSON.parse(localStorage.getItem(folder));
  for (let i = 0; i < tasks.length; i++) {
    createTask(tasks[i]);
  }
}

function createFolder(folder) {
  const folderCon = document.querySelector(".projects");
  const project = document.createElement("div");
  project.className = "folder-button";
  project.innerHTML = `<button class="project-folder">${folder}</button><button class="delete-folder">X</button>`;
  folderCon.appendChild(project);
}

function addTask() {
  const form = document.querySelector(".task-form");
  const dialog = document.querySelector(".task-dialog");
  const close = document.querySelector(".close-task");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.querySelector(".task-title");
    const dis = document.querySelector(".task-dis");
    const date = document.querySelector(".task-date");
    const prio = document.querySelector(".task-prio");

    const task = new Task(title.value, dis.value, date.value, prio.value);
    storeTask(task);
    createTask(task);

    dialog.close();
  });
  close.addEventListener("click", () => dialog.close());
}

function selectedFolder() {
  const projects = document.querySelectorAll(".project-folder");
  projects.forEach((project) => {
    project.addEventListener("click", (e) => {
      clearTasks();
      renderTask(e.target.innerText);
      currentFolder = e.target.innerText;
    });
  });
}

function storeTask(task) {
  const project = localStorage.getItem(currentFolder);
  const localTasks = project ? JSON.parse(project) : [];
  localTasks.push(task);
  localStorage.setItem(currentFolder, JSON.stringify(localTasks));
}

function createTask(task) {
  const newTask = document.createElement("div");
  const con = document.querySelector(".task-con");
  newTask.className = "task";
  newTask.innerHTML = `<div class="task">
          <div class="title" contenteditable="false">${task.title}</div>
          <div class="dis" contenteditable="false">${task.dis}</div>
          <div class="date" contenteditable="false">${task.date}</div>
          <div class="priority" contenteditable="false">${task.prio}</div>
          <button class="edit">Edit</button>
          <button class="delete-task">Delete</button>
        </div>`;

  con.appendChild(newTask);
  deleteTask();
}

function deleteProject() {
  const deleteButtons = document.querySelectorAll(".delete-folder");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const deleteFolder = e.target.previousSibling.innerText;
      localStorage.removeItem(deleteFolder);
      e.target.parentElement.remove();
    });
  });
}

function deleteTask() {
  const deleteButtons = document.querySelectorAll(".delete-task");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const parent = e.target.parentElement;
      console.log(parent);
      const taskObj = getElements(parent);
      deleteTaskStorage(taskObj);
      parent.parentElement.remove();
    });
  });

  function getElements(parent) {
    return new Task(
      parent.children[0].innerText,
      parent.children[1].innerText,
      parent.children[2].innerText,
      parent.children[3].innerText
    );
  }
}

function deleteTaskStorage(task) {
  const storageTasks = JSON.parse(localStorage.getItem(currentFolder));
  const filteredTasks = storageTasks.filter(
    (storageTask) =>
      !(
        storageTask.title === task.title &&
        storageTask.dis === task.dis &&
        storageTask.date === task.date &&
        storageTask.prio === task.prio
      )
  );
  localStorage.setItem(currentFolder, JSON.stringify(filteredTasks));
}

function editTask() {
  const con = document.querySelector(".task-con");
  con.addEventListener("click", (e) => {
    const parent = e.target.parentElement;
    const elements = parent.querySelectorAll(".title, .dis, .date, .priority");

    if (e.target.classList.contains("edit")) {
      const currentTask = new Task(
        elements[0].innerText,
        elements[1].innerText,
        elements[2].innerText,
        elements[3].innerText
      );
      if (e.target.innerText === "Edit") {
        e.target.innerText = "Save";
        elements.forEach((el) => {
          el.contentEditable = "true";
        });
        deleteTaskStorage(currentTask);
      } else {
        e.target.innerText = "Edit";
        elements.forEach((el) => {
          el.contentEditable = "false";
        });
        changeTask(elements);
      }
    }
  });

  function changeTask(elements) {
    const task = new Task(
      elements[0].innerText,
      elements[1].innerText,
      elements[2].innerText,
      elements[3].innerText
    );
    storeTask(task);
  }
}

function allTasks(){
  const allTaskButton = document.querySelector("#all-tasks")
  allTaskButton.addEventListener("click", ()=> {
    clearTasks();
    Object.keys(localStorage).forEach(key => {
      renderTask(key)
    })
  })
}

export function interactions() {
  addProject();
  openTask();
  createProject();
  renderFolder();
  addTask();
  selectedFolder();
  allTasks();
  document.addEventListener("DOMContentLoaded", () => {
    editTask();
    deleteProject();
  });
}
