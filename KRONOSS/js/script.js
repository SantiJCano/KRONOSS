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
        updateStatCards();
    }, updateInterval);
}

// Actualizar las tarjetas de estadísticas con datos simulados
function updateStatCards() {
    // Simulación de cambios en los datos
    const cards = document.querySelectorAll('.card .number');
    
    // Usuarios activos (variación aleatoria)
    const usersCard = cards[0];
    let usersCount = parseInt(usersCard.textContent.replace(',', ''));
    const usersDelta = Math.floor(Math.random() * 10) - 3; // Entre -3 y +6
    usersCount += usersDelta;
    usersCard.textContent = usersCount.toLocaleString('es-ES');
    
    // Actualizar tendencia
    const usersTrend = usersCard.nextElementSibling;
    if (usersDelta >= 0) {
        usersTrend.innerHTML = `<i class="fas fa-arrow-up"></i> ${Math.abs(usersDelta)}% desde ayer`;
        usersTrend.className = 'trend positive';
    } else {
        usersTrend.innerHTML = `<i class="fas fa-arrow-down"></i> ${Math.abs(usersDelta)}% desde ayer`;
        usersTrend.className = 'trend negative';
    }
    
    // Recordatorios creados (siempre aumenta)
    const tasksCard = cards[1];
    let tasksCount = parseInt(tasksCard.textContent.replace(',', ''));
    const tasksDelta = Math.floor(Math.random() * 20) + 1; // Entre 1 y 20
    tasksCount += tasksDelta;
    tasksCard.textContent = tasksCount.toLocaleString('es-ES');
    
    // Actualizar tendencia
    const tasksTrend = tasksCard.nextElementSibling;
    tasksTrend.innerHTML = `<i class="fas fa-arrow-up"></i> ${tasksDelta}% desde ayer`;
    
    // Simular cambios en los otros indicadores también
    simulateOtherMetricsChanges();
}

// Simular cambios en otras métricas
function simulateOtherMetricsChanges() {
    // Simular cambios en el gráfico de barras
    const bars = document.querySelectorAll('.chart-placeholder .bar');
    bars.forEach(bar => {
        const currentHeight = parseInt(bar.style.height);
        const newHeight = Math.max(10, Math.min(95, currentHeight + (Math.random() * 20 - 10))) + '%';
        bar.style.height = newHeight;
    });
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
            updateStatCards();
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
    
    // Simular notificaciones nuevas
    simulateNewNotifications();
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
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // Aplicar nuevo tema
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Guardar preferencia
    localStorage.setItem('theme', newTheme);
} 