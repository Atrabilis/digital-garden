/**
 * Dark Mode Toggle
 * Maneja el cambio entre modo claro y oscuro con persistencia en localStorage
 */

(function() {
  'use strict';
  
  const storageKey = 'theme-preference';
  let themeToggle;
  let html;
  let isInitialized = false;
  
  function init() {
    if (isInitialized) return;
    
    // Obtener elementos
    themeToggle = document.getElementById('theme-toggle');
    html = document.documentElement;
    
    // Verificar que el elemento existe
    if (!themeToggle) {
      // Reintentar después de un breve delay
      setTimeout(init, 100);
      return;
    }
    
    // Cargar tema inicial
    loadTheme();
    
    // Agregar event listeners
    themeToggle.addEventListener('click', handleClick);
    themeToggle.addEventListener('keydown', handleKeydown);
    
    isInitialized = true;
  }
  
  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleTheme();
  }
  
  function handleKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      toggleTheme();
    }
  }
  
  function loadTheme() {
    try {
      const savedTheme = localStorage.getItem(storageKey);
      const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // Prioridad: preferencia guardada > preferencia del sistema > modo claro
      const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
      setTheme(theme);
    } catch (error) {
      setTheme('light');
    }
  }
  
  function toggleTheme() {
    try {
      const currentTheme = html.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    } catch (error) {
      // Error silencioso
    }
  }
  
  function setTheme(theme) {
    try {
      html.setAttribute('data-theme', theme);
      localStorage.setItem(storageKey, theme);
      
      // Actualizar aria-label para accesibilidad
      if (themeToggle) {
        const label = theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
        themeToggle.setAttribute('aria-label', label);
      }
    } catch (error) {
      // Error silencioso
    }
  }
  
  // Múltiples estrategias de inicialización para máxima compatibilidad
  function tryInit() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }
  
  // Inicializar inmediatamente
  tryInit();
  
  // También intentar después de un delay por si acaso
  setTimeout(tryInit, 100);
  
  // Exponer función global para debugging (solo en desarrollo)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.debugThemeToggle = function() {
      console.log('ThemeToggle Debug Info:');
      console.log('- Elemento encontrado:', !!themeToggle);
      console.log('- Inicializado:', isInitialized);
      console.log('- Tema actual:', html.getAttribute('data-theme'));
      console.log('- Tema guardado:', localStorage.getItem(storageKey));
    };
  }
  
})();
