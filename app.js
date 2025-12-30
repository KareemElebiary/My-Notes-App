// ===================================
// APPLICATION STATE
// ===================================
const AppState = {
    currentView: 'sticky', // 'sticky' or 'editor'
    notes: [],
    editorContent: '',
    editorHistory: [],
    editorHistoryIndex: -1,
    hasUnsavedChanges: false,
    currentFileName: 'untitled.txt',
    draggedNote: null,
    dragOffset: { x: 0, y: 0 },
    searchMatches: [],
    currentSearchIndex: -1,
    autoSaveTimer: null
};

// ===================================
// DATABASE SIMULATION (LocalStorage)
// ===================================
class NotesDatabase {
    constructor() {
        this.dbName = 'myNotesDB';
        this.init();
    }

    init() {
        if (!localStorage.getItem(this.dbName)) {
            localStorage.setItem(this.dbName, JSON.stringify({
                notes: [],
                editorContent: '',
                settings: {}
            }));
        }
    }

    getData() {
        return JSON.parse(localStorage.getItem(this.dbName));
    }

    saveData(data) {
        localStorage.setItem(this.dbName, JSON.stringify(data));
    }

    // Note Operations
    async getAllNotes() {
        return new Promise((resolve) => {
            setTimeout(() => {
                const data = this.getData();
                resolve(data.notes || []);
            }, 100);
        });
    }

    async createNote(note) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const data = this.getData();
                const newNote = {
                    id: Date.now().toString(),
                    ...note,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                data.notes.push(newNote);
                this.saveData(data);
                resolve(newNote);
            }, 100);
        });
    }

    async updateNote(id, updates) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const data = this.getData();
                const noteIndex = data.notes.findIndex(n => n.id === id);
                if (noteIndex !== -1) {
                    data.notes[noteIndex] = {
                        ...data.notes[noteIndex],
                        ...updates,
                        updatedAt: new Date().toISOString()
                    };
                    this.saveData(data);
                    resolve(data.notes[noteIndex]);
                } else {
                    resolve(null);
                }
            }, 100);
        });
    }

    async deleteNote(id) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const data = this.getData();
                data.notes = data.notes.filter(n => n.id !== id);
                this.saveData(data);
                resolve(true);
            }, 100);
        });
    }

    // Editor Content Operations
    async saveEditorContent(content) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const data = this.getData();
                data.editorContent = content;
                this.saveData(data);
                resolve(true);
            }, 100);
        });
    }

    async getEditorContent() {
        return new Promise((resolve) => {
            setTimeout(() => {
                const data = this.getData();
                resolve(data.editorContent || '');
            }, 100);
        });
    }
}

const db = new NotesDatabase();

