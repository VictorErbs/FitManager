const API = 'http://localhost:8080/api/transactions';

async function loadAll() {
    try {
        const [listRes, sumRes] = await Promise.all([fetch(API), fetch(`${API}/summary`)]);
        const list = await listRes.json();
        const summary = await sumRes.json();
        renderSummary(summary);
        renderTable(list);
    } catch(e) {
        document.getElementById('transactionsBody').innerHTML =
            '<tr><td colspan="6" style="text-align:center;padding:2rem;color:var(--text-muted);">Servidor não disponível.</td></tr>';
    }
}

const fmt = v => `R$ ${Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

function renderSummary({ totalIncome, totalExpense, balance }) {
    document.getElementById('totalIncome').textContent  = fmt(totalIncome);
    document.getElementById('totalExpense').textContent = fmt(totalExpense);
    document.getElementById('balance').textContent      = fmt(balance);
    const el = document.getElementById('balanceTrend');
    if (balance >= 0) {
        el.textContent = '✅ Saldo positivo';
        el.className = 'stat-trend positive';
    } else {
        el.textContent = '⚠️ Saldo negativo';
        el.className = 'stat-trend negative';
    }
}

function renderTable(list) {
    const tbody = document.getElementById('transactionsBody');
    if (!list.length) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:2rem;color:var(--text-muted);">Nenhum lançamento encontrado.</td></tr>';
        return;
    }
    tbody.innerHTML = list.map(t => {
        const isIncome = t.type === 'INCOME';
        const date = t.date ? new Date(t.date + 'T00:00:00').toLocaleDateString('pt-BR') : '-';
        return `
        <tr>
            <td style="font-weight:500">${t.description}</td>
            <td style="color:var(--text-muted)">${t.category || '-'}</td>
            <td style="color:var(--text-muted)">${date}</td>
            <td><span class="${isIncome ? 'badge-income' : 'badge-expense'}">${isIncome ? 'Receita' : 'Despesa'}</span></td>
            <td class="${isIncome ? 'amount-income' : 'amount-expense'}">${fmt(t.amount)}</td>
            <td>
                <button class="icon-btn danger" onclick="deleteTransaction(${t.id})" title="Remover">
                    <i class="ph ph-trash"></i>
                </button>
            </td>
        </tr>`;
    }).join('');
}

async function deleteTransaction(id) {
    if (!confirm('Remover este lançamento?')) return;
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    loadAll();
}

document.getElementById('transactionForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
        description: document.getElementById('tDesc').value,
        type: document.getElementById('tType').value,
        amount: parseFloat(document.getElementById('tAmount').value),
        category: document.getElementById('tCategory').value,
        date: document.getElementById('tDate').value || null
    };
    await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    closeModal();
    loadAll();
    document.getElementById('transactionForm').reset();
});

function openModal() {
    document.getElementById('modalBackdrop').classList.add('open');
    document.getElementById('tDate').value = new Date().toISOString().split('T')[0];
}
function closeModal() { document.getElementById('modalBackdrop').classList.remove('open'); }
function closeModalOutside(e) { if (e.target.id === 'modalBackdrop') closeModal(); }

document.addEventListener('DOMContentLoaded', () => {
    loadAll();
    document.getElementById('menuToggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('collapsed');
    });
});
