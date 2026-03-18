const STORAGE_KEY = 'fitlife_config';
let planCount = 0;

const DEFAULTS = {
    name: 'Academia FitLife',
    cnpj: '',
    phone: '',
    email: '',
    address: '',
    weekdayOpen: '06:00',
    weekdayClose: '22:00',
    satOpen: '07:00',
    satClose: '18:00',
    sunOpen: '08:00',
    sunClose: '13:00',
    plans: [
        { name: 'Plano Mensal', duration: '1 mês', price: '150.00' },
        { name: 'Plano Trimestral', duration: '3 meses', price: '399.00' },
        { name: 'Plano Anual', duration: '12 meses', price: '1399.00' }
    ]
};

function loadConfig() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULTS;
}

function fillForm(cfg) {
    document.getElementById('cfgName').value         = cfg.name || '';
    document.getElementById('cfgCnpj').value         = cfg.cnpj || '';
    document.getElementById('cfgPhone').value        = cfg.phone || '';
    document.getElementById('cfgEmail').value        = cfg.email || '';
    document.getElementById('cfgAddress').value      = cfg.address || '';
    document.getElementById('cfgWeekdayOpen').value  = cfg.weekdayOpen || '06:00';
    document.getElementById('cfgWeekdayClose').value = cfg.weekdayClose || '22:00';
    document.getElementById('cfgSatOpen').value      = cfg.satOpen || '07:00';
    document.getElementById('cfgSatClose').value     = cfg.satClose || '18:00';
    document.getElementById('cfgSunOpen').value      = cfg.sunOpen || '08:00';
    document.getElementById('cfgSunClose').value     = cfg.sunClose || '13:00';

    document.getElementById('plansContainer').innerHTML = '';
    planCount = 0;
    (cfg.plans || []).forEach(p => addPlan(p));
}

function addPlan(data = {}) {
    planCount++;
    const id = planCount;
    const row = document.createElement('div');
    row.className = 'plan-row';
    row.id = `plan-${id}`;
    row.innerHTML = `
        <input type="text"   class="form-control plan-name"     placeholder="Nome do plano"    value="${data.name || ''}">
        <input type="text"   class="form-control plan-duration"  placeholder="Duração (ex: 1 mês)" value="${data.duration || ''}">
        <input type="number" class="form-control plan-price"    placeholder="Preço (R$)"       value="${data.price || ''}" step="0.01">
        <button type="button" class="icon-btn danger" onclick="document.getElementById('plan-${id}').remove()">
            <i class="ph ph-trash"></i>
        </button>`;
    document.getElementById('plansContainer').appendChild(row);
}

function collectConfig() {
    const plans = Array.from(document.querySelectorAll('.plan-row')).map(row => ({
        name:     row.querySelector('.plan-name').value,
        duration: row.querySelector('.plan-duration').value,
        price:    row.querySelector('.plan-price').value
    }));
    return {
        name:         document.getElementById('cfgName').value,
        cnpj:         document.getElementById('cfgCnpj').value,
        phone:        document.getElementById('cfgPhone').value,
        email:        document.getElementById('cfgEmail').value,
        address:      document.getElementById('cfgAddress').value,
        weekdayOpen:  document.getElementById('cfgWeekdayOpen').value,
        weekdayClose: document.getElementById('cfgWeekdayClose').value,
        satOpen:      document.getElementById('cfgSatOpen').value,
        satClose:     document.getElementById('cfgSatClose').value,
        sunOpen:      document.getElementById('cfgSunOpen').value,
        sunClose:     document.getElementById('cfgSunClose').value,
        plans
    };
}

function saveAll() {
    const cfg = collectConfig();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
    const toast = document.getElementById('saveToast');
    toast.style.display = 'flex';
    setTimeout(() => { toast.style.display = 'none'; }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    fillForm(loadConfig());
    document.getElementById('menuToggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('collapsed');
    });
});
