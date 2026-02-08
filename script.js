// ===================================
// Cinematic Scroll Experience
// NO localStorage, NO cookies, NO tracking
// ===================================

document.addEventListener('DOMContentLoaded', function () {
    // Check if opening screen should be shown
    initOpeningScreen();

    // Initialize scroll-triggered visibility and animations
    initScrollTriggers();

    // Engagement button
    initEngagementButton();

    // Form handling
    initFormHandling();

    // Hide scroll hint after first scroll
    initScrollHint();

    // Parallax image motion
    initParallaxImages();
});

// ===================================
// Opening Screen - One-Time Threshold
// ===================================
function initOpeningScreen() {
    const openingScreen = document.getElementById('opening-screen');
    const mainExperience = document.getElementById('main-experience');
    const enterBtn = document.getElementById('enter-btn');

    if (!openingScreen || !mainExperience || !enterBtn) return;

    // Always show opening screen on every page load
    openingScreen.style.display = 'flex';
    openingScreen.classList.remove('hidden');
    mainExperience.classList.remove('visible');

    enterBtn.addEventListener('click', function () {
        // Fade out opening screen
        openingScreen.classList.add('hidden');

        // Fade in main experience immediately
        mainExperience.classList.add('visible');
    });
}

// ===================================
// Scroll-Triggered Visibility & Line-by-Line Animations
// ===================================
function initScrollTriggers() {
    const momentSections = document.querySelectorAll('.moment-section');

    if (!momentSections.length) return;

    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Animate text lines with staggered delays
                const textLines = entry.target.querySelectorAll('.text-line');
                textLines.forEach((line) => {
                    const delay = parseInt(line.getAttribute('data-delay')) || 0;
                    line.style.transitionDelay = `${delay}ms`;
                });

                // Add slide-in animation to images
                const images = entry.target.querySelectorAll('.moment-image');
                images.forEach((img, index) => {
                    img.style.opacity = '0';
                    img.style.transform = 'translateX(-30px)';
                    img.style.transition = 'opacity 1.2s ease-out, transform 1.2s ease-out';

                    setTimeout(() => {
                        img.style.opacity = '';
                        img.style.transform = 'translateX(0)';
                    }, 100 * (index + 1));
                });
            }
        });
    }, observerOptions);

    momentSections.forEach(section => {
        observer.observe(section);
    });
}

// ===================================
// Scroll Hint - Clickable with Smooth Scroll
// ===================================
function initScrollHint() {
    const scrollHint = document.querySelector('.scroll-hint');
    if (!scrollHint) return;

    let hasScrolled = false;

    // Click to scroll to next section
    scrollHint.addEventListener('click', function () {
        const moment1 = document.querySelector('.moment-1');
        if (moment1) {
            moment1.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });

    // Hide after first scroll
    window.addEventListener('scroll', function () {
        if (!hasScrolled && window.scrollY > 100) {
            hasScrolled = true;
            scrollHint.style.transition = 'opacity 0.8s ease-out';
            scrollHint.style.opacity = '0';
            setTimeout(() => {
                scrollHint.style.display = 'none';
            }, 800);
        }
    });
}

// ===================================
// Parallax Image Motion
// ===================================
function initParallaxImages() {
    const parallaxImages = document.querySelectorAll('.parallax-image');

    if (!parallaxImages.length) return;

    let ticking = false;

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                parallaxImages.forEach(img => {
                    const section = img.closest('.moment-section');
                    if (!section) return;

                    const rect = section.getBoundingClientRect();
                    const windowHeight = window.innerHeight;

                    // Only apply parallax when section is in viewport
                    if (rect.top < windowHeight && rect.bottom > 0) {
                        // Calculate scroll progress through section (0 to 1)
                        const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
                        const clampedProgress = Math.max(0, Math.min(1, scrollProgress));

                        // Subtle vertical movement (max 30px)
                        const translateY = (clampedProgress - 0.5) * 30;

                        // Subtle zoom (1.0 to 1.05)
                        const scale = 1 + (clampedProgress * 0.05);

                        img.style.transform = `translateY(${translateY}px) scale(${scale})`;
                    }
                });

                ticking = false;
            });

            ticking = true;
        }
    });
}

// ===================================
// Engagement Button
// ===================================
function initEngagementButton() {
    const engagementBtn = document.getElementById('engagement-btn');
    const solidarityMsg = document.getElementById('solidarity-msg');

    if (!engagementBtn) return;

    engagementBtn.addEventListener('click', function () {
        // Show solidarity message
        if (solidarityMsg) {
            solidarityMsg.classList.add('visible');
        }

        // Wait for emotional moment, then scroll to form
        setTimeout(() => {
            const feedbackSection = document.getElementById('feedback');
            if (feedbackSection) {
                feedbackSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 2000);
    });
}

// ===================================
// Checkbox Interactions
// ===================================
function initCheckboxInteractions() {
    // Show/hide "other" text input for Q1
    const q1OtherCheckbox = document.getElementById('q1_other_checkbox');
    const q1OtherText = document.getElementById('q1_other_text');

    if (q1OtherCheckbox && q1OtherText) {
        q1OtherCheckbox.addEventListener('change', function () {
            q1OtherText.style.display = this.checked ? 'block' : 'none';
            if (!this.checked) q1OtherText.value = '';
        });
    }

    // Show/hide "other" text input for Q2
    const q2OtherCheckbox = document.getElementById('q2_other_checkbox');
    const q2OtherText = document.getElementById('q2_other_text');

    if (q2OtherCheckbox && q2OtherText) {
        q2OtherCheckbox.addEventListener('change', function () {
            q2OtherText.style.display = this.checked ? 'block' : 'none';
            if (!this.checked) q2OtherText.value = '';
        });
    }

    // Limit selection to 2 checkboxes for Q4 (trust question)
    const trustCheckboxes = document.querySelectorAll('.max-two');
    if (trustCheckboxes.length) {
        trustCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function () {
                const checkedCount = document.querySelectorAll('.max-two:checked').length;
                if (checkedCount > 2) {
                    this.checked = false;
                    alert('Please select up to 2 options only.');
                }
            });
        });
    }
}

