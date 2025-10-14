// ========================================
// ALMA OBRADOR - MAIN JAVASCRIPT
// VERSIÓN CON CARGA DINÁMICA DE MENÚ
// ========================================

// ========== MENU TOGGLE (MOBILE) ==========
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    if (navLinks) {
        navLinks.classList.toggle('active');
    }
}

function closeMenu() {
    const navLinks = document.getElementById('navLinks');
    if (navLinks) {
        navLinks.classList.remove('active');
    }
}

// ========== SCROLL ANIMATIONS ==========
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { 
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    });
});

// ========== CLOSE MOBILE MENU ON OUTSIDE CLICK ==========
document.addEventListener('click', function(event) {
    const nav = document.querySelector('nav');
    const navLinks = document.getElementById('navLinks');
    
    if (nav && navLinks && !nav.contains(event.target)) {
        navLinks.classList.remove('active');
    }
});

// Prevent menu from closing when clicking inside it
const navLinksElement = document.getElementById('navLinks');
if (navLinksElement) {
    navLinksElement.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}

// ========================================
// CAROUSEL FUNCTIONALITY (Solo si existe)
// ========================================

const carousels = document.querySelectorAll('.carousel');

if (carousels.length > 0) {
    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevBtn = carousel.querySelector('.prev');
        const nextBtn = carousel.querySelector('.next');
        const dots = carousel.querySelectorAll('.dot');
        const counter = carousel.querySelector('.current');
        
        if (!track || slides.length === 0) return;
        
        let currentIndex = 0;
        const totalSlides = slides.length;

        // Update carousel position
        function updateCarousel() {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            if (counter) {
                counter.textContent = currentIndex + 1;
            }
            
            // Update dots
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        // Next slide
        function nextSlide() {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateCarousel();
        }

        // Previous slide
        function prevSlide() {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateCarousel();
        }

        // Event listeners for buttons
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);

        // Event listeners for dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
        });

        // Touch/Swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            
            if (touchEndX < touchStartX - swipeThreshold) {
                nextSlide();
            }
            if (touchEndX > touchStartX + swipeThreshold) {
                prevSlide();
            }
        }

        // Keyboard navigation
        carousel.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        });
    });
}

// ========== SCROLL TO TOP BUTTON ==========
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '↑';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.setAttribute('aria-label', 'Volver arriba');
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 100px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: var(--accent, #8b6f47);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.5rem;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s;
    z-index: 998;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
`;

document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.style.opacity = '1';
        scrollToTopBtn.style.visibility = 'visible';
    } else {
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.visibility = 'hidden';
    }
});

scrollToTopBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ========================================
// CARGA DINÁMICA DEL MENÚ DESDE API
// ========================================

//const API_BASE = 'http://localhost:3000/api'; // 🔴 Cambiar en producción
const API_BASE = 'https://alma-obrador-backend-4a4f.onrender.com/api'; // 🟢 Producción

// Función para cargar el menú desde la API
async function loadMenuFromAPI() {
    const container = document.getElementById('menu-dynamic-content');
    
    if (!container) {
        console.warn('⚠️ Contenedor del menú no encontrado. Usando menú estático del HTML.');
        return;
    }

    try {
        // Mostrar loading
        container.innerHTML = '<p style="text-align: center; color: var(--secondary); padding: 2rem;">⏳ Cargando menú...</p>';
        
        console.log('🔄 Cargando menú desde:', `${API_BASE}/menu`);
        
        // Fetch del menú
        const response = await fetch(`${API_BASE}/menu`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const menuData = await response.json();
        
        // Renderizar el menú
        renderMenu(menuData);
        
        console.log('✅ Menú cargado dinámicamente desde Node.js');
        
    } catch (error) {
        console.error('❌ Error cargando menú:', error);
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <p style="color: #ef4444; margin-bottom: 1rem;">⚠️ Error al cargar el menú</p>
                <p style="color: var(--secondary); font-size: 0.9rem;">${error.message}</p>
                <p style="color: var(--secondary); font-size: 0.9rem; margin-top: 1rem;">
                    Verifica que el servidor Node.js esté corriendo en ${API_BASE}
                </p>
            </div>
        `;
    }
}

