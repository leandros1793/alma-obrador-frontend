// ========================================
// ALMA OBRADOR - ADMIN PANEL
// ========================================

//const API_BASE = 'http://localhost:3000/api'; // 🔴 Desarrollo
const API_BASE = 'https://alma-obrador-backend-4a4f.onrender.com/api'; // 🟢 Producción
const ADMIN_PASSWORD = 'Alma2025'; // 🔐 Misma que en backend/.env

let menuData = null;

// ========== LOGIN ==========
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const password = document.getElementById('password').value;
    
    if (password === ADMIN_PASSWORD) {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        loadMenuData();
    } else {
        document.getElementById('errorMessage').style.display = 'block';
        document.getElementById('password').value = '';
    }
});

// ========== LOGOUT ==========
function logout() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('password').value = '';
    document.getElementById('errorMessage').style.display = 'none';
}

// ========== TAB SWITCHING ==========
function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    event.target.classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// ========== LOAD MENU DATA ==========
async function loadMenuData() {
    try {
        const response = await fetch(`${API_BASE}/menu`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        menuData = await response.json();
        renderMenuEdit();
        console.log('✅ Menú cargado desde Node.js');
        
    } catch (error) {
        console.error('❌ Error cargando menú:', error);
        alert('Error al cargar el menú. Usando datos de respaldo.');
        menuData = getDefaultMenuData();
        renderMenuEdit();
    }
}

// ========== RENDER MENU FOR EDITING ==========
function renderMenuEdit() {
    // Café clásicos
    renderMenuSection('cafe-clasicos-edit', menuData.cafe.clasicos);
    
    // Sin café
    renderMenuSection('sin-cafe-edit', menuData.cafe.sinCafe);
    
    // Temporada café
    renderMenuSection('temporada-cafe-edit', menuData.cafe.temporada);
    
    // Extras
    renderMenuSection('extras-edit', menuData.cafe.extras);
    
    // Panadería
    renderMenuSection('panaderia-edit', menuData.panaderia);
    
    // Temporada
    renderMenuSection('temporada-edit', menuData.temporada);
    
    // Sandwich del día
    renderSandwichDelDia();
}

// ========== RENDER MENU SECTION ==========
function renderMenuSection(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container || !items) return;
    
    container.innerHTML = items.map(item => `
        <div class="menu-item-edit" data-id="${item.id}">
            <input type="text" value="${item.name}" class="item-name" placeholder="Nombre del producto">
            <input type="text" value="${item.price}" class="item-price" placeholder="Precio (ej: $50 o Consultar)">
            <button class="btn-small btn-save" onclick="updateItem(${item.id}, '${containerId}')">💾 Guardar</button>
            <button class="btn-small btn-delete" onclick="deleteItem(${item.id}, '${containerId}')">🗑️</button>
        </div>
    `).join('');
}

// ========== RENDER SANDWICH DEL DÍA ==========
function renderSandwichDelDia() {
    const container = document.getElementById('sandwich-edit');
    if (!container) return;
    
    const sandwich = menuData.sandwichDelDia;
    
    container.innerHTML = `
        <div class="menu-item-edit">
            <input 
                type="text" 
                value="${sandwich.name || ''}" 
                class="sandwich-name" 
                placeholder="Nombre del sandwich (opcional)">
            <input 
                type="text" 
                value="${sandwich.price || ''}" 
                class="sandwich-price" 
                placeholder="Precio (opcional, ej: $80)">
            <button class="btn-small btn-save" onclick="updateSandwich()">💾 Guardar</button>
        </div>
        <p style="font-size: 0.9rem; color: #666; margin-top: 0.5rem;">
            💡 Deja los campos vacíos para mostrar solo "Sujeto a disponibilidad"
        </p>
    `;
}

// ========== UPDATE SANDWICH DEL DÍA ==========
function updateSandwich() {
    const name = document.querySelector('.sandwich-name').value.trim();
    const price = document.querySelector('.sandwich-price').value.trim();
    
    menuData.sandwichDelDia.name = name;
    menuData.sandwichDelDia.price = price;
    menuData.sandwichDelDia.available = name !== '' || price !== '';
    
    showToast('✅ Sandwich del día actualizado');
}

