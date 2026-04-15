const API_KEY = 'c9a2c5c39b3244409e6e27b6d5716564';
const URL = 'https://api.football-data.org/v4/matches';

async function fetchFootballData() {
    const listElement = document.getElementById('match-list');
    const statusMsg = document.getElementById('status-message');

    try {
        const response = await fetch(URL, {
            headers: { 'X-Auth-Token': API_KEY }
        });

        if (!response.ok) throw new Error('Error en la conexión');

        const data = await response.json();
        statusMsg.style.display = 'none';

        if (data.matches.length === 0) {
            statusMsg.innerText = "No hay partidos programados para hoy.";
            statusMsg.style.display = 'block';
            return;
        }

        renderMatches(data.matches);
    } catch (error) {
        statusMsg.innerHTML = "⚠️ Error de conexión.<br><small>Es probable que el navegador bloquee la API por seguridad (CORS).</small>";
        console.error("Detalle:", error);
    }
}

function renderMatches(matches) {
    const list = document.getElementById('match-list');
    
    matches.forEach(match => {
        const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED';
        const homeScore = match.score.fullTime.home ?? 0;
        const awayScore = match.score.fullTime.away ?? 0;
        
        const card = document.createElement('div');
        card.className = 'match-card';
        card.innerHTML = `
            <div class="league-info">${match.competition.name}</div>
            <div class="match-content">
                <div class="team home">${match.homeTeam.shortName || match.homeTeam.name}</div>
                <div class="score-box">${match.status === 'TIMED' ? 'vs' : homeScore + ' - ' + awayScore}</div>
                <div class="team away">${match.awayTeam.shortName || match.awayTeam.name}</div>
            </div>
            <div class="status-tag ${isLive ? 'status-live' : 'status-timed'}">
                ${isLive ? '• EN VIVO' : new Date(match.utcDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </div>
        `;
        list.appendChild(card);
    });
}

// Configurar fecha actual
document.getElementById('date-badge').innerText = new Date().toLocaleDateString('es-ES', { 
    weekday: 'long', day: 'numeric', month: 'long' 
});

fetchFootballData();const API_KEY = 'c9a2c5c39b3244409e6e27b6d5716564';
const url = 'https://api.football-data.org/v4/matches';
const proxyUrl = 'https://corsproxy.io/?'; // Necesario para que GitHub no bloquee la API

async function getMatches() {
    const container = document.getElementById('match-container');
    const loading = document.getElementById('loading');
    const errorDiv = document.getElementById('error');

    try {
        const response = await fetch(proxyUrl + encodeURIComponent(url), {
            headers: { 'X-Auth-Token': API_KEY }
        });

        if (!response.ok) throw new Error("Error al conectar con la API");

        const data = await response.json();
        loading.style.display = 'none';
        
        if (data.matches.length === 0) {
            container.innerHTML = '<p class="message">No hay partidos importantes para hoy.</p>';
            return;
        }

        renderMatches(data.matches);
    } catch (err) {
        loading.style.display = 'none';
        errorDiv.style.display = 'block';
        errorDiv.innerText = "Hubo un problema al cargar los datos. Inténtalo más tarde.";
        console.error(err);
    }
}

function renderMatches(matches) {
    const container = document.getElementById('match-container');
    container.innerHTML = '';

    matches.forEach(match => {
        const card = document.createElement('div');
        card.className = 'match-card';
        
        const homeScore = match.score.fullTime.home !== null ? match.score.fullTime.home : '-';
        const awayScore = match.score.fullTime.away !== null ? match.score.fullTime.away : '-';

        card.innerHTML = `
            <div style="flex: 2">
                <div class="league-name">${match.competition.name}</div>
                <div class="teams">${match.homeTeam.name} vs ${match.awayTeam.name}</div>
            </div>
            <div class="score">${homeScore} - ${awayScore}</div>
            <div class="status">${match.status === 'TIMED' ? 'Próximamente' : 'En vivo'}</div>
        `;
        container.appendChild(card);
    });
}

document.getElementById('current-date').innerText = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
getMatches();
