// Hamburger menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
            });
        });
    }

    // Smooth page load animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in';
        document.body.style.opacity = '1';
    }, 50);

    // Booking CTA buttons
    const bookingButtons = document.querySelectorAll('.cta-btn[data-booking="true"]');
    bookingButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            createRipple(e, button);
            const bookingUrl = button.getAttribute('data-booking-url');
            if (bookingUrl) {
                // Add fade-out animation before navigation
                document.body.style.transition = 'opacity 0.3s ease-out';
                document.body.style.opacity = '0';
                setTimeout(() => {
                    window.location.href = bookingUrl;
                }, 300);
            }
        });
    });

    // Smooth scroll for anchor links
    const allLinks = document.querySelectorAll('a[href^="#"]');
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Smooth scroll animations for sections
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Fade-in animation for service cards
                if (entry.target.classList.contains('service-card')) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                }
                // Fade-in for timeline steps
                else if (entry.target.classList.contains('timeline-step')) {
                    entry.target.style.animation = 'slideInLeft 0.6s ease forwards';
                }
                // Fade-in for other elements
                else {
                    entry.target.style.animation = 'fadeIn 0.5s ease forwards';
                }
            }
        });
    }, observerOptions);

    // Observe all animate-on-scroll elements
    const serviceCards = document.querySelectorAll('.service-card');
    const timelineSteps = document.querySelectorAll('.timeline-step');
    const sections = document.querySelectorAll('section');

    serviceCards.forEach(card => observer.observe(card));
    timelineSteps.forEach(step => observer.observe(step));
    sections.forEach(section => {
        if (!section.id.includes('hero')) {
            observer.observe(section);
        }
    });

    // Add active state to nav links based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    // Add active state to nav links based on scroll position
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Smooth hover effects on all buttons
    const allButtons = document.querySelectorAll('button, .cta-btn, .secondary-link');
    allButtons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Ripple effect function
function createRipple(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    // Remove any existing ripples
    element.querySelectorAll('.ripple').forEach(r => r.remove());
    element.appendChild(ripple);
}