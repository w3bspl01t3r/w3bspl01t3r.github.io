(function () {
  "use strict";

  const researchPages = new Set([
    "CVE-2025-10492.html",
    "CVE-2025-11466.html",
    "CVE-2025-60785.html",
    "CVE-2025-60786.html",
    "CVE-2025-6216.html",
    "CVE-2025-xxxx.html"
  ]);
  const technicalPages = new Set([
    "BeanShell1.html",
    "BeanValidationToRce.html",
    "CommonsBeanUtils1.html",
    "CommonsCollection1.html",
    "CommonsCollection2.html",
    "CommonsCollection3.html",
    "CommonsCollection4.html",
    "CommonsCollection5.html",
    "CommonsCollection6.html",
    "CommonsCollection7.html",
    "GPGBypass.html",
    "Groovy1.html",
    "HackingJWT.html",
    "InsecureDeserialization.html",
    "JDBCInjection.html",
    "JNDIToRCE.html",
    "beyondcommoncollections.html",
    "customgadget.html",
    "ysoserial.html"
  ]);
  const technicalArticleDetails = {
    "BeanValidationToRce.html": {
      lead: "Tracing unsafe Bean Validation message interpolation from attacker-controlled input to expression evaluation and code execution.",
      focus: "Bean Validation",
      series: "Java application security"
    },
    "GPGBypass.html": {
      lead: "A practical examination of signature-verification mistakes and the conditions that can turn a trust bypass into code execution.",
      focus: "Signature verification",
      series: "Application security"
    },
    "HackingJWT.html": {
      lead: "Testing JSON Web Token implementations for algorithm confusion, key handling flaws, and unsafe verification behavior.",
      focus: "Token security",
      series: "Authentication"
    },
    "JDBCInjection.html": {
      lead: "Following attacker-controlled JDBC configuration through driver behavior and into remote code execution paths.",
      focus: "JDBC configuration",
      series: "Java application security"
    },
    "JNDIToRCE.html": {
      lead: "A technical walkthrough of JNDI injection, lookup behavior, JDK constraints, gadget use, and exploitation flow.",
      focus: "JNDI injection",
      series: "Java exploitation"
    },
    "InsecureDeserialization.html": {
      lead: "Understanding Java object serialization, unsafe reconstruction of untrusted data, gadget chains, exploitation, and defensive controls.",
      focus: "Deserialization",
      series: "Java security"
    },
    "ysoserial.html": {
      lead: "A deeper look at CommonsCollections gadget chains, with an emphasis on why each link in the execution path works.",
      focus: "Gadget internals",
      series: "Java deserialization"
    },
    "beyondcommoncollections.html": {
      lead: "A method for reasoning about gadget-chain anatomy and finding useful execution paths beyond familiar libraries.",
      focus: "Gadget discovery",
      series: "Java deserialization"
    },
    "customgadget.html": {
      lead: "A focused lab note on constructing, tracing, and understanding a custom Java deserialization gadget chain.",
      focus: "Custom gadgets",
      series: "Java deserialization"
    },
    "CommonsCollection1.html": {
      lead: "Transformer chains, lazy maps, proxies, and the invocation flow behind the classic CommonsCollections1 payload.",
      focus: "Transformer chain",
      series: "Gadget-chain lab"
    },
    "CommonsCollection2.html": {
      lead: "Priority queues, transforming comparators, and the path from deserialization to malicious template execution.",
      focus: "PriorityQueue",
      series: "Gadget-chain lab"
    },
    "CommonsCollection3.html": {
      lead: "An alternate Commons Collections composition using factories, transformers, and template-based execution.",
      focus: "InstantiateTransformer",
      series: "Gadget-chain lab"
    },
    "CommonsCollection4.html": {
      lead: "Updated Commons Collections primitives and the execution flow that turns comparator behavior into a gadget chain.",
      focus: "Collections4",
      series: "Gadget-chain lab"
    },
    "CommonsCollection5.html": {
      lead: "Tied map entries, nested map access, and the object interactions that trigger the CommonsCollections5 chain.",
      focus: "TiedMapEntry",
      series: "Gadget-chain lab"
    },
    "CommonsCollection6.html": {
      lead: "Hash-based triggering, transformed map values, and the deserialization path used by CommonsCollections6.",
      focus: "Hash triggering",
      series: "Gadget-chain lab"
    },
    "CommonsCollection7.html": {
      lead: "Hashtable collision behavior and transformed values used as the trigger for the CommonsCollections7 chain.",
      focus: "Hashtable collision",
      series: "Gadget-chain lab"
    },
    "CommonsBeanUtils1.html": {
      lead: "Property comparison, PriorityQueue ordering, and template execution through Apache Commons BeanUtils.",
      focus: "BeanComparator",
      series: "Gadget-chain lab"
    },
    "BeanShell1.html": {
      lead: "Dynamic proxies, BeanShell interpreter behavior, and the invocation path behind the BeanShell1 gadget chain.",
      focus: "Dynamic proxy",
      series: "Gadget-chain lab"
    },
    "Groovy1.html": {
      lead: "Method closures, converted closures, proxy invocation, and the execution path behind the Groovy1 gadget chain.",
      focus: "Groovy closures",
      series: "Gadget-chain lab"
    }
  };
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const isTechnicalArticle = technicalPages.has(currentPage);

  let placeholder = document.getElementById("navigation-placeholder");
  if (!placeholder && isTechnicalArticle) {
    placeholder = document.createElement("div");
    placeholder.id = "navigation-placeholder";
    const firstContent = document.body.firstElementChild;
    document.body.insertBefore(placeholder, firstContent);
  }

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
    let activePage = currentPage;
    if (researchPages.has(currentPage)) {
      activePage = "research.html";
    } else if (technicalPages.has(currentPage)) {
      activePage = "blogs.html";
    } else if (currentPage === "policy.html") {
      activePage = "contact.html";
    }

    document.querySelectorAll("#site-navigation a").forEach(function (link) {
      const linkPage = link.getAttribute("href").split("/").pop();
      if (linkPage === activePage) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function createMetaItem(label, value) {
    const item = document.createElement("div");
    item.className = "article-meta-item";

    const itemLabel = document.createElement("span");
    itemLabel.textContent = label;
    const itemValue = document.createElement("strong");
    itemValue.textContent = value;

    item.append(itemLabel, itemValue);
    return item;
  }

  function hasMeaningfulContent(element) {
    return Array.from(element.childNodes).some(function (node) {
      return node.nodeType === Node.ELEMENT_NODE ||
        (node.nodeType === Node.TEXT_NODE && node.textContent.trim());
    });
  }

  function modernizeTechnicalArticle() {
    if (!isTechnicalArticle) {
      return;
    }

    document.documentElement.classList.add("technical-article-document");
    document.body.classList.add("technical-article-page");

    Array.from(document.body.children).forEach(function (element) {
      if (element.tagName === "HEADER" && !element.classList.contains("site-header")) {
        element.remove();
      }
    });

    if (!document.querySelector(".skip-link")) {
      const skipLink = document.createElement("a");
      skipLink.className = "skip-link";
      skipLink.href = "#main-content";
      skipLink.textContent = "Skip to content";
      document.body.insertBefore(skipLink, placeholder);
    }

    let main = document.querySelector("main");
    if (!main) {
      const legacyContainer = document.querySelector(".container");
      if (legacyContainer) {
        main = document.createElement("main");
        while (legacyContainer.firstChild) {
          main.appendChild(legacyContainer.firstChild);
        }
        legacyContainer.replaceWith(main);
      }
    }

    if (!main || main.dataset.modernized === "true") {
      return;
    }

    let heading = main.querySelector("h1, h2");
    if (!heading) {
      return;
    }
    if (heading.tagName !== "H1") {
      const promotedHeading = document.createElement("h1");
      if (heading.id) {
        promotedHeading.id = heading.id;
      }
      while (heading.firstChild) {
        promotedHeading.appendChild(heading.firstChild);
      }
      heading.replaceWith(promotedHeading);
      heading = promotedHeading;
    }

    const detail = technicalArticleDetails[currentPage] || {
      lead: "A technical security note from ZDayLabs.",
      focus: "Security research",
      series: "Technical notes"
    };
    const remainingContent = Array.from(main.childNodes).filter(function (node) {
      return node !== heading;
    });

    main.dataset.modernized = "true";
    main.id = "main-content";
    main.className = "research-article technical-article";

    const backLink = document.createElement("a");
    backLink.className = "article-back";
    backLink.href = "/blogs.html";
    backLink.textContent = "<- All technical notes";

    const articleHeader = document.createElement("header");
    articleHeader.className = "article-header";

    const eyebrow = document.createElement("p");
    eyebrow.className = "eyebrow";
    eyebrow.textContent = "Technical note";
    heading.removeAttribute("style");

    const lead = document.createElement("p");
    lead.className = "article-lead";
    lead.textContent = detail.lead;

    const metadata = document.createElement("div");
    metadata.className = "article-meta-grid";
    metadata.append(
      createMetaItem("Category", "Technical note"),
      createMetaItem("Focus", detail.focus),
      createMetaItem("Series", detail.series),
      createMetaItem("Audience", "Security engineers")
    );
    articleHeader.append(eyebrow, heading, lead, metadata);

    const articleBody = document.createElement("div");
    articleBody.className = "article-body";
    let section = document.createElement("section");
    section.className = "article-section technical-content";

    remainingContent.forEach(function (node) {
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "H2" && hasMeaningfulContent(section)) {
        articleBody.appendChild(section);
        section = document.createElement("section");
        section.className = "article-section technical-content";
      }
      section.appendChild(node);
    });
    if (hasMeaningfulContent(section)) {
      articleBody.appendChild(section);
    }

    main.replaceChildren(backLink, articleHeader, articleBody);

    Array.from(document.body.children).forEach(function (element) {
      if (element.tagName === "FOOTER" && !element.classList.contains("site-footer")) {
        element.remove();
      }
    });

    if (!document.querySelector(".site-footer")) {
      const footer = document.createElement("footer");
      footer.className = "site-footer";
      footer.innerHTML = '<div class="site-container footer-bottom"><span>© 2026 ZDayLabs</span><span><a href="/blogs.html">Technical notes</a> · <a href="/contact.html">Contact</a></span></div>';
      document.body.appendChild(footer);
    }
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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", modernizeTechnicalArticle);
  } else {
    modernizeTechnicalArticle();
  }
})();