// ===================================
// Form Handling & Validation
// ===================================
function initFormHandling() {
    const form = document.getElementById('feedback-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Collect form data
        const email = document.getElementById('email').value;
        const testingInterest = document.querySelector('input[name="testing_interest"]:checked')?.value;
        const features = document.getElementById('features').value;
        const currentSolution = document.getElementById('current_solution').value;
        const pastExperience = document.getElementById('past_experience').value;

        // Validate required fields
        if (!testingInterest || !features.trim() || !currentSolution.trim() || !pastExperience.trim()) {
            alert('Please fill in all required fields.');
            return;
        }

        // Build Google Form URL with pre-filled data
        // Replace these entry IDs with your actual Google Form entry IDs
        const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdYOUR_FORM_ID/formResponse';
        const params = new URLSearchParams({
            'entry.EMAIL_ENTRY_ID': email,
            'entry.TESTING_ENTRY_ID': testingInterest,
            'entry.FEATURES_ENTRY_ID': features,
            'entry.SOLUTION_ENTRY_ID': currentSolution,
            'entry.EXPERIENCE_ENTRY_ID': pastExperience
        });

        // Open Google Form in new tab (for now just log data)
        console.log('Form Data:', {
            email,
            testingInterest,
            features,
            currentSolution,
            pastExperience
        });

        // Show success message
        showSuccessMessage();
        form.reset();
    });
}

function showSuccessMessage() {
    const formContainer = document.querySelector('.form-container-editorial');
    if (!formContainer) return;

    formContainer.innerHTML = `
        <div class="success-message-container">
            <h2 class="success-title">Thank you for trusting us with something personal.</h2>
            <p class="success-text">You didn't imagine it.</p>
            <p class="success-text">And you're not alone.</p>
            
            <div class="additional-help-section">
                <p class="help-intro">If you have a moment, your detailed experience could help countless other women.</p>
                <p class="help-description">Every story shared helps us build something that truly understands what women go through.</p>
                <a href="https://forms.gle/7BWQGkcGT1TRDLoQA" target="_blank" class="btn-detailed-form">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <span>Share Your Full Story (Optional)</span>
                </a>
                <p class="help-note">Takes 5 minutes • Completely anonymous • Helps build safer solutions</p>
            </div>
        </div>
    `;

    // Add styles for success message
    const style = document.createElement('style');
    style.textContent = `
        .success-message-container {
            text-align: center;
            padding: 3rem 2rem;
        }
        .success-title {
            font-family: 'Playfair Display', serif;
            font-size: clamp(2rem, 5vw, 3rem);
            color: #ffffff;
            margin-bottom: 2rem;
            font-weight: 600;
            line-height: 1.3;
        }
        .success-text {
            font-family: 'Inter', sans-serif;
            font-size: clamp(1.125rem, 2.5vw, 1.5rem);
            color: rgba(255, 255, 255, 0.9);
            margin-bottom: 1rem;
            font-weight: 300;
        }
        .additional-help-section {
            margin-top: 3rem;
            padding-top: 2rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .help-intro {
            font-family: 'Playfair Display', serif;
            font-size: clamp(1.25rem, 3vw, 1.75rem);
            color: #ffffff;
            margin-bottom: 1rem;
            font-weight: 400;
            line-height: 1.4;
        }
        .help-description {
            font-family: 'Inter', sans-serif;
            font-size: clamp(0.95rem, 2vw, 1.125rem);
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 2rem;
            font-style: italic;
            line-height: 1.6;
        }
        .btn-detailed-form {
            display: inline-flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1.25rem 2.5rem;
            font-size: 1.05rem;
            font-weight: 500;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.08));
            color: #ffffff;
            border: 2px solid rgba(255, 255, 255, 0.4);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            font-family: 'Inter', sans-serif;
            text-decoration: none;
            margin-bottom: 1rem;
        }
        .btn-detailed-form:hover {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.15));
            border-color: rgba(255, 255, 255, 0.7);
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(255, 255, 255, 0.12);
        }
        .btn-detailed-form svg {
            flex-shrink: 0;
        }
        .help-note {
            font-size: 0.85rem;
            color: rgba(255, 255, 255, 0.5);
            font-style: italic;
            font-family: 'Inter', sans-serif;
        }
    `;
    document.head.appendChild(style);
}
