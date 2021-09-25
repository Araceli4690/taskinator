let formEl = document.querySelector("#task-form");
let tasksToDoEl = document.querySelector("#tasks-to-do")

let taskFormHandler = function (event) {
    event.preventDefault();

    let taskNameInput = document.querySelector("input[name='task-name']").value;
    let taskTypeInput = document.querySelector("select[name='task-type']").value;
    //package data as object
    let taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput
    };
    //send it as an argument to createTaskEl
    createTaskEl(taskDataObj);
};

let createTaskEl = function (taskDataObj) {
    let listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    //create div to hold task infor and add to list item
    let taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    //innerHTML works similar to textContent except we can use actual HTML elemnts
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);

    //add entire list item to list
    tasksToDoEl.appendChild(listItemEl);
}

//waiting for click on button el with a type attribute that has value submit
formEl.addEventListener('submit', taskFormHandler)
