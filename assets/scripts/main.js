document.addEventListener("DOMContentLoaded", () => {
  /*=============== SHOW/HIDE MOBILE MENU ===============*/
  const navMenu = document.getElementById("nav-menu"),
    navToggle = document.getElementById("nav-toggle"),
    navClose = document.getElementById("nav-close");

  /* Show menu */
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.add("show-menu");
    });
  }

  /* Hide menu */
  if (navClose) {
    navClose.addEventListener("click", () => {
      navMenu.classList.remove("show-menu");
    });
  }

  /* Hide menu when a link is clicked */
  const navLinks = document.querySelectorAll(".nav__link");
  function linkAction() {
    navMenu.classList.remove("show-menu");
  }
  navLinks.forEach((n) => n.addEventListener("click", linkAction));

  /*=============== STICKY HEADER ON SCROLL ===============*/
  const header = document.getElementById("header");
  function scrollHeader() {
    if (this.scrollY >= 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", scrollHeader);

  /*=============== LIGHT/DARK THEME TOGGLE ===============*/
  const themeToggleButton = document.querySelector(".theme-toggle");
  const themeIcon = document.querySelector(".theme-toggle__icon");
  const currentTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  // Set initial theme based on localStorage > system preference > default (light)
  if (currentTheme) {
    document.documentElement.setAttribute("data-theme", currentTheme);
    if (currentTheme === "dark") {
      themeIcon.classList.replace("bx-moon", "bx-sun");
    }
  } else if (prefersDark) {
    document.documentElement.setAttribute("data-theme", "dark");
    themeIcon.classList.replace("bx-moon", "bx-sun");
  }

  themeToggleButton.addEventListener("click", () => {
    const theme = document.documentElement.getAttribute("data-theme");
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "light");
      themeIcon.classList.replace("bx-sun", "bx-moon");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      themeIcon.classList.replace("bx-moon", "bx-sun");
      localStorage.setItem("theme", "dark");
    }
  });

  /*=============== SCROLL-REVEAL ANIMATION ===============*/
  const scrollElements = document.querySelectorAll(".anim-on-scroll");

  const elementObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          elementObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  scrollElements.forEach((el) => {
    elementObserver.observe(el);
  });

  /*=============== STATS COUNTER ANIMATION ===============*/
  const statsNumbers = document.querySelectorAll(".stats__number");
  const statsSection = document.getElementById("impact");

  const countUp = (el) => {
    const target = +el.getAttribute("data-target");
    const duration = 2000; // 2 seconds
    let current = 0;
    const increment = target / (duration / 16);

    const updateCount = () => {
      current += increment;
      if (current < target) {
        el.innerText = Math.ceil(current);
        requestAnimationFrame(updateCount);
      } else {
        el.innerText = target;
      }
    };
    requestAnimationFrame(updateCount);
  };

  const statsObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          statsNumbers.forEach((number) => countUp(number));
          observer.unobserve(entry.target); // Stop observing after animation
        }
      });
    },
    { threshold: 0.5 }
  );

  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  /*=============== SET CURRENT YEAR IN FOOTER ===============*/
  const yearSpan = document.getElementById("current-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  /*=============== ACTIVE NAV LINK ON SCROLL ===============*/
  const sections = document.querySelectorAll("section[id]");

  function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight,
        sectionTop = current.offsetTop - 58,
        sectionId = current.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document
          .querySelector(".nav__menu a[href*=" + sectionId + "]")
          .classList.add("active-link");
      } else {
        document
          .querySelector(".nav__menu a[href*=" + sectionId + "]")
          .classList.remove("active-link");
      }
    });
  }
  window.addEventListener("scroll", scrollActive);

  /*=============== SHOW SCROLL UP BUTTON ===============*/
  const scrollUpButton = document.getElementById("scroll-up");

  function showScrollUp() {
    if (this.scrollY >= 400) {
      scrollUpButton.classList.add("show-scroll");
    } else {
      scrollUpButton.classList.remove("show-scroll");
    }
  }
  window.addEventListener("scroll", showScrollUp);

  /*=============== FAQ ACCORDION ===============*/
  const faqItems = document.querySelectorAll(".faq__item");

  faqItems.forEach((item) => {
    const faqHeader = item.querySelector(".faq__header");

    faqHeader.addEventListener("click", () => {
      const openItem = document.querySelector(".faq-open");

      // Close already open item if it exists and is not the current item
      if (openItem && openItem !== item) {
        openItem.classList.remove("faq-open");
      }

      // Toggle the current item
      item.classList.toggle("faq-open");
    });
  });

  /*=============== CONTACT FORM LOGIC ===============*/
  const handleFormSubmit = (formId) => {
    const form = document.getElementById(formId);
    if (!form) return;

    const formStatus = document.getElementById("form-status-" + formId);

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const data = {
        name: formData.get("name"),
        email: formData.get("email"),
        subject: formData.get("subject"),
        message: formData.get("message"),
      };

      // Reset status and show "pending" message
      formStatus.classList.remove("success", "error");
      formStatus.classList.add("pending", "visible");
      formStatus.textContent = "Sending...";

      try {
        const response = await fetch("/api/send-email", {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          formStatus.classList.remove("pending");
          formStatus.classList.add("success");
          formStatus.textContent = "Thank you! Your message has been sent.";
          form.reset();
        } else {
          throw new Error("Server responded with an error.");
        }
      } catch (error) {
        console.error("Form submission error:", error);
        formStatus.classList.remove("pending");
        formStatus.classList.add("error");
        formStatus.textContent = "Sorry, there was an error. Please try again.";
      }
    });
  };

  // Initialize both forms with their unique IDs
  handleFormSubmit("contact-form-main");
  handleFormSubmit("contact-form-involved");
});
