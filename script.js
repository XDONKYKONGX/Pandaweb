document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuButton = document.querySelector('.mobile-menu');
    const navMenu = document.querySelector('nav ul');
    const navLinks = document.querySelectorAll('nav ul li a');
    
    mobileMenuButton.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        mobileMenuButton.classList.toggle('active');
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            mobileMenuButton.classList.remove('active');
        });
    });
    
    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header Scroll Effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        header.classList.toggle('scrolled', window.scrollY > 100);
    });
    
    // Portfolio Slider (Mobile Only)
    if (window.innerWidth < 768) {
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        let currentSlide = 0;
        
        function showSlide(index) {
            portfolioItems.forEach((item, i) => {
                if (i === index) {
                    item.style.opacity = '0';
                    item.style.transform = 'translateX(30px)';
                    item.style.display = 'block';
                    
                    setTimeout(() => {
                        item.style.transition = 'all 0.5s ease-out';
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                    }, 50);
                } else {
                    item.style.display = 'none';
                    item.style.transition = 'none';
                }
            });
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % portfolioItems.length;
            showSlide(currentSlide);
        }
        
        function prevSlide() {
            currentSlide = (currentSlide - 1 + portfolioItems.length) % portfolioItems.length;
            showSlide(currentSlide);
        }
        
        // Initialize slider
        showSlide(0);
        
        // Add event listeners
        document.querySelector('.next-slide')?.addEventListener('click', nextSlide);
        document.querySelector('.prev-slide')?.addEventListener('click', prevSlide);
        
        // Auto-advance
        let slideInterval = setInterval(nextSlide, 5000);
        
        // Pause on hover
        const portfolioSection = document.querySelector('.portfolio');
        portfolioSection.addEventListener('mouseenter', () => clearInterval(slideInterval));
        portfolioSection.addEventListener('mouseleave', () => {
            slideInterval = setInterval(nextSlide, 5000);
        });
    }
    
    // Scroll Animations
    function animateOnScroll() {
        document.querySelectorAll('.service-card, .portfolio-item, .testimonial').forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            if (elTop < window.innerHeight - 100) {
                el.classList.add('animate');
            }
        });
    }
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load
    
    // Form Validation and AJAX Submission
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!validateForm()) return;
            
            const formData = new FormData(contactForm);
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // AJAX request
            fetch('send-email.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    showFormMessage('form-success', 'Thank you! We\'ll contact you soon.');
                    contactForm.reset();
                } else {
                    throw new Error(data.message || 'Failed to send message');
                }
            })
            .catch(error => {
                showFormMessage('form-error', error.message || 'There was a problem sending your message. Please try again.');
            })
            .finally(() => {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            });
        });
        
        function validateForm() {
            let isValid = true;
            const nameInput = contactForm.querySelector('input[name="name"]');
            const emailInput = contactForm.querySelector('input[name="email"]');
            const messageInput = contactForm.querySelector('textarea[name="message"]');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            // Clear previous errors
            clearError(nameInput);
            clearError(emailInput);
            clearError(messageInput);
            
            // Validate name
            if (nameInput.value.trim() === '') {
                showError(nameInput, 'Please enter your name');
                isValid = false;
            }
            
            // Validate email
            if (!emailRegex.test(emailInput.value.trim())) {
                showError(emailInput, 'Please enter a valid email');
                isValid = false;
            }
            
            // Validate message
            if (messageInput.value.trim() === '') {
                showError(messageInput, 'Please enter your message');
                isValid = false;
            }
            
            return isValid;
        }
        
        function showError(input, message) {
            const formGroup = input.closest('.form-group');
            let errorElement = formGroup.querySelector('.error-message');
            
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                formGroup.appendChild(errorElement);
            }
            
            errorElement.textContent = message;
            formGroup.classList.add('has-error');
        }
        
        function clearError(input) {
            const formGroup = input.closest('.form-group');
            const errorElement = formGroup.querySelector('.error-message');
            
            if (errorElement) {
                errorElement.remove();
            }
            
            formGroup.classList.remove('has-error');
        }
        
        function showFormMessage(className, message) {
            // Remove existing messages
            const existingMessages = document.querySelectorAll('.form-success, .form-error');
            existingMessages.forEach(msg => msg.remove());
            
            // Create new message
            const messageDiv = document.createElement('div');
            messageDiv.className = className;
            
            if (className === 'form-success') {
                messageDiv.innerHTML = `<i class="fas fa-check-circle"></i><p>${message}</p>`;
            } else {
                messageDiv.textContent = message;
            }
            
            // Insert after form
            contactForm.parentNode.insertBefore(messageDiv, contactForm.nextSibling);
            
            // Remove after 5 seconds
            setTimeout(() => {
                messageDiv.remove();
            }, 5000);
        }
    }
});