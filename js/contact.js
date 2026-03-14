// Contact information configuration
const contactInfo = {
    email: 'doctorerry@gmail.com',
    phone: '+91 78370 74388',
    altPhone: '+91 83603 23818',
    whatsapp: '+91 78370 74388',
    website: 'https://www.omhomeo.com',
    websiteLabel: 'www.omhomeo.com',
    address: 'Baddi, Himachal Pradesh, India (near Chandigarh)'
};

function digitsOnly(value) {
    return value.replace(/\D+/g, '');
}

// Function to dynamically update contact information
function updateContactInfo() {
    // Update email links
    const emailElements = document.querySelectorAll('.contact-email, a.email-link');
    emailElements.forEach(el => {
        el.textContent = contactInfo.email;
        if (el.tagName === 'A') {
            el.href = `mailto:${contactInfo.email}`;
        }
    });

    // Update phone links
    const phoneElements = document.querySelectorAll('.contact-phone, a.phone-link');
    phoneElements.forEach(el => {
        el.textContent = contactInfo.phone;
        if (el.tagName === 'A') {
            el.href = `tel:+${digitsOnly(contactInfo.phone)}`;
        }
    });

    const altPhoneElements = document.querySelectorAll('.contact-phone-secondary');
    altPhoneElements.forEach(el => {
        el.textContent = contactInfo.altPhone;
        if (el.tagName === 'A') {
            el.href = `tel:+${digitsOnly(contactInfo.altPhone)}`;
        }
    });

    const whatsappElements = document.querySelectorAll('.contact-whatsapp');
    whatsappElements.forEach(el => {
        el.textContent = contactInfo.whatsapp;
        if (el.tagName === 'A') {
            el.href = `https://wa.me/${digitsOnly(contactInfo.whatsapp)}`;
        }
    });

    const websiteElements = document.querySelectorAll('.contact-website');
    websiteElements.forEach(el => {
        el.textContent = contactInfo.websiteLabel;
        if (el.tagName === 'A') {
            el.href = contactInfo.website;
        }
    });

    // Update address
    const addressElements = document.querySelectorAll('.contact-address');
    addressElements.forEach(el => {
        el.textContent = contactInfo.address;
    });
}

// Initialize contact info on page load
document.addEventListener('DOMContentLoaded', updateContactInfo);