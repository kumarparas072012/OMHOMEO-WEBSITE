document.addEventListener('DOMContentLoaded', () => {
    if (window.top !== window.self) {
        try {
            window.top.location = window.self.location.href;
        } catch (error) {
            window.self.location = window.self.location.href;
        }
    }

    const isInfoPage = window.location.pathname.includes('/pages/');
    const basePrefix = isInfoPage ? '../' : '';

    const routes = {
        home: `${basePrefix}index.html`,
        about: `${basePrefix}about.html`,
        specializations: `${basePrefix}specializations.html`,
        services: `${basePrefix}index.html#services`,
        process: `${basePrefix}index.html#process`,
        contact: `${basePrefix}contact.html`
    };

    const routeByLabel = {
        home: 'home',
        'about us': 'about',
        about: 'about',
        specializations: 'specializations',
        services: 'services',
        'our process': 'process',
        process: 'process',
        contact: 'contact',
        'contact us': 'contact'
    };

    const navAndFooterLinks = document.querySelectorAll('header a, nav a, footer a, .info-nav a');

    const isSafeLink = (href) => {
        const value = (href || '').trim().toLowerCase();
        if (!value) {
            return false;
        }

        if (value.startsWith('javascript:') || value.startsWith('data:text/html')) {
            return false;
        }

        return true;
    };

    navAndFooterLinks.forEach((link) => {
        const currentHref = link.getAttribute('href') || '';
        if (!isSafeLink(currentHref)) {
            link.setAttribute('href', '#');
        }

        if (link.target === '_blank') {
            link.setAttribute('rel', 'noopener noreferrer');
            return;
        }

        const label = link.textContent.trim().toLowerCase().replace(/\s+/g, ' ');
        const routeKey = routeByLabel[label];

        if (routeKey && routes[routeKey]) {
            link.setAttribute('href', routes[routeKey]);
        }
    });

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const currentHash = window.location.hash;

    document.querySelectorAll('.nav-link, .info-nav a').forEach((link) => {
        const href = link.getAttribute('href') || '';
        if (!href || href === '#') {
            return;
        }

        const [hrefPath, hrefHash] = href.split('#');
        const targetPage = (hrefPath || '').split('/').pop() || 'index.html';
        const pointsToCurrentPage = targetPage === currentPage;
        const hasHash = Boolean(hrefHash);

        if (!pointsToCurrentPage) {
            return;
        }

        if (!hasHash) {
            link.classList.add('active');
            return;
        }

        if (currentHash && `#${hrefHash}` === currentHash) {
            link.classList.add('active');
        }
    });
});
