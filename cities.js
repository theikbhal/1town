// Fetch and render cities from cities.json, with filtering
async function loadCities() {
    const response = await fetch('cities.json');
    const cities = await response.json();
    window.allCities = cities;
    populateStateFilter(cities);
    renderTable(cities);
}

function populateStateFilter(cities) {
    const stateSet = new Set(cities.map(c => c.state).filter(Boolean));
    const stateFilter = document.getElementById('stateFilter');
    stateFilter.innerHTML = '<option value="">All</option>';
    Array.from(stateSet).sort().forEach(state => {
        const opt = document.createElement('option');
        opt.value = state;
        opt.textContent = state;
        stateFilter.appendChild(opt);
    });
}

let currentSort = { col: null, dir: 'asc' };

function sortCities(cities, col, dir) {
    return cities.slice().sort((a, b) => {
        let v1 = a[col], v2 = b[col];
        if (col === 'pop2011') {
            v1 = Number(v1) || 0;
            v2 = Number(v2) || 0;
        } else {
            v1 = (v1 || '').toString().toLowerCase();
            v2 = (v2 || '').toString().toLowerCase();
        }
        if (v1 < v2) return dir === 'asc' ? -1 : 1;
        if (v1 > v2) return dir === 'asc' ? 1 : -1;
        return 0;
    });
}

function updateSortIndicators(col, dir) {
    document.querySelectorAll('.sortable .sort-indicator').forEach(span => {
        span.textContent = '';
    });
    const th = document.querySelector(`.sortable[data-col="${col}"] .sort-indicator`);
    if (th) th.textContent = dir === 'asc' ? '▲' : '▼';
}

function handleSort(e) {
    const th = e.target.closest('.sortable');
    if (!th) return;
    const col = th.getAttribute('data-col');
    let dir = 'asc';
    if (currentSort.col === col && currentSort.dir === 'asc') dir = 'desc';
    currentSort = { col, dir };
    const sorted = sortCities(window.filteredCities || window.allCities, col, dir);
    window.filteredCities = sorted;
    renderTable(sorted);
    updateSortIndicators(col, dir);
}

document.querySelectorAll('.sortable').forEach(th => {
    th.addEventListener('click', handleSort);
});

function applyFilters() {
    const state = document.getElementById('stateFilter').value;
    const minPop = document.getElementById('minPop').value;
    const maxPop = document.getElementById('maxPop').value;
    let filtered = window.allCities;
    if (state) {
        filtered = filtered.filter(city => city.state === state);
    }
    if (minPop) {
        filtered = filtered.filter(city => city.pop2011 >= parseInt(minPop));
    }
    if (maxPop) {
        filtered = filtered.filter(city => city.pop2011 <= parseInt(maxPop));
    }
    renderTable(filtered);
}

document.getElementById('applyFilters').addEventListener('click', applyFilters);

document.addEventListener('DOMContentLoaded', loadCities); 

function renderTable(filteredCities) {
    window.filteredCities = filteredCities;
    const tbody = document.querySelector('#citiesTable tbody');
    tbody.innerHTML = '';
    filteredCities.forEach(city => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${city.city}</td>
            <td>${city.pop2011 ? city.pop2011.toLocaleString() : ''}</td>
            <td>${city.state}</td>
        `;
        tbody.appendChild(tr);
    });
} 