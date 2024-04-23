const input = document.getElementById("input");
const list = document.getElementById("list");
const selectAllBtn = document.getElementById("select-all");
const count = document.getElementById("count");
const clearCompleteBtn = document.getElementById("clear-complete");
const footer = document.getElementById("footer");

let TODOS = [];

function rennderTodo(todo) {
  const li = document.createElement("li");
  li.dataset.id = todo.id;
  li.className = "group p-4 flex items-center border border-t-1";
  li.insertAdjacentHTML(
    "afterbegin",
    `
        ${
          todo.completed
            ? '<svg data-todo="toggle" class="text-green-500 cursor-pointer w-10 h-10 mr-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>'
            : '<svg data-todo="toggle" class="cursor-pointer w-10 h-10 mr-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle"><circle cx="12" cy="12" r="10"/></svg>'
        }
        <div class="flex justify-between flex-1 ${todo.completed ? "line-through" : ""}">
          <span data-todo="value" contenteditable="true">${todo.content}</span>
          <svg data-todo="remove" class="hidden group-hover:block cursor-pointer hover:text-red-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/>
          </svg>
        </div>

      `,
  );
  return li;
}

function renderTodos() {
  const hash = window.location.hash;
  let filterTodos = [...TODOS];

  if (TODOS.length === 0) {
    footer.classList.add("hidden");
    list.classList.add("hidden");
  } else {
    footer.classList.remove("hidden");
    list.classList.remove("hidden");
  }
  if (hash === "#/active")
    filterTodos = TODOS.filter((todo) => !todo.completed);
  else if (hash === "#/complete")
    filterTodos = TODOS.filter((todo) => todo.completed);

  list.replaceChildren(...filterTodos.map((todo) => rennderTodo(todo)));

  const totalItemLeft = TODOS.filter((todo) => !todo.completed).length;
  count.textContent = `${totalItemLeft} items left!`;

  document.querySelectorAll('[data-todo="filters"] a').forEach((el) => {
    if (el.matches(`[href="${hash}"]`)) {
      el.classList.add("checked");
    } else {
      el.classList.remove("checked");
    }
  });
}

input.onkeyup = function (e) {
  const value = e.target.value;
  if (e.key === "Enter" && input.value.trim(" ") !== "") {
    TODOS.push({
      id: crypto.randomUUID(),
      content: value,
      completed: false,
    });
    input.value = "";
    renderTodos();
  }
};

list.onclick = function (e) {
  if (e.target.matches("[data-todo='remove']")) {
    TODOS = TODOS.filter(
      (todo) => todo.id !== e.target.closest("li").dataset.id,
    );
  }

  if (e.target.matches("[data-todo='toggle']")) {
    const id = e.target.closest("li").dataset.id;
    TODOS = TODOS.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          completed: !item.completed,
        };
      }
      return item;
    });
  }
  renderTodos();
};

selectAllBtn.onclick = function () {
  TODOS = TODOS.map((item) => {
    return {
      ...item,
      completed: true,
    };
  });
  renderTodos();
};

clearCompleteBtn.onclick = function () {
  TODOS = TODOS.filter((todo) => !todo.completed);
  renderTodos();
};

window.addEventListener("hashchange", () => {
  renderTodos();
});

renderTodos();
