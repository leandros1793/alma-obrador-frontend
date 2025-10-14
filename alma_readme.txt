# 🥐 Alma Obrador - Sitio Web

Landing page y menú digital para Alma Obrador - Panadería artesanal y cafetería.

---

## 📁 Estructura del Proyecto

```
alma-obrador/
├── index.html           # Página principal
├── admin.html          # Panel de administración
├── README.md           # Este archivo
├── css/
│   └── styles.css      # Estilos principales
├── js/
│   ├── main.js         # JavaScript principal
│   └── admin.js        # JavaScript del panel admin
├── data/
│   └── menu.json       # Datos del menú (editable)
└── images/
    ├── logo.png        # Logo de Alma Obrador
    ├── about.jpg       # Foto de la sección "Nosotros"
    └── gallery/
        ├── medialunas.jpg
        ├── cafe.jpg
        ├── bundts.jpg
        ├── tartas.jpg
        ├── pan.jpg
        └── reposteria.jpg
```

---

## 🚀 Instalación

### 1. Descargar el proyecto
Descarga todos los archivos y mantenlos en la estructura de carpetas indicada arriba.

### 2. Agregar tus imágenes
Coloca tus imágenes en la carpeta `images/`:

- **logo.png**: Tu logo de Alma Obrador (preferiblemente PNG transparente)
- **about.jpg**: Foto del obrador o de Danaé para la sección "Nosotros"
- **gallery/**: 6 fotos de productos:
  - medialunas.jpg
  - cafe.jpg
  - bundts.jpg
  - tartas.jpg
  - pan.jpg
  - reposteria.jpg

### 3. Probar localmente
Abre `index.html` en tu navegador para ver la página.

---

## 📱 Características

✅ **100% Responsive** - Se adapta a móviles, tablets y desktop  
✅ **Menú Digital** - Productos con precios cargados desde JSON  
✅ **Panel Admin** - Para editar productos y precios fácilmente  
✅ **WhatsApp Integrado** - Botón flotante para pedidos  
✅ **Animaciones Suaves** - Experiencia visual profesional  
✅ **SEO Optimizado** - Meta tags y estructura semántica  

---

## ⚙️ Panel de Administración

### Acceso
1. Abre `admin.html` en tu navegador
2. Contraseña por defecto: **admin123**

### Funciones
- ✏️ Editar nombres de productos
- 💰 Cambiar precios
- 🗑️ Eliminar productos
- 💾 Descargar el menú actualizado (menu.json)

### Cambiar contraseña
En el archivo `js/admin.js`, línea 8:
```javascript
const ADMIN_PASSWORD = 'tuNuevaContraseña';
```

---

## 📝 Editar el Menú

### Método 1: Panel Admin (Recomendado)
1. Entra a `admin.html`
2. Edita los productos
3. Haz clic en "💾 Guardar Todos los Cambios"
4. Se descargará un nuevo `menu.json`
5. Reemplaza el archivo en `data/menu.json`

### Método 2: Editar JSON directamente
Abre `data/menu.json` y edita manualmente:

```json
{
  "id": 1,
  "name": "Americano",
  "price": "$40",
  "available": true
}
```

---

## 🌐 Subir a Vercel

### Opción 1: Desde GitHub
1. Sube el proyecto a GitHub
2. Ve a [vercel.com](https://vercel.com)
3. Click en "New Project"
4. Importa tu repositorio
5. Click en "Deploy"

### Opción 2: Vercel CLI
```bash
# Instalar Vercel CLI
npm i -g vercel

# En la carpeta del proyecto
vercel

# Seguir las instrucciones
```

### Opción 3: Drag & Drop
1. Ve a [vercel.com](https://vercel.com)
2. Arrastra la carpeta completa a Vercel
3. ¡Listo!

---

## 📞 Contacto y Redes

Actualiza estos datos en:
- `index.html` (líneas con WhatsApp e Instagram)
- `data/menu.json` (si aplica)

**WhatsApp actual:** +54 351 229 5662  
**Instagram actual:** @alma.obrador  
**Ubicación:** Dámaso Cárdenas #712, México

---

## 🎨 Personalización

### Colores
En `css/styles.css`, líneas 10-16:
```css
:root {
    --primary: #2c1810;
    --secondary: #5c4033;
    --accent: #8b6f47;
    --light: #faf8f5;
    --cream: #f5ebe0;
    --white: #ffffff;
}
```

### Fuentes
Actualmente usa:
- **Playfair Display** (títulos)
- **Poppins** (texto)

Para cambiar, edita el `@import` en `css/styles.css`.

---

## 🐛 Solución de Problemas

### Las imágenes no se ven
- Verifica que los nombres de archivo coincidan exactamente
- Las imágenes deben estar en la carpeta `images/`
- Usa formatos: .jpg, .jpeg, .png

### El menú no carga
- Verifica que `data/menu.json` exista
- Comprueba que el JSON sea válido (sin comas extras)
- Abre la consola del navegador (F12) para ver errores

### El admin no funciona
- Verifica que `js/admin.js` esté en la carpeta correcta
- Usa la contraseña correcta: **admin123**

---

## 📄 Licencia

Proyecto desarrollado para **Alma Obrador** por Claude AI.  
© 2025 Alma Obrador - Todos los derechos reservados.

---

## 🆘 Soporte

Si necesitas ayuda:
1. Revisa este README completo
2. Verifica la consola del navegador (F12)
3. Asegúrate de que todos los archivos estén en su lugar

---

**¡Feliz horneado! 🥐☕**