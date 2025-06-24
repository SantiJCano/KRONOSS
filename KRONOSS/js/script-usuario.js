// Elementos DOM
document.addEventListener('DOMContentLoaded', function() {
    // Actualizar fecha actual
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const currentDate = new Date().toLocaleDateString('es-ES', options);
    document.getElementById('current-date').textContent = currentDate;
    
    // Inicializar tema
    initTheme();
    
    // Simulación de datos en tiempo real
    setupLiveDataUpdates();
    
    // Inicializar eventos
    initEvents();
});

// Función para simular actualizaciones de datos en tiempo real
function setupLiveDataUpdates() {
    // Intervalo de actualización (en milisegundos)
    const updateInterval = 5000; // 5 segundos
    
    // Actualizar estadísticas cada cierto tiempo
    setInterval(() => {
        updateUserStats();
    }, updateInterval);
}

// Actualizar las tarjetas de estadísticas con datos simulados
function updateUserStats() {
    // Simulación de cambios en los datos
    const cards = document.querySelectorAll('.card .number');
    
    // Total de recordatorios (variación aleatoria)
    const totalCard = cards[0];
    let totalCount = parseInt(totalCard.textContent);
    // 10% de probabilidad de añadir un nuevo recordatorio
    if (Math.random() < 0.1) {
        totalCount += 1;
        totalCard.textContent = totalCount;
        
        // Actualizar tendencia
        const totalTrend = totalCard.nextElementSibling;
        totalTrend.innerHTML = `<i class="fas fa-arrow-up"></i> ${Math.floor(Math.random() * 5) + 1} nuevos esta semana`;
    }
    
    // Recordatorios completados (variación aleatoria)
    const completedCard = cards[1];
    let completedCount = parseInt(completedCard.textContent);
    // 15% de probabilidad de completar un recordatorio
    if (Math.random() < 0.15 && completedCount < totalCount) {
        completedCount += 1;
        completedCard.textContent = completedCount;
        
        // Actualizar tendencia
        const completedTrend = completedCard.nextElementSibling;
        completedTrend.innerHTML = `<i class="fas fa-arrow-up"></i> ${Math.floor(Math.random() * 3) + 1} completados ayer`;
    }
    
    // Recordatorios pendientes (calculado)
    const pendingCard = cards[2];
    let pendingCount = totalCount - completedCount;
    pendingCard.textContent = pendingCount;
    
    // Actualizar tendencia de pendientes
    const pendingTrend = pendingCard.nextElementSibling;
    if (pendingCount > 0) {
        const vencidos = Math.min(pendingCount, Math.floor(Math.random() * 3));
        pendingTrend.innerHTML = `<i class="fas fa-arrow-up"></i> ${vencidos} vencidos`;
        pendingTrend.className = 'trend negative';
    } else {
        pendingTrend.innerHTML = `<i class="fas fa-check"></i> Sin vencidos`;
        pendingTrend.className = 'trend positive';
    }
    
    // Eficiencia (calculada)
    const efficiencyCard = cards[3];
    const efficiency = Math.round((completedCount / totalCount) * 100);
    efficiencyCard.textContent = efficiency + '%';
    
    // Actualizar tendencia de eficiencia
    const efficiencyTrend = efficiencyCard.nextElementSibling;
    const efficiencyDelta = Math.floor(Math.random() * 10) - 3; // Entre -3 y +6
    
    if (efficiencyDelta >= 0) {
        efficiencyTrend.innerHTML = `<i class="fas fa-arrow-up"></i> ${Math.abs(efficiencyDelta)}% desde el mes pasado`;
        efficiencyTrend.className = 'trend positive';
    } else {
        efficiencyTrend.innerHTML = `<i class="fas fa-arrow-down"></i> ${Math.abs(efficiencyDelta)}% desde el mes pasado`;
        efficiencyTrend.className = 'trend negative';
    }
    
    // Simular cambios en los gráficos
    simulateChartChanges();
    
    // Actualizar barras de progreso
    updateProgressBars();
}

// Simular cambios en los gráficos
function simulateChartChanges() {
    // Simular cambios en el gráfico de barras
    const bars = document.querySelectorAll('.chart-placeholder .bar');
    bars.forEach(bar => {
        const currentHeight = parseInt(bar.style.height);
        const newHeight = Math.max(10, Math.min(95, currentHeight + (Math.random() * 20 - 10))) + '%';
        bar.style.height = newHeight;
    });
}

