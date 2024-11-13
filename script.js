function loadTodos() {
  const todos = JSON.parse(localStorage.getItem("todos")) || {
    todoList: [],
  };
  return todos;
}
function refreshTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}
function addTodoToLocalStorage(todo) {
  const todos = loadTodos();
  todos.todoList.push({ ...todo });
  localStorage.setItem("todos", JSON.stringify(todos));
}

function appendTodoInHtml(todo) {
  const todoList = document.getElementById("todoList");
  const todoItem = document.createElement("li");
  todoItem.setAttribute("data-id", todo.id);

  const textDiv = document.createElement("div");
  if (todo.isCompleted) {
    textDiv.classList.add("completed");
  }
  textDiv.textContent = todo.text;
  todoItem.classList.add("todoItem");
  todoList.appendChild(todoItem);

  const wrapper = document.createElement("div");
  wrapper.classList.add("todoButtons");
  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.classList.add("editBtn");
  editBtn.addEventListener("click", editTodos);

  const deteteBtn = document.createElement("button");
  deteteBtn.textContent = "Delete";
  deteteBtn.classList.add("deleteBtn");
  deteteBtn.addEventListener("click", deleteTodo);

  const completeBtn = document.createElement("button");
  completeBtn.textContent = todo.isCompleted ? "Reset" : "Completed";
  completeBtn.classList.add("completeBtn");
  completeBtn.addEventListener("click", toggleTodo);

  wrapper.appendChild(editBtn);
  wrapper.appendChild(deteteBtn);
  wrapper.appendChild(completeBtn);
  todoItem.appendChild(textDiv);
  todoItem.appendChild(wrapper);
}

function resetHtmlTodos(todos) {
  const todoList = document.getElementById("todoList");
  todoList.innerHTML = "";
  todos.todoList.forEach((todo) => {
    appendTodoInHtml(todo);
  });
}
function toggleTodo(event) {
  const todoItem = event.target.parentElement.parentElement;
  const todoId = todoItem.getAttribute("data-id");
  const todos = loadTodos();
  todos.todoList.forEach((todo) => {
    if (todo.id == todoId) {
      todo.isCompleted = !todo.isCompleted;
    }
  });
  console.log("todos", todos);
  refreshTodos(todos);
  resetHtmlTodos(todos);
}

function deleteTodo(event) {
  const todoItem = event.target.parentElement.parentElement;
  const todoId = todoItem.getAttribute("data-id");
  const todos = loadTodos();
  todos.todoList = todos.todoList.filter((todo) => todo.id != todoId);
  refreshTodos(todos);
  resetHtmlTodos(todos);
}

function editTodos(event) {
  const todoItem = event.target.parentElement.parentElement;

  const todoId = todoItem.getAttribute("data-id");
  const todos = loadTodos();
  const response = prompt(
    "What is the new value of the todo you want to set ?",
    event.target.parentElement.parentElement?.firstChild?.textContent
  );
  todos.todoList.forEach((todo) => {
    if (todo.id == todoId) {
      todo.text = response;
    }
  });
  refreshTodos(todos);
  resetHtmlTodos(todos);
}

function addNewTodo() {
  const todoText = todoInput.value;

  if (todoText == "") {
    alert("please write something for todos");
  } else {
    const todos = loadTodos();
    const id = todos.todoList.length;
    addTodoToLocalStorage({
      text: todoText,
      isCompleted: false,
      id,
    });
    appendTodoInHtml({
      text: todoText,
      isCompleted: false,
    });
    todoInput.value = "";
  }
}

function excuteFiletredAction(event) {
  const todoList = document.getElementById("todoList");
  const element = event.target;
  const value = element.getAttribute("data-filter");
  todoList.innerHTML = "";
  const todos = loadTodos();

  if (value == "all") {
    todos?.todoList.forEach((todo) => {
      appendTodoInHtml(todo);
    });
  } else if (value == "pending") {
    todos?.todoList.forEach((todo) => {
      if (todo.isCompleted !== true) appendTodoInHtml(todo);
    });
  } else {
    todos?.todoList.forEach((todo) => {
      if (todo.isCompleted == true) appendTodoInHtml(todo);
    });
  }
}

addEventListener("DOMContentLoaded", () => {
  const submitButton = document.getElementById("addTodo");
  const todoInput = document.getElementById("todoInput");

  const filteredBtns = document.getElementsByClassName("filteredBtn");

  for (const btn of filteredBtns) {
    btn.addEventListener("click", excuteFiletredAction);
  }

  let todos = loadTodos();
  submitButton.addEventListener("click", (event) => {
    addNewTodo();
  });

  todoInput.addEventListener("change", (event) => {
    const todoText = event.target.value;
    event.target.value = capitalizeFirstLetter(event.target.value.trim());
  });

  todos?.todoList.forEach((todo) => {
    appendTodoInHtml(todo);
  });
  document.addEventListener("keypress", (event) => {
    if ((event.code == "Enter")) {
      addNewTodo();
    }
  });
});

function capitalizeFirstLetter(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
