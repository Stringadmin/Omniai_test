(() => {
    const topbar = document.getElementById("topbar");
    const mobileToggle = document.getElementById("mobileToggle");
    const mobilePanel = document.getElementById("mobilePanel");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const syncTopbar = () => {
        if (!topbar) {
            return;
        }

        topbar.classList.toggle("is-scrolled", window.scrollY > 12);
    };

    const closeMobileMenu = () => {
        if (!mobileToggle || !mobilePanel) {
            return;
        }

        mobileToggle.setAttribute("aria-expanded", "false");
        mobilePanel.classList.remove("is-open");
    };

    if (mobileToggle && mobilePanel) {
        mobileToggle.addEventListener("click", () => {
            const isExpanded = mobileToggle.getAttribute("aria-expanded") === "true";
            mobileToggle.setAttribute("aria-expanded", String(!isExpanded));
            mobilePanel.classList.toggle("is-open");
        });

        document.querySelectorAll(".mobile-links a, .nav-links a").forEach((link) => {
            link.addEventListener("click", closeMobileMenu);
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 860) {
                closeMobileMenu();
            }
        });
    }

    if (topbar) {
        syncTopbar();
        window.addEventListener("scroll", syncTopbar, { passive: true });
    }

    const revealNodes = Array.from(document.querySelectorAll("[data-reveal]"));

    if (!revealNodes.length || reduceMotion || !("IntersectionObserver" in window)) {
        revealNodes.forEach((node) => node.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.18,
        rootMargin: "0px 0px -40px 0px"
    });

    revealNodes.forEach((node) => observer.observe(node));
})();
