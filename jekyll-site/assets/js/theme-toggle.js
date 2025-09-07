/**
 * Dark Mode Toggle - GitHub Pages Compatible
 * Versión simplificada para máxima compatibilidad
 */

// Función simple para cambiar tema
function toggleTheme() {
  var html = document.documentElement;
  var currentTheme = html.getAttribute('data-theme') || 'light';
  var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  // Aplicar nuevo tema
  html.setAttribute('data-theme', newTheme);
  
  // Guardar preferencia
  try {
    localStorage.setItem('theme-preference', newTheme);
  } catch (e) {
    // Ignorar errores de localStorage
  }
  
  // Actualizar aria-label
  var toggle = document.getElementById('theme-toggle');
  if (toggle) {
    var label = newTheme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
    toggle.setAttribute('aria-label', label);
  }
}

// Función para cargar tema guardado
function loadTheme() {
  var html = document.documentElement;
  var savedTheme;
  
  try {
    savedTheme = localStorage.getItem('theme-preference');
  } catch (e) {
    savedTheme = null;
  }
  
  // Detectar preferencia del sistema
  var systemPrefersDark = false;
  if (window.matchMedia) {
    systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  
  // Aplicar tema: preferencia guardada > preferencia del sistema > modo oscuro por defecto
  var theme = savedTheme || (systemPrefersDark ? 'dark' : 'dark');
  html.setAttribute('data-theme', theme);
}

// Función para manejar teclado
function handleKeydown(event) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    toggleTheme();
  }
}

// Inicializar cuando el DOM esté listo
function initThemeToggle() {
  var toggle = document.getElementById('theme-toggle');
  if (!toggle) {
    // Reintentar después de un breve delay
    setTimeout(initThemeToggle, 100);
    return;
  }
  
  // Cargar tema inicial
  loadTheme();
  
  // Agregar event listeners
  toggle.addEventListener('click', function(e) {
    e.preventDefault();
    toggleTheme();
  });
  
  toggle.addEventListener('keydown', handleKeydown);
}

// Inicializar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initThemeToggle);
} else {
  initThemeToggle();
}
