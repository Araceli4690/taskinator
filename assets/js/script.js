let formEl = document.querySelector("#task-form");
let tasksToDoEl = document.querySelector("#tasks-to-do")
let taskIdCounter = 0;
let pageContentEl = document.querySelector("#page-content");
let taskInProgress = document.querySelector("#tasks-in-progress");
let tasksCompletedEl = document.querySelector("#tasks-completed");
let tasks = [];

let taskFormHandler = function (event) {
    event.preventDefault();

    let taskNameInput = document.querySelector("input[name='task-name']").value;
    let taskTypeInput = document.querySelector("select[name='task-type']").value;

    //validate input
    if (!taskNameInput || !taskTypeInput) {
        alert('task form empty, nothing to submit');
        return false;
    }
    formEl.reset();

    let isEdit = formEl.hasAttribute("data-task-id");

    if (isEdit) {
        let taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    else {
        //package data as object
        let taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        };
        //send it as an argument to createTaskEl
        createTaskEl(taskDataObj);
    }

};

let createTaskEl = function (taskDataObj) {
    let listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    //add task id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);
    //create div to hold task infor and add to list item
    let taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    //innerHTML works similar to textContent except we can use actual HTML elemnts
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);

    let taskActionsEl = createTaskActions(taskIdCounter);

    listItemEl.appendChild(taskActionsEl);
    //add entire list item to list
    tasksToDoEl.appendChild(listItemEl);

    taskDataObj.id = taskIdCounter;
    tasks.push(taskDataObj);

    //saving to local storage
    saveTasks();

    //increase task counter for next unique id
    taskIdCounter++;
}

let createTaskActions = function (taskId) {
    let actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";
    //create edit button
    let editButtonEL = document.createElement("button");
    editButtonEL.textContent = "Edit";
    editButtonEL.className = "btn edit-btn";
    editButtonEL.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEL);

    //create delete button
    let deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    //select element
    let statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);

    let statusChoices = ["To Do", "In Progress", "Completed"];
    for (let i = 0; i < statusChoices.length; i++) {
        //creating option element
        let statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute = ("value", statusChoices[i]);

        //append to select
        statusSelectEl.appendChild(statusOptionEl);
    }
    return actionContainerEl;
}
//waiting for click on button el with a type attribute that has value submit
formEl.addEventListener('submit', taskFormHandler)

let taskButtonHandler = function (event) {
    //get target element form event
    let targetEl = event.target;
    //edit button was clicked
    if (targetEl.matches(".edit-btn")) {
        let taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }//delete was clicked 
    else if (targetEl.matches(".delete-btn")) {
        let taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};

let deleteTask = function (taskId) {
    let taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    //array to hole updated list of tasks
    let updatedTaskArr = [];

    //loop through current tasks
    for (let i = 0; i < tasks.length; i++) {
        // if tasks[i].id doesn't match the value of taskId, let's keep that task and push it into the new array
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }

    // reassign tasks array to be the same as updatedTaskArr
    tasks = updatedTaskArr;
    //saving to local storage
    saveTasks();
};

let editTask = function (taskId) {
    let taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    let taskName = taskSelected.querySelector("h3.task-name").textContent;
    let taskType = taskSelected.querySelector("span.task-type").textContent;

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";

    formEl.setAttribute("data-task-id", taskId);
}

let completeEditTask = function (taskName, taskType, taskId) {
    // find the matching task list item
    let taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    //loop through tasks arrary and task obj with new content
    for (let i = o; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    };
    //saving to local storage
    saveTasks();

    alert("Task Updated!");

    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
};

let taskStatusChangeHandler = function (event) {
    //get taks item's id
    let taskId = event.target.getAttribute("data-task-id");

    //get currently selected options value adn coenvert to lowercase
    let statusValue = event.target.value.toLowerCase();

    let taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    } else if (statusValue === "in progress") {
        tasksCompletedEl.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }
    //update tasks in tasks array
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }

    //saving to local storage
    saveTasks();
}

let saveTasks = function () {
    //converting task array into a string for saving in localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

pageContentEl.addEventListener('click', taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);