/**
 * Dark Mode Toggle - Versión ultra simple
 */

// Función global para cambiar tema
function toggleTheme() {
  var html = document.documentElement;
  var currentTheme = html.getAttribute('data-theme');
  var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  // Aplicar nuevo tema
  html.setAttribute('data-theme', newTheme);
  
  // Guardar preferencia
  try {
    localStorage.setItem('theme-preference', newTheme);
  } catch (e) {
    // Ignorar errores
  }
  
}

// Cargar tema guardado al inicio
function loadSavedTheme() {
  try {
    var savedTheme = localStorage.getItem('theme-preference');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  } catch (e) {
    // Ignorar errores
  }
}

// Inicializar
loadSavedTheme();
