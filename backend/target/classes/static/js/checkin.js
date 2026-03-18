const CHECKIN_API = 'http://localhost:8080/api/checkins';
const STUDENTS_API = 'http://localhost:8080/api/students';
let allStudents = [];

// Update live clock
function updateClock() {
    const now = new Date();
    document.getElementById('currentTime').textContent =
        now.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

// Load students for autocomplete
async function loadStudents() {
    try {
        const res = await fetch(STUDENTS_API);
        allStudents = await res.json();
    } catch(e) { allStudents = []; }
}

// Load today's check-ins
async function loadTodayCheckIns() {
    try {
        const res = await fetch(`${CHECKIN_API}/today`);
        const items = await res.json();
        document.getElementById('todayCount').textContent = items.length;
        renderTodayList(items);
    } catch(e) {
        document.getElementById('todayList').innerHTML =
            '<div style="text-align:center;padding:2rem;color:var(--text-muted);">Servidor não disponível.</div>';
    }
}

function renderTodayList(items) {
    const el = document.getElementById('todayList');
    if (!items.length) {
        el.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--text-muted);">Nenhum check-in hoje ainda.</div>';
        return;
    }
    el.innerHTML = items.map(c => {
        const initials = c.studentName.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase();
        return `
        <div class="checkin-item" id="ci-${c.id}">
            <div class="checkin-avatar">${initials}</div>
            <div style="flex:1">
                <div class="checkin-name">${c.studentName}</div>
                ${c.note ? `<div class="checkin-note">${c.note}</div>` : ''}
            </div>
            <div class="checkin-time">${c.timeFormatted}</div>
        </div>`;
    }).join('');
}

// Student autocomplete
function searchStudents() {
    const q = document.getElementById('studentSearchInput').value.toLowerCase();
    const sugg = document.getElementById('studentSuggestions');
    if (!q) { sugg.classList.remove('open'); return; }
    const matches = allStudents.filter(s => s.name.toLowerCase().includes(q)).slice(0, 6);
    if (!matches.length) { sugg.classList.remove('open'); return; }
    sugg.innerHTML = matches.map(s =>
        `<div class="suggestion-item" onclick="selectStudent('${s.name}')">${s.name}</div>`
    ).join('');
    sugg.classList.add('open');
}

function selectStudent(name) {
    document.getElementById('studentSearchInput').value = name;
    document.getElementById('studentSuggestions').classList.remove('open');
}

// Submit check-in
document.getElementById('checkinForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const studentName = document.getElementById('studentSearchInput').value.trim();
    const note = document.getElementById('checkinNote').value.trim();
    if (!studentName) { alert('Informe o nome do aluno.'); return; }

    try {
        await fetch(CHECKIN_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentName, note: note || null })
        });

        // Show feedback
        const fb = document.getElementById('checkinFeedback');
        fb.className = 'checkin-feedback success';
        fb.textContent = `✅ Entrada de ${studentName} registrada!`;
        fb.style.display = 'block';
        setTimeout(() => { fb.style.display = 'none'; }, 3000);

        // Reset form
        document.getElementById('studentSearchInput').value = '';
        document.getElementById('checkinNote').value = '';

        // Refresh list
        await loadTodayCheckIns();
    } catch(err) {
        alert('Erro ao registrar check-in.');
    }
});

// Close suggestions on click outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.student-search-wrapper')) {
        document.getElementById('studentSuggestions').classList.remove('open');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    loadStudents();
    loadTodayCheckIns();
    updateClock();
    setInterval(updateClock, 1000);
    document.getElementById('menuToggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('collapsed');
    });
});
