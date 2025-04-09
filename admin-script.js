document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the login page
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('loginError');
            
            // Simple authentication (in a real app, this would be server-side)
            if (username === 'admin' && password === 'password123') {
                // Store login status in localStorage
                localStorage.setItem('adminLoggedIn', 'true');
                localStorage.setItem('adminUsername', username);
                
                // Redirect to dashboard
                window.location.href = 'admin-dashboard.html';
            } else {
                errorMessage.textContent = 'Invalid username or password';
            }
        });
    }
    
    // Check if we're on the dashboard page
    const adminDashboard = document.querySelector('.admin-dashboard-body');
    if (adminDashboard) {
        // Check if user is logged in
        if (!localStorage.getItem('adminLoggedIn')) {
            window.location.href = 'admin-login.html';
            return;
        }
        
        // Set admin username
        const adminUsername = document.getElementById('adminUsername');
        if (adminUsername) {
            adminUsername.textContent = localStorage.getItem('adminUsername') || 'Admin';
        }
        
        // Handle logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function() {
                localStorage.removeItem('adminLoggedIn');
                localStorage.removeItem('adminUsername');
                window.location.href = 'admin-login.html';
            });
        }
        
        // Handle sidebar navigation
        const menuItems = document.querySelectorAll('.admin-menu li a');
        const sections = document.querySelectorAll('.admin-section');
        
        menuItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetSection = this.getAttribute('data-section');
                
                // Remove active class from all menu items and sections
                menuItems.forEach(item => {
                    item.parentElement.classList.remove('active');
                });
                sections.forEach(section => {
                    section.classList.remove('active');
                });
                
                // Add active class to clicked menu item and corresponding section
                this.parentElement.classList.add('active');
                document.getElementById(targetSection).classList.add('active');
            });
        });
        
        // Initialize projects management
        initProjectsManagement();
    }
});

