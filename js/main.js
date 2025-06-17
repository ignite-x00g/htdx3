// MODAL FORM CONTROLLER – FINAL FULL VERSION

document.addEventListener("DOMContentLoaded", () => {
  // ================================
  // LANGUAGE TOGGLE
  // ================================
  let currentLanguage = localStorage.getItem("language") || "en";
  const langToggleDesktop = document.getElementById("language-toggle-desktop");
  const langToggleMobile = document.getElementById("language-toggle-mobile");

  function updateLanguage(lang) {
    const attr = lang === "en" ? "data-en" : "data-es";
    const elements = document.querySelectorAll("[data-en]");
    elements.forEach(el => {
      const translation = el.getAttribute(attr);
      if (!translation) return;
      if (["INPUT", "TEXTAREA"].includes(el.tagName)) {
        if (el.placeholder) el.placeholder = translation;
      } else {
        el.textContent = translation;
      }
    });
  }

  function toggleLanguage() {
    currentLanguage = currentLanguage === "en" ? "es" : "en";
    localStorage.setItem("language", currentLanguage);
    updateLanguage(currentLanguage);
    document.body.setAttribute("lang", currentLanguage);
    if (langToggleDesktop) langToggleDesktop.textContent = currentLanguage === "en" ? "ES" : "EN";
    if (langToggleMobile) {
      const span = langToggleMobile.querySelector("span") || langToggleMobile;
      span.textContent = currentLanguage === "en" ? "ES" : "EN";
    }
  }

  updateLanguage(currentLanguage);
  document.body.setAttribute("lang", currentLanguage);
  if (langToggleDesktop) langToggleDesktop.addEventListener("click", toggleLanguage);
  if (langToggleMobile) langToggleMobile.addEventListener("click", toggleLanguage);

  // ================================
  // THEME TOGGLE
  // ================================
  const themeToggleDesktop = document.getElementById("theme-toggle-desktop");
  const themeToggleMobile = document.getElementById("theme-toggle-mobile");
  const currentTheme = localStorage.getItem("theme") || "light";
  document.body.setAttribute("data-theme", currentTheme);

  function setupTheme(button) {
    if (!button) return;
    button.textContent = currentTheme === "light" ? "Dark" : "Light";
    button.addEventListener("click", () => {
      const newTheme = document.body.getAttribute("data-theme") === "light" ? "dark" : "light";
      document.body.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      button.textContent = newTheme === "light" ? "Dark" : "Light";
    });
  }

  setupTheme(themeToggleDesktop);
  setupTheme(themeToggleMobile);

  // ================================
  // MODALS
  // ================================
  const modalTriggers = document.querySelectorAll("[data-modal]");
  const closeModalButtons = document.querySelectorAll("[data-close]");
  const modalOverlays = document.querySelectorAll(".modal-overlay");

  modalTriggers.forEach(btn => {
    btn.addEventListener("click", () => {
      const modalId = btn.getAttribute("data-modal");
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    });
  });

  closeModalButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const modal = btn.closest(".modal-overlay");
      if (modal) {
        modal.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  });

  modalOverlays.forEach(modal => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
    modal.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        modal.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  });

  // ================================================================
  // Employment Type Toggle for Join Us Form
  // ================================================================
  const employmentTypeToggle = document.getElementById('employment-type-toggle');
  const employmentTypeCheckboxes = document.getElementById('employment-type-checkboxes');
  const employmentDone = document.getElementById('employment-done');

  if (employmentTypeToggle && employmentTypeCheckboxes && employmentDone) {
    employmentTypeToggle.addEventListener('click', () => {
      const isExpanded = employmentTypeToggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        employmentTypeCheckboxes.style.display = 'none';
        employmentTypeToggle.setAttribute('aria-expanded', 'false');
      } else {
        employmentTypeCheckboxes.style.display = 'block';
        employmentTypeToggle.setAttribute('aria-expanded', 'true');
      }
    });
  }

  if (areasDone) {
    areasDone.addEventListener("click", () => {
      areasOptions.style.display = "none";
      areasTrigger.setAttribute("aria-expanded", "false");
      const arrow = areasTrigger.querySelector(".arrow-down");
      if (arrow) arrow.textContent = "▼";
    });
  }

  const employmentToggle = document.getElementById("employment-type-toggle");
  const employmentOptions = document.getElementById("employment-type-checkboxes");
  const employmentDone = document.getElementById("employment-done");

  if (employmentToggle) {
    employmentToggle.addEventListener("click", () => {
      const isOpen = employmentOptions.style.display === "block";
      employmentOptions.style.display = isOpen ? "none" : "block";
      employmentToggle.setAttribute("aria-expanded", !isOpen);
    });
  }

  if (employmentDone) {
    employmentDone.addEventListener("click", () => {
      employmentOptions.style.display = "none";
      employmentToggle.setAttribute("aria-expanded", "false");
    });
  }

  // ================================
  // MOBILE SERVICES MENU
  // ================================
  const mobileMenuToggle = document.getElementById("mobile-services-toggle");
  const mobileMenu = document.getElementById("mobile-services-menu-container");

  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      mobileMenu.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
      if (!mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        mobileMenu.classList.remove("active");
      }
    });
  }

  // ================================
  // FORM VALIDATION HELPERS
  // ================================
  function sanitizeInput(input) {
    const div = document.createElement("div");
    div.textContent = input;
    return div.innerHTML;
  }

  // ================================
  // FORM: JOIN US
  // ================================
  const joinForm = document.getElementById("join-form");

  if (joinForm) {
    joinForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const honey = document.getElementById('honeypot-join');
      if (honey && honey.value) {
        alert('Submission blocked.');
        return;
      }

      if (typeof grecaptcha === 'undefined') {
        alert('ReCAPTCHA not ready.');
        return;
      }

      grecaptcha.ready(() => {
        grecaptcha.execute('6LfAOV0rAAAAAPBGgn2swZWj5SjANoQ4rUH6XIMz', { action: 'join_us_submit' }).then((token) => {
          const name = sanitizeInput(document.getElementById("join-name").value);
          const email = sanitizeInput(document.getElementById("join-email").value);
          const contact = sanitizeInput(document.getElementById("join-contact").value);
          const date = document.getElementById("join-date").value;
          const time = document.getElementById("join-time").value;
          const comment = sanitizeInput(document.getElementById("join-comment").value);

          const selectedInterests = [];
          document.querySelectorAll('input[name="join_interest"]:checked').forEach(cb => selectedInterests.push(cb.value));

          const formData = new FormData();
          formData.append("name", name);
          formData.append("email", email);
          formData.append("contact", contact);
          formData.append("date", date);
          formData.append("time", time);
          formData.append("comment", comment);
          formData.append("interests", selectedInterests.join(","));
          formData.append("g-recaptcha-response", token);

          fetch("https://join.gabrieloor-cv1.workers.dev/", {
            method: "POST",
            body: formData
          })
            .then(res => res.json())
            .then(data => {
              if (data.success) {
                alert("Form submitted successfully! " + data.message);
                joinForm.reset();
                document.getElementById("join-modal").classList.remove("active");
              } else {
                alert("Submission failed: " + (data.message || "Unknown error"));
              }
            })
            .catch(err => {
              console.error("Join Us form error:", err);
              alert("Error submitting the form. Try again.");
            });
        });
      });
    });
  }

  // ================================
  // FORM: CONTACT US
  // ================================
  const contactForm = document.getElementById("contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const honey = document.getElementById('honeypot-contact');
      if (honey && honey.value) {
        alert('Submission blocked.');
        return;
      }

      if (typeof grecaptcha === 'undefined') {
        alert('ReCAPTCHA not ready.');
        return;
      }

      grecaptcha.ready(() => {
        grecaptcha.execute('6LfAOV0rAAAAAPBGgn2swZWj5SjANoQ4rUH6XIMz', { action: 'contact_us_submit' }).then((token) => {
          const name = sanitizeInput(document.getElementById("contact-name").value);
          const email = sanitizeInput(document.getElementById("contact-email").value);
          const contactNumber = sanitizeInput(document.getElementById("contact-number").value);
          const preferredDate = document.getElementById("contact-date").value;
          const preferredTime = document.getElementById("contact-time").value;
          const comments = sanitizeInput(document.getElementById("contact-comments").value);

          const formData = new FormData();
          formData.append("name", name);
          formData.append("email", email);
          formData.append("contactNumber", contactNumber);
          formData.append("preferredDate", preferredDate);
          formData.append("preferredTime", preferredTime);
          formData.append("comments", comments);
          formData.append("g-recaptcha-response", token);

          fetch("https://contact.gabrieloor-cv1.workers.dev/", {
            method: "POST",
            body: formData
          })
            .then(res => res.json())
            .then(data => {
              if (data.success) {
                alert("Message sent successfully! " + data.message);
                contactForm.reset();
                document.getElementById("contact-modal").classList.remove("active");
              } else {
                alert("Submission failed: " + (data.message || "Unknown error"));
              }
            })
            .catch(err => {
              console.error("Contact Us form error:", err);
              alert("Error submitting the form. Try again.");
            });
        });
      });
    });
  }
  // Collapsible Areas of Interest for Join Us form
  const areasTrigger = document.getElementById('join-areas-trigger');
  const areasOptions = document.getElementById('join-areas-options');
  const areasDone = document.getElementById('areas-done');
  if (areasTrigger && areasOptions && areasDone) {
    areasTrigger.addEventListener('click', () => {
      const isExpanded = areasTrigger.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        areasOptions.style.display = 'none';
        areasTrigger.setAttribute('aria-expanded', 'false');
      } else {
        areasOptions.style.display = 'block';
        areasTrigger.setAttribute('aria-expanded', 'true');
      }
    });

    areasDone.addEventListener('click', () => {
      areasOptions.style.display = 'none';
      areasTrigger.setAttribute('aria-expanded', 'false');
    });
  }
});
