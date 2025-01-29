let currentFolder = "Default";
let deleteFolder = ""

class Task {
  constructor(title, dis, prio) {
    this.title = title;
    this.dis = dis;
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
  const addTask = document.querySelector(".add-task");
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
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const folder = document.querySelector(".project-name");
    storeProject(folder.value);
    selectedFolder()
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

function renderTask(folder) {
  const con = document.querySelector(".task-con");
  con.innerHTML = "";
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
    const prio = document.querySelector(".task-prio");

    const task = new Task(title.value, dis.value, prio.value);
    storeTask(currentFolder, task);
    createTask(task);
  });
  close.addEventListener("click", () => dialog.close());
}

function selectedFolder() {
  const projects = document.querySelectorAll(".project-folder");
  projects.forEach((project) => {
    project.addEventListener("click", (e) => {
      renderTask(e.target.innerText);
      currentFolder = e.target.innerText;
    });
  });
}

function storeTask(selectedFolder, task) {
  const project = localStorage.getItem(selectedFolder);
  const localTasks = project ? JSON.parse(project) : [];
  localTasks.push(task);
  localStorage.setItem(selectedFolder, JSON.stringify(localTasks));
}

function createTask(task) {
  const newTask = document.createElement("div");
  const con = document.querySelector(".task-con");
  newTask.className = "task";
  newTask.innerHTML = `<div class="task">
          <div class="title">${task.title}</div>
          <div class="dis">${task.dis}</div>
          <div class="priority">${task.prio}</div>
          <button class="edit">Edit</button>
          <button class="delete">Delete</button>
        </div>`;
  con.appendChild(newTask);
}

function deleteProject() {
  const deleteButtons = document.querySelectorAll(".delete-folder");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      deleteFolder = e.target.previousSibling.innerText;
      localStorage.removeItem(deleteFolder);
      e.target.parentElement.remove();
    });
  });
}

export function interactions() {
  addProject();
  openTask();
  createProject();
  renderFolder();
  addTask();
  selectedFolder();
}
