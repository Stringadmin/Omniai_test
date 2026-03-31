(() => {
    const modal = document.getElementById("downloadModal");

    if (!modal) {
        return;
    }

    const urls = {
        r112: "aHR0cHM6Ly9zdHJpbmd0ZXN0Lm9zcy1jbi1oYW5nemhvdS5hbGl5dW5jcy5jb20vd2Fud3VrZWFpLXNldHVwLTEuMS4yLmV4ZQ==",
        r110: "aHR0cHM6Ly9zdHJpbmd0ZXN0Lm9zcy1jbi1oYW5nemhvdS5hbGl5dW5jcy5jb20vd2Fud3VrZWFpLXNldHVwLTEuMS4wLmV4ZQ==",
        r100: "aHR0cHM6Ly9zdHJpbmd0ZXN0Lm9zcy1jbi1oYW5nemhvdS5hbGl5dW5jcy5jb20vd2Fud3VrZWFpLXNldHVwLTEuMC4wLmV4ZQ==",
        v10: "aHR0cHM6Ly9zdHJpbmd0ZXN0Lm9zcy1jbi1oYW5nemhvdS5hbGl5dW5jcy5jb20vJUU0JUI4JTg3JUU3JTg5JUE5JUU1JThGJUFGJUU3JTg4JUIxJTIwU2V0dXAlMjBWMTAuMC4wLmV4ZQ==",
        v9: "aHR0cHM6Ly9zdHJpbmd0ZXN0Lm9zcy1jbi1oYW5nemhvdS5hbGl5dW5jcy5jb20vJUU0JUI4JTg3JUU3JTg5JUE5JUU1JThGJUFGJUU3JTg4JUIxJTIwU2V0dXAlMjBWOS4wLjAuZXhl",
        v8: "aHR0cHM6Ly9zdHJpbmd0ZXN0Lm9zcy1jbi1oYW5nemhvdS5hbGl5dW5jcy5jb20vJUU0JUI4JTg3JUU3JTg5JUE5JUU1JThGJUFGJUU3JTg4JUIxJTIwU2V0dXAlMjBWOC4wLjAuZXhl",
        v7: "aHR0cHM6Ly9zdHJpbmd0ZXN0Lm9zcy1jbi1oYW5nemhvdS5hbGl5dW5jcy5jb20vJUU0JUI4JTg3JUU3JTg5JUE5JUU1JThGJUFGJUU3JTg4JUIxJTIwU2V0dXAlMjBWNy4wLjAuZXhl",
        v6: "aHR0cHM6Ly9zdHJpbmd0ZXN0Lm9zcy1jbi1oYW5nemhvdS5hbGl5dW5jcy5jb20vJUU0JUI4JTg3JUU3JTg5JUE5JUU1JThGJUFGJUU3JTg4JUIxJTIwU2V0dXAlMjBWNi4wLjAuZXhl",
        v5: "aHR0cHM6Ly9zdHJpbmd0ZXN0Lm9zcy1jbi1oYW5nemhvdS5hbGl5dW5jcy5jb20vJUU0JUI4JTg3JUU3JTg5JUE5JUU1JThGJUFGJUU3JTg4JUIxJTIwU2V0dXAlMjBWNS4wLjAuZXhl",
        v4: "aHR0cHM6Ly9zdHJpbmd0ZXN0Lm9zcy1jbi1oYW5nemhvdS5hbGl5dW5jcy5jb20vJUU0JUI4JTg3JUU3JTg5JUE5JUU1JThGJUFGJUU3JTg4JUIxJTIwU2V0dXAlMjBWNC4wLjAuZXhl"
    };

    const passwordCode = [111, 109, 110, 105, 97, 105, 50, 48, 50, 54];
    const passwordInput = document.getElementById("downloadPassword");
    const passwordError = document.getElementById("passwordError");
    const closeButton = document.getElementById("closeModal");
    const cancelButton = document.getElementById("cancelModal");
    const confirmButton = document.getElementById("confirmDownload");
    const triggers = Array.from(document.querySelectorAll("[data-download-version]"));

    let currentVersion = "";
    let lastTrigger = null;
    let lastActionTime = 0;

    const decodeUrl = (value) => {
        try {
            return atob(value);
        } catch {
            return "";
        }
    };

    const decodePassword = () => String.fromCharCode(...passwordCode);

    const isRateLimited = () => {
        const now = Date.now();

        if (now - lastActionTime < 1800) {
            return true;
        }

        lastActionTime = now;
        return false;
    };

    const getFocusableElements = () => Array.from(
        modal.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])")
    ).filter((element) => !element.hasAttribute("disabled"));

    const showError = () => {
        passwordError.classList.add("is-visible");
        passwordInput.value = "";
        passwordInput.focus();
    };

    const hideError = () => {
        passwordError.classList.remove("is-visible");
    };

    const openModal = (version, trigger) => {
        if (isRateLimited()) {
            return;
        }

        currentVersion = version;
        lastTrigger = trigger || null;
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
        hideError();
        passwordInput.value = "";
        window.setTimeout(() => passwordInput.focus(), 80);
    };

    const closeModal = () => {
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
        hideError();
        currentVersion = "";

        if (lastTrigger) {
            lastTrigger.focus();
        }
    };

    const verifyPassword = () => {
        if (passwordInput.value !== decodePassword()) {
            showError();
            return;
        }

        const url = decodeUrl(urls[currentVersion]);
        closeModal();

        if (url) {
            window.location.href = url;
        }
    };

    triggers.forEach((trigger) => {
        trigger.addEventListener("click", () => {
            openModal(trigger.dataset.downloadVersion || "", trigger);
        });
    });

    closeButton.addEventListener("click", closeModal);
    cancelButton.addEventListener("click", closeModal);
    confirmButton.addEventListener("click", verifyPassword);

    passwordInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            verifyPassword();
        }
    });

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    modal.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeModal();
            return;
        }

        if (event.key !== "Tab") {
            return;
        }

        const focusable = getFocusableElements();

        if (!focusable.length) {
            return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    });
})();