// Actualizar barras de progreso
function updateProgressBars() {
    const progressFills = document.querySelectorAll('.progress-fill');
    if (progressFills.length > 0) {
        // Obtener valores actuales
        const completedPercent = parseInt(progressFills[0].style.width);
        const pendingPercent = parseInt(progressFills[1].style.width);
        
        // Pequeña variación aleatoria
        const completedDelta = Math.floor(Math.random() * 5) - 2; // Entre -2 y +2
        const newCompletedPercent = Math.max(0, Math.min(100, completedPercent + completedDelta));
        const newPendingPercent = 100 - newCompletedPercent;
        
        // Actualizar barras
        progressFills[0].style.width = newCompletedPercent + '%';
        progressFills[1].style.width = newPendingPercent + '%';
        
        // Actualizar etiquetas
        const labels = document.querySelectorAll('.progress-label span:last-child');
        labels[0].textContent = newCompletedPercent + '%';
        labels[1].textContent = newPendingPercent + '%';
    }
}

// Inicializar eventos de la interfaz
function initEvents() {
    // Botón de cambio de tema
    const themeSwitch = document.getElementById('theme-switch');
    if (themeSwitch) {
        themeSwitch.addEventListener('click', toggleTheme);
    }
    
    // Menú móvil toggle
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    
    if (sidebarToggle && sidebar && sidebarOverlay) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            sidebarOverlay.classList.toggle('active');
            document.body.classList.toggle('sidebar-open');
        });
        
        sidebarOverlay.addEventListener('click', function() {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
            document.body.classList.remove('sidebar-open');
        });
    }
    
    // Cerrar menú al hacer clic en un elemento del menú en móvil
    const menuLinks = document.querySelectorAll('.menu ul li a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
                sidebarOverlay.classList.remove('active');
                document.body.classList.remove('sidebar-open');
            }
        });
    });
    
    // Botón de actualizar en el gráfico circular
    const refreshBtn = document.querySelector('.refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            // Animar botón
            this.classList.add('rotating');
            setTimeout(() => {
                this.classList.remove('rotating');
            }, 1000);
            
            // Actualizar datos
            updateUserStats();
        });
    }
    
    // Selector de período para el gráfico de actividad
    const periodSelector = document.querySelector('.chart-actions select');
    if (periodSelector) {
        periodSelector.addEventListener('change', function() {
            // Simular carga de datos para el período seleccionado
            const loadingMessage = document.createElement('div');
            loadingMessage.className = 'loading-message';
            loadingMessage.textContent = 'Cargando datos...';
            
            const chartPlaceholder = document.querySelector('.chart-placeholder');
            chartPlaceholder.style.opacity = '0.5';
            chartPlaceholder.parentNode.insertBefore(loadingMessage, chartPlaceholder.nextSibling);
            
            // Simular tiempo de carga
            setTimeout(() => {
                chartPlaceholder.style.opacity = '1';
                loadingMessage.remove();
                
                // Actualizar alturas de las barras con nuevos datos simulados
                const bars = document.querySelectorAll('.chart-placeholder .bar');
                bars.forEach(bar => {
                    const newHeight = Math.floor(Math.random() * 85) + 15 + '%';
                    bar.style.height = newHeight;
                });
            }, 800);
        });
    }
    
    // Menú lateral en dispositivos móviles
    const menuItems = document.querySelectorAll('.menu ul li');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remover clase activa de todos los elementos
            menuItems.forEach(i => i.classList.remove('active'));
            // Añadir clase activa al elemento clicado
            this.classList.add('active');
        });
    });
    
    // Botones de acción en la tabla de recordatorios
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const row = this.closest('tr');
            
            if (this.classList.contains('complete')) {
                // Simular completar recordatorio
                row.style.opacity = '0.5';
                setTimeout(() => {
                    row.remove();
                    // Actualizar estadísticas
                    const completedCard = document.querySelectorAll('.card .number')[1];
                    let completedCount = parseInt(completedCard.textContent);
                    completedCount += 1;
                    completedCard.textContent = completedCount;
                    const pendingCard = document.querySelectorAll('.card .number')[2];
                    let pendingCount = parseInt(pendingCard.textContent);
                    pendingCount -= 1;
                    pendingCard.textContent = pendingCount;
                    // Actualizar eficiencia
                    const totalCount = parseInt(document.querySelectorAll('.card .number')[0].textContent);
                    const efficiency = Math.round((completedCount / totalCount) * 100);
                    document.querySelectorAll('.card .number')[3].textContent = efficiency + '%';
                    // Gamificación: sumar puntos y logros
                    registrarCompletado();
                    // Mostrar mensaje de éxito
                    showNotification('Recordatorio completado con éxito');
                }, 500);
            } else if (this.classList.contains('edit')) {
                // Simular edición de recordatorio
                showNotification('Editando recordatorio...');
            }
        });
    });
    
    // Simular notificaciones nuevas
    simulateNewNotifications();
}

