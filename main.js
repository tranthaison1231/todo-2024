const input = document.getElementById("input");
const list = document.getElementById("list");
const selectAllBtn = document.getElementById("select-all");
const count = document.getElementById("count");
const clearCompleteBtn = document.getElementById("clear-complete");
const footer = document.getElementById("footer");

function renderListItem() {
  const totalItemLeft = Array.from(list.children).filter((item) => {
    return !item.classList.contains("line-through");
  }).length;

  count.textContent = `${totalItemLeft} items left!`;

  if (list.children.length === 0) {
    footer.classList.add("hidden");
    list.classList.add("hidden");
  } else {
    footer.classList.remove("hidden");
    list.classList.remove("hidden");
  }

  const hash = window.location.hash;

  document.querySelectorAll('[data-todo="filters"] a').forEach((el) => {
    if (el.matches(`[href="${hash}"]`)) {
      el.classList.add("checked");
    } else {
      el.classList.remove("checked");
    }
  });

  switch (hash) {
    case "#/active":
      Array.from(list.children).forEach((item) => {
        if (item.classList.contains("line-through")) {
          item.classList.add("hidden");
        } else {
          item.classList.remove("hidden");
        }
      });
      break;
    case "#/completed":
      Array.from(list.children).forEach((item) => {
        if (item.classList.contains("line-through")) {
          item.classList.remove("hidden");
        } else {
          item.classList.add("hidden");
        }
      });
      break;
    default:
      Array.from(list.children).forEach((item) => {
        item.classList.remove("hidden");
      });
      break;
  }
}

input.onkeyup = function (e) {
  const value = e.target.value;
  if (e.key === "Enter" && input.value.trim(" ") !== "") {
    const li = `
      <li class="group p-4 flex items-center border border-t-1">
        <svg data-todo="toggle" class="cursor-pointer w-10 h-10 mr-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle"><circle cx="12" cy="12" r="10"/></svg>
        <div class="flex justify-between flex-1">
          <span contenteditable="true">${value}</span>
          <svg data-todo="remove" class="hidden group-hover:block cursor-pointer hover:text-red-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/>
          </svg>
        </div>
      </li>`;
    list.insertAdjacentHTML("afterbegin", li);
    input.value = "";
    renderListItem();
  }
};

list.onclick = function (e) {
  if (e.target.matches("[data-todo='remove']")) {
    e.target.closest("li").remove();
  }

  if (e.target.matches("[data-todo='toggle']")) {
    if (e.target.classList.contains("text-green-500")) {
      e.target.classList.remove("text-green-500");
      e.target.children[0].remove();
      e.target.closest("li").classList.remove("line-through");
    } else {
      e.target.closest("li").classList.add("line-through");
      e.target.classList.add("text-green-500");
      e.target.insertAdjacentHTML("afterbegin", `<path d="m9 12 2 2 4-4"/>`);
    }
  }
  renderListItem();
};

selectAllBtn.onclick = function () {
  const totalItemLeft = Array.from(list.children).filter((item) => {
    return !item.classList.contains("line-through");
  }).length;

  if (totalItemLeft === 0) {
    Array.from(list.children).forEach((item) => {
      item.classList.remove("line-through");
      item.children[0].classList.remove("text-green-500");
      item.children[0].children[0].remove();
    });
  } else {
    Array.from(list.children).forEach((item) => {
      if (!item.classList.contains("line-through")) {
        item.classList.add("line-through");
        item.children[0].classList.add("text-green-500");
        item.children[0].insertAdjacentHTML(
          "afterbegin",
          `<path d="m9 12 2 2 4-4"/>`,
        );
      }
    });
  }
  renderListItem();
};

clearCompleteBtn.onclick = function () {
  list.querySelectorAll(".line-through").forEach((item) => {
    item.remove();
  });
  renderListItem();
};

window.addEventListener("hashchange", () => {
  renderListItem();
});