// Función para renderizar el menú en HTML
function renderMenu(menuData) {
    const container = document.getElementById('menu-dynamic-content');
    
    let html = '';
    
    // ☕ CAFETERÍA
    html += `
        <div class="menu-category">
            <h3>☕ Barra de Café</h3>
            
            <div class="menu-section-divider">
                <!-- CLÁSICOS -->
                <div>
                    <h4 class="menu-subtitle-small">Clásicos</h4>
                    <div class="menu-items">
    `;
    
    menuData.cafe.clasicos.forEach(item => {
        if (item.available) {
            html += `
                <div class="menu-item">
                    <span class="menu-item-name">${item.name}</span>
                    <span class="menu-item-price">${item.price}</span>
                </div>
            `;
        }
    });
    
    html += `
                    </div>
                </div>
                
                <!-- SIN CAFÉ -->
                <div>
                    <h4 class="menu-subtitle-small">Sin Café</h4>
                    <div class="menu-items">
    `;
    
    menuData.cafe.sinCafe.forEach(item => {
        if (item.available) {
            html += `
                <div class="menu-item">
                    <span class="menu-item-name">${item.name}</span>
                    <span class="menu-item-price">${item.price}</span>
                </div>
            `;
        }
    });
    
    html += `
                    </div>
                </div>
            </div>
            
            <!-- DE TEMPORADA (CAFÉ) -->
            <div style="margin-top: 2rem;">
                <h4 class="menu-subtitle-small">De Temporada</h4>
                <div class="menu-items">
    `;
    
    menuData.cafe.temporada.forEach(item => {
        if (item.available) {
            html += `
                <div class="menu-item">
                    <span class="menu-item-name">${item.name}</span>
                    <span class="menu-item-price">${item.price}</span>
                </div>
            `;
        }
    });
    
    html += `
                </div>
            </div>
            
            <!-- EXTRAS -->
            <div style="margin-top: 2rem;">
                <h4 class="menu-subtitle-small">Extras & Embotellados</h4>
                <div class="menu-items">
    `;
    
    menuData.cafe.extras.forEach(item => {
        if (item.available) {
            html += `
                <div class="menu-item">
                    <span class="menu-item-name">${item.name}</span>
                    <span class="menu-item-price">${item.price}</span>
                </div>
            `;
        }
    });
    
    html += `
                </div>
            </div>
        </div>
    `;
    
    // 🥐 PANADERÍA
    html += `
        <div class="menu-category">
            <h3>🥐 Panadería y Repostería</h3>
            <p class="section-subtitle">Clásicos</p>
            <div class="menu-items">
    `;
    
    menuData.panaderia.forEach(item => {
        if (item.available) {
            html += `
                <div class="menu-item">
                    <span class="menu-item-name">${item.name}</span>
                    <span class="menu-item-price">${item.price}</span>
                </div>
            `;
        }
    });
    
    html += `
            </div>
        </div>
    `;
    
    // 🍂 DE TEMPORADA
    html += `
        <div class="menu-category">
            <h3>🍂 De Temporada</h3>
            <div class="menu-items">
    `;
    
    menuData.temporada.forEach(item => {
        if (item.available) {
            html += `
                <div class="menu-item">
                    <span class="menu-item-name">${item.name}</span>
                    <span class="menu-item-price">${item.price}</span>
                </div>
            `;
        }
    });
    
    html += `
            </div>
        </div>
    `;
    
    // 🥪 SANDWICH DEL DÍA
    html += `<div class="menu-category"><h3>🥪 Sandwich del Día</h3>`;
    
    if (menuData.sandwichDelDia.name || menuData.sandwichDelDia.price) {
        html += `<div class="menu-items">`;
        html += `<div class="menu-item">`;
        html += `<span class="menu-item-name">${menuData.sandwichDelDia.name || 'Sandwich del Día'}</span>`;
        html += `<span class="menu-item-price">${menuData.sandwichDelDia.price || 'Consultar'}</span>`;
        html += `</div></div>`;
    } else {
        html += `<p style="text-align: center; color: var(--secondary); font-style: italic; margin-top: 1rem;">Sujeto a disponibilidad</p>`;
    }
    
    html += `</div>`;
    
    // Insertar todo el HTML generado
    container.innerHTML = html;
}

// ========== INICIALIZACIÓN ==========
document.addEventListener('DOMContentLoaded', function() {
    // Cargar menú dinámico
    loadMenuFromAPI();
    
    // Log de confirmación
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🥐 ALMA OBRADOR - Sistema cargado');
    console.log('✅ Scripts cargados correctamente');
    console.log('📊 Carousels encontrados:', carousels.length);
    console.log('🎯 Animaciones activadas');
    console.log('🔄 Sistema de menú dinámico activado');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});