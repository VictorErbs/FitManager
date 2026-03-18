const API_URL = 'http://localhost:8080/api/students';
let allStudents = [];
let currentFilter = 'all';

// Fetch students from Java API
async function loadStudents() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Falha ao carregar alunos.');
        allStudents = await res.json();
        renderStudents(allStudents);
    } catch (e) {
        document.getElementById('studentsBody').innerHTML = `
            <tr><td colspan="5">
                <div class="empty-state">
                    <i class="ph ph-warning-circle"></i>
                    <p>Servidor Java não está rodando. Inicie o backend e recarregue.</p>
                </div>
            </td></tr>`;
    }
}

// Render student rows
function renderStudents(students) {
    const tbody = document.getElementById('studentsBody');
    if (students.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><i class="ph ph-users"></i><p>Nenhum aluno encontrado.</p></div></td></tr>`;
        return;
    }
    tbody.innerHTML = students.map(s => {
        const initials = s.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
        const statusClass = { 'ACTIVE': 'badge-active', 'INACTIVE': 'badge-inactive', 'OVERDUE': 'badge-overdue' };
        const date = s.enrollmentDate ? new Date(s.enrollmentDate).toLocaleDateString('pt-BR') : '-';
        return `
            <tr data-id="${s.id}">
                <td>
                    <div class="student-name">
                        <div class="student-avatar">${initials}</div>
                        ${s.name}
                    </div>
                </td>
                <td style="color: var(--text-muted);">${s.email}</td>
                <td><span class="badge ${statusClass[s.status] || 'badge-inactive'}">${s.statusLabel || s.status}</span></td>
                <td style="color: var(--text-muted);">${date}</td>
                <td>
                    <div class="table-actions">
                        <button class="icon-btn" title="Ver treino" onclick="alert('Módulo de treinos em breve!')"><i class="ph ph-clipboard-text"></i></button>
                        <button class="icon-btn danger" title="Remover aluno" onclick="removeStudent(${s.id}, '${s.name}')"><i class="ph ph-trash"></i></button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Filter by text search
function filterStudents() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    let filtered = allStudents;
    if (currentFilter !== 'all') filtered = filtered.filter(s => s.status === currentFilter);
    filtered = filtered.filter(s => s.name.toLowerCase().includes(query) || s.email.toLowerCase().includes(query));
    renderStudents(filtered);
}

// Filter by status buttons
function filterByStatus(status) {
    currentFilter = status;
    filterStudents();
}

// Add new student via POST to Java API
document.getElementById('newStudentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const newStudent = {
        name: document.getElementById('studentName').value,
        email: document.getElementById('studentEmail').value,
        status: document.getElementById('studentStatus').value,
        enrollmentDate: document.getElementById('studentDate').value || null
    };
    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newStudent)
        });
        if (!res.ok) throw new Error('Erro ao salvar aluno.');
        closeModal();
        await loadStudents(); // Refresh table
        document.getElementById('newStudentForm').reset();
    } catch (e) {
        alert('Erro ao cadastrar aluno. Verifique se o servidor Java está rodando.');
    }
});

// Remove student
async function removeStudent(id, name) {
    if (!confirm(`Remover o aluno "${name}"?`)) return;
    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        await loadStudents();
    } catch(e) {
        alert('Erro ao remover aluno.');
    }
}

// Modal controls
function openModal() {
    document.getElementById('modalBackdrop').classList.add('open');
    // Set today as default enrollment date
    document.getElementById('studentDate').value = new Date().toISOString().split('T')[0];
}
function closeModal() { document.getElementById('modalBackdrop').classList.remove('open'); }
function closeModalOutside(e) { if (e.target.id === 'modalBackdrop') closeModal(); }

// Sidebar toggle
document.addEventListener('DOMContentLoaded', () => {
    loadStudents();
    document.getElementById('menuToggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('collapsed');
    });
});
