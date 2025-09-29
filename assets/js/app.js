// Set footer year dynamically
document.getElementById("year").textContent = new Date().getFullYear();

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

// Enhanced Formspree handler
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formOk = document.getElementById("formOk");
    formOk.style.display = "none"; // reset message

    const data = new FormData(contactForm);

    try {
      const response = await fetch(contactForm.action, {
        method: contactForm.method,
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        formOk.style.display = "block";    // show success
        contactForm.reset();               // clear form
      } else {
        alert("❌ Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Network error. Please try again later.");
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
