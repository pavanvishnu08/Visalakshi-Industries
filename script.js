

// Visalakshi Industries - JavaScript Functionality

document.addEventListener("DOMContentLoaded", function () {
    // Initialize all functionality
    initMobileMenu();
    initStickyHeader();
    initSmoothScrolling();
    initFormValidation();
    initScrollAnimations();
    initScrollToTop();
    initContactForm();
    initGallery();
    initChatbot();
});

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");
    const mobileLinks = mobileMenu.querySelectorAll("a");

    mobileMenuToggle.addEventListener("click", function () {
        mobileMenu.classList.toggle("hidden");

        // Toggle hamburger icon
        const icon = this.querySelector("i");
        if (mobileMenu.classList.contains("hidden")) {
            icon.classList.remove("fa-times");
            icon.classList.add("fa-bars");
        } else {
            icon.classList.remove("fa-bars");
            icon.classList.add("fa-times");
        }
    });

    // Close mobile menu when clicking on links
    mobileLinks.forEach((link) => {
        link.addEventListener("click", function () {
            mobileMenu.classList.add("hidden");
            const icon = mobileMenuToggle.querySelector("i");
            icon.classList.remove("fa-times");
            icon.classList.add("fa-bars");
        });
    });
}

// Sticky Header
function initStickyHeader() {
    const header = document.querySelector("header");
    const nav = header.querySelector("nav");

    window.addEventListener("scroll", function () {
        if (window.scrollY > 100) {
            nav.classList.add("header-sticky");
        } else {
            nav.classList.remove("header-sticky");
        }
    });
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
            e.preventDefault();

            const targetId = this.getAttribute("href");
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const headerHeight =
                    document.querySelector("header").offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth",
                });

                // Update active nav link
                updateActiveNavLink(targetId);
            }
        });
    });
}

// Update Active Navigation Link
function updateActiveNavLink(targetId) {
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === targetId) {
            link.classList.add("active");
        }
    });
}

// Form Validation
function initFormValidation() {
    const form = document.getElementById("contact-form");

    if (form) {
        const inputs = form.querySelectorAll(
            "input[required], textarea[required]",
        );

        inputs.forEach((input) => {
            input.addEventListener("blur", function () {
                validateField(this);
            });

            input.addEventListener("input", function () {
                if (this.classList.contains("error")) {
                    validateField(this);
                }
            });
        });
    }
}

// Validate Individual Field
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute("name");
    const errorElement = field.parentNode.querySelector(".error-message");

    let isValid = true;
    let errorMessage = "";

    // Required field validation
    if (field.hasAttribute("required") && !value) {
        isValid = false;
        errorMessage = `${getFieldLabel(fieldName)} is required.`;
    }

    // Email validation
    if (fieldName === "email" && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = "Please enter a valid email address.";
        }
    }

    // Phone validation
    if (fieldName === "phone" && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ""))) {
            isValid = false;
            errorMessage = "Please enter a valid phone number.";
        }
    }

    // Name validation
    if (fieldName === "fullName" && value && value.length < 2) {
        isValid = false;
        errorMessage = "Name must be at least 2 characters long.";
    }

    // Update field styling and error message
    if (isValid) {
        field.classList.remove("error");
        errorElement.classList.remove("show");
        errorElement.classList.add("hidden");
    } else {
        field.classList.add("error");
        errorElement.textContent = errorMessage;
        errorElement.classList.remove("hidden");
        errorElement.classList.add("show");
    }

    return isValid;
}

// Get Field Label for Error Messages
function getFieldLabel(fieldName) {
    const labels = {
        fullName: "Full Name",
        phone: "Phone Number",
        email: "Email Address",
        projectDetails: "Project Details",
    };

    return labels[fieldName] || fieldName;
}

// Contact Form Submission
function initContactForm() {
    const form = document.getElementById("contact-form");

    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            // Validate all fields
            const requiredFields = form.querySelectorAll(
                "input[required], textarea[required]",
            );
            let isFormValid = true;

            requiredFields.forEach((field) => {
                if (!validateField(field)) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                submitForm(form);
            } else {
                // Scroll to first error
                const firstError = form.querySelector(".error");
                if (firstError) {
                    firstError.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                    });
                    firstError.focus();
                }
            }
        });
    }
}

