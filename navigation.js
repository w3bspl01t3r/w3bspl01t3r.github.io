(function () {
  "use strict";

  const placeholder = document.getElementById("navigation-placeholder");
  if (!placeholder) {
    return;
  }

  const fallbackNavigation = `
    <header class="site-header">
      <div class="site-container header-inner">
        <a class="brand" href="/index.html" aria-label="ZDayLabs home">
          <span class="brand-mark" aria-hidden="true">ZD</span>
          <span class="brand-copy"><span class="brand-name">ZDayLabs</span></span>
        </a>
        <nav class="site-nav is-open" id="site-navigation" aria-label="Primary navigation">
          <a href="/index.html">Home</a>
          <a href="/services.html">Services</a>
          <a href="/engagements.html">Engagements</a>
          <a href="/research.html">Research</a>
          <a href="/blogs.html">Technical notes</a>
          <a class="nav-cta" href="/contact.html">Contact</a>
        </nav>
      </div>
    </header>`;

  function markCurrentPage() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const groups = {
      "policy.html": "contact.html"
    };
    const activePage = groups[currentPage] || currentPage;

    document.querySelectorAll("#site-navigation a").forEach(function (link) {
      const linkPage = link.getAttribute("href").split("/").pop();
      if (linkPage === activePage) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function initializeMenu() {
    const toggle = document.querySelector(".nav-toggle");
    const navigation = document.getElementById("site-navigation");

    if (!toggle || !navigation) {
      return;
    }

    function closeMenu() {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation");
      navigation.classList.remove("is-open");
    }

    toggle.addEventListener("click", function () {
      const willOpen = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(willOpen));
      toggle.setAttribute("aria-label", willOpen ? "Close navigation" : "Open navigation");
      navigation.classList.toggle("is-open", willOpen);
    });

    navigation.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
        toggle.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 820) {
        closeMenu();
      }
    });
  }

  fetch("/navigation.html")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Navigation request failed");
      }
      return response.text();
    })
    .then(function (markup) {
      placeholder.innerHTML = markup;
      markCurrentPage();
      initializeMenu();
    })
    .catch(function () {
      placeholder.innerHTML = fallbackNavigation;
      markCurrentPage();
    });
})();
