(function () {
  const sidebar = document.querySelector('.sidebar');
  const resizer = document.querySelector('.sidebar-resizer');
  if (!sidebar || !resizer) return;

  const MIN = 200;
  const MAX = 520;

  let resizing = false;

  resizer.addEventListener('mousedown', (e) => {
    resizing = true;
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', (e) => {
    if (!resizing) return;
    const left = sidebar.getBoundingClientRect().left; // posición real de la sidebar
    let width = e.clientX - left;
    if (width < MIN) width = MIN;
    if (width > MAX) width = MAX;
    sidebar.style.width = width + 'px';
  });

  document.addEventListener('mouseup', () => {
    if (!resizing) return;
    resizing = false;
    document.body.style.userSelect = '';
  });
})();
