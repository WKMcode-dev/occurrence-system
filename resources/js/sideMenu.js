document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('menuToggle');
    const closeBtn = document.getElementById('menuClose');
    const sideMenu = document.getElementById('sideMenu');
    const overlay = document.getElementById('menuOverlay');

    if (toggleBtn && closeBtn && sideMenu && overlay) {
        toggleBtn.addEventListener('click', () => {
            sideMenu.classList.add('open');
            overlay.classList.add('visible');
            toggleBtn.style.display = 'none';
        });

        closeBtn.addEventListener('click', () => {
            sideMenu.classList.remove('open');
            overlay.classList.remove('visible');
            toggleBtn.style.display = 'flex';
        });

        overlay.addEventListener('click', () => {
            sideMenu.classList.remove('open');
            overlay.classList.remove('visible');
            toggleBtn.style.display = 'flex';
        });
    }
});