// ===================================
// UTILITY FUNCTIONS
// ===================================
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>',
        error: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>',
        warning: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><path d="M12 2L2 20h20L12 2z"/><path d="M12 9v4M12 17h.01"/></svg>'
    };

    toast.innerHTML = `
        ${icons[type]}
        <div class="toast-message">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOutRight 300ms ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===================================
// STICKY NOTES FUNCTIONALITY
// ===================================
async function loadNotes() {
    const notes = await db.getAllNotes();
    AppState.notes = notes;
    renderNotes();
}

function renderNotes() {
    const container = document.getElementById('notesContainer');
    container.innerHTML = '';

    AppState.notes.forEach(note => {
        const noteElement = createNoteElement(note);
        container.appendChild(noteElement);
    });
}

function createNoteElement(note) {
    const noteDiv = document.createElement('div');
    noteDiv.className = 'sticky-note';
    noteDiv.dataset.id = note.id;
    noteDiv.dataset.color = note.color || 'yellow';
    noteDiv.style.left = `${note.x}px`;
    noteDiv.style.top = `${note.y}px`;

    noteDiv.innerHTML = `
        <div class="note-header">
            <div class="note-controls">
                <div class="color-picker" data-color="yellow" style="background: var(--note-yellow)"></div>
                <div class="color-picker" data-color="pink" style="background: var(--note-pink)"></div>
                <div class="color-picker" data-color="blue" style="background: var(--note-blue)"></div>
                <div class="color-picker" data-color="green" style="background: var(--note-green)"></div>
                <div class="color-picker" data-color="purple" style="background: var(--note-purple)"></div>
            </div>
            <button class="delete-btn" title="Delete Note">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                    <path d="M1 1l12 12M13 1L1 13"/>
                </svg>
            </button>
        </div>
        <textarea class="note-content" placeholder="Type your note here...">${note.content || ''}</textarea>
    `;

    // Event Listeners
    const textarea = noteDiv.querySelector('.note-content');
    textarea.addEventListener('input', (e) => handleNoteContentChange(note.id, e.target.value));
    textarea.addEventListener('input', autoResizeTextarea);

    const deleteBtn = noteDiv.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => deleteNote(note.id));

    const colorPickers = noteDiv.querySelectorAll('.color-picker');
    colorPickers.forEach(picker => {
        picker.addEventListener('click', (e) => {
            e.stopPropagation();
            changeNoteColor(note.id, picker.dataset.color);
        });
    });

    // Drag functionality
    noteDiv.addEventListener('mousedown', startDragging);

    // Auto-resize on load
    setTimeout(() => autoResizeTextarea.call(textarea), 0);

    return noteDiv;
}

function autoResizeTextarea() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
}

async function addNote() {
    const newNote = {
        content: '',
        color: 'yellow',
        x: Math.random() * (window.innerWidth - 300) + 50,
        y: Math.random() * (window.innerHeight - 350) + 150
    };

    const createdNote = await db.createNote(newNote);
    AppState.notes.push(createdNote);

    const noteElement = createNoteElement(createdNote);
    document.getElementById('notesContainer').appendChild(noteElement);

    // Focus on the new note
    noteElement.querySelector('.note-content').focus();

    showToast('Note created successfully!');
}

const handleNoteContentChange = debounce(async (id, content) => {
    await db.updateNote(id, { content });
    const note = AppState.notes.find(n => n.id === id);
    if (note) {
        note.content = content;
    }
}, 500);

async function changeNoteColor(id, color) {
    await db.updateNote(id, { color });
    const note = AppState.notes.find(n => n.id === id);
    if (note) {
        note.color = color;
    }
    const noteElement = document.querySelector(`[data-id="${id}"]`);
    if (noteElement) {
        noteElement.dataset.color = color;
    }
}

async function deleteNote(id) {
    await db.deleteNote(id);
    AppState.notes = AppState.notes.filter(n => n.id !== id);
    const noteElement = document.querySelector(`[data-id="${id}"]`);
    if (noteElement) {
        noteElement.style.animation = 'scaleOut 300ms ease';
        setTimeout(() => noteElement.remove(), 300);
    }
    showToast('Note deleted', 'warning');
}

// Drag and Drop
function startDragging(e) {
    if (e.target.classList.contains('note-content') ||
        e.target.classList.contains('delete-btn') ||
        e.target.classList.contains('color-picker')) {
        return;
    }

    const note = e.currentTarget;
    AppState.draggedNote = note;

    const rect = note.getBoundingClientRect();
    AppState.dragOffset = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };

    note.classList.add('dragging');

    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);
}

function drag(e) {
    if (!AppState.draggedNote) return;

    const x = e.clientX - AppState.dragOffset.x;
    const y = e.clientY - AppState.dragOffset.y;

    AppState.draggedNote.style.left = `${x}px`;
    AppState.draggedNote.style.top = `${y}px`;
}

async function stopDragging(e) {
    if (!AppState.draggedNote) return;

    const note = AppState.draggedNote;
    note.classList.remove('dragging');

    const id = note.dataset.id;
    const x = parseInt(note.style.left);
    const y = parseInt(note.style.top);

    await db.updateNote(id, { x, y });

    const noteData = AppState.notes.find(n => n.id === id);
    if (noteData) {
        noteData.x = x;
        noteData.y = y;
    }

    AppState.draggedNote = null;

    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDragging);
}

// ===================================
// TEXT EDITOR FUNCTIONALITY
// ===================================
async function loadEditorContent() {
    const content = await db.getEditorContent();
    const editor = document.getElementById('textEditor');
    editor.value = content;
    AppState.editorContent = content;
    updateEditorStats();
    addToHistory(content);
}

function updateEditorStats() {
    const editor = document.getElementById('textEditor');
    const content = editor.value;

    // Cursor position
    const lines = content.substr(0, editor.selectionStart).split('\n');
    const line = lines.length;
    const col = lines[lines.length - 1].length + 1;
    document.getElementById('cursorPosition').textContent = `Line ${line}, Col ${col}`;

    // Word count
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    document.getElementById('wordCount').textContent = `${words} words`;

    // Character count
    document.getElementById('charCount').textContent = `${content.length} characters`;
}

const autoSaveEditor = debounce(async () => {
    const editor = document.getElementById('textEditor');
    await db.saveEditorContent(editor.value);
    AppState.editorContent = editor.value;
    AppState.hasUnsavedChanges = false;
    updateSaveStatus(true);
}, 1000);

function updateSaveStatus(saved) {
    const status = document.getElementById('saveStatus');
    if (saved) {
        status.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                <circle cx="7" cy="7" r="6" fill="none" stroke="currentColor" stroke-width="2"/>
                <path d="M5 7l2 2 4-4" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
            Saved
        `;
        status.classList.remove('unsaved');
    } else {
        status.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                <circle cx="7" cy="7" r="2"/>
            </svg>
            Unsaved changes
        `;
        status.classList.add('unsaved');
    }
}

// History Management
function addToHistory(content) {
    if (AppState.editorHistoryIndex < AppState.editorHistory.length - 1) {
        AppState.editorHistory = AppState.editorHistory.slice(0, AppState.editorHistoryIndex + 1);
    }
    AppState.editorHistory.push(content);
    AppState.editorHistoryIndex = AppState.editorHistory.length - 1;
}

function undo() {
    if (AppState.editorHistoryIndex > 0) {
        AppState.editorHistoryIndex--;
        const editor = document.getElementById('textEditor');
        editor.value = AppState.editorHistory[AppState.editorHistoryIndex];
        updateEditorStats();
        showToast('Undo', 'success');
    }
}

function redo() {
    if (AppState.editorHistoryIndex < AppState.editorHistory.length - 1) {
        AppState.editorHistoryIndex++;
        const editor = document.getElementById('textEditor');
        editor.value = AppState.editorHistory[AppState.editorHistoryIndex];
        updateEditorStats();
        showToast('Redo', 'success');
    }
}

// File Operations
function newFile() {
    if (AppState.hasUnsavedChanges) {
        showConfirmModal(
            'Unsaved Changes',
            'You have unsaved changes. Do you want to save before creating a new file?',
            () => {
                saveFile();
                createNewFile();
            },
            createNewFile
        );
    } else {
        createNewFile();
    }
}

function createNewFile() {
    const editor = document.getElementById('textEditor');
    editor.value = '';
    AppState.editorContent = '';
    AppState.currentFileName = 'untitled.txt';
    AppState.hasUnsavedChanges = false;
    AppState.editorHistory = [''];
    AppState.editorHistoryIndex = 0;
    updateEditorStats();
    updateSaveStatus(true);
    showToast('New file created');
}

function openFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.md,.js,.html,.css,.json';

    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const editor = document.getElementById('textEditor');
                editor.value = event.target.result;
                AppState.editorContent = event.target.result;
                AppState.currentFileName = file.name;
                AppState.hasUnsavedChanges = false;
                addToHistory(event.target.result);
                updateEditorStats();
                updateSaveStatus(true);
                showToast(`Opened ${file.name}`);
            };
            reader.readAsText(file);
        }
    };

    input.click();
}

function saveFile() {
    const editor = document.getElementById('textEditor');
    const content = editor.value;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = AppState.currentFileName;
    a.click();

    URL.revokeObjectURL(url);

    AppState.hasUnsavedChanges = false;
    updateSaveStatus(true);
    showToast(`Saved ${AppState.currentFileName}`);
}

// Edit Operations
function cutText() {
    const editor = document.getElementById('textEditor');
    const selectedText = editor.value.substring(editor.selectionStart, editor.selectionEnd);

    if (selectedText) {
        navigator.clipboard.writeText(selectedText);
        const newValue = editor.value.substring(0, editor.selectionStart) +
            editor.value.substring(editor.selectionEnd);
        editor.value = newValue;
        addToHistory(newValue);
        updateEditorStats();
        showToast('Text cut to clipboard');
    }
}

function copyText() {
    const editor = document.getElementById('textEditor');
    const selectedText = editor.value.substring(editor.selectionStart, editor.selectionEnd);

    if (selectedText) {
        navigator.clipboard.writeText(selectedText);
        showToast('Text copied to clipboard');
    }
}

async function pasteText() {
    try {
        const text = await navigator.clipboard.readText();
        const editor = document.getElementById('textEditor');
        const start = editor.selectionStart;
        const end = editor.selectionEnd;

        const newValue = editor.value.substring(0, start) + text + editor.value.substring(end);
        editor.value = newValue;
        editor.selectionStart = editor.selectionEnd = start + text.length;

        addToHistory(newValue);
        updateEditorStats();
        showToast('Text pasted');
    } catch (err) {
        showToast('Failed to paste text', 'error');
    }
}

function selectAll() {
    const editor = document.getElementById('textEditor');
    editor.select();
    showToast('All text selected');
}

// Search Functionality
function toggleSearch() {
    const searchBar = document.getElementById('searchBar');
    searchBar.classList.toggle('hidden');

    if (!searchBar.classList.contains('hidden')) {
        document.getElementById('searchInput').focus();
    } else {
        clearSearch();
    }
}

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const editor = document.getElementById('textEditor');
    const query = searchInput.value;

    if (!query) {
        clearSearch();
        return;
    }

    const content = editor.value;
    const regex = new RegExp(query, 'gi');
    const matches = [...content.matchAll(regex)];

    AppState.searchMatches = matches.map(match => match.index);
    AppState.currentSearchIndex = 0;

    updateSearchResults();
    highlightCurrentMatch();
}

function updateSearchResults() {
    const resultsSpan = document.getElementById('searchResults');
    if (AppState.searchMatches.length > 0) {
        resultsSpan.textContent = `${AppState.currentSearchIndex + 1} of ${AppState.searchMatches.length}`;
    } else {
        resultsSpan.textContent = '0 of 0';
    }
}

function highlightCurrentMatch() {
    if (AppState.searchMatches.length === 0) return;

    const editor = document.getElementById('textEditor');
    const searchInput = document.getElementById('searchInput');
    const matchIndex = AppState.searchMatches[AppState.currentSearchIndex];

    editor.focus();
    editor.setSelectionRange(matchIndex, matchIndex + searchInput.value.length);
    editor.scrollTop = editor.scrollHeight * (matchIndex / editor.value.length);
}

function findNext() {
    if (AppState.searchMatches.length === 0) return;

    AppState.currentSearchIndex = (AppState.currentSearchIndex + 1) % AppState.searchMatches.length;
    updateSearchResults();
    highlightCurrentMatch();
}

function findPrevious() {
    if (AppState.searchMatches.length === 0) return;

    AppState.currentSearchIndex = (AppState.currentSearchIndex - 1 + AppState.searchMatches.length) % AppState.searchMatches.length;
    updateSearchResults();
    highlightCurrentMatch();
}

function clearSearch() {
    AppState.searchMatches = [];
    AppState.currentSearchIndex = -1;
    document.getElementById('searchInput').value = '';
    updateSearchResults();
}

// ===================================
// VIEW SWITCHING
// ===================================
function toggleView() {
    const stickyView = document.getElementById('stickyNotesView');
    const editorView = document.getElementById('textEditorView');
    const toggleBtn = document.getElementById('viewToggle');

    if (AppState.currentView === 'sticky') {
        AppState.currentView = 'editor';
        stickyView.classList.remove('active');
        editorView.classList.add('active');
        toggleBtn.querySelector('.btn-label').textContent = 'Text Editor';
        toggleBtn.querySelector('svg').innerHTML = `
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        `;
    } else {
        AppState.currentView = 'sticky';
        editorView.classList.remove('active');
        stickyView.classList.add('active');
        toggleBtn.querySelector('.btn-label').textContent = 'Sticky Notes';
        toggleBtn.querySelector('svg').innerHTML = `
            <rect x="2" y="2" width="7" height="7" rx="1"/>
            <rect x="11" y="2" width="7" height="7" rx="1"/>
            <rect x="2" y="11" width="7" height="7" rx="1"/>
            <rect x="11" y="11" width="7" height="7" rx="1"/>
        `;
    }
}

// ===================================
// MODAL FUNCTIONALITY
// ===================================
function showConfirmModal(title, message, onConfirm, onCancel) {
    const modal = document.getElementById('confirmModal');
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalMessage').textContent = message;

    modal.classList.remove('hidden');

    const yesBtn = document.getElementById('modalYesBtn');
    const noBtn = document.getElementById('modalNoBtn');
    const cancelBtn = document.getElementById('modalCancelBtn');

    const closeModal = () => {
        modal.classList.add('hidden');
        yesBtn.onclick = null;
        noBtn.onclick = null;
        cancelBtn.onclick = null;
    };

    yesBtn.onclick = () => {
        if (onConfirm) onConfirm();
        closeModal();
    };

    noBtn.onclick = () => {
        if (onCancel) onCancel();
        closeModal();
    };

    cancelBtn.onclick = closeModal;
}

// ===================================
// KEYBOARD SHORTCUTS
// ===================================
document.addEventListener('keydown', (e) => {
    // Only apply shortcuts in editor view
    if (AppState.currentView !== 'editor') return;

    if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
            case 'n':
                e.preventDefault();
                newFile();
                break;
            case 'o':
                e.preventDefault();
                openFile();
                break;
            case 's':
                e.preventDefault();
                saveFile();
                break;
            case 'z':
                e.preventDefault();
                undo();
                break;
            case 'y':
                e.preventDefault();
                redo();
                break;
            case 'f':
                e.preventDefault();
                toggleSearch();
                break;
            case 'a':
                // Let default behavior work
                break;
        }
    }
});

// ===================================
// EVENT LISTENERS
// ===================================
// ===================================
// AUTHENTICATION
// ===================================
async function checkAuth() {
    try {
        const response = await fetch('api/check_auth.php');
        const data = await response.json();
        if (!data.authenticated) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    } catch (e) {
        console.error('Auth check failed', e);
        window.location.href = 'login.html';
        return false;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication first
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) return;

    // Load initial data
    await loadNotes();
    await loadEditorContent();

    // Navigation
    document.getElementById('viewToggle').addEventListener('click', toggleView);
    document.getElementById('addNoteBtn').addEventListener('click', addNote);
    document.getElementById('logoutBtn').addEventListener('click', async () => {
        try {
            await fetch('api/logout.php');
            window.location.href = 'login.html';
        } catch (e) {
            window.location.href = 'login.html';
        }
    });

    // Toolbar - File Operations
    document.getElementById('newFileBtn').addEventListener('click', newFile);
    document.getElementById('openFileBtn').addEventListener('click', openFile);
    document.getElementById('saveFileBtn').addEventListener('click', saveFile);

    // Toolbar - Edit Operations
    document.getElementById('cutBtn').addEventListener('click', cutText);
    document.getElementById('copyBtn').addEventListener('click', copyText);
    document.getElementById('pasteBtn').addEventListener('click', pasteText);
    document.getElementById('selectAllBtn').addEventListener('click', selectAll);

    // Toolbar - History
    document.getElementById('undoBtn').addEventListener('click', undo);
    document.getElementById('redoBtn').addEventListener('click', redo);

    // Toolbar - Search
    document.getElementById('findBtn').addEventListener('click', toggleSearch);

    // Search Bar
    document.getElementById('searchInput').addEventListener('input', performSearch);
    document.getElementById('findNextBtn').addEventListener('click', findNext);
    document.getElementById('findPrevBtn').addEventListener('click', findPrevious);
    document.getElementById('closeSearchBtn').addEventListener('click', toggleSearch);

    // Text Editor
    const editor = document.getElementById('textEditor');
    editor.addEventListener('input', () => {
        AppState.hasUnsavedChanges = true;
        updateSaveStatus(false);
        updateEditorStats();
        autoSaveEditor();

        // Add to history on significant changes
        const currentContent = editor.value;
        const lastContent = AppState.editorHistory[AppState.editorHistoryIndex] || '';
        if (Math.abs(currentContent.length - lastContent.length) > 10) {
            addToHistory(currentContent);
        }
    });

    editor.addEventListener('click', updateEditorStats);
    editor.addEventListener('keyup', updateEditorStats);

    // Warn before closing with unsaved changes
    window.addEventListener('beforeunload', (e) => {
        if (AppState.hasUnsavedChanges) {
            e.preventDefault();
            e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
            return e.returnValue;
        }
    });

    // Session timeout warning (simulated - 30 minutes)
    let inactivityTimer;
    const resetInactivityTimer = () => {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
            showToast('Your session will expire in 2 minutes due to inactivity', 'warning');
        }, 28 * 60 * 1000); // 28 minutes
    };

    document.addEventListener('mousemove', resetInactivityTimer);
    document.addEventListener('keypress', resetInactivityTimer);
    resetInactivityTimer();

    console.log('My Notes application initialized successfully!');
});

// Add CSS animation for note deletion
const style = document.createElement('style');
style.textContent = `
    @keyframes scaleOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.8);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);
