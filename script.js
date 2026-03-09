 // DOM Elements
    const darkModeToggle = document.getElementById('darkModeToggle');
    const settingsPanel = document.getElementById('settingsPanel');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectBoxes = document.querySelectorAll('.project-box');
    const contactForm = document.getElementById('contactForm');
    const progressBars = document.querySelectorAll('.progress');
    const skillLevels = document.querySelectorAll('.skill-level');
    const colorOptions = document.querySelectorAll('.color-option');

    // Typewriter Effect
    const typewriterElement = document.getElementById('typewriter');
    const titles = ["Full Stack Developer", "Java Developer", "Spring Boot Expert", "Angular Developer", "Database Specialist"];
    let currentTitleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingTimeout;

    // Initialize the page
    document.addEventListener('DOMContentLoaded', function() {
      // Load saved preferences
      loadPreferences();
      
      // Set initial active section
      showSection('home');
      
      // Start typewriter effect
      typeWriter();
      
      // Set up event listeners
      setupEventListeners();
      
      // Initialize dark mode
      initDarkMode();
    });

    // Load saved preferences from localStorage
    function loadPreferences() {
      // Theme color
      const savedColor = localStorage.getItem('themeColor') || '#4db6ac';
      changeThemeColor(savedColor, false);
      
      // Animation speed
      const savedSpeed = localStorage.getItem('animationSpeed') || 'normal';
      document.getElementById('animationSpeed').value = savedSpeed;
      changeAnimationSpeed(savedSpeed);
      
      // Layout density
      const savedDensity = localStorage.getItem('layoutDensity') || 'normal';
      document.getElementById('layoutDensity').value = savedDensity;
      changeLayoutDensity(savedDensity);
      
      // Dark mode
      const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
      darkModeToggle.checked = darkModeEnabled;
      toggleDarkMode(darkModeEnabled, false);
    }

    // Initialize dark mode
    function initDarkMode() {
      // Set initial state from localStorage
      const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
      darkModeToggle.checked = darkModeEnabled;
      toggleDarkMode(darkModeEnabled, false);
      
      // Add event listener
      darkModeToggle.addEventListener('change', function() {
        toggleDarkMode(this.checked);
        localStorage.setItem('darkMode', this.checked);
      });
    }

    // Toggle dark mode
    function toggleDarkMode(enable, animate = true) {
      if (animate) {
        document.body.style.transition = 'all 0.5s ease';
        setTimeout(() => {
          document.body.style.transition = '';
        }, 500);
      }
      
      if (enable) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    }

    // Set up all event listeners
    function setupEventListeners() {
      // Project filter buttons
      filterButtons.forEach(button => {
        button.addEventListener('click', function() {
          filterProjects(this);
        });
      });
      
      // Contact form submission
      if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
      }
      
      // Animate skills when scrolling to skills section
      window.addEventListener('scroll', checkSkillAnimation);
    }

    // Toggle settings panel
    function toggleSettings() {
      settingsPanel.classList.toggle('active');
    }

    // Change theme color
    function changeThemeColor(color, save = true) {
      // Update CSS variable
      document.documentElement.style.setProperty('--theme-color', color);
      
      // Update active color option
      colorOptions.forEach(option => {
        option.classList.remove('active');
        if (option.style.backgroundColor === color) {
          option.classList.add('active');
        }
      });
      
      // Update specific elements that use the theme color
      document.querySelectorAll('.btn-about, .submit-btn, .progress, .skill-level, .resume-btn').forEach(el => {
        el.style.background = `linear-gradient(90deg, ${color}, ${adjustColor(color, 20)})`;
      });
      
      document.querySelectorAll('section h2').forEach(el => {
        el.style.borderBottomColor = color;
      });
      
      document.querySelectorAll('.skill-category h3, .contact-icon').forEach(el => {
        el.style.color = color;
      });
      
      // Save to localStorage
      if (save) {
        localStorage.setItem('themeColor', color);
      }
    }

    // Helper function to adjust color brightness
    function adjustColor(color, percent) {
      // Convert hex to RGB
      let R = parseInt(color.substring(1,3), 16);
      let G = parseInt(color.substring(3,5), 16);
      let B = parseInt(color.substring(5,7), 16);
      
      // Adjust brightness
      R = parseInt(R * (100 + percent) / 100);
      G = parseInt(G * (100 + percent) / 100);
      B = parseInt(B * (100 + percent) / 100);
      
      R = (R < 255) ? R : 255;  
      G = (G < 255) ? G : 255;
      B = (B < 255) ? B : 255;
      
      // Convert back to hex
      const RR = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16));
      const GG = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16));
      const BB = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16));
      
      return "#" + RR + GG + BB;
    }

    // Change animation speed
    function changeAnimationSpeed(speed) {
      const multiplier = speed === 'slow' ? 1.5 : speed === 'fast' ? 0.5 : 1;
      document.documentElement.style.setProperty('--animation-speed', multiplier);
      localStorage.setItem('animationSpeed', speed);
    }

    // Change layout density
    function changeLayoutDensity(density) {
      document.body.classList.remove('compact', 'spacious');
      if (density !== 'normal') {
        document.body.classList.add(density);
      }
      localStorage.setItem('layoutDensity', density);
    }

    // Show selected section and hide others with smooth transition
    function showSection(sectionId) {
      // Hide all sections first
      sections.forEach(section => {
        if (section.classList.contains('visible')) {
          section.classList.remove('visible');
          setTimeout(() => {
            section.style.display = 'none';
          }, 300);
        }
      });
      
      // Show selected section after a brief delay
      setTimeout(() => {
        const activeSection = document.getElementById(sectionId);
        activeSection.style.display = 'block';
        setTimeout(() => {
          activeSection.classList.add('visible');
          
          // Special handling for sections that need animations
          if (sectionId === 'skills') {
            animateSkills();
          } else if (sectionId === 'projects') {
            animateProjectSkills();
          }
        }, 50);
      }, 300);
      
      // Update active nav link
      updateActiveNavLink(sectionId);
      
      // Scroll to section
      scrollToSection(sectionId);
    }

    // Update active navigation link
    function updateActiveNavLink(sectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('onclick').includes(sectionId)) {
          link.classList.add('active');
        }
      });
    }

    // Smooth scroll to section
    function scrollToSection(sectionId) {
      const section = document.getElementById(sectionId);
      if (section) {
        window.scrollTo({
          top: section.offsetTop - 80, // Adjust for header height
          behavior: 'smooth'
        });
      }
    }

    // Enhanced Typewriter Effect with blinking cursor
    function typeWriter() {
      clearTimeout(typingTimeout);
      
      const currentTitle = titles[currentTitleIndex];
      let displayText = currentTitle.substring(0, charIndex);
      
      // Add blinking cursor when not deleting
      if (!isDeleting) {
        displayText += '<span class="cursor">|</span>';
      }
      
      typewriterElement.innerHTML = displayText;
      
      if (isDeleting) {
        charIndex--;
      } else {
        charIndex++;
      }
      
      // Determine typing speed
      let typingSpeed = isDeleting ? 50 : 100;
      
      // Check if we've reached the end of the word
      if (!isDeleting && charIndex === currentTitle.length) {
        typingSpeed = 2000; // Pause at end of word
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        currentTitleIndex = (currentTitleIndex + 1) % titles.length;
        typingSpeed = 500; // Pause before typing next word
      }
      
      typingTimeout = setTimeout(typeWriter, typingSpeed);
    }

    // Filter projects with smooth transition
    function filterProjects(clickedButton) {
      // Update active filter button
      filterButtons.forEach(button => button.classList.remove('active'));
      clickedButton.classList.add('active');
      
      const filterValue = clickedButton.getAttribute('data-filter');
      
      // Animate project boxes
      projectBoxes.forEach(box => {
        const boxTech = box.getAttribute('data-tech');
        
        if (filterValue === 'all' || boxTech.includes(filterValue)) {
          box.style.display = 'block';
          setTimeout(() => {
            box.style.opacity = '1';
            box.style.transform = 'translateY(0)';
          }, 50);
        } else {
          box.style.opacity = '0';
          box.style.transform = 'translateY(20px)';
          setTimeout(() => {
            box.style.display = 'none';
          }, 300);
        }
      });
    }

    // Animate skill progress bars
    function animateSkills() {
      progressBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = '0';
        setTimeout(() => {
          bar.style.width = width + '%';
        }, 100);
      });
    }

    // Animate project skill bars
    function animateProjectSkills() {
      skillLevels.forEach(level => {
        const width = level.style.width;
        level.style.width = '0';
        setTimeout(() => {
          level.style.width = width;
        }, 100);
      });
    }

    // Check if skills section is in view for animation
    function checkSkillAnimation() {
      const skillsSection = document.getElementById('skills');
      if (isElementInViewport(skillsSection)) {
        animateSkills();
        // Remove event listener after animation to improve performance
        window.removeEventListener('scroll', checkSkillAnimation);
      }
    }

    // Check if element is in viewport
    function isElementInViewport(el) {
      if (!el) return false;
      
      const rect = el.getBoundingClientRect();
      return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
      );
    }

    // Enhanced form handling with fetch API simulation
    function handleFormSubmit(e) {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const formMessage = document.querySelector('.form-message');
      
      // Simple validation
      const name = formData.get('name');
      const email = formData.get('email');
      const message = formData.get('message');
      
      if (!name || !email || !message) {
        showFormMessage(formMessage, 'Please fill in all required fields.', 'error');
        return;
      }
      
      if (!validateEmail(email)) {
        showFormMessage(formMessage, 'Please enter a valid email address.', 'error');
        return;
      }
      
      // Show loading state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;
      
      // Simulate API call
      setTimeout(() => {
        showFormMessage(formMessage, 'Your message has been sent successfully!', 'success');
        contactForm.reset();
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        
        // Hide message after 5 seconds
        setTimeout(() => {
          formMessage.style.display = 'none';
        }, 5000);
      }, 1500);
    }

    // Show form message with animation
    function showFormMessage(element, message, type) {
      element.textContent = message;
      element.style.display = 'block';
      element.style.animation = 'fadeIn 0.3s ease-out';
      
      // Set colors based on message type
      if (type === 'error') {
        element.style.backgroundColor = '#ffebee';
        element.style.color = '#c62828';
      } else {
        element.style.backgroundColor = '#e8f5e9';
        element.style.color = '#2e7d32';
      }
    }

    // Email validation
    function validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }
