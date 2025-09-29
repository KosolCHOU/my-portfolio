// Mobile menu toggle with accessibility
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');
  
  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', function() {
      const isOpen = navMenu.classList.contains('active');
      
      navMenu.classList.toggle('active');
      
      // Update ARIA attributes
      this.setAttribute('aria-expanded', !isOpen);
      
      // Change icon
      const icon = this.querySelector('i');
      if (!isOpen) {
        icon.className = 'fas fa-times';
        // Focus management
        navMenu.querySelector('a').focus();
      } else {
        icon.className = 'fas fa-bars';
      }
    });
    
    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navMenu.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.querySelector('i').className = 'fas fa-bars';
      });
    });
    
    // Close menu on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.querySelector('i').className = 'fas fa-bars';
        mobileMenuToggle.focus();
      }
    });
  }
});

// Set footer year dynamically
document.addEventListener('DOMContentLoaded', function() {
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
  
  // Check if external resources loaded properly
  const fontAwesome = document.querySelector('link[href*="font-awesome"]');
  const googleFonts = document.querySelector('link[href*="fonts.googleapis.com"]');
  
  // Add fallbacks if external resources fail
  if (fontAwesome) {
    fontAwesome.addEventListener('error', function() {
      console.warn('Font Awesome failed to load');
      // Add fallback text for icons
      document.querySelectorAll('i[class*="fa"]').forEach(icon => {
        if (!icon.textContent.trim()) {
          const className = icon.className;
          if (className.includes('fa-bars')) icon.textContent = '☰';
          if (className.includes('fa-times')) icon.textContent = '✕';
          if (className.includes('fa-envelope')) icon.textContent = '✉';
          if (className.includes('fa-phone')) icon.textContent = '☎';
          if (className.includes('fa-map-marker')) icon.textContent = '📍';
        }
      });
    });
  }
});

// ----- Active nav link on scroll -----
const sections = [...document.querySelectorAll("section")];
const navLinks = [...document.querySelectorAll(".navbar nav a")];

// Map section id -> nav link
const linkById = navLinks.reduce((acc, a) => {
  const href = a.getAttribute("href");
  if (href && href.startsWith("#")) acc[href.slice(1)] = a;
  return acc;
}, {});

// Highlight active link
function setActive(id) {
  navLinks.forEach(a => a.classList.remove("active"));
  if (linkById[id]) linkById[id].classList.add("active");
}

// Intersection Observer to track active section
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setActive(entry.target.id);
      history.replaceState(null, "", `#${entry.target.id}`);
    }
  });
}, {
  root:null,
  threshold:0.55,
  rootMargin:"-10% 0px -35% 0px"
});

sections.forEach(sec => observer.observe(sec));

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior:"smooth", block:"start" });
    setActive(id.slice(1));
  });
});

// Set initial active link
window.addEventListener("load", () => {
  const id = (location.hash || "#hero").slice(1);
  setActive(id);
});

// Simple contact form handler (demo only)
const form = document.getElementById("contactForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    document.getElementById("formOk").style.display = "block";
    form.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

// Enhanced Formspree handler with validation
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  // Real-time validation
  const fields = {
    name: document.getElementById('name'),
    email: document.getElementById('email_i'),
    subject: document.getElementById('subject'),
    message: document.getElementById('message')
  };
  
  // Validation functions
  function validateField(field, value) {
    const errors = [];
    
    switch(field) {
      case 'name':
        if (value.length < 2) errors.push('Name must be at least 2 characters');
        if (value.length > 50) errors.push('Name must be less than 50 characters');
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) errors.push('Please enter a valid email address');
        break;
      case 'subject':
        if (value.length < 3) errors.push('Subject must be at least 3 characters');
        if (value.length > 100) errors.push('Subject must be less than 100 characters');
        break;
      case 'message':
        if (value.length < 10) errors.push('Message must be at least 10 characters');
        if (value.length > 1000) errors.push('Message must be less than 1000 characters');
        break;
    }
    
    return errors;
  }
  
  // Add real-time validation
  Object.keys(fields).forEach(fieldName => {
    const field = fields[fieldName];
    if (field) {
      field.addEventListener('blur', function() {
        const errors = validateField(fieldName, this.value.trim());
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        if (errorElement) {
          errorElement.textContent = errors[0] || '';
        }
      });
    }
  });
  
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formOk = document.getElementById("formOk");
    const formStatus = document.getElementById("formStatus");
    const submitBtn = document.getElementById("submitBtn");
    
    // Reset messages
    formOk.style.display = "none";
    formStatus.textContent = '';
    formStatus.className = 'form-status';
    
    // Validate all fields
    let hasErrors = false;
    Object.keys(fields).forEach(fieldName => {
      const field = fields[fieldName];
      if (field) {
        const errors = validateField(fieldName, field.value.trim());
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        if (errors.length > 0) {
          hasErrors = true;
          if (errorElement) {
            errorElement.textContent = errors[0];
          }
        } else if (errorElement) {
          errorElement.textContent = '';
        }
      }
    });
    
    if (hasErrors) {
      formStatus.textContent = 'Please fix the errors above before submitting.';
      formStatus.className = 'form-status error';
      return;
    }
    
    // Show loading state
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    const data = new FormData(contactForm);

    try {
      const response = await fetch(contactForm.action, {
        method: contactForm.method,
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        formOk.style.display = "block";
        formStatus.textContent = 'Message sent successfully!';
        formStatus.className = 'form-status success';
        contactForm.reset();
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      console.error(err);
      formStatus.textContent = 'Network error. Please try again later.';
      formStatus.className = 'form-status error';
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

// Experience/Education toggle
document.querySelectorAll(".xp-section .seg").forEach(btn => {
  btn.addEventListener("click", () => {
    // active button
    document.querySelectorAll(".xp-section .seg").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    // show list
    const tab = btn.dataset.tab; // 'xp' or 'edu'
    document.getElementById("xp-tab").classList.toggle("hidden", tab !== "xp");
    document.getElementById("edu-tab").classList.toggle("hidden", tab !== "edu");
  });
});

// ===== Download Page (PDF) =====
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("downloadPageBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    // Show loading state
    const originalText = btn.textContent;
    btn.textContent = "Generating PDF...";
    btn.disabled = true;

    // Add a small delay to ensure DOM is ready
    setTimeout(() => {
      try {
        // Make sure the library exists
        if (typeof window.html2pdf === "undefined") {
          // Fallback: use browser's print function
          alert("PDF library not available. Opening print dialog instead.");
          window.print();
          btn.textContent = originalText;
          btn.disabled = false;
          return;
        }

        // Create a copy of the body to modify for PDF
        const element = document.documentElement;

        // Simplified options that work better
        const opt = {
          margin: [0.5, 0.5, 0.5, 0.5],
          filename: "Chou_Kosol_Portfolio.pdf",
          image: { type: "jpeg", quality: 0.85 },
          html2canvas: { 
            scale: 1.5,
            useCORS: true,
            allowTaint: true,
            letterRendering: true,
            scrollX: 0,
            scrollY: 0
          },
          jsPDF: { 
            unit: "in", 
            format: "a4", 
            orientation: "portrait",
            compress: true
          }
        };

        // Generate PDF with proper error handling
        window.html2pdf()
          .set(opt)
          .from(element)
          .save()
          .then(() => {
            console.log("PDF generated successfully");
          })
          .catch((error) => {
            console.error("PDF generation error:", error);
            // Fallback to print dialog
            if (confirm("PDF generation failed. Would you like to use the browser's print function instead? (You can save as PDF from there)")) {
              window.print();
            }
          })
          .finally(() => {
            // Reset button state
            btn.textContent = originalText;
            btn.disabled = false;
          });

      } catch (error) {
        console.error("PDF generation failed:", error);
        // Fallback to print dialog
        if (confirm("PDF generation failed. Would you like to use the browser's print function instead? (You can save as PDF from there)")) {
          window.print();
        }
        btn.textContent = originalText;
        btn.disabled = false;
      }
    }, 500); // Increased delay to ensure library is fully loaded
  });
});