// ========== UPDATE ITEM ==========
function updateItem(id, containerId) {
    const itemDiv = document.querySelector(`[data-id="${id}"]`);
    const newName = itemDiv.querySelector('.item-name').value.trim();
    const newPrice = itemDiv.querySelector('.item-price').value.trim();
    
    let found = false;
    
    const sections = [
        menuData.cafe.clasicos,
        menuData.cafe.sinCafe,
        menuData.cafe.temporada,
        menuData.cafe.extras,
        menuData.panaderia,
        menuData.temporada
    ];
    
    for (let section of sections) {
        const item = section.find(i => i.id === id);
        if (item) {
            item.name = newName;
            item.price = newPrice;
            found = true;
            break;
        }
    }
    
    if (found) {
        showToast('✅ Item actualizado');
    }
}

// ========== DELETE ITEM ==========
function deleteItem(id, containerId) {
    if (!confirm('¿Estás seguro de eliminar este item?')) {
        return;
    }
    
    menuData.cafe.clasicos = menuData.cafe.clasicos.filter(i => i.id !== id);
    menuData.cafe.sinCafe = menuData.cafe.sinCafe.filter(i => i.id !== id);
    menuData.cafe.temporada = menuData.cafe.temporada.filter(i => i.id !== id);
    menuData.cafe.extras = menuData.cafe.extras.filter(i => i.id !== id);
    menuData.panaderia = menuData.panaderia.filter(i => i.id !== id);
    menuData.temporada = menuData.temporada.filter(i => i.id !== id);
    
    renderMenuEdit();
    showToast('✅ Item eliminado');
}

// ========== SAVE ALL CHANGES ==========
async function saveAllChanges() {
    const password = prompt('Confirma tu contraseña para guardar:');
    
    if (!password) {
        return;
    }
    
    try {
        showToast('⏳ Guardando cambios...');
        
        const response = await fetch(`${API_BASE}/menu`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                password: password,
                menuData: menuData
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast(`✅ ${result.message}`);
            console.log('Guardado:', result);
        } else {
            alert(`❌ Error: ${result.message}`);
        }
        
    } catch (error) {
        console.error('❌ Error:', error);
        alert('❌ Error de conexión con el servidor');
    }
}

// ========== SHOW TOAST ==========
function showToast(message) {
    const toast = document.getElementById('successToast');
    toast.textContent = message;
    toast.style.display = 'block';
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// ========== DEFAULT MENU DATA ==========
function getDefaultMenuData() {
    return {
        "cafe": {
            "clasicos": [
                { "id": 1, "name": "Americano", "price": "$40", "available": true },
                { "id": 2, "name": "Latte", "price": "$55", "available": true },
                { "id": 3, "name": "Cappuccino", "price": "$45", "available": true },
                { "id": 4, "name": "Flat White", "price": "$45", "available": true },
                { "id": 5, "name": "Cold Brew", "price": "$50", "available": true }
            ],
            "sinCafe": [
                { "id": 6, "name": "Chai", "price": "$55", "available": true },
                { "id": 7, "name": "Matcha Orgánico", "price": "$70", "available": true },
                { "id": 8, "name": "Matcha Ceremonial", "price": "$85", "available": true },
                { "id": 9, "name": "Infusión de Té", "price": "$30", "available": true },
                { "id": 10, "name": "Chocolate Caliente", "price": "$50", "available": true }
            ],
            "temporada": [
                { "id": 11, "name": "Horchata Latte", "price": "$65", "available": true },
                { "id": 12, "name": "Pumpkin Spice Latte", "price": "$65", "available": true }
            ],
            "extras": [
                { "id": 13, "name": "Frío", "price": "+$5", "available": true },
                { "id": 14, "name": "Leche Oatly", "price": "+$15", "available": true },
                { "id": 15, "name": "Leche Deslactosada o Vegetal", "price": "+$5", "available": true },
                { "id": 18, "name": "Felix (Agua Natural)", "price": "$50", "available": true },
                { "id": 19, "name": "Agua Natural", "price": "$15", "available": true }
            ]
        },
        "panaderia": [
            { "id": 20, "name": "Croissant", "price": "Consultar", "available": true },
            { "id": 21, "name": "Pain au Chocolat", "price": "Consultar", "available": true }
        ],
        "temporada": [
            { "id": 27, "name": "Pan de Muerto", "price": "Consultar", "available": true }
        ],
        "sandwichDelDia": {
            "name": "",
            "price": "",
            "available": true
        }
    };
}