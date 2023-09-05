const form = document.getElementById('todo-form');
const todoList = document.getElementById('todoList');
const add = document.getElementById('ADD');
let isEditing = false;

document.addEventListener('DOMContentLoaded', () => {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.forEach(todo => {
        createTodoElement(todo.text, todo.id, todo.completed);
    });
});

form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (add.value === '') {
        alert('پشمک اول تایپ کن');
    } else {
        if (add.dataset.edit === 'true') {
            // Edit existing todo
            const todoText = document.getElementById(add.dataset.editid);
            todoText.innerText = add.value;
            add.value = '';
            add.dataset.edit = false;
            isEditing = false; // Editing is now finished
            // Change the edit icon
            const button = document.getElementById('btn');
            button.style.backgroundImage = "url('./asset/Check_green_icon.svg.png')";
        } else {
            // Create a new todo
            const randomNumber = Math.floor(Math.random() * 1000);
            createTodoElement(add.value, randomNumber, false);
            add.value = '';
        }

        // Save todos to localStorage
        saveTodosToLocalStorage();
    }
});

// Create a new todo element and add it to the list
function createTodoElement(text, id, completed) {
    const newTodo = document.createElement('li');
    newTodo.innerHTML = `
        <input type="checkbox" class="todo-checkbox" ${completed ? 'checked' : ''}>
        <strong id="todo-text-${id}" class="${completed ? 'completed' : ''}">${text}</strong>
        <button class="remove" onclick="remove(this)">Remove</button>
        <button class="edit" onclick="edit(this)">Edit</button>
        <hr>
    `;
    todoList.appendChild(newTodo);
}

// Add an event listener to the todoList element for checkbox clicks
todoList.addEventListener('click', (event) => {
    if (event.target.classList.contains('todo-checkbox')) {
        const checkbox = event.target;
        const id = checkbox.nextElementSibling.id.replace('todo-text-', '');
        toggleCompleted(checkbox, id);
    }
});

// Toggle the completed state of a todo and save the updated list to localStorage
function toggleCompleted(checkbox, id) {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    const todoIndex = todos.findIndex(todo => todo.id === id);

    if (todoIndex !== -1) {
        todos[todoIndex].completed = checkbox.checked;
        localStorage.setItem('todos', JSON.stringify(todos));
    }
}


// Remove a todo element and save the updated list to localStorage
function remove(element) {
    if (!isEditing) { // Check if editing is not in progress
        const parent = element.parentElement;
        parent.classList.add('animation');
        setTimeout(function () {
            parent.remove();
            saveTodosToLocalStorage();
        }, 500);
    } else {
        alert("اول edit کن پشمک نژاد")
    }
}

// Edit a todo element and save the updated text to localStorage
function edit(element) {
    const text = element.parentElement.querySelector('strong').innerText;
    add.value = text;
    add.dataset.edit = true;
    add.dataset.editid = element.parentElement.querySelector('strong').id;
    isEditing = true; // Editing is in progress
    // Change the edit icon
    const button = document.getElementById('btn');
    button.style.backgroundImage = "url('./asset/168-512.webp')";
}

// Save todos to localStorage
function saveTodosToLocalStorage() {
    const todos = [];
    const todoElements = todoList.querySelectorAll('li');
    todoElements.forEach(element => {
        const id = element.querySelector('strong').id.replace('todo-text-', '');
        const text = element.querySelector('strong').innerText;
        const completed = element.querySelector('.todo-checkbox').checked;
        todos.push({ id, text, completed });
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}

