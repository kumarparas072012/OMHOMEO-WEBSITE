document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) {
        return;
    }

    const submitButton = document.getElementById('contact-submit-btn');
    const warningBanner = document.getElementById('contact-form-warning');
    const isHttpContext = window.location.protocol === 'http:' || window.location.protocol === 'https:';

    const nextUrlField = document.getElementById('contact-next-url');
    if (nextUrlField) {
        nextUrlField.value = isHttpContext
            ? `${window.location.origin}${window.location.pathname}?submitted=true`
            : 'https://www.omhomeo.com/contact.html?submitted=true';
    }

    const successBanner = document.getElementById('contact-form-success');
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get('submitted') === 'true' && successBanner) {
        successBanner.hidden = false;
        // Scroll to success banner immediately so user sees it
        setTimeout(() => {
            successBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }

    const messageInput = document.getElementById('message');
    const messageCount = document.getElementById('message-count');
    if (messageInput && messageCount) {
        const updateCount = () => {
            messageCount.textContent = String(messageInput.value.length);
        };

        updateCount();
        messageInput.addEventListener('input', updateCount);
    }

    if (!isHttpContext) {
        if (warningBanner) {
            warningBanner.hidden = false;
        }

        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();
            if (warningBanner) {
                warningBanner.hidden = false;
                warningBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Start local server to submit';
        }

        return;
    }

    const allowedPatterns = {
        name: /^[A-Za-z][A-Za-z\s.'-]{1,79}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
        phone: /^\+?[0-9\s-]{8,20}$/,
        subject: /^[A-Za-z0-9][A-Za-z0-9\s.,'()!?&/-]{2,119}$/,
        message: /^[A-Za-z0-9\s.,'()!?&:/\-\n]{10,1000}$/
    };

    const containsInjectionPattern = (value) => {
        const trimmed = value.trim();
        const suspiciousRegex = /(<\s*script|javascript:|onerror\s*=|onload\s*=|onmouseover\s*=|\bunion\b\s+\bselect\b|\b(drop|truncate|alter)\b\s+\btable\b|\b(or|and)\b\s+['"]?\d+['"]?\s*=\s*['"]?\d+['"]?|--|\/\*)/i;
        return suspiciousRegex.test(trimmed);
    };

    const setFieldError = (field, message) => {
        field.setCustomValidity(message);
        field.reportValidity();
    };

    const clearFieldError = (field) => {
        field.setCustomValidity('');
    };

    const formFields = ['name', 'email', 'phone', 'subject', 'message'];
    formFields.forEach((fieldId) => {
        const field = document.getElementById(fieldId);
        if (!field) {
            return;
        }

        field.addEventListener('input', () => {
            field.value = field.value.replace(/[\u0000-\u001F\u007F]/g, '');
            clearFieldError(field);
        });
    });

    contactForm.addEventListener('submit', (event) => {
        // Prevent double submission
        if (submitButton && submitButton.disabled) {
            event.preventDefault();
            return;
        }

        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const subject = document.getElementById('subject');
        const message = document.getElementById('message');

        const fieldsToValidate = [name, email, phone, subject, message].filter(Boolean);

        let isValid = true;
        fieldsToValidate.forEach((field) => {
            field.value = field.value.trim();
            clearFieldError(field);

            const fieldPattern = allowedPatterns[field.id];
            if (fieldPattern && !fieldPattern.test(field.value)) {
                setFieldError(field, `Please enter a valid ${field.id.replace('_', ' ')}.`);
                isValid = false;
                return;
            }

            if (containsInjectionPattern(field.value)) {
                setFieldError(field, 'Input contains unsafe text. Please remove special scripts or query patterns.');
                isValid = false;
            }
        });

        if (!isValid) {
            event.preventDefault();
            return;
        }

        // Disable submit button and show sending state
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            submitButton.style.opacity = '0.6';

            // Safety timeout: if FormSubmit doesn't redirect within 15s, re-enable button
            setTimeout(() => {
                if (submitButton.textContent === 'Sending...') {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Submit';
                    submitButton.style.opacity = '1';
                    console.warn('Form submission timeout - FormSubmit may be unavailable');
                }
            }, 15000);
        }

        // FormSubmit will redirect automatically - no need to prevent default
        // Let the form submit naturally to FormSubmit.co
    });
});
