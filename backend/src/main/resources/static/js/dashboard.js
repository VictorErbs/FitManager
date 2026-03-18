const API_STUDENTS   = 'http://localhost:8080/api/students';
const API_CHECKINS   = 'http://localhost:8080/api/checkins/today/count';
const API_SUMMARY    = 'http://localhost:8080/api/transactions/summary';
const API_MONTHLY    = 'http://localhost:8080/api/transactions/monthly';

async function loadDashboard() {
    try {
        const studRes  = await fetch(API_STUDENTS);
        const students = await studRes.json();
        const active   = students.filter(s => s.status === 'ACTIVE').length;
        const overdue  = students.filter(s => s.status === 'OVERDUE').length;
        document.getElementById('activeStudentsCount').textContent = active;
        document.getElementById('overdueCount').textContent        = overdue;

        const list = document.getElementById('recentActivityList');
        const colors = ['var(--primary)', '#38bdf8', '#a855f7', '#ef4444'];
        list.innerHTML = students.slice(0, 4).map((s, idx) => {
            const initials = s.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
            const date = s.enrollmentDate ? new Date(s.enrollmentDate).toLocaleDateString('pt-BR') : '-';
            return `
            <div class="activity-item">
                <div class="activity-avatar" style="background:${colors[idx % colors.length]}">${initials}</div>
                <div class="activity-details">
                    <div class="activity-text"><strong>${s.name}</strong> — ${s.statusLabel || s.status}</div>
                    <div class="activity-time">Desde: ${date}</div>
                </div>
            </div>`;
        }).join('');
    } catch(e) { console.warn('Students API unavailable'); }

    try {
        const ciRes = await fetch(API_CHECKINS);
        const ci    = await ciRes.json();
        document.getElementById('todayCheckins').textContent = ci.count;
    } catch(e) { document.getElementById('todayCheckins').textContent = '0'; }

    try {
        const finRes = await fetch(API_SUMMARY);
        const fin    = await finRes.json();
        const fmt    = v => `R$ ${Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`;
        document.getElementById('totalRevenue').textContent = fmt(fin.totalIncome);
    } catch(e) { document.getElementById('totalRevenue').textContent = 'R$ --'; }
}

async function renderChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;

    let labels  = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    let income  = new Array(12).fill(0);
    let expense = new Array(12).fill(0);

    try {
        const res  = await fetch(API_MONTHLY);
        const data = await res.json();
        labels  = data.labels  || labels;
        income  = Array.from(data.income  || income);
        expense = Array.from(data.expense || expense);
    } catch(e) {
        console.warn('Monthly API unavailable, using placeholder');
        income  = [3800,4100,4500,4200,5100,4900,5300,5800,5500,6000,5700,6200];
        expense = [2100,2300,2400,2200,2700,2600,2800,3000,2900,3100,2900,3200];
    }

    new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Receitas (R$)',
                    data: income,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.08)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#10b981'
                },
                {
                    label: 'Despesas (R$)',
                    data: expense,
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.06)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#ef4444'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: { color: '#94a3b8', usePointStyle: true, pointStyleWidth: 8 }
                },
                tooltip: {
                    callbacks: {
                        label: ctx => ` R$ ${Number(ctx.raw).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                    }
                }
            },
            scales: {
                x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', callback: v => `R$${(v/1000).toFixed(0)}k` } }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
    renderChart();
    document.getElementById('menuToggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('collapsed');
    });
});
