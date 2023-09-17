function displayTasks(tasks) {
    var taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach(function(task, index) {
        var taskItem = document.createElement('div');
        taskItem.innerHTML = task.title + ' (Added: ' + task.dateAdded + ')';

        var deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.addEventListener('click', function() {
            deleteTask(index);
        });

        var editButton = document.createElement('button');
        editButton.innerText = 'Edit';
        editButton.addEventListener('click', function() {
            editTask(index);
        });

        taskItem.appendChild(deleteButton);
        taskItem.appendChild(editButton);
        taskList.appendChild(taskItem);
    });
}

function addTaskAjax(event) {
    event.preventDefault();

    var taskTitle = document.getElementById('taskTitle').value;

    if (taskTitle !== '') {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'backend.php?action=add', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                if (response.success) {
                    getAndDisplayTasks();
                } 
            }
        };
        xhr.send('taskTitle=' + encodeURIComponent(taskTitle));
    }
}

function deleteTask(index) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'backend.php?action=delete&index=' + encodeURIComponent(index), true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.success) {
                getAndDisplayTasks();
            } 
        }
    };
    xhr.send();
}






function getAndDisplayTasks() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'backend.php?action=list', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var tasks = JSON.parse(xhr.responseText);
            displayTasks(tasks);
        }
    };
    xhr.send();
}

function sortTasks() {
    var sortOption = document.getElementById('sortOption').value;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'backend.php?action=sort&option=' + encodeURIComponent(sortOption), true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var tasks = JSON.parse(xhr.responseText);
            displayTasks(tasks);
        }
    };
    xhr.send();
}

function filterTasks() {
    var filterOption = document.getElementById('filterOption').value;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'backend.php?action=filter&option=' + encodeURIComponent(filterOption), true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var tasks = JSON.parse(xhr.responseText);
            displayTasks(tasks);
        }
    };
    xhr.send();
}

function editTask(index) {

    var taskTitle = prompt('Enter the new task title');
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'backend.php?action=edit&index=' + encodeURIComponent(index) + '&taskTitle=' + encodeURIComponent(taskTitle), true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // console.log(xhr.responseText);
            var response = JSON.parse(xhr.responseText);
            if (response.success) {
                getAndDisplayTasks();
            } 
        }
    }
    /* console.log(index);
    console.log(taskTitle); */
    xhr.send();




   
    


            






   
}

// Event listeners
document.getElementById('addTaskForm').addEventListener('submit', addTaskAjax);
document.getElementById('sortOption').addEventListener('change', sortTasks);
document.getElementById('filterOption').addEventListener('input', filterTasks);

// Initial setup
getAndDisplayTasks();