// Projects Management
function initProjectsManagement() {
    // DOM elements
    const projectsTableBody = document.getElementById('projectsTableBody');
    const addProjectBtn = document.getElementById('addProjectBtn');
    const projectModal = document.getElementById('projectModal');
    const deleteModal = document.getElementById('deleteModal');
    const projectForm = document.getElementById('projectForm');
    const cancelProjectBtn = document.getElementById('cancelProjectBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const projectCount = document.getElementById('projectCount');
    
    // Default projects (these would normally come from a database)
    const defaultProjects = [
        {
            id: 1,
            name: 'Lusaka Business Park',
            category: 'commercial',
            description: 'Complete electrical installation for a 5-story office complex',
            image: 'images/project1.jpg'
        },
        {
            id: 2,
            name: 'Kabulonga Residence',
            category: 'residential',
            description: 'Smart home electrical systems with automated lighting and security',
            image: 'images/project2.jpg'
        },
        {
            id: 3,
            name: 'Kafue Manufacturing Plant',
            category: 'industrial',
            description: 'Industrial-grade electrical infrastructure for heavy machinery',
            image: 'images/project3.jpg'
        },
        {
            id: 4,
            name: 'Chilanga Solar Farm',
            category: 'solar',
            description: '50kW solar installation for sustainable energy production',
            image: 'images/project4.jpg'
        },
        {
            id: 5,
            name: 'Manda Hill Mall',
            category: 'commercial',
            description: 'Electrical upgrades and maintenance for retail spaces',
            image: 'images/project5.jpg'
        },
        {
            id: 6,
            name: 'Garden City Apartments',
            category: 'residential',
            description: 'Complete wiring for a 24-unit residential complex',
            image: 'images/project6.jpg'
        }
    ];
    
    // Initialize projects in localStorage if not already there
    if (!localStorage.getItem('projects')) {
        localStorage.setItem('projects', JSON.stringify(defaultProjects));
    }
    
    // Load projects from localStorage
    function loadProjects() {
        const projects = JSON.parse(localStorage.getItem('projects')) || [];
        
        // Update project count
        if (projectCount) {
            projectCount.textContent = projects.length;
        }
        
        // Clear table
        if (projectsTableBody) {
            projectsTableBody.innerHTML = '';
            
            // Add projects to table
            projects.forEach(project => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><img src="${project.image}" alt="${project.name}"></td>
                    <td>${project.name}</td>
                    <td>${capitalizeFirstLetter(project.category)}</td>
                    <td>${project.description}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="action-btn edit-btn" data-id="${project.id}"><i class="fas fa-edit"></i></button>
                            <button class="action-btn delete-btn" data-id="${project.id}"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
                `;
                projectsTableBody.appendChild(row);
            });
            
            // Add event listeners to edit and delete buttons
            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const projectId = parseInt(this.getAttribute('data-id'));
                    editProject(projectId);
                });
            });
            
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const projectId = parseInt(this.getAttribute('data-id'));
                    openDeleteModal(projectId);
                });
            });
        }
    }
    
    // Open project modal for adding a new project
    function openAddProjectModal() {
        document.getElementById('modalTitle').textContent = 'Add New Project';
        document.getElementById('projectId').value = '';
        projectForm.reset();
        document.getElementById('imagePreview').innerHTML = '<p>Image preview will appear here</p>';
        projectModal.style.display = 'block';
    }
    
    // Open project modal for editing an existing project
    function editProject(projectId) {
        const projects = JSON.parse(localStorage.getItem('projects')) || [];
        const project = projects.find(p => p.id === projectId);
        
        if (project) {
            document.getElementById('modalTitle').textContent = 'Edit Project';
            document.getElementById('projectId').value = project.id;
            document.getElementById('projectName').value = project.name;
            document.getElementById('projectCategory').value = project.category;
            document.getElementById('projectDescription').value = project.description;
            document.getElementById('projectImage').value = project.image;
            
            // Update image preview
            const imagePreview = document.getElementById('imagePreview');
            imagePreview.innerHTML = `<img src="${project.image}" alt="${project.name}">`;
            
            projectModal.style.display = 'block';
        }
    }
    
    // Open delete confirmation modal
    function openDeleteModal(projectId) {
        confirmDeleteBtn.setAttribute('data-id', projectId);
        deleteModal.style.display = 'block';
    }
    
    // Close modals
    function closeModals() {
        projectModal.style.display = 'none';
        deleteModal.style.display = 'none';
    }
    
    // Save project (add or update)
    function saveProject(e) {
        e.preventDefault();
        
        const projectId = document.getElementById('projectId').value;
        const name = document.getElementById('projectName').value;
        const category = document.getElementById('projectCategory').value;
        const description = document.getElementById('projectDescription').value;
        const image = document.getElementById('projectImage').value;
        
        const projects = JSON.parse(localStorage.getItem('projects')) || [];
        
        if (projectId) {
            // Update existing project
            const index = projects.findIndex(p => p.id === parseInt(projectId));
            if (index !== -1) {
                projects[index] = {
                    ...projects[index],
                    name,
                    category,
                    description,
                    image
                };
            }
        } else {
            // Add new project
            const newId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
            projects.push({
                id: newId,
                name,
                category,
                description,
                image
            });
        }
        
        // Save to localStorage
        localStorage.setItem('projects', JSON.stringify(projects));
        
        // Close modal and reload projects
        closeModals();
        loadProjects();
        
        // Add to activity log
        addActivity(projectId ? 'Project updated' : 'New project added');
    }
    
    // Delete project
    function deleteProject(projectId) {
        let projects = JSON.parse(localStorage.getItem('projects')) || [];
        projects = projects.filter(p => p.id !== parseInt(projectId));
        
        // Save to localStorage
        localStorage.setItem('projects', JSON.stringify(projects));
        
        // Close modal and reload projects
        closeModals();
        loadProjects();
        
        // Add to activity log
        addActivity('Project deleted');
    }
    
    // Add activity to log
    function addActivity(action) {
        const activityList = document.querySelector('.activity-list');
        if (activityList) {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            activityItem.innerHTML = `
                <div class="activity-icon">
                    <i class="fas fa-project-diagram"></i>
                </div>
                <div class="activity-details">
                    <p>${action}</p>
                    <span class="activity-time">Just now</span>
                </div>
            `;
            activityList.insertBefore(activityItem, activityList.firstChild);
        }
    }
    
    // Preview image when URL is entered
    function previewImage() {
        const imageUrl = document.getElementById('projectImage').value;
        const imagePreview = document.getElementById('imagePreview');
        
        if (imageUrl) {
            imagePreview.innerHTML = `<img src="${imageUrl}" alt="Preview" onerror="this.onerror=null;this.src='images/placeholder.jpg';">`;
        } else {
            imagePreview.innerHTML = '<p>Image preview will appear here</p>';
        }
    }
    
    // Helper function to capitalize first letter
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    // Event listeners
    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', openAddProjectModal);
    }
    
    if (projectForm) {
        projectForm.addEventListener('submit', saveProject);
    }
    
    if (cancelProjectBtn) {
        cancelProjectBtn.addEventListener('click', closeModals);
    }
    
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', closeModals);
    }
    
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function() {
            const projectId = this.getAttribute('data-id');
            deleteProject(projectId);
        });
    }
    
    if (closeModalBtns) {
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', closeModals);
        });
    }
    
    // Preview image when URL changes
    const projectImageInput = document.getElementById('projectImage');
    if (projectImageInput) {
        projectImageInput.addEventListener('input', previewImage);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === projectModal) {
            closeModals();
        }
        if (e.target === deleteModal) {
            closeModals();
        }
    });
    
    // Load projects on page load
    loadProjects();
}