// Submit Form (Email Integration)
function submitForm(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;

    // Show loading state
    submitButton.innerHTML = '<span class="loading"></span> Sending...';
    submitButton.disabled = true;

    // Collect form data
    const formData = new FormData(form);
    const data = {
        fullName: formData.get("fullName"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        serviceType: formData.get("serviceType"),
        projectDetails: formData.get("projectDetails"),
    };

    // Create email content
    const emailContent = createEmailContent(data);

    // Simulate form submission (replace with actual email service)
    setTimeout(() => {
        // In a real implementation, you would send this to your email service
        // For now, we'll create a mailto link as fallback
        const subject = `New Quote Request from ${data.fullName}`;
        const body = emailContent;
        const mailtoLink = `mailto:info@visalakshiindustries.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        // Try to open email client
        window.location.href = mailtoLink;

        // Show success message
        showSuccessMessage(form);

        // Reset form
        form.reset();

        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }, 2000);
}

// Create Email Content
function createEmailContent(data) {
    return `
Dear Visalakshi Industries Team,

You have received a new quote request from your website.

Customer Details:
- Name: ${data.fullName}
- Phone: ${data.phone}
- Email: ${data.email}
- Service Type: ${data.serviceType || "Not specified"}

Project Details:
${data.projectDetails}

Please respond to this inquiry as soon as possible.

Best regards,
Website Contact Form
    `.trim();
}

// Show Success Message
function showSuccessMessage(form) {
    // Remove existing success message
    const existingMessage = form.querySelector(".success-message");
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create success message
    const successMessage = document.createElement("div");
    successMessage.className = "success-message show";
    successMessage.innerHTML = `
        <i class="fas fa-check-circle mr-2"></i>
        Thank you for your inquiry! We'll get back to you within 24 hours.
    `;

    // Insert at top of form
    form.insertBefore(successMessage, form.firstChild);

    // Scroll to success message
    successMessage.scrollIntoView({
        behavior: "smooth",
        block: "center",
    });

    // Remove message after 5 seconds
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
}

// Scroll Animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        ".fade-in, .slide-in-left, .slide-in-right",
    );

    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    }, observerOptions);

    animatedElements.forEach((element) => {
        observer.observe(element);
    });
}

// Scroll to Top Button
function initScrollToTop() {
    // Create scroll to top button
    const scrollToTopButton = document.createElement("button");
    scrollToTopButton.className = "scroll-to-top";
    scrollToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopButton.setAttribute("aria-label", "Scroll to top");
    document.body.appendChild(scrollToTopButton);

    // Show/hide button based on scroll position
    window.addEventListener("scroll", function () {
        if (window.scrollY > 500) {
            scrollToTopButton.classList.add("show");
        } else {
            scrollToTopButton.classList.remove("show");
        }
    });

    // Scroll to top on click
    scrollToTopButton.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    });
}

// Newsletter Subscription
document.addEventListener("DOMContentLoaded", function () {
    const newsletterForm = document.querySelector(
        'footer input[type="email"]',
    ).parentNode;
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const subscribeButton = newsletterForm.querySelector("button");

    subscribeButton.addEventListener("click", function (e) {
        e.preventDefault();

        const email = emailInput.value.trim();

        if (!email) {
            alert("Please enter your email address.");
            emailInput.focus();
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert("Please enter a valid email address.");
            emailInput.focus();
            return;
        }

        // Simulate subscription
        const originalText = subscribeButton.textContent;
        subscribeButton.innerHTML = '<span class="loading"></span>';
        subscribeButton.disabled = true;

        setTimeout(() => {
            alert("Thank you for subscribing to our newsletter!");
            emailInput.value = "";
            subscribeButton.textContent = originalText;
            subscribeButton.disabled = false;
        }, 1500);
    });
});

// Service Card Interactions
document.addEventListener("DOMContentLoaded", function () {
    const serviceCards = document.querySelectorAll(".service-card");

    serviceCards.forEach((card) => {
        const learnMoreButton = card.querySelector("button");

        if (learnMoreButton) {
            learnMoreButton.addEventListener("click", function (e) {
                e.preventDefault();

                // Scroll to contact form
                const contactForm = document.getElementById("contact-form");
                if (contactForm) {
                    const serviceTitle = card.querySelector("h3").textContent;
                    const serviceSelect =
                        contactForm.querySelector("#serviceType");

                    // Pre-select service type
                    const serviceValues = {
                        "Gate Fabrication": "gate-fabrication",
                        "Railing Fabrication": "railing-fabrication",
                        "Grill & Security Work": "grill-security",
                        "Industrial Fabrication": "industrial-fabrication",
                        "Structural Steel Work": "structural-steel",
                        "Custom Metal Work": "custom-metal",
                    };

                    if (serviceValues[serviceTitle]) {
                        serviceSelect.value = serviceValues[serviceTitle];
                    }

                    // Scroll to contact form
                    contactForm.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });

                    // Focus on first input after a delay
                    setTimeout(() => {
                        contactForm.querySelector("input").focus();
                    }, 1000);
                }
            });
        }
    });
});

// Call Now Buttons
document.addEventListener("DOMContentLoaded", function () {
    const callButtons = document.querySelectorAll('a[href^="tel:"]');

    callButtons.forEach((button) => {
        button.addEventListener("click", function () {
            // Track call button clicks (analytics could be added here)
            console.log("Call button clicked:", this.href);
        });
    });
});

// Quote Buttons
document.addEventListener("DOMContentLoaded", function () {
    const quoteButtons = document.querySelectorAll("button");

    quoteButtons.forEach((button) => {
        if (
            button.textContent.includes("Quote") ||
            button.textContent.includes("quote")
        ) {
            button.addEventListener("click", function () {
                // Scroll to contact form
                const contactForm = document.getElementById("contact-form");
                if (contactForm) {
                    contactForm.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });

                    setTimeout(() => {
                        contactForm.querySelector("input").focus();
                    }, 1000);
                }
            });
        }
    });
});

// Intersection Observer for Navigation Active States
document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    const sectionObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const sectionId = "#" + entry.target.id;

                    navLinks.forEach((link) => {
                        link.classList.remove("active");
                        if (link.getAttribute("href") === sectionId) {
                            link.classList.add("active");
                        }
                    });
                }
            });
        },
        {
            threshold: 0.3,
            rootMargin: "-100px 0px -100px 0px",
        },
    );

    sections.forEach((section) => {
        sectionObserver.observe(section);
    });
});

// Performance Optimization - Debounce Scroll Events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(function () {
    // Handle scroll events here if needed
}, 10);

window.addEventListener("scroll", debouncedScrollHandler);

// Error Handling
window.addEventListener("error", function (e) {
    console.error("JavaScript Error:", e.error);
    // In production, you might want to send errors to a logging service
});

// Page Load Performance
window.addEventListener("load", function () {
    // Hide any loading overlays
    const loadingOverlay = document.querySelector(".loading-overlay");
    if (loadingOverlay) {
        loadingOverlay.style.display = "none";
    }

    // Initialize any additional functionality that requires full page load
    console.log("Visalakshi Industries website loaded successfully");
});

// Gallery functionality with slideshows
function initGallery() {
    // Define image data for each category
    const galleryData = {
        peb: [
            {
                src: "attached_assets/p1_1756815850200.jpg",
                alt: "PEB Building Construction 1",
            },
            {
                src: "attached_assets/p2_1756815850201.jpg",
                alt: "PEB Building Construction 2",
            },
            {
                src: "attached_assets/p3_1756815850201.jpg",
                alt: "PEB Building Construction 3",
            },
        ],
        bridges: [
            {
                src: "attached_assets/s1_1756815881202.jpg",
                alt: "Steel Bridge Construction 1",
            },
            {
                src: "attached_assets/s2_1756815881203.jpg",
                alt: "Steel Bridge Construction 2",
            },
        ],
        blasting: [
            {
                src: "attached_assets/c1_1756815861870.jpg",
                alt: "Sand and Copper Slag Blasting",
            },
        ],
        painting: [
            {
                src: "attached_assets/a1_1756815850198.jpg",
                alt: "Airless Painting 1",
            },
            {
                src: "attached_assets/a2_1756815850199.jpg",
                alt: "Airless Painting 2",
            },
        ],
        structural: [
            {
                src: "attached_assets/as1_1756815850200.jpg",
                alt: "Structural Building 1",
            },
            {
                src: "attached_assets/as2_1756815850200.jpg",
                alt: "Structural Building 2",
            },
        ],
        metalizing: [
            {
                src: "attached_assets/m1_1756815866986.jpg",
                alt: "Metalizing Process 1",
            },
            {
                src: "attached_assets/m2_1756815850200.jpg",
                alt: "Metalizing Process 2",
            },
        ],
    };

    let currentCategory = "";
    let currentSlide = 0;

    const modal = document.getElementById("gallery-modal");
    const modalImage = document.getElementById("modal-image");
    const slideCounter = document.getElementById("slide-counter");
    const closeBtn = document.getElementById("close-modal");
    const prevBtn = document.getElementById("prev-slide");
    const nextBtn = document.getElementById("next-slide");

    // Debug: Check if elements exist
    if (
        !modal ||
        !modalImage ||
        !slideCounter ||
        !closeBtn ||
        !prevBtn ||
        !nextBtn
    ) {
        console.error("Gallery modal elements not found:", {
            modal: !!modal,
            modalImage: !!modalImage,
            slideCounter: !!slideCounter,
            closeBtn: !!closeBtn,
            prevBtn: !!prevBtn,
            nextBtn: !!nextBtn,
        });
        return;
    }

    // Debug: Check if gallery categories exist
    const galleryCategories = document.querySelectorAll(".gallery-category");
    console.log("Found", galleryCategories.length, "gallery categories");

    // Gallery category click handlers
    galleryCategories.forEach((category, index) => {
        category.addEventListener("click", function () {
            console.log("Gallery category clicked:", this.dataset.category);
            currentCategory = this.dataset.category;
            currentSlide = 0;
            showSlide();
            modal.classList.remove("hidden");
        });
    });

    // Close modal
    closeBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
    });

    // Close on background click
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.add("hidden");
        }
    });

    // Previous slide
    prevBtn.addEventListener("click", () => {
        if (currentCategory && galleryData[currentCategory].length > 1) {
            currentSlide =
                currentSlide > 0
                    ? currentSlide - 1
                    : galleryData[currentCategory].length - 1;
            showSlide();
        }
    });

    // Next slide
    nextBtn.addEventListener("click", () => {
        if (currentCategory && galleryData[currentCategory].length > 1) {
            currentSlide =
                currentSlide < galleryData[currentCategory].length - 1
                    ? currentSlide + 1
                    : 0;
            showSlide();
        }
    });

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
        if (!modal.classList.contains("hidden")) {
            if (e.key === "Escape") {
                modal.classList.add("hidden");
            } else if (e.key === "ArrowLeft") {
                prevBtn.click();
            } else if (e.key === "ArrowRight") {
                nextBtn.click();
            }
        }
    });

    function showSlide() {
        if (currentCategory && galleryData[currentCategory]) {
            const images = galleryData[currentCategory];
            modalImage.src = images[currentSlide].src;
            modalImage.alt = images[currentSlide].alt;
            slideCounter.textContent = `${currentSlide + 1} / ${images.length}`;

            // Hide navigation buttons if only one image
            if (images.length === 1) {
                prevBtn.style.display = "none";
                nextBtn.style.display = "none";
            } else {
                prevBtn.style.display = "block";
                nextBtn.style.display = "block";
            }
        }
    }
}

// Chatbot functionality
function initChatbot() {
    const chatbotToggle = document.getElementById("chatbot-toggle");
    const chatbotWindow = document.getElementById("chatbot-window");
    const chatbotClose = document.getElementById("chatbot-close");
    const chatInput = document.getElementById("chat-input");
    const sendButton = document.getElementById("send-message");
    const chatMessages = document.getElementById("chat-messages");

    // Toggle chatbot
    chatbotToggle.addEventListener("click", () => {
        chatbotWindow.classList.toggle("hidden");
        if (!chatbotWindow.classList.contains("hidden")) {
            chatInput.focus();
        }
    });

    // Close chatbot
    chatbotClose.addEventListener("click", () => {
        chatbotWindow.classList.add("hidden");
    });

    // Send message
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            addMessage(message, "user");
            chatInput.value = "";
            processMessage(message);
        }
    }

    sendButton.addEventListener("click", sendMessage);
    chatInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    });

    // Add message to chat
    function addMessage(message, type) {
        const messageDiv = document.createElement("div");
        messageDiv.className = `flex items-start space-x-2 ${type === "user" ? "justify-end" : ""}`;

        if (type === "user") {
            messageDiv.innerHTML = `
                <div class="bg-orange-accent text-white p-2 rounded-lg rounded-tr-none max-w-xs">
                    <p class="text-sm">${message}</p>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="bg-blue-bright text-white p-2 rounded-lg rounded-tl-none max-w-xs">
                    <p class="text-sm">${message}</p>
                </div>
            `;
        }

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Process user message and get AI response
    async function processMessage(userMessage) {
        try {
            // Show typing indicator
            addMessage("Typing...", "bot");

            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: userMessage }),
            });

            // Remove typing indicator
            chatMessages.removeChild(chatMessages.lastElementChild);

            if (response.ok) {
                const data = await response.json();
                addMessage(data.reply, "bot");
            } else {
                throw new Error("Failed to get response");
            }
        } catch (error) {
            // Remove typing indicator if it exists
            if (
                chatMessages.lastElementChild &&
                chatMessages.lastElementChild.textContent.includes("Typing...")
            ) {
                chatMessages.removeChild(chatMessages.lastElementChild);
            }

            // Fallback message with WhatsApp redirect
            const fallbackMessage = `For immediate assistance, please contact us via WhatsApp: <a href="https://wa.me/8121035599" target="_blank" class="underline text-blue-200">+91-8121035599</a>`;
            addMessage(fallbackMessage, "bot");
        }
    }
}
