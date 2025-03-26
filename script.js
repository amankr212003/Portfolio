// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu after clicking a link
            navLinks.classList.remove('active');
        }
    });
});

// Form submission handling
const contactForm = document.getElementById('contact-form');
const ACCESS_KEY = '13df7386-d94c-43b0-9b01-2bd765a71d2f';

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        access_key: ACCESS_KEY,
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    const submitButton = document.querySelector('.submit-btn');
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.success) {
            contactForm.reset();
            window.location.href = 'thankyou.html';
        } else {
            throw new Error('Form submission failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Sorry, there was an error sending your message. Please try again later.');
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
    }
});

// DOM loaded event
document.addEventListener('DOMContentLoaded', () => {
    // Initial animations for hero section
    setTimeout(() => {
        document.querySelector('.profile-image').classList.add('fade-in');
        document.querySelector('.hero h1').classList.add('fade-in');
        document.querySelector('.hero h2').classList.add('fade-in');
        document.querySelector('.hero p').classList.add('fade-in');
        document.querySelector('.cta-button').classList.add('fade-in');
    }, 100);
});

// Lazy loading images
const lazyLoadImages = () => {
    // Get all images with data-src attribute
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '0px 0px 200px 0px'
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        let lazyLoadThrottleTimeout;
        
        const lazyLoad = () => {
            if (lazyLoadThrottleTimeout) {
                clearTimeout(lazyLoadThrottleTimeout);
            }
            
            lazyLoadThrottleTimeout = setTimeout(() => {
                const scrollTop = window.pageYOffset;
                
                lazyImages.forEach(img => {
                    if (img.offsetTop < window.innerHeight + scrollTop) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                    }
                });
                
                if (lazyImages.length === 0) {
                    document.removeEventListener('scroll', lazyLoad);
                    window.removeEventListener('resize', lazyLoad);
                    window.removeEventListener('orientationchange', lazyLoad);
                }
            }, 20);
        };
        
        document.addEventListener('scroll', lazyLoad);
        window.addEventListener('resize', lazyLoad);
        window.addEventListener('orientationchange', lazyLoad);
    }
};

// Intersection Observer for section animations
const setupSectionObservers = () => {
    const sections = document.querySelectorAll('section:not(#home)');
    
    if ('IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-visible');
                    
                    // Trigger animations for elements inside the section
                    const animElements = entry.target.querySelectorAll('.project-card, .skill-card, .cert-card, .section-title, .about-image, .about-text');
                    animElements.forEach((el, index) => {
                        setTimeout(() => {
                            el.classList.add('active');
                        }, index * 100); // Staggered animation
                    });
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }
};

// Initialize when DOM is loaded
window.addEventListener('load', () => {
    lazyLoadImages();
    setupSectionObservers();
});

// Update navigation based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 60) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Performance optimization - throttle scroll events
const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Optimize scroll handlers with throttling
const optimizedReveal = throttle(() => {
    const reveals = document.querySelectorAll('.project-card:not(.active), .skill-card:not(.active), .cert-card:not(.active)');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}, 100);

window.addEventListener('scroll', optimizedReveal);

// Initialize reveal for already visible elements
optimizedReveal();

// Web font loading optimization
if ('fonts' in document) {
    // Try to use the Fonts API for better performance
    Promise.all([
        document.fonts.load('300 1em Poppins'),
        document.fonts.load('400 1em Poppins'),
        document.fonts.load('500 1em Poppins'),
        document.fonts.load('600 1em Poppins'),
        document.fonts.load('700 1em Poppins')
    ]).then(() => {
        document.documentElement.classList.add('fonts-loaded');
    });
} else {
    // Fallback if Fonts API is not available
    document.documentElement.classList.add('fonts-loaded');
}

// Prefetch critical resources only when idle
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        // Prefetch other pages if needed
        const prefetchLink = document.createElement('link');
        prefetchLink.rel = 'prefetch';
        prefetchLink.href = 'thankyou.html';
        document.head.appendChild(prefetchLink);
    });
} 