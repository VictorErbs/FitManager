/**
 * sidebar.js — shared sidebar logic for all pages
 * - Desktop: clicking the FitLife logo collapses/expands the sidebar
 * - Mobile: a hamburger icon in the top header opens/closes an overlay sidebar
 */
(function () {
    function initSidebar() {
        const sidebar = document.getElementById('sidebar');
        const logo    = document.querySelector('.sidebar-logo');
        const overlay = document.getElementById('sidebarOverlay');
        const mobileToggle = document.getElementById('mobileMenuToggle');

        if (!sidebar) return;

        const isMobile = () => window.innerWidth <= 900;

        // Inject resize handle if it doesn't exist
        let resizer = sidebar.querySelector('.sidebar-resizer');
        if (!resizer && !isMobile()) {
            resizer = document.createElement('div');
            resizer.className = 'sidebar-resizer';
            sidebar.appendChild(resizer);
        }

        // Restore custom width from localStorage (only for desktop)
        const savedWidth = localStorage.getItem('sidebarWidth');
        if (!isMobile() && savedWidth) {
            sidebar.style.width = savedWidth;
            if (parseInt(savedWidth) < 150) {
                sidebar.classList.add('collapsed'); // Use CSS class for icon-only mode if too small
            }
        }

        // Custom Resize Logic
        if (resizer) {
            let startX, startWidth;
            
            const doDrag = (e) => {
                const newWidth = Math.min(Math.max(startWidth + e.clientX - startX, 80), 400); // Between 80px and 400px
                sidebar.style.width = newWidth + 'px';
                
                // Toggle text visibility based on width
                if (newWidth < 150) {
                    sidebar.classList.add('collapsed');
                } else {
                    sidebar.classList.remove('collapsed');
                }
            };

            const stopDrag = () => {
                document.documentElement.removeEventListener('mousemove', doDrag, false);
                document.documentElement.removeEventListener('mouseup', stopDrag, false);
                resizer.classList.remove('is-resizing');
                localStorage.setItem('sidebarWidth', sidebar.style.width);
                document.body.style.cursor = 'default';
            };

            resizer.addEventListener('mousedown', (e) => {
                startX = e.clientX;
                startWidth = parseInt(document.defaultView.getComputedStyle(sidebar).width, 10);
                document.documentElement.addEventListener('mousemove', doDrag, false);
                document.documentElement.addEventListener('mouseup', stopDrag, false);
                resizer.classList.add('is-resizing');
                document.body.style.cursor = 'col-resize';
                e.preventDefault();
            });
        }

        // Mobile toggle — hamburger in header
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => {
                sidebar.classList.toggle('mobile-open');
                if (overlay) overlay.classList.toggle('active');
            });
        }

        // Close sidebar when clicking overlay
        if (overlay) {
            overlay.addEventListener('click', () => {
                sidebar.classList.remove('mobile-open');
                overlay.classList.remove('active');
            });
        }

        // On resize, clean up classes
        window.addEventListener('resize', () => {
            if (!isMobile()) {
                sidebar.classList.remove('mobile-open');
                if (overlay) overlay.classList.remove('active');
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSidebar);
    } else {
        initSidebar();
    }
})();
