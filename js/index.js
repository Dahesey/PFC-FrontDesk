let slideIndex = 1;
let animationFrame;

// Back to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'auto' // Using 'auto' instead of 'smooth' for instant scroll
    });
}

// Add scroll event listener for navbar and back-to-top button
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    const backToTop = document.getElementById('back-to-top');
    
    // Navbar scroll effect
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
    
    // Back to top button visibility
    if (window.scrollY > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

// Image lazy loading
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('skeleton');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        img.classList.add('skeleton');
        imageObserver.observe(img);
    });
});

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    const slides = document.getElementsByClassName("slides");
    const dots = document.getElementsByClassName("dot");
    
    if (!slides.length || !dots.length) return;
    
    slideIndex = n > slides.length ? 1 : n < 1 ? slides.length : n;
    
    Array.from(slides).forEach(slide => {
        slide.style.display = "none";
        slide.classList.remove("active");
    });
    
    Array.from(dots).forEach(dot => dot.classList.remove("active"));
    
    slides[slideIndex - 1].style.display = "block";
    slides[slideIndex - 1].classList.add("active");
    dots[slideIndex - 1].classList.add("active");
}

function autoAdvance() {
    plusSlides(1);
    animationFrame = requestAnimationFrame(() => {
        setTimeout(autoAdvance, 5000);
    });
}

// Add intersection observer for reveal animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    showSlides(slideIndex);
    autoAdvance();
    
    // Observe elements for reveal animations
    document.querySelectorAll('.card-event-content p, .creed-list li, .heading h1, .text h3, .potter-creed h3, .page-title h1, .card-event h1').forEach(element => {
        observer.observe(element);
    });
    
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationFrame);
        } else {
            autoAdvance();
        }
    });
});

// Newsletter Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const messageDiv = document.getElementById('form-message');
            const submitButton = this.querySelector('button[type="submit"]');
            
            // Enhanced email validation
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!email || !emailRegex.test(email)) {
                showMessage(messageDiv, 'Please enter a valid email address', 'error');
                return;
            }
            
            // Check if CAPTCHA is completed
            const captchaResponse = grecaptcha.getResponse();
            if (!captchaResponse) {
                showMessage(messageDiv, 'Please complete the CAPTCHA', 'error');
                return;
            }
            
            // Show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            showMessage(messageDiv, 'Submitting...', 'info');
            
            try {
                // Set a timeout for the fetch request
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
                
                // Update this URL with your Google Apps Script deployment URL
                const response = await fetch('https://script.google.com/macros/s/AKfycbxbCZJJHMDGv9eWFOoGNhMp2pS4DT4mKwDKK72Z9DAp78yJ1wCbSA4p_Ux3LSaHcxdvdw/exec', {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        email: email,
                        captchaResponse: captchaResponse,
                        source: 'https://dahesey.github.io/PFC-FrontDesk/'
                    }),
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                // Since we're using no-cors, we can't read the response
                // So we'll assume success if no error is thrown
                showMessage(messageDiv, 'Thank you for subscribing!', 'success');
                document.getElementById('email').value = ''; // Clear the input
                grecaptcha.reset(); // Reset CAPTCHA
                
                // Show success animation
                const successAnimation = document.createElement('div');
                successAnimation.className = 'success-animation';
                successAnimation.innerHTML = '<i class="fas fa-check-circle"></i>';
                messageDiv.appendChild(successAnimation);
                
                // Remove animation after 2 seconds
                setTimeout(() => {
                    successAnimation.remove();
                }, 2000);
                
            } catch (error) {
                if (error.name === 'AbortError') {
                    showMessage(messageDiv, 'Request timed out. Please try again.', 'error');
                } else {
                    showMessage(messageDiv, 'Failed to submit. Please try again.', 'error');
                }
                console.error('Error:', error);
            } finally {
                // Reset button state
                submitButton.disabled = false;
                submitButton.innerHTML = 'Subscribe';
            }
            
            // Reset message after 5 seconds
            setTimeout(() => {
                messageDiv.className = 'form-message';
            }, 5000);
        });
    }
});

function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `form-message ${type}`;
}

// Social Sharing
document.querySelectorAll('.share-button').forEach(button => {
    button.addEventListener('click', function() {
        const platform = this.getAttribute('aria-label').toLowerCase();
        const url = window.location.href;
        const title = document.title;
        
        switch(platform) {
            case 'share on facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'share on twitter':
                window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
                break;
            case 'share on whatsapp':
                window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`, '_blank');
                break;
            case 'share via email':
                window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`, '_blank');
                break;
        }
    });
});

// Mobile menu functionality
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

// Initially hide menu on mobile
if (window.innerWidth <= 768) {
    navMenu.classList.remove('show');
}

// Toggle menu on click
menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('show');
    menuToggle.classList.toggle('active');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        navMenu.classList.remove('show');
        menuToggle.classList.remove('active');
    }
});

// Close menu when clicking a link
navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show');
        menuToggle.classList.remove('active');
    });
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        navMenu.classList.remove('show');
        menuToggle.classList.remove('active');
    }
});

// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check for system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Function to set theme
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateThemeIcon(theme);
    }
    
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (prefersDark.matches) {
        setTheme('dark');
    }
    
    // Listen for system preference changes
    prefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
    
    // Toggle theme on click
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });
    
    // Update theme icon based on current theme
    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }
    
    // Handle mobile menu in dark mode
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    menuToggle.addEventListener('click', () => {
        // Ensure proper z-index for theme toggle in mobile menu
        if (window.innerWidth <= 768) {
            themeToggle.style.zIndex = navMenu.classList.contains('show') ? '1001' : '1000';
        }
    });
});