let formEl = document.querySelector("#task-form");
let tasksToDoEl = document.querySelector("#tasks-to-do")

let createTaskHandler = function (event) {
    event.preventDefault();

    let listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    listItemEl.textContent = "This is a new task.";
    tasksToDoEl.appendChild(listItemEl);
};

//waiting for click on button el with a type attribute that has value submit
formEl.addEventListener('submit', createTaskHandler)
