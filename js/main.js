document.addEventListener('DOMContentLoaded', function() {
  const bodyElement = document.body;
  // ================================================================
  // 1) THEME TOGGLE (Desktop & Mobile)
  // ================================================================
  const themeToggleMobile = document.getElementById('mobile-theme-toggle');
  const themeToggleDesktop = document.getElementById('theme-toggle-desktop');
  let currentTheme = localStorage.getItem('theme') || 'light';

  // Apply the saved theme on load
  bodyElement.setAttribute('data-theme', currentTheme);

  // Helper to set up a single theme button's text and event listener
  function setupThemeButton(button) {
    if (!button) return;

    // Set initial button text
    button.textContent = (bodyElement.getAttribute('data-theme') === 'light') ? 'Dark' : 'Light';

    // Add event listener
    button.addEventListener('click', function() {
      currentTheme = bodyElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      bodyElement.setAttribute('data-theme', currentTheme);
      localStorage.setItem('theme', currentTheme);
      // Update text for this button
      this.textContent = (currentTheme === 'light') ? 'Dark' : 'Light';
      // Update text for the other button if it exists
      if (this === themeToggleMobile && themeToggleDesktop) {
        themeToggleDesktop.textContent = (currentTheme === 'light') ? 'Dark' : 'Light';
      } else if (this === themeToggleDesktop && themeToggleMobile) {
        themeToggleMobile.textContent = (currentTheme === 'light') ? 'Dark' : 'Light';
      }
    });
  }

  // Initialize both theme toggles
  setupThemeButton(themeToggleMobile);
  setupThemeButton(themeToggleDesktop);

  // ================================================================
  // Right-Side Main Menu: Open/Close
  // =================================================================
  // const menuOpenBtn = document.getElementById('menu-open');
  // const menuCloseBtn = document.getElementById('menu-close');
  // const rightSideMenu = document.getElementById('rightSideMenu');

  // if (menuOpenBtn && menuCloseBtn && rightSideMenu) {
  //   menuOpenBtn.addEventListener('click', () => {
  //     rightSideMenu.classList.add('open');
  //   });
  //   menuCloseBtn.addEventListener('click', () => {
  //     rightSideMenu.classList.remove('open');
  //   });
  // }

  // ================================================================
  // Services Sub-Menu: Slide Up
  // =================================================================
  // const servicesTrigger = document.querySelector('.services-trigger button');
  // const servicesSubMenu = document.getElementById('servicesSubMenu');

  // if (servicesTrigger && servicesSubMenu) {
  //   servicesTrigger.addEventListener('click', (e) => {
  //     e.stopPropagation();
  //     servicesSubMenu.classList.toggle('open');
  //   });

  //   document.addEventListener('click', (evt) => {
  //     const clickInsideTrigger = servicesTrigger.contains(evt.target);
  //     const clickInsideSubMenu = servicesSubMenu.contains(evt.target);
  //     if (!clickInsideTrigger && !clickInsideSubMenu) {
  //       servicesSubMenu.classList.remove('open');
  //     }
  //   });
  // }
  // ================================================================
  // 3) MODAL FUNCTIONALITY (Join Us & Contact Us)
  // ================================================================
  const modalOverlays = document.querySelectorAll('.modal-overlay');
  const closeModalButtons = document.querySelectorAll('[data-close]');
  const floatingIcons = document.querySelectorAll('.floating-icon-tailwind');

  floatingIcons.forEach((icon) => {
    icon.addEventListener('click', function() {
      const modalId = icon.getAttribute('data-modal');
      const modalElement = document.getElementById(modalId);
      if (modalElement) {
        modalElement.classList.add('active');
        modalElement.focus(); // For accessibility, focus on the modal
      }
    });
  });

  closeModalButtons.forEach((btn) => {
    btn.addEventListener('click', function() {
      const parentOverlay = btn.closest('.modal-overlay');
      if (parentOverlay) {
        parentOverlay.classList.remove('active');
      }
    });
  });

  modalOverlays.forEach((overlay) => {
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) { // Clicked on the overlay itself
        overlay.classList.remove('active');
      }
    });
    // Add ESC key listener to close modals
    overlay.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        overlay.classList.remove('active');
      }
    });
  });

  // ================================================================
  // Mobile Services Menu Toggle
  // =================================================================
  const mobileServicesToggleBtn = document.getElementById('mobile-services-toggle');
  const mobileServicesMenu = document.getElementById('mobile-services-menu'); // Corrected ID

  if (mobileServicesToggleBtn && mobileServicesMenu) {
    mobileServicesToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent click from immediately closing due to document listener

      const isHidden = mobileServicesMenu.classList.contains('hidden');

      if (isHidden) {
        // Show menu
        mobileServicesMenu.classList.remove('hidden');
        // Allow a frame for display:block to take effect before starting transition
        requestAnimationFrame(() => {
          mobileServicesMenu.classList.remove('opacity-0');
          mobileServicesMenu.classList.remove('translate-y-full');
          mobileServicesMenu.classList.add('opacity-100');
          mobileServicesMenu.classList.add('translate-y-0');
        });
      } else {
        // Hide menu
        mobileServicesMenu.classList.remove('opacity-100');
        mobileServicesMenu.classList.remove('translate-y-0');
        mobileServicesMenu.classList.add('opacity-0');
        mobileServicesMenu.classList.add('translate-y-full');
        // Wait for transition to finish before adding 'hidden'
        setTimeout(() => {
          mobileServicesMenu.classList.add('hidden');
        }, 300); // Match transition duration
      }
    });

    // Optional: Close menu if clicking outside of it
    document.addEventListener('click', (e) => {
      if (!mobileServicesMenu.classList.contains('hidden') && !mobileServicesMenu.contains(e.target) && !mobileServicesToggleBtn.contains(e.target)) {
        mobileServicesMenu.classList.remove('opacity-100');
        mobileServicesMenu.classList.remove('translate-y-0');
        mobileServicesMenu.classList.add('opacity-0');
        mobileServicesMenu.classList.add('translate-y-full');
        setTimeout(() => {
          mobileServicesMenu.classList.add('hidden');
        }, 300);
      }
    });
  }

  // ================================================================
  // Employment Type Toggle for Join Us Form
  // ================================================================
  const servicesToggleMobile = document.getElementById('mobile-services-toggle');
  const mobileServicesMenu = document.getElementById('mobile-services-menu');

  if (servicesToggleMobile && mobileServicesMenu) {
    servicesToggleMobile.addEventListener('click', function() {
      mobileServicesMenu.classList.toggle('active');
    });
  }

  // ================================================================
  // 5) FORM SUBMISSIONS (Alert + Reset + Close Modal)
  // ================================================================
  const joinForm = document.getElementById('join-form');
  if (joinForm) {
    joinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Simple alert, replace with actual submission logic if needed
      alert(currentLanguage === 'en' ? 'Thank you for joining us! We have received your details.' : '¡Gracias por unirte! Hemos recibido tus datos.');
      joinForm.reset();
      const joinModal = document.getElementById('join-modal');
      if (joinModal) {
        joinModal.classList.remove('active');
      }
      grecaptcha.ready(() => {
        grecaptcha.execute('6LfAOV0rAAAAAPBGgn2swZWj5SjANoQ4rUH6XIMz', { action: 'join_us_submit' }).then((token) => {
          console.log('Join Us ReCAPTCHA token:', token);

          const name = sanitizeInput(document.getElementById("join-name").value);
          const email = sanitizeInput(document.getElementById("join-email").value);
          const contact = sanitizeInput(document.getElementById("join-contact").value);
          const date = document.getElementById("join-date").value;
          const time = document.getElementById("join-time").value;
          const comment = sanitizeInput(document.getElementById("join-comment").value);

          const selectedInterests = [];
          document.querySelectorAll('input[name="join_interest"]:checked').forEach(checkbox => {
            selectedInterests.push(checkbox.value);
          });

          const formData = new FormData();
          formData.append('name', name);
          formData.append('email', email);
          formData.append('contact', contact);
          formData.append('date', date);
          formData.append('time', time);
          formData.append('comment', comment);
          if (selectedInterests.length > 0) {
            formData.append('interests', selectedInterests.join(','));
          }
          formData.append('g-recaptcha-response', token);

          console.log("Submitting Join Us Form Data:", { name, email, contact, date, time, comment, interests: selectedInterests.join(',') }); // Token is not directly logged here but sent

          fetch('https://join.gabrieloor-cv1.workers.dev/', {
            method: 'POST',
            body: formData
          })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              alert('Form submitted successfully! Message: ' + data.message);
              joinForm.reset();
              document.getElementById('join-modal').classList.remove('active');
            } else {
              alert('Submission failed: ' + (data.message || 'Unknown error') + (data.details ? ' Details: ' + JSON.stringify(data.details) : ''));
            }
          })
          .catch(error => {
            console.error('Error submitting Join Us form:', error);
            alert('An error occurred while submitting the Join Us form. Please try again.');
          });
        }).catch(error => {
          console.error("Error executing reCAPTCHA for Join Us:", error);
          alert("Error with reCAPTCHA. Please try again.");
        });
      });
    });
  }

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Simple alert, replace with actual submission logic if needed
      alert(currentLanguage === 'en' ? 'Thank you for contacting us! We will get back to you soon.' : '¡Gracias por contactarnos! Nos pondremos en contacto contigo pronto.');
      contactForm.reset();
      const contactModal = document.getElementById('contact-modal');
      if (contactModal) {
        contactModal.classList.remove('active');
      }
    });
  }
  // Collapsible Areas of Interest for Join Us form
  const areasTrigger = document.getElementById('join-areas-trigger');
  const areasOptions = document.getElementById('join-areas-options');
  if (areasTrigger && areasOptions) {
    areasTrigger.addEventListener('click', () => {
      const isExpanded = areasTrigger.getAttribute('aria-expanded') === 'true';
      areasTrigger.setAttribute('aria-expanded', !isExpanded);
      areasOptions.style.display = isExpanded ? 'none' : 'block'; // This controls visibility
      const arrow = areasTrigger.querySelector('.arrow-down');
      if (arrow) {
        arrow.textContent = isExpanded ? '▼' : '▲'; // Toggle arrow indicator
      }
    });
  }

});
