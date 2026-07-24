document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('mainChart');
    if (!ctx) return;

    // Create gradient for the chart
    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(249, 115, 22, 0.4)'); // Primary orange
    gradient.addColorStop(1, 'rgba(249, 115, 22, 0)');

    const gradientBlue = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
    gradientBlue.addColorStop(0, 'rgba(59, 130, 246, 0.4)'); // Blue
    gradientBlue.addColorStop(1, 'rgba(59, 130, 246, 0)');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
            datasets: [
                {
                    label: 'Producción Actual',
                    data: [120, 190, 150, 220, 180, 250, 210],
                    borderColor: '#F97316',
                    backgroundColor: gradient,
                    borderWidth: 3,
                    tension: 0.4, // Smooth curve
                    fill: true,
                    pointBackgroundColor: '#FFF',
                    pointBorderColor: '#F97316',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                },
                {
                    label: 'Semana Pasada',
                    data: [100, 160, 140, 180, 160, 200, 190],
                    borderColor: '#3B82F6',
                    backgroundColor: gradientBlue,
                    borderWidth: 2,
                    borderDash: [5, 5],
                    tension: 0.4,
                    fill: true,
                    pointRadius: 0,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false // Hide default legend to match mockup
                },
                tooltip: {
                    backgroundColor: 'rgba(31, 41, 55, 0.9)',
                    titleFont: { family: 'Outfit', size: 13 },
                    bodyFont: { family: 'Outfit', size: 14, weight: 'bold' },
                    padding: 10,
                    cornerRadius: 8,
                    displayColors: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#F3F4F6',
                        drawBorder: false,
                    },
                    ticks: {
                        font: { family: 'Outfit', size: 11 },
                        color: '#6B7280'
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false,
                    },
                    ticks: {
                        font: { family: 'Outfit', size: 12 },
                        color: '#6B7280'
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index',
            },
        }
    });

    // --- ANUNCIOS DEL ADMINISTRADOR EN TIEMPO REAL ---
    const newsList = document.getElementById('user-news-list');
    if (newsList) {
        // Verificar si la base de datos Firestore está disponible
        if (typeof db !== 'undefined' && db !== null) {
            db.collection('anuncios_sistema')
                .orderBy('timestamp', 'desc')
                .limit(10)
                .onSnapshot((snapshot) => {
                    newsList.innerHTML = '';
                    if (snapshot.empty) {
                        newsList.innerHTML = `
                            <li>
                                <span class="dot green"></span>
                                <div class="news-text">
                                    <strong>Sin Novedades</strong>
                                    <p>No hay avisos publicados en el sistema por el momento.</p>
                                </div>
                            </li>`;
                        return;
                    }
                    snapshot.forEach(doc => {
                        const data = doc.data();
                        const li = document.createElement('li');
                        
                        let date = new Date();
                        if (data.timestamp) {
                            date = typeof data.timestamp.toDate === 'function' ? data.timestamp.toDate() : new Date(data.timestamp);
                        } else if (data.fecha) {
                            date = new Date(data.fecha);
                        }
                        const timeStr = date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
                        
                        li.innerHTML = `
                            <span class="dot ${data.nivel || 'green'}"></span>
                            <div class="news-text">
                                <strong>${data.titulo}</strong> <span style="font-size:0.75rem; color:#9CA3AF; margin-left:8px;">${timeStr}</span>
                                <p>${data.mensaje}</p>
                            </div>
                        `;
                        newsList.appendChild(li);
                    });
                }, (error) => {
                    console.warn("Error cargando anuncios de Firestore:", error);
                    cargarAnunciosLocalesFallback();
                });
        } else {
            cargarAnunciosLocalesFallback();
        }
    }

    function cargarAnunciosLocalesFallback() {
        const localAvisos = JSON.parse(localStorage.getItem('rymco_local_avisos') || '[]');
        newsList.innerHTML = '';
        if (localAvisos.length === 0) {
            newsList.innerHTML = `
                <li>
                    <span class="dot green"></span>
                    <div class="news-text">
                        <strong>Sin Novedades</strong>
                        <p>No hay avisos locales por el momento.</p>
                    </div>
                </li>`;
            return;
        }
        localAvisos.forEach(a => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="dot ${a.nivel || 'green'}"></span>
                <div class="news-text">
                    <strong>${a.titulo}</strong>
                    <p>${a.mensaje}</p>
                </div>
            `;
            newsList.appendChild(li);
        });
    }
});
