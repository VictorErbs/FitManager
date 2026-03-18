const API_URL = 'http://localhost:8080/api/workouts';
let allWorkouts = [];

async function loadWorkouts() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('API error');
        allWorkouts = await res.json();
        renderWorkouts(allWorkouts);
    } catch (e) {
        document.getElementById('workoutsGrid').innerHTML = `
            <div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-muted);">
                <i class="ph ph-warning-circle" style="font-size:2rem;"></i>
                <p>Servidor Java não está rodando.</p>
            </div>`;
    }
}

const DIVISION_CLASS = { 'Treino A': 'division-a', 'Treino B': 'division-b', 'Treino C': 'division-c', 'Full Body': 'division-other' };

function renderWorkouts(workouts) {
    const grid = document.getElementById('workoutsGrid');
    if (workouts.length === 0) {
        grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-muted);">
            <i class="ph ph-clipboard-text" style="font-size:2rem;"></i><p>Nenhuma ficha encontrada.</p></div>`;
        return;
    }
    grid.innerHTML = workouts.map(w => {
        const exercises = (() => { try { return JSON.parse(w.exercises); } catch { return []; } })();
        const divClass = DIVISION_CLASS[w.division] || 'division-other';
        const exerciseItems = exercises.slice(0, 4).map(ex =>
            `<li class="exercise-item">
                <span class="exercise-name">${ex.name}</span>
                <span class="exercise-detail">${ex.sets}x${ex.reps} • ${ex.rest || ''}</span>
            </li>`
        ).join('');
        const extra = exercises.length > 4 ? `<li style="color:var(--text-muted);font-size:0.8rem;padding:0.3rem 0.75rem;">+${exercises.length - 4} exercícios...</li>` : '';

        return `
        <div class="glass-panel workout-card">
            <div class="workout-card-header">
                <span class="workout-division ${divClass}"><i class="ph-fill ph-dumbbell"></i>${w.division}</span>
                <button class="icon-btn danger" onclick="deleteWorkout(${w.id})" title="Remover"><i class="ph ph-trash"></i></button>
            </div>
            <div class="workout-title">${w.title}</div>
            <div class="workout-meta"><i class="ph ph-user"></i>${w.studentName}</div>
            <div class="workout-meta"><i class="ph ph-chalkboard-teacher"></i>${w.professorName}</div>
            <span class="objective-badge"><i class="ph ph-target"></i>${w.objective}</span>
            <ul class="exercise-list">${exerciseItems}${extra}</ul>
            <div class="workout-card-footer">
                <span style="color:var(--text-muted);font-size:0.8rem;">${w.exerciseCount} exercício(s)</span>
            </div>
        </div>`;
    }).join('');
}

function filterWorkouts() {
    const q = document.getElementById('searchInput').value.toLowerCase();
    renderWorkouts(allWorkouts.filter(w =>
        w.title.toLowerCase().includes(q) ||
        w.studentName.toLowerCase().includes(q) ||
        w.objective.toLowerCase().includes(q)
    ));
}

async function deleteWorkout(id) {
    if (!confirm('Remover esta ficha de treino?')) return;
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    loadWorkouts();
}

// Exercise builder rows
let exerciseCount = 0;
function addExerciseRow() {
    exerciseCount++;
    const id = exerciseCount;
    const container = document.getElementById('exerciseRows');
    const row = document.createElement('div');
    row.className = 'exercise-row';
    row.id = `ex-row-${id}`;
    row.innerHTML = `
        <input type="text" class="form-control ex-name" placeholder="Exercício" required>
        <input type="number" class="form-control ex-sets" placeholder="Séries" min="1" value="3" required>
        <input type="text" class="form-control ex-reps" placeholder="Reps" value="12">
        <input type="text" class="form-control ex-rest" placeholder="Descanso" value="60s">
        <button type="button" class="remove-exercise" onclick="document.getElementById('ex-row-${id}').remove()">
            <i class="ph ph-x-circle"></i>
        </button>`;
    container.appendChild(row);
}

document.getElementById('newWorkoutForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const rows = document.querySelectorAll('.exercise-row');
    const exercises = Array.from(rows).map(row => ({
        name: row.querySelector('.ex-name').value,
        sets: row.querySelector('.ex-sets').value,
        reps: row.querySelector('.ex-reps').value,
        rest: row.querySelector('.ex-rest').value
    }));

    const body = {
        title: document.getElementById('wTitle').value,
        division: document.getElementById('wDivision').value,
        objective: document.getElementById('wObjective').value,
        studentName: document.getElementById('wStudentName').value,
        professorName: document.getElementById('wProfessorName').value,
        exercises: JSON.stringify(exercises)
    };

    try {
        await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        closeModal();
        loadWorkouts();
        document.getElementById('newWorkoutForm').reset();
        document.getElementById('exerciseRows').innerHTML = '';
        exerciseCount = 0;
    } catch (err) {
        alert('Erro ao salvar ficha de treino.');
    }
});

function openModal() { document.getElementById('modalBackdrop').classList.add('open'); addExerciseRow(); }
function closeModal() { document.getElementById('modalBackdrop').classList.remove('open'); }
function closeModalOutside(e) { if (e.target.id === 'modalBackdrop') closeModal(); }

document.addEventListener('DOMContentLoaded', () => {
    loadWorkouts();
    document.getElementById('menuToggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('collapsed');
    });
});
