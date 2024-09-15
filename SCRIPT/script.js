document.addEventListener('DOMContentLoaded', loadTasks);
document.getElementById('task-form').addEventListener('submit', addTask);

// Función para agregar una nueva tarea
function addTask(e) {
    e.preventDefault();

    const taskInput = document.getElementById('new-task');
    const taskText = taskInput.value;

    if (taskText === '') return;

    // Capturamos y formateamos la fecha 
    const date = new Date();
    const formattedDate = formatDate(date); // Usamos la función de formato
    const task = {
        text: taskText,
        completed: false,
        date: formattedDate 
    };

    const tasks = getTasksFromStorage();
    tasks.push(task);
    saveTasksToStorage(tasks);

    taskInput.value = '';

    renderTask(task, tasks.length - 1);
}

// Función para mostrar una tarea en la lista
function renderTask(task, index) {
    const taskList = document.getElementById('task-list');
    const li = document.createElement('li');

    li.className = task.completed ? 'completed' : '';
    li.innerHTML = `
        <span class="task-date">${task.date}</span>
        <span class="task-text">${task.text}</span>
        <div class="task-actions">
            <button class="complete">${task.completed ? 'Desmarcar' : 'Completar'}</button>
            <button class="edit">Editar</button>
            <button class="save" style="display:none;">Guardar</button>
            <button class="delete">Eliminar</button>
        </div>
    `;

    li.querySelector('.complete').addEventListener('click', () => toggleComplete(index, li));
    li.querySelector('.edit').addEventListener('click', () => editTask(index, li));
    li.querySelector('.save').addEventListener('click', () => saveTask(index, li));
    li.querySelector('.delete').addEventListener('click', () => deleteTask(index));

    taskList.appendChild(li);
}

// Función para cargar las tareas guardadas
function loadTasks() {
    const tasks = getTasksFromStorage();
    tasks.forEach((task, index) => renderTask(task, index));
}

// Función para marcar o desmarcar una tarea como completada
function toggleComplete(index, li) {
    const tasks = getTasksFromStorage();
    tasks[index].completed = !tasks[index].completed;
    saveTasksToStorage(tasks);

    li.className = tasks[index].completed ? 'completed' : '';
    li.querySelector('.complete').textContent = tasks[index].completed ? 'Desmarcar' : 'Completar';
}

function editTask(index, li) {
    const taskTextSpan = li.querySelector('.task-text');
    const currentText = taskTextSpan.textContent;

    taskTextSpan.innerHTML = `<input type="text" value="${currentText}" class="edit-input">`;

    li.querySelector('.edit').style.display = 'none';
    li.querySelector('.save').style.display = 'inline-block';
}

function saveTask(index, li) {
    const tasks = getTasksFromStorage();
    const newTaskText = li.querySelector('.edit-input').value;

    tasks[index].text = newTaskText;
    saveTasksToStorage(tasks);

    const taskTextSpan = li.querySelector('.task-text');
    taskTextSpan.innerHTML = newTaskText;

    li.querySelector('.edit').style.display = 'inline-block';
    li.querySelector('.save').style.display = 'none';
}

function deleteTask(index) {
    const tasks = getTasksFromStorage();
    tasks.splice(index, 1);
    saveTasksToStorage(tasks);
    reloadTasks();
}

function reloadTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    loadTasks();
}

function getTasksFromStorage() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

function saveTasksToStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Función para formatear la fecha
function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1; 
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}