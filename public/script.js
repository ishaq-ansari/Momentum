// Global Variables
const API_URL = window.location.origin + '/api';
let token = localStorage.getItem('token');

// Auth Functions
async function handleLogin() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (data.token) {
            token = data.token;
            localStorage.setItem('token', token);
            showTodoApp();
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        alert('Error logging in');
    }
}

async function handleRegister(event) {
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    // Clear previous error messages
    document.getElementById('email-error').textContent = '';
    document.getElementById('password-error').textContent = '';

    let valid = true;
    
    // Validate email
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
        document.getElementById('email-error').textContent = 'Invalid email address.';
        valid = false;
    }
    
    // Validate password
    if (password.length < 8 && password.length > 0) {
        document.getElementById('password-error').textContent = 'At least 8 characters long.';
        valid = false;
    }
    
    if (!valid) {
        event.preventDefault(); // Prevent form submission if validation fails
    }

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Registration successful! Please login.');
            switchForm();
        } else {
            alert(data.message || 'Registration failed');
        }
    } catch (error) {
        alert('Error registering');
    }
}

function handleLogout() {
    localStorage.removeItem('token');
    location.reload();
}

// Todo Functions
async function fetchTodos() {
    try {
        const response = await fetch(`${API_URL}/todos`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const todos = await response.json();
        renderTodos(todos);
    } catch (error) {
        alert('Error fetching todos');
    }
}

async function handleAddTodo() {
    const input = document.getElementById('todo-input');
    const text = input.value.trim();

    if (!text) return;

    try {
        await fetch(`${API_URL}/todos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ text })
        });
        input.value = '';
        fetchTodos();
    } catch (error) {
        alert('Error adding todo');
    }
}

async function handleUpdateTodo(id, updates) {
    try {
        await fetch(`${API_URL}/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updates)
        });
        fetchTodos();
    } catch (error) {
        alert('Error updating todo');
    }
}

async function handleDeleteTodo(id) {
    try {
        await fetch(`${API_URL}/todos/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchTodos();
    } catch (error) {
        alert('Error deleting todo');
    }
}

function renderTodos(todos) {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';
    
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.innerHTML = `
            <input type="checkbox" class="todo-checkbox" 
                    ${todo.completed ? 'checked' : ''} 
                    onchange="handleUpdateTodo('${todo._id}', {completed: this.checked})">
            <span class="todo-text ${todo.completed ? 'completed' : ''}">${todo.text}</span>
            <div class="todo-actions">
                <button class="delete-btn" onclick="handleDeleteTodo('${todo._id}')">Delete</button>
            </div>
        `;
        todoList.appendChild(li);
    });
}

// UI Functions
function switchForm() {
    document.querySelector('.form-container').classList.toggle('active');
}

function showTodoApp() {
    document.querySelector('.container').style.display = 'none';
    document.getElementById('todo-container').style.display = 'block';
    fetchTodos();
}

// Event Listeners
document.getElementById('todo-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleAddTodo();
    }
});

// Check if user is already logged in
if (token) {
    showTodoApp();
}