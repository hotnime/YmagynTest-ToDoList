const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function displayTasks() {
    taskList.innerHTML = '';

    if (tasks.length === 0) {
        const noTasksFoundLi = document.createElement('li');
        noTasksFoundLi.textContent = 'No tasks found.';
        noTasksFoundLi.classList.add('no-tasks-found');
        taskList.appendChild(noTasksFoundLi);
    } else {
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            // Add 'completed' or 'pending' class based on the task's status
            li.classList.add(task.isComplete ? 'completed' : 'pending');
            li.innerHTML = `
                <form onsubmit="return false">
                    <input type="checkbox" onclick="markComplete(${index})" ${task.isComplete ? 'checked' : ''}>
                    <input type="text" value="${task.description}" ${task.isComplete ? 'style="text-decoration: line-through;" disabled' : ''}>
                    <div class="task-status">${task.isComplete ? 'Completed' : 'Pending'}</div>
                    <div class="button-container">
                        <button class="save-button" onclick="saveTask(${index})">Save</button>
                        <button class="remove-button" onclick="removeTask('${task.description}')">Remove</button>
                    </div>
                </form>
            `;
            // Apply fade-in effect when adding new tasks
            li.classList.add('fade-in');
            taskList.appendChild(li);

            // Triggering reflow to enable fade-in animation
            // This ensures that the fade-in animation is applied when adding the task
            li.offsetHeight;

            // Remove the fade-in class after the animation finishes
            li.classList.remove('fade-in');
            li.classList.add('active');
        });
    }
}

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        tasks.push({ description: taskText, isComplete: false });
        saveTasks();
        
        // Remove the "No tasks found." text before displaying new tasks
        const noTasksFoundLi = taskList.querySelector('.no-tasks-found');
        if (noTasksFoundLi) {
            taskList.removeChild(noTasksFoundLi);
        }

        displayTasks();
        taskInput.value = '';
    } else {
        // Show an error message when the input is empty
        alert("Please enter a valid task description.");
    }
}

function markComplete(index) {
    tasks[index].isComplete = !tasks[index].isComplete;
    saveTasks(); 
    displayTasks();

    const li = taskList.children[index];
    li.classList.toggle('completed', tasks[index].isComplete);
    li.classList.toggle('pending', !tasks[index].isComplete);
}

function removeTask(description) {
    const taskIndex = tasks.findIndex((task) => task.description === description);
    if (taskIndex !== -1) {
        const shouldRemove = window.confirm('Are you sure you want to remove this task?');
        if (shouldRemove) {
            const li = taskList.children[taskIndex];
            li.classList.add('fade-out');
            li.addEventListener('transitionend', () => {
                tasks.splice(taskIndex, 1);
                saveTasks();

                // Remove the task element after the fade-out animation completes
                taskList.removeChild(li);

                // If all tasks are removed, show "No tasks found." text
                if (tasks.length === 0) {
                    const noTasksFoundLi = document.createElement('li');
                    noTasksFoundLi.textContent = 'No tasks found.';
                    noTasksFoundLi.classList.add('no-tasks-found');
                    taskList.appendChild(noTasksFoundLi);
                }
            });
        }
    }
}


function updateTaskDescription(index, description) {
    tasks[index].description = description;
    saveTasks();
}

function saveTask(index) {
    const taskDescriptionInput = taskList.children[index].querySelector('input[type="text"]');
    const newDescription = taskDescriptionInput.value.trim();
    if (newDescription !== '') {
        updateTaskDescription(index, newDescription); // Call updateTaskDescription with the new description
        displayTasks(); // Redisplay the tasks after updating the description
    } else {
        // Show an error message when the input is empty
        alert("Please enter a valid task description.");
    }
}

displayTasks();