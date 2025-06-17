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
      if (el.placeholder !== undefined && el.tagName === "INPUT") {
        el.placeholder = translation;
      } else if (!["INPUT", "TEXTAREA"].includes(el.tagName)) {
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
  const modalOverlays = document.querySelectorAll(".modal-overlay");
  const modalTriggers = document.querySelectorAll("[data-modal]");
  const closeModalButtons = document.querySelectorAll("[data-close]");

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

  // ================================
  // COLLAPSIBLE SECTIONS
  // ================================
  const areasTrigger = document.getElementById("join-areas-trigger");
  const areasOptions = document.getElementById("join-areas-options");
  const areasDone = document.getElementById("areas-done");
  if (areasTrigger) {
    areasTrigger.addEventListener("click", () => {
      const isOpen = areasOptions.style.display === "block";
      areasOptions.style.display = isOpen ? "none" : "block";
      areasTrigger.setAttribute("aria-expanded", !isOpen);
      const arrow = areasTrigger.querySelector(".arrow-down");
      if (arrow) arrow.textContent = isOpen ? "▼" : "▲";
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
  // FORM HANDLERS (JOIN & CONTACT)
  // ================================
  const joinForm = document.getElementById("join-form");
  if (joinForm) {
    joinForm.addEventListener("submit", function(e) {
      e.preventDefault();
      if (document.getElementById("honeypot-join").value !== "") return;
      grecaptcha.ready(function() {
        grecaptcha.execute('6LfAOV0rAAAAAPBGgn2swZWj5SjANoQ4rUH6XIMz', { action: 'submit' }).then(function(token) {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = "recaptcha_token";
          input.value = token;
          joinForm.appendChild(input);
          joinForm.submit();
        });
      });
    });
  }

  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function(e) {
      e.preventDefault();
      if (document.getElementById("honeypot-contact").value !== "") return;
      grecaptcha.ready(function() {
        grecaptcha.execute('6LfAOV0rAAAAAPBGgn2swZWj5SjANoQ4rUH6XIMz', { action: 'submit' }).then(function(token) {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = "recaptcha_token";
          input.value = token;
          contactForm.appendChild(input);
          contactForm.submit();
        });
      });
    });
  }
});
