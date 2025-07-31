const notesContainer = document.getElementById('notes');
const addNoteBtn = document.getElementById('addNoteBtn');
const searchInput = document.getElementById('search');
const themeToggle = document.getElementById('themeToggle');

// Theme Toggle
themeToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark');
});

// Load Saved Theme
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark');
  themeToggle.checked = true;
}

// Save theme on change
themeToggle.addEventListener('change', () => {
  localStorage.setItem('darkMode', themeToggle.checked);
});

// Notes Logic
function getNotes() {
  return JSON.parse(localStorage.getItem('notes') || "[]");
}

function saveNotes(notes) {
  localStorage.setItem('notes', JSON.stringify(notes));
}

function createNote(text = "", tags = "", important = false) {
  const note = document.createElement('div');
  note.classList.add('note');
  if (important) note.classList.add('important');

  const textarea = document.createElement('textarea');
  textarea.value = text;

  const tagInput = document.createElement('input');
  tagInput.type = "text";
  tagInput.placeholder = "Tags (comma-separated)";
  tagInput.value = tags;

  const deleteBtn = document.createElement('button');
  deleteBtn.innerText = '🗑️';

  const markBtn = document.createElement('button');
  markBtn.innerText = '⭐';
  markBtn.style.background = 'orange';
  markBtn.style.marginLeft = '5px';

  deleteBtn.onclick = () => {
    note.remove();
    updateStorage();
  };

  markBtn.onclick = () => {
    note.classList.toggle('important');
    updateStorage();
  };

  textarea.oninput = updateStorage;
  tagInput.oninput = updateStorage;

  const btnContainer = document.createElement('div');
  btnContainer.style.display = 'flex';
  btnContainer.style.justifyContent = 'flex-end';
  btnContainer.append(deleteBtn, markBtn);

  note.appendChild(textarea);
  note.appendChild(tagInput);
  note.appendChild(btnContainer);
  notesContainer.appendChild(note);
}

function updateStorage() {
  const notes = [];
  document.querySelectorAll('.note').forEach(note => {
    const text = note.querySelector('textarea').value;
    const tags = note.querySelector('input').value;
    const isImportant = note.classList.contains('important');
    notes.push({ text, tags, important: isImportant });
  });
  saveNotes(notes);
}

// Search Filter
searchInput.addEventListener('input', () => {
  const val = searchInput.value.toLowerCase();
  document.querySelectorAll('.note').forEach(note => {
    const content = note.querySelector('textarea').value.toLowerCase();
    const tags = note.querySelector('input').value.toLowerCase();
    note.style.display = content.includes(val) || tags.includes(val) ? "block" : "none";
  });
});

// Load existing notes
getNotes().forEach(note => createNote(note.text, note.tags, note.important));

// Add new note
addNoteBtn.onclick = () => createNote();