// Mostrar notificación
function showNotification(message) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Añadir al DOM
    document.body.appendChild(notification);
    
    // Mostrar con animación
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Simular llegada de nuevas notificaciones
function simulateNewNotifications() {
    setInterval(() => {
        const badge = document.querySelector('.badge');
        if (badge) {
            const currentCount = parseInt(badge.textContent);
            // 20% de probabilidad de nueva notificación
            if (Math.random() < 0.2) {
                badge.textContent = currentCount + 1;
                
                // Mostrar un flash en el icono de notificación
                const notificationIcon = document.querySelector('.notifications');
                notificationIcon.classList.add('notification-flash');
                setTimeout(() => {
                    notificationIcon.classList.remove('notification-flash');
                }, 1000);
                
                // Mostrar mensaje de notificación
                const messages = [
                    'Nuevo recordatorio creado',
                    'Recordatorio próximo a vencer',
                    'Recordatorio actualizado',
                    'Nuevo mensaje del sistema'
                ];
                const randomMessage = messages[Math.floor(Math.random() * messages.length)];
                showNotification(randomMessage);
            }
        }
    }, 15000); // Cada 15 segundos
}

// Añadir estilos CSS para animaciones
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        .rotating {
            animation: rotate 1s linear;
        }
        
        .loading-message {
            text-align: center;
            margin: 10px 0;
            font-size: 0.9rem;
            color: var(--gray-color);
        }
        
        @keyframes flash {
            0% { color: var(--gray-color); }
            50% { color: var(--warning-color); }
            100% { color: var(--gray-color); }
        }
        
        .notification-flash {
            animation: flash 1s ease;
        }
        
        /* Estilo para cuando el sidebar está abierto en móvil */
        body.sidebar-open {
            overflow: hidden;
        }
        
        /* Estilos para notificaciones */
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: var(--primary-color);
            color: var(--dark-color);
            padding: 12px 20px;
            border-radius: var(--radius);
            box-shadow: var(--shadow);
            font-size: 0.9rem;
            transform: translateY(100px);
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
            z-index: 1000;
        }
        
        .notification.show {
            transform: translateY(0);
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
});

// Función para inicializar el tema
function initTheme() {
    // Verificar si hay un tema guardado en localStorage
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        // Aplicar tema guardado
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
        // Verificar preferencia del sistema
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (prefersDarkScheme) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    }
}

// Función para cambiar el tema
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
}

// --- Gamificación Kronoss ---
const GAMIFICACION_LS_KEY = 'kronoss_gamificacion';
const LOGROS_DEFINIDOS = [
    { id: '5_completados', nombre: '5 Completados', desc: 'Completaste 5 recordatorios', icono: 'fa-trophy', rareza: 'comun', secreto: false },
    { id: '10_creados', nombre: '10 Creados', desc: 'Creaste 10 recordatorios', icono: 'fa-lightbulb', rareza: 'comun', secreto: false },
    { id: '7_dias', nombre: '7 Días Activo', desc: 'Estuviste activo 7 días seguidos', icono: 'fa-fire', rareza: 'raro', secreto: false },
    { id: 'madrugador', nombre: 'Madrugador', desc: 'Completaste un recordatorio antes de las 8:00 AM', icono: 'fa-coffee', rareza: 'epico', secreto: true },
    { id: 'maraton', nombre: 'Maratón', desc: 'Completaste 10 recordatorios en un solo día', icono: 'fa-running', rareza: 'epico', secreto: true }
];

