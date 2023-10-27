// Initiale Verweise
const newTaskInput = document.querySelector("#new-task input");
const tasksDiv = document.querySelector("#tasks");
let deleteTasks, editTasks, tasks;
let updateNote = "";
let count;

// Funktion bei Seitenladung
window.onload = () => {
  updateNote = "";
  count = Object.keys(localStorage).length;
  displayTasks();
};

// Funktion zur Anzeige der Aufgaben
const displayTasks = () => {
  if (Object.keys(localStorage).length > 0) {
    tasksDiv.style.display = "inline-block";
  } else {
    tasksDiv.style.display = "none";
  }

  // Löschen der Aufgaben
  tasksDiv.innerHTML = "";

  // Abrufen aller Schlüssel im lokalen Speicher
  let tasks = Object.keys(localStorage);
  tasks = tasks.sort();

  for (let key of tasks) {
    let classValue = "";

    // Alle Werte abrufen
    let value = localStorage.getItem(key);
    let taskInnerDiv = document.createElement("div");
    taskInnerDiv.classList.add("task");
    taskInnerDiv.setAttribute("id", key);
    taskInnerDiv.innerHTML = `<span id="taskname">${key.split("_")[1]}</span>`;
    // Lokaler Speicher speichert Booleans als Zeichenketten, deshalb müssen wir sie zurück in Booleans umwandeln
    let editButton = document.createElement("button");
    editButton.classList.add("edit");
    editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
    if (!JSON.parse(value)) {
      editButton.style.visibility = "visible";
    } else {
      editButton.style.visibility = "hidden";
      taskInnerDiv.classList.add("completed");
    }
    taskInnerDiv.appendChild(editButton);
    taskInnerDiv.innerHTML += `<button class="delete"><i class="fa-solid fa-trash"></i></button>`;
    tasksDiv.appendChild(taskInnerDiv);
  }

  // Aufgaben als erledigt markieren
  tasks = document.querySelectorAll(".task");
  tasks.forEach((element, index) => {
    element.onclick = () => {
      // Aktualisierung des lokalen Speichers
      if (element.classList.contains("completed")) {
        updateStorage(element.id.split("_")[0], element.innerText, false);
      } else {
        updateStorage(element.id.split("_")[0], element.innerText, true);
      }
    };
  });

  // Aufgaben bearbeiten
  editTasks = document.getElementsByClassName("edit");
  Array.from(editTasks).forEach((element, index) => {
    element.addEventListener("click", (e) => {
      e.stopPropagation();
      // Deaktivieren anderer Bearbeiten-Schaltflächen, während eine Aufgabe bearbeitet wird
      disableButtons(true);
      // Eingabewert aktualisieren und den Bearbeitungsmodus aktivieren
      let parent = element.parentElement;
      newTaskInput.value = parent.querySelector("#taskname").innerText;
      newTaskInput.setAttribute("data-task-id", parent.id);
      newTaskInput.focus();
      updateNote = parent.id; // Setzen von updateNote auf die bearbeitete Aufgabe
      parent.remove(); // Die bearbeitete Aufgabe entfernen
    });
  });

  // Aufgaben löschen
  deleteTasks = document.getElementsByClassName("delete");
  Array.from(deleteTasks).forEach((element, index) => {
    element.addEventListener("click", (e) => {
      e.stopPropagation();
      // Aus dem lokalen Speicher löschen und das DIV entfernen
      let parent = element.parentElement;
      removeTask(parent.id);
      parent.remove();
      count -= 1;
    });
  });
};

// Bearbeiten-Schaltflächen deaktivieren
const disableButtons = (bool) => {
  let editButtons = document.getElementsByClassName("edit");
  Array.from(editButtons).forEach((element) => {
    element.disabled = bool;
  });
};

// Aufgabe aus dem lokalen Speicher entfernen
const removeTask = (taskValue) => {
  localStorage.removeItem(taskValue);
  displayTasks();
};

// Aufgaben zum lokalen Speicher hinzufügen
const updateStorage = (index, taskValue, completed) => {
  localStorage.setItem(`${index}_${taskValue}`, completed);
  displayTasks();
};

// Funktion zum Hinzufügen einer neuen Aufgabe
document.querySelector("#push").addEventListener("click", () => {
  // Bearbeiten-Schaltflächen aktivieren
  disableButtons(false);
  if (newTaskInput.value.length == 0) {
    alert("Bitte eine Aufgabe eingeben.");
  } else {
    if (updateNote == "") {
      // Neue Aufgabe
      updateStorage(count, newTaskInput.value, false);
    } else {
      // Aufgabe aktualisieren
      let existingCount = updateNote.split("_")[0];
      removeTask(updateNote);
      updateStorage(existingCount, newTaskInput.value, false);
      updateNote = "";
    }
    count += 1;
    newTaskInput.value = "";
  }
});
