document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const themeSwitch = document.getElementById('theme-switch');
    const createTopicBtn = document.getElementById('create-topic');
    const newTopicModal = document.getElementById('new-topic-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.cancel-btn');
    const categoryCards = document.querySelectorAll('.category-card');
    const topicLinks = document.querySelectorAll('.topic-link');
    const topicFilter = document.getElementById('topic-filter');
    const reactionBtns = document.querySelectorAll('.reaction-btn');
    const replyBtns = document.querySelectorAll('.reply-btn');
    const editorButtons = document.querySelectorAll('.toolbar-btn');
    const newTopicForm = document.getElementById('new-topic-form');
    const postReplyForm = document.getElementById('post-reply-form');
    
    // Comprobar tema actual
    checkTheme();
    
    // Eventos para sidebar móvil
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
    
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }
    
    // Evento para cambio de tema
    if (themeSwitch) {
        themeSwitch.addEventListener('click', toggleTheme);
    }
    
    // Eventos para modal de nuevo tema
    if (createTopicBtn) {
        createTopicBtn.addEventListener('click', openNewTopicModal);
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeNewTopicModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeNewTopicModal);
    }
    
    // Eventos para categorías
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            navigateToCategory(category);
        });
    });
    
    // Eventos para enlaces de temas
    topicLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navigateToTopic(this.getAttribute('href'));
        });
    });
    
    // Evento para filtro de temas
    if (topicFilter) {
        topicFilter.addEventListener('change', filterTopics);
    }
    
    // Eventos para botones de reacción
    reactionBtns.forEach(btn => {
        btn.addEventListener('click', toggleReaction);
    });
    
    // Eventos para botones de respuesta
    replyBtns.forEach(btn => {
        btn.addEventListener('click', scrollToReplyForm);
    });
    
    // Eventos para botones del editor
    editorButtons.forEach(btn => {
        btn.addEventListener('click', applyFormatting);
    });
    
    // Eventos para formularios
    if (newTopicForm) {
        newTopicForm.addEventListener('submit', handleNewTopicSubmit);
    }
    
    if (postReplyForm) {
        postReplyForm.addEventListener('submit', handleReplySubmit);
    }
    
    // Inicializar fecha actual
    updateCurrentDate();
    
    // Funciones
    
    // Función para alternar sidebar en móvil
    function toggleSidebar() {
        sidebar.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
    }
    
    // Función para cerrar sidebar
    function closeSidebar() {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
    }
    
    // Función para alternar tema claro/oscuro
    function toggleTheme() {
        const currentTheme = localStorage.getItem('theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        updateThemeIcon(newTheme);
    }
    
    // Función para comprobar tema actual
    function checkTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }
    
    // Función para actualizar icono del tema
    function updateThemeIcon(theme) {
        const moonIcon = themeSwitch.querySelector('.fa-moon');
        const sunIcon = themeSwitch.querySelector('.fa-sun');
        
        if (theme === 'dark') {
            moonIcon.style.display = 'none';
            sunIcon.style.display = 'inline-block';
        } else {
            moonIcon.style.display = 'inline-block';
            sunIcon.style.display = 'none';
        }
    }
    
    // Función para abrir modal de nuevo tema
    function openNewTopicModal() {
        newTopicModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Función para cerrar modal de nuevo tema
    function closeNewTopicModal() {
        newTopicModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Función para navegar a una categoría
    function navigateToCategory(category) {
        console.log(`Navegando a la categoría: ${category}`);
        // En una implementación real, redirigir a la página de la categoría
        // window.location.href = `categoria.html?cat=${category}`;
    }
    
    // Función para navegar a un tema
    function navigateToTopic(url) {
        console.log(`Navegando al tema: ${url}`);
        // En una implementación real, redirigir a la página del tema
        window.location.href = 'tema.html';
    }
    
    // Función para filtrar temas
    function filterTopics() {
        const filterValue = this.value;
        console.log(`Filtrando temas por: ${filterValue}`);
        // En una implementación real, hacer una petición AJAX para obtener los temas filtrados
        // y actualizar la lista de temas
    }
    
    // Función para alternar reacción (me gusta, no me gusta)
    function toggleReaction() {
        this.classList.toggle('liked');
        
        const countSpan = this.querySelector('span');
        let count = parseInt(countSpan.textContent);
        
        if (this.classList.contains('liked')) {
            count++;
        } else {
            count--;
        }
        
        countSpan.textContent = count;
        
        // En una implementación real, enviar la reacción al servidor
        console.log(`Reacción actualizada: ${count}`);
    }
    
    // Función para desplazarse al formulario de respuesta
    function scrollToReplyForm() {
        const replyForm = document.querySelector('.reply-form');
        if (replyForm) {
            replyForm.scrollIntoView({ behavior: 'smooth' });
            replyForm.querySelector('textarea').focus();
        }
    }
    
    // Función para aplicar formato al texto en el editor
    function applyFormatting() {
        const format = this.getAttribute('data-format');
        const textarea = this.closest('.rich-editor').querySelector('textarea');
        
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);
        let formattedText = '';
        
        switch (format) {
            case 'bold':
                formattedText = `**${selectedText}**`;
                break;
            case 'italic':
                formattedText = `*${selectedText}*`;
                break;
            case 'underline':
                formattedText = `__${selectedText}__`;
                break;
            case 'link':
                formattedText = `[${selectedText}](url)`;
                break;
            case 'image':
                formattedText = `![${selectedText}](url)`;
                break;
            case 'list-ul':
                formattedText = `\n- ${selectedText.split('\n').join('\n- ')}`;
                break;
            case 'list-ol':
                const lines = selectedText.split('\n');
                formattedText = '\n';
                for (let i = 0; i < lines.length; i++) {
                    formattedText += `${i + 1}. ${lines[i]}\n`;
                }
                break;
            case 'mention':
                formattedText = `@${selectedText}`;
                break;
            case 'quote':
                formattedText = `> ${selectedText.split('\n').join('\n> ')}`;
                break;
        }
        
        textarea.value = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
        textarea.focus();
        textarea.selectionStart = start;
        textarea.selectionEnd = start + formattedText.length;
    }
    
    // Función para manejar envío de nuevo tema
    function handleNewTopicSubmit(e) {
        e.preventDefault();
        
        const title = document.getElementById('topic-title').value;
        const category = document.getElementById('topic-category').value;
        const content = document.getElementById('topic-content').value;
        const tags = document.getElementById('topic-tags').value;
        
        if (!title || !category || !content) {
            alert('Por favor completa todos los campos requeridos.');
            return;
        }
        
        // En una implementación real, enviar los datos al servidor
        console.log('Nuevo tema:', { title, category, content, tags });
        
        // Simular éxito
        alert('¡Tema creado con éxito!');
        closeNewTopicModal();
        
        // Redirigir a la página del tema (simulación)
        setTimeout(() => {
            window.location.href = 'tema.html';
        }, 500);
    }
    
    // Función para manejar envío de respuesta
    function handleReplySubmit(e) {
        e.preventDefault();
        
        const content = document.getElementById('reply-content').value;
        const attachments = document.getElementById('reply-attachments').files;
        
        if (!content) {
            alert('Por favor escribe una respuesta.');
            return;
        }
        
        // En una implementación real, enviar los datos al servidor
        console.log('Nueva respuesta:', { content, attachments });
        
        // Simular éxito
        alert('¡Respuesta publicada con éxito!');
        
        // Limpiar formulario
        document.getElementById('reply-content').value = '';
        document.getElementById('reply-attachments').value = '';
        
        // Recargar la página para mostrar la nueva respuesta (simulación)
        setTimeout(() => {
            location.reload();
        }, 500);
    }
    
    // Función para actualizar la fecha actual
    function updateCurrentDate() {
        const currentDateElement = document.getElementById('current-date');
        if (currentDateElement) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const today = new Date();
            currentDateElement.textContent = today.toLocaleDateString('es-ES', options);
        }
    }
    
    // Cerrar modal al hacer clic fuera de él
    window.addEventListener('click', function(e) {
        if (e.target === newTopicModal) {
            closeNewTopicModal();
        }
    });
    
    // Prevenir cierre al hacer clic dentro del contenido del modal
    if (newTopicModal) {
        const modalContent = newTopicModal.querySelector('.modal-content');
        modalContent.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Manejar tecla Escape para cerrar modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && newTopicModal && newTopicModal.classList.contains('active')) {
            closeNewTopicModal();
        }
    });
}); 