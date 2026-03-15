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

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const currentHash = window.location.hash;
    const navItems = [
        { key: 'home', label: 'Home', href: routes.home },
        { key: 'about', label: 'About', href: routes.about },
        { key: 'specializations', label: 'Specializations', href: routes.specializations },
        { key: 'services', label: 'Services', href: routes.services },
        { key: 'process', label: 'Process', href: routes.process },
        { key: 'contact', label: 'Contact', href: routes.contact }
    ];

    const allLinks = document.querySelectorAll('a');

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

    allLinks.forEach((link) => {
        const currentHref = link.getAttribute('href') || '';
        if (!isSafeLink(currentHref)) {
            link.setAttribute('href', '#');
        }

        if (link.target === '_blank') {
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });

    const createNavLink = (item) => {
        const link = document.createElement('a');
        link.className = 'nav-link';
        link.href = item.href;
        link.textContent = item.label;
        return link;
    };

    const populateNavMenu = (menuElement) => {
        if (!menuElement) {
            return;
        }

        menuElement.replaceChildren();
        navItems.forEach((item) => {
            const listItem = document.createElement('li');
            listItem.appendChild(createNavLink(item));
            menuElement.appendChild(listItem);
        });
    };

    const existingNavbar = document.querySelector('.navbar');
    if (existingNavbar) {
        populateNavMenu(existingNavbar.querySelector('#nav-menu, .nav-menu'));
    } else {
        const header = document.createElement('header');
        header.className = 'navbar';

        const container = document.createElement('div');
        container.className = 'container';

        const brandLink = document.createElement('a');
        brandLink.className = 'brand';
        brandLink.href = routes.home;
        brandLink.setAttribute('aria-label', 'Om Homeo Home');

        const logo = document.createElement('img');
        logo.src = `${basePrefix}Images/OMHomeoLOGO.png`;
        logo.alt = 'Om Homeo Logo';
        logo.className = 'logo-img';
        brandLink.appendChild(logo);

        const nav = document.createElement('nav');
        const hamburger = document.createElement('div');
        hamburger.className = 'hamburger';
        hamburger.id = 'hamburger';
        for (let index = 0; index < 3; index += 1) {
            hamburger.appendChild(document.createElement('span'));
        }

        const menu = document.createElement('ul');
        menu.className = 'nav-menu';
        menu.id = 'nav-menu';
        populateNavMenu(menu);

        nav.appendChild(hamburger);
        nav.appendChild(menu);
        container.appendChild(brandLink);
        container.appendChild(nav);
        header.appendChild(container);
        document.body.insertBefore(header, document.body.firstChild);
    }

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
            if (isInfoPage && href.includes('specializations.html')) {
                link.classList.add('active');
            }
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