function getGamificacion() {
    let data = localStorage.getItem(GAMIFICACION_LS_KEY);
    if (!data) {
        data = {
            puntos: 0,
            nivel: 1,
            progreso: 0,
            completados: 0,
            creados: 0,
            diasActivos: 1,
            ultimoDia: new Date().toLocaleDateString('es-ES'),
            logros: [],
            streak: 1,
            streakLost: false,
            record: 0,
            completadosHoy: 0,
            diaCompletados: new Date().toLocaleDateString('es-ES')
        };
        localStorage.setItem(GAMIFICACION_LS_KEY, JSON.stringify(data));
    } else {
        data = JSON.parse(data);
    }
    return data;
}

function saveGamificacion(data) {
    // Actualizar récord
    if (data.puntos > (data.record || 0)) {
        data.record = data.puntos;
    }
    localStorage.setItem(GAMIFICACION_LS_KEY, JSON.stringify(data));
}

function sumarPuntos(cantidad) {
    const gam = getGamificacion();
    gam.puntos += cantidad;
    // Nivel: cada 100 puntos
    const nuevoNivel = Math.floor(gam.puntos / 100) + 1;
    if (nuevoNivel > gam.nivel) {
        gam.nivel = nuevoNivel;
        gam.progreso = gam.puntos % 100;
        saveGamificacion(gam);
        actualizarGamificacionUI();
        showNotification(`¡Subiste a nivel ${gam.nivel}!`);
        lanzarConfeti();
    } else {
        gam.nivel = nuevoNivel;
        gam.progreso = gam.puntos % 100;
        saveGamificacion(gam);
        actualizarGamificacionUI();
        showNotification(`¡Felicidades, ganaste ${cantidad} puntos!`);
    }
}

function registrarCompletado() {
    const gam = getGamificacion();
    gam.completados += 1;
    // Completados hoy
    const hoy = new Date().toLocaleDateString('es-ES');
    if (gam.diaCompletados !== hoy) {
        gam.completadosHoy = 1;
        gam.diaCompletados = hoy;
    } else {
        gam.completadosHoy += 1;
    }
    sumarPuntos(10);
    // Logro: 5 completados
    if (gam.completados === 5 && !gam.logros.includes('5_completados')) {
        gam.logros.push('5_completados');
        showLogroDesbloqueado('5_completados');
    }
    // Logro: Maratón
    if (gam.completadosHoy === 10 && !gam.logros.includes('maraton')) {
        gam.logros.push('maraton');
        showLogroDesbloqueado('maraton');
    }
    // Logro: Madrugador
    const ahora = new Date();
    if (ahora.getHours() < 8 && !gam.logros.includes('madrugador')) {
        gam.logros.push('madrugador');
        showLogroDesbloqueado('madrugador');
    }
    saveGamificacion(gam);
    actualizarGamificacionUI();
}

function registrarCreado() {
    const gam = getGamificacion();
    gam.creados += 1;
    // Logro: 10 creados
    if (gam.creados === 10 && !gam.logros.includes('10_creados')) {
        gam.logros.push('10_creados');
        showLogroDesbloqueado('10_creados');
    }
    saveGamificacion(gam);
    actualizarGamificacionUI();
}

function registrarDiaActivo() {
    const gam = getGamificacion();
    const hoy = new Date().toLocaleDateString('es-ES');
    if (gam.ultimoDia !== hoy) {
        const ayer = new Date(Date.now() - 86400000).toLocaleDateString('es-ES');
        if (gam.ultimoDia === ayer) {
            gam.diasActivos += 1;
            gam.streak = (gam.streak || 1) + 1;
            gam.streakLost = false;
        } else {
            gam.diasActivos = 1;
            if (gam.streak && gam.streak > 1) {
                gam.streakLost = true;
            }
            gam.streak = 1;
        }
        gam.ultimoDia = hoy;
        // Logro: 7 días seguidos
        if (gam.diasActivos === 7 && !gam.logros.includes('7_dias')) {
            gam.logros.push('7_dias');
            showLogroDesbloqueado('7_dias');
        }
        saveGamificacion(gam);
        actualizarGamificacionUI();
    }
}

function animarProgresoBarra(valorInicial, valorFinal) {
    const barra = document.getElementById('gam-progreso');
    const texto = document.getElementById('gam-progreso-texto');
    if (!barra || !texto) return;
    const duracion = 700; // ms
    const pasos = 30;
    let paso = 0;
    let valorActual = valorInicial;
    const incremento = (valorFinal - valorInicial) / pasos;
    function animar() {
        valorActual += incremento;
        paso++;
        const valorRedondeado = Math.round(valorActual);
        barra.style.width = valorRedondeado + '%';
        texto.textContent = `${valorRedondeado}/100 para el siguiente nivel`;
        if (paso < pasos) {
            setTimeout(animar, duracion / pasos);
        } else {
            barra.style.width = valorFinal + '%';
            texto.textContent = `${valorFinal}/100 para el siguiente nivel`;
        }
    }
    animar();
}

