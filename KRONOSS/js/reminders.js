// reminders.js - Gestión de recordatorios CRUD

document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const reminderForm = document.getElementById('reminderForm');
    const remindersList = document.getElementById('remindersList');
    const tabCrear = document.getElementById('tab-crear');
    const tabVer = document.getElementById('tab-ver');
    const formContainer = document.getElementById('form-container');
    const listContainer = document.getElementById('list-container');
    const submitButton = document.getElementById('saveReminder');
    const submitButtonText = document.getElementById('submitButtonText');
    const cancelEditButton = document.getElementById('cancelEdit');
    const deleteModal = document.getElementById('deleteModal');
    const confirmDeleteButton = document.getElementById('confirmDelete');
    const cancelDeleteButton = document.getElementById('cancelDelete');
    const closeModalButton = document.querySelector('.close-modal');
    const searchInput = document.getElementById('searchReminder');
    const filterCategory = document.getElementById('filterCategory');
    const filterPriority = document.getElementById('filterPriority');

    // Estado de la aplicación
    let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
    let currentReminderId = null;
    let isEditing = false;

    // Inicializar
    renderReminders();
    initializeTabs();
    initializeEventListeners();
    setDefaultDate();

    // Establecer la fecha actual por defecto
    function setDefaultDate() {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        document.getElementById('reminderDate').value = formattedDate;
    }

    // Inicializar pestañas
    function initializeTabs() {
        // Asegurar que el formulario esté visible inicialmente
        formContainer.classList.add('active-tab');
        listContainer.classList.remove('active-tab');
        
        tabCrear.addEventListener('click', function() {
            tabCrear.classList.add('active');
            tabVer.classList.remove('active');
            formContainer.classList.add('active-tab');
            listContainer.classList.remove('active-tab');
        });

        tabVer.addEventListener('click', function() {
            tabVer.classList.add('active');
            tabCrear.classList.remove('active');
            listContainer.classList.add('active-tab');
            formContainer.classList.remove('active-tab');
            renderReminders(); // Actualizar la lista al cambiar a esta pestaña
        });
    }

    // Inicializar todos los event listeners
    function initializeEventListeners() {
        // Formulario de recordatorios
        reminderForm.addEventListener('submit', handleFormSubmit);
        
        // Botón cancelar edición
        cancelEditButton.addEventListener('click', cancelEdit);
        
        // Modal de eliminación
        confirmDeleteButton.addEventListener('click', confirmDelete);
        cancelDeleteButton.addEventListener('click', closeDeleteModal);
        closeModalButton.addEventListener('click', closeDeleteModal);
        
        // Cerrar modal al hacer clic fuera
        window.addEventListener('click', function(event) {
            if (event.target === deleteModal) {
                closeDeleteModal();
            }
        });
        
        // Filtros
        searchInput.addEventListener('input', filterReminders);
        filterCategory.addEventListener('change', filterReminders);
        filterPriority.addEventListener('change', filterReminders);
    }

    // Manejar envío del formulario (crear o actualizar)
    function handleFormSubmit(e) {
        e.preventDefault();
        
        // Obtener datos del formulario
        const formData = new FormData(reminderForm);
        const reminderData = {
            id: isEditing ? currentReminderId : Date.now().toString(),
            title: formData.get('reminderTitle'),
            type: formData.get('reminderType'),
            category: formData.get('reminderCategory'),
            context: formData.get('reminderContext'),
            date: formData.get('reminderDate'),
            time: formData.get('reminderTime'),
            priority: formData.get('reminderPriority'),
            message: formData.get('reminderMessage'),
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            energyLevel: formData.get('energyLevel'),
            repeat: formData.get('reminderRepeat'),
            notificationType: formData.get('notificationType'),
            smartSuggestion: formData.get('smartSuggestion'),
            peopleInvolved: formData.get('peopleInvolved'),
            notes: formData.get('reminderNotes'),
            createdAt: isEditing ? (findReminderById(currentReminderId)?.createdAt || new Date().toISOString()) : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        if (isEditing) {
            // Actualizar recordatorio existente
            updateReminder(reminderData);
        } else {
            // Crear nuevo recordatorio
            createReminder(reminderData);
        }
        
        // Resetear formulario y estado
        reminderForm.reset();
        resetFormState();
        setDefaultDate(); // Restablecer la fecha por defecto
        
        // Cambiar a la pestaña de ver recordatorios
        tabVer.click();
    }

    // Crear nuevo recordatorio
    function createReminder(reminderData) {
        reminders.push(reminderData);
        saveReminders();
        showNotification('Recordatorio creado correctamente');
    }

    // Actualizar recordatorio existente
    function updateReminder(reminderData) {
        const index = reminders.findIndex(reminder => reminder.id === reminderData.id);
        if (index !== -1) {
            reminders[index] = reminderData;
            saveReminders();
            showNotification('Recordatorio actualizado correctamente');
        }
    }

    // Eliminar recordatorio
    function deleteReminder(id) {
        reminders = reminders.filter(reminder => reminder.id !== id);
        saveReminders();
        renderReminders();
        showNotification('Recordatorio eliminado correctamente');
    }

    // Guardar recordatorios en localStorage
    function saveReminders() {
        localStorage.setItem('reminders', JSON.stringify(reminders));
    }

    // Renderizar lista de recordatorios
    function renderReminders(filteredList = null) {
        const list = filteredList || reminders;
        
        if (list.length === 0) {
            remindersList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-times"></i>
                    <p>No tienes recordatorios. ¡Crea uno nuevo!</p>
                </div>
            `;
            return;
        }
        
        // Ordenar por fecha y hora
        const sortedList = [...list].sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}`);
            const dateB = new Date(`${b.date}T${b.time}`);
            return dateA - dateB;
        });
        
        remindersList.innerHTML = '';
        
        sortedList.forEach(reminder => {
            const reminderEl = document.createElement('div');
            reminderEl.className = `reminder-item priority-${reminder.priority}`;
            reminderEl.dataset.id = reminder.id;
            
            // Formatear fecha para mostrar
            const reminderDate = new Date(`${reminder.date}T${reminder.time}`);
            const formattedDate = new Intl.DateTimeFormat('es', { 
                dateStyle: 'full',
                timeStyle: 'short'
            }).format(reminderDate);
            
            // Icono según tipo de recordatorio
            let typeIcon;
            switch(reminder.type) {
                case 'meeting': typeIcon = 'fa-users'; break;
                case 'call': typeIcon = 'fa-phone'; break;
                case 'task': typeIcon = 'fa-tasks'; break;
                case 'event': typeIcon = 'fa-calendar-day'; break;
                default: typeIcon = 'fa-bell';
            }
            
            // Texto de categoría en español
            let categoryText;
            switch(reminder.category) {
                case 'personal': categoryText = 'Personal'; break;
                case 'salud': categoryText = 'Salud'; break;
                case 'trabajo': categoryText = 'Trabajo'; break;
                case 'familia': categoryText = 'Familia'; break;
                case 'finanzas': categoryText = 'Finanzas'; break;
                default: categoryText = 'Otro';
            }
            
            reminderEl.innerHTML = `
                <div class="reminder-header">
                    <div class="reminder-title">
                        <i class="fas ${typeIcon}"></i>
                        <h3>${reminder.title}</h3>
                    </div>
                    <div class="reminder-category">${categoryText}</div>
                </div>
                <div class="reminder-datetime">
                    <i class="fas fa-clock"></i> ${formattedDate}
                </div>
                <div class="reminder-message">${reminder.message}</div>
                <div class="reminder-actions">
                    <button class="edit-button" data-id="${reminder.id}" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-button" data-id="${reminder.id}" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            // Añadir event listeners para editar y eliminar
            const editButton = reminderEl.querySelector('.edit-button');
            const deleteButton = reminderEl.querySelector('.delete-button');
            
            editButton.addEventListener('click', () => editReminder(reminder.id));
            deleteButton.addEventListener('click', () => showDeleteModal(reminder.id));
            
            remindersList.appendChild(reminderEl);
        });
    }

    // Editar recordatorio
    function editReminder(id) {
        const reminder = findReminderById(id);
        if (!reminder) return;
        
        // Cambiar a la pestaña de crear/editar
        tabCrear.click();
        
        // Establecer estado de edición
        isEditing = true;
        currentReminderId = id;
        submitButtonText.textContent = 'Actualizar Recordatorio';
        cancelEditButton.style.display = 'inline-flex';
        
        // Rellenar formulario con datos del recordatorio
        document.getElementById('reminderId').value = reminder.id;
        document.getElementById('reminderTitle').value = reminder.title;
        document.getElementById('reminderType').value = reminder.type;
        document.getElementById('reminderCategory').value = reminder.category;
        document.getElementById('reminderContext').value = reminder.context;
        document.getElementById('reminderDate').value = reminder.date;
        document.getElementById('reminderTime').value = reminder.time;
        document.getElementById('reminderPriority').value = reminder.priority;
        document.getElementById('reminderMessage').value = reminder.message;
        document.getElementById('fullName').value = reminder.fullName;
        document.getElementById('email').value = reminder.email;
        document.getElementById('phone').value = reminder.phone;
        document.getElementById('energyLevel').value = reminder.energyLevel;
        document.getElementById('reminderRepeat').value = reminder.repeat;
        document.getElementById('notificationType').value = reminder.notificationType;
        document.getElementById('smartSuggestion').value = reminder.smartSuggestion;
        document.getElementById('peopleInvolved').value = reminder.peopleInvolved;
        document.getElementById('reminderNotes').value = reminder.notes;
    }

    // Cancelar edición
    function cancelEdit() {
        resetFormState();
        reminderForm.reset();
        setDefaultDate(); // Restablecer la fecha por defecto
    }

    // Resetear estado del formulario
    function resetFormState() {
        isEditing = false;
        currentReminderId = null;
        submitButtonText.textContent = 'Crear Recordatorio';
        cancelEditButton.style.display = 'none';
    }

    // Mostrar modal de confirmación para eliminar
    function showDeleteModal(id) {
        currentReminderId = id;
        deleteModal.style.display = 'flex';
    }

    // Cerrar modal de eliminación
    function closeDeleteModal() {
        deleteModal.style.display = 'none';
    }

    // Confirmar eliminación
    function confirmDelete() {
        if (currentReminderId) {
            deleteReminder(currentReminderId);
            closeDeleteModal();
        }
    }

    // Filtrar recordatorios
    function filterReminders() {
        const searchTerm = searchInput.value.toLowerCase();
        const categoryFilter = filterCategory.value;
        const priorityFilter = filterPriority.value;
        
        const filtered = reminders.filter(reminder => {
            // Filtro por texto de búsqueda
            const matchesSearch = 
                reminder.title.toLowerCase().includes(searchTerm) ||
                reminder.message.toLowerCase().includes(searchTerm) ||
                reminder.context.toLowerCase().includes(searchTerm);
            
            // Filtro por categoría
            const matchesCategory = !categoryFilter || reminder.category === categoryFilter;
            
            // Filtro por prioridad
            const matchesPriority = !priorityFilter || reminder.priority === priorityFilter;
            
            return matchesSearch && matchesCategory && matchesPriority;
        });
        
        renderReminders(filtered);
    }

    // Encontrar recordatorio por ID
    function findReminderById(id) {
        return reminders.find(reminder => reminder.id === id);
    }

    // Mostrar notificación
    function showNotification(message) {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        // Añadir a la página
        document.body.appendChild(notification);
        
        // Mostrar con animación
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Eliminar después de 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}); 