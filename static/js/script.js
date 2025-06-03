const addBtn = document.querySelector("#add-btn");
const newTaskInput = document.querySelector("#wrapper input");
const tasksContainer = document.querySelector("#tasks");
const error = document.getElementById("error");
const countValue = document.querySelector(".count-value");
let taskCount = 0;

const displayCount = (taskCount) => {
    countValue.innerText = taskCount;
};

const addTask = () => {
    const taskName = newTaskInput.value.trim();
    error.style.display = "none";

    if (!taskName) {
        setTimeout(() => {
            error.style.display = "block";
        }, 200);
        return;
    }

    const task = `
<div class="task">
<input type="checkbox" class="task-check">
<span class="taskname">${taskName}</span>
<button class="edit"><i class="fas fa-edit"></i></button>
<button class="delete"><i class="far fa-trash-alt"></i></button>
</div>
`;

    tasksContainer.insertAdjacentHTML("beforeend", task);

    const deleteButtons = document.querySelectorAll(".delete");
    deleteButtons.forEach((button) => {
        button.onclick = () => {
            const taskCheckBox = button.parentNode.querySelector(".task-check");

            if (!taskCheckBox.checked) {
                taskCount -= 1;
            }
            button.parentNode.remove();
            displayCount(taskCount);
        };
    });

    const editButtons = document.querySelectorAll(".edit");
    editButtons.forEach((editBtn) => {
        editBtn.onclick = (e) => {
            let targetElement = e.target;
            if (!(e.target.className == "edit")) {
                targetElement = e.target.parentElement;
            }
            const taskSpan = targetElement.previousElementSibling;

            const editInput = document.createElement('input');
            editInput.type = 'text';
            editInput.value = taskSpan.innerText;

            // Установите белый фон и белую рамку
            editInput.style.width = '100%';
            editInput.style.backgroundColor = '#ffffff'; // Белый фон
            editInput.style.color = '#232936';
            editInput.style.border = '2px solid #ffffff'; // Белая рамка
            editInput.style.padding = '0.8em 1em';
            editInput.style.borderRadius = '0.5em';
            editInput.style.fontFamily = 'Poppins, sans-serif';
            editInput.style.fontSize = '15px';
            editInput.style.outline = 'none'; // Убирает стандартную рамку при фокусе

            targetElement.parentNode.insertBefore(editInput, targetElement);
            targetElement.parentNode.removeChild(taskSpan);

            const saveChanges = () => {
                if (editInput.value.trim()) {
                    taskSpan.innerText = editInput.value;
                    targetElement.parentNode.insertBefore(taskSpan, targetElement);
                } else {
                    targetElement.parentNode.remove();
                    taskCount -= 1;
                }
                targetElement.parentNode.removeChild(editInput);
                displayCount(taskCount);
            };

            editInput.addEventListener('blur', saveChanges);

            editInput.addEventListener('keydown', (event) => {
                if (event.key === "Enter") {
                    saveChanges();
                }
            });
        };
    });

    const tasksCheck = document.querySelectorAll(".task-check");
    tasksCheck.forEach((checkBox) => {
        checkBox.onchange = () => {
            checkBox.nextElementSibling.classList.toggle("completed");
            if (checkBox.checked) {
                taskCount -= 1;
            } else {
                taskCount += 1;
            }
            displayCount(taskCount);
        };
    });

    taskCount += 1;
    displayCount(taskCount);
    newTaskInput.value = "";
};

newTaskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addTask();
    }
});

addBtn.addEventListener("click", addTask);
window.onload = () => {
    taskCount = 0;
    displayCount(taskCount);
    newTaskInput.value = "";
};