// Modifica actualizarGamificacionUI para animar el progreso
function actualizarGamificacionUI() {
    const gam = getGamificacion();
    // Puntos, nivel, barra
    if (document.getElementById('gam-puntos')) {
        document.getElementById('gam-puntos').textContent = gam.puntos;
        document.getElementById('gam-nivel').textContent = gam.nivel;
        // Animación de barra y contador
        const barra = document.getElementById('gam-progreso');
        const texto = document.getElementById('gam-progreso-texto');
        if (barra && texto) {
            const valorActual = parseInt(barra.style.width) || 0;
            animarProgresoBarra(valorActual, gam.progreso);
        }
    }
    // Racha
    if (document.getElementById('streak-count')) {
        document.getElementById('streak-count').textContent = gam.streak || 1;
        const streakDiv = document.getElementById('gam-streak');
        if (gam.streakLost) {
            streakDiv.classList.add('streak-lost');
            streakDiv.innerHTML += ' <span>¡Racha perdida!</span>';
            setTimeout(() => streakDiv.classList.remove('streak-lost'), 1200);
        } else {
            streakDiv.classList.remove('streak-lost');
        }
    }
    // Récord
    if (document.getElementById('record-puntos')) {
        document.getElementById('record-puntos').textContent = gam.record || gam.puntos;
    }
    // Logros
    if (document.getElementById('gam-logros')) {
        const logrosDiv = document.getElementById('gam-logros');
        logrosDiv.innerHTML = '';
        LOGROS_DEFINIDOS.forEach(l => {
            if (gam.logros.includes(l.id)) {
                logrosDiv.innerHTML += `<div class='logro-insignia ${l.rareza}'><span class='logro-icono fa ${l.icono}'></span><span class='logro-nombre'>${l.nombre}</span><span class='logro-desc'>${l.desc}</span></div>`;
            } else if (!l.secreto) {
                logrosDiv.innerHTML += `<div class='logro-insignia bloqueado ${l.rareza}'><span class='logro-icono fa fa-lock'></span><span class='logro-nombre'>???</span><span class='logro-desc'>${l.desc}</span></div>`;
            }
        });
    }
}

function showLogroDesbloqueado(id) {
    const logro = LOGROS_DEFINIDOS.find(l => l.id === id);
    if (!logro) return;
    showNotification(`¡Logro desbloqueado! ${logro.nombre}`);
    lanzarConfeti();
    if (document.getElementById('gam-logros')) {
        const logrosDiv = document.getElementById('gam-logros');
        const temp = document.createElement('div');
        temp.className = `logro-insignia logro-nuevo ${logro.rareza}`;
        temp.innerHTML = `<span class='logro-icono fa ${logro.icono}'></span><span class='logro-nombre'>${logro.nombre}</span><span class='logro-desc'>${logro.desc}</span>`;
        logrosDiv.appendChild(temp);
        setTimeout(() => temp.classList.remove('logro-nuevo'), 1500);
    }
}

// Confeti animado
function lanzarConfeti() {
    const colores = ['#ffcc00', '#28a745', '#ab47bc', '#4fc3f7', '#ff5722', '#ffc107'];
    const confettiContainer = document.getElementById('confetti-container');
    if (!confettiContainer) return;
    confettiContainer.innerHTML = '';
    confettiContainer.className = 'confetti';
    for (let i = 0; i < 40; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + 'vw';
        piece.style.background = colores[Math.floor(Math.random() * colores.length)];
        piece.style.animationDelay = (Math.random() * 0.7) + 's';
        confettiContainer.appendChild(piece);
    }
    setTimeout(() => { confettiContainer.innerHTML = ''; }, 1800);
}

// Inicializar gamificación al cargar
if (document.readyState !== 'loading') {
    actualizarGamificacionUI();
    registrarDiaActivo();
} else {
    document.addEventListener('DOMContentLoaded', () => {
        actualizarGamificacionUI();
        registrarDiaActivo();
    });
}
// --- FIN Gamificación Kronoss --- 