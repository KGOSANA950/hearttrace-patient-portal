let chartInstance = null;

// Load the Dashboard after successful login
function loadDashboard() {
    document.querySelectorAll('.auth-container').forEach(el => el.classList.add('hidden'));
    document.getElementById('dashboard-page').classList.remove('hidden');

    // Set Profile Data
    const initials = currentUser.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
    document.getElementById('user-avatar').textContent = initials;
    document.getElementById('user-name-display').textContent = currentUser.name;
    document.getElementById('profile-name').textContent = currentUser.name;
    document.getElementById('profile-email').textContent = currentUser.email;

    // Default Date input to now
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('input-date').value = now.toISOString().slice(0,16);

    updateDashboardData();
    switchTab('dashboard-tab', document.querySelector('.nav-menu .nav-item'));
}

// Switch Tabs in Sidebar
function switchTab(tabId, navElement) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active-tab'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active-tab');
    if(navElement) navElement.classList.add('active');
}

// Get specific user's tests
function getUserTests() {
    let allTests = JSON.parse(localStorage.getItem('ht_tests'));
    return allTests.filter(t => t.userId === currentUser.id).sort((a,b) => new Date(b.date) - new Date(a.date));
}

// Update UI with latest data
function updateDashboardData() {
    const tests = getUserTests();
    
    // Update Cards
    document.getElementById('total-tests-card').textContent = tests.length;
    
    if (tests.length > 0) {
        const latestBpm = tests[0].bpm;
        document.getElementById('current-bpm-card').textContent = latestBpm;
        
        const sum = tests.reduce((acc, t) => acc + parseInt(t.bpm), 0);
        document.getElementById('avg-bpm-card').textContent = Math.round(sum / tests.length);
    } else {
        document.getElementById('current-bpm-card').textContent = '--';
        document.getElementById('avg-bpm-card').textContent = '--';
    }

    // Update Table
    const tbody = document.getElementById('history-table-body');
    tbody.innerHTML = '';
    
    if (tests.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; color:gray;">No tests recorded yet.</td></tr>';
    } else {
        tests.forEach(test => {
            const d = new Date(test.date).toLocaleString();
            let statusClass = 'status-normal';
            let statusText = 'Normal';
            if (test.bpm > 100) { statusClass = 'status-high'; statusText = 'High'; }
            if (test.bpm > 130 || test.bpm < 50) { statusClass = 'status-critical'; statusText = 'Critical'; }

            tbody.innerHTML += `
                <tr>
                    <td>${d}</td>
                    <td><strong>${test.bpm}</strong> BPM</td>
                    <td class="${statusClass}">${statusText}</td>
                </tr>
            `;
        });
    }

    // Update Chart
    initChart(tests.slice(0, 10).reverse());
}

// Save Data Form Submit
document.getElementById('data-entry-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const bpm = document.getElementById('input-bpm').value;
    const date = document.getElementById('input-date').value;

    const newTest = {
        id: Date.now(),
        userId: currentUser.id,
        bpm: parseInt(bpm),
        date: new Date(date).toISOString()
    };

    let allTests = JSON.parse(localStorage.getItem('ht_tests'));
    allTests.push(newTest);
    localStorage.setItem('ht_tests', JSON.stringify(allTests));

    const msg = document.getElementById('save-success');
    msg.style.display = 'block';
    setTimeout(() => msg.style.display = 'none', 3000);

    document.getElementById('input-bpm').value = '';
    updateDashboardData();
});

// CSV Export
function exportToCSV() {
    const tests = getUserTests();
    if (tests.length === 0) return alert("No data to export!");

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Date,Heart Rate (BPM),Status\n";

    tests.forEach(t => {
        let status = t.bpm > 100 ? "High" : "Normal";
        const dateStr = new Date(t.date).toLocaleString();
        csvContent += `"${dateStr}",${t.bpm},${status}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `HeartTrace_Data_${currentUser.name.replace(/\s/g,'_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Chart rendering
function initChart(dataPoints) {
    const ctx = document.getElementById('heartRateChart').getContext('2d');
    
    if (chartInstance) {
        chartInstance.destroy();
    }

    const labels = dataPoints.map(t => new Date(t.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
    const data = dataPoints.map(t => t.bpm);

    let gradient = ctx.createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0, 'rgba(37, 99, 235, 0.2)');
    gradient.addColorStop(1, 'rgba(37, 99, 235, 0)');

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels.length ? labels : ['No Data'],
            datasets: [{
                label: 'Heart Rate',
                data: data.length ? data : [0],
                borderColor: '#2563EB',
                backgroundColor: gradient,
                borderWidth: 3,
                pointRadius: 4,
                pointBackgroundColor: '#2563EB',
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: false, min: 40, max: 140 }
            }
        }
    });
}