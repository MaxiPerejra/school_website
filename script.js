(() => {
    "use strict";

    const root = document.documentElement;

    function applyTheme(theme, { persist = false } = {}) {
        const themeToggle = document.querySelector("#theme-toggle");
    
        root.dataset.theme = theme;
    
        if (themeToggle) {
            themeToggle.checked = theme === "dark";
    
            themeToggle.setAttribute(
                "aria-label",
                theme === "dark"
                    ? "Włącz jasny motyw"
                    : "Włącz ciemny motyw"
            );
        }
    
        if (persist) {
            localStorage.setItem("theme", theme);
        }
    }
    
    function setTheme(theme, { persist = false, animate = false } = {}) {
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
    
        if (
            animate &&
            document.startViewTransition &&
            !prefersReducedMotion
        ) {
            document.startViewTransition(() => {
                applyTheme(theme, { persist });
            });
    
            return;
        }
    
        applyTheme(theme, { persist });
    }
    
    function initTheme() {
        const themeToggle = document.querySelector("#theme-toggle");
    
        const savedTheme = localStorage.getItem("theme");
    
        const systemPrefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;
    
        const initialTheme =
            savedTheme ?? (systemPrefersDark ? "dark" : "light");
    
        setTheme(initialTheme);
    
        themeToggle?.addEventListener("change", () => {
            setTheme(
                themeToggle.checked ? "dark" : "light",
                {
                    persist: true,
                    animate: true,
                }
            );
        });
    }

    function initMobileMenu() {
        const menuToggle = document.querySelector("#menu-icon");
        const menuLinks = document.querySelectorAll(".nav a");

        if (!menuToggle) return;

        menuLinks.forEach((link) => {
            link.addEventListener("click", () => {
                menuToggle.checked = false;
            });
        });
    }

    function initOpinionRing() {
        const ring = document.querySelector(".opinie-ring");
    
        if (!ring) return;
    
        const stage = ring.querySelector(".opinie-ring__stage");
        const cards = [...ring.querySelectorAll(".opinie-ring__card")];
    
        const prev = ring.querySelector(".button-prev");
        const next = ring.querySelector(".button-next");
    
        const total = cards.length;
    

        let activeIndex = 1;
    
        function updateCards() {
            cards.forEach((card, index) => {
    
                const forward =
                    (index - activeIndex + total) % total;
    
                const backward =
                    (activeIndex - index + total) % total;
    
                let position = "hidden";
    
                if (forward === 0) {
                    position = "center";
    
                } else if (forward === 1) {
                    position = "right";
    
                } else if (backward === 1) {
                    position = "left";
    
                } else if (forward === 2) {
                    position = "back-right";
    
                } else if (backward === 2) {
                    position = "back-left";
                }
    
                card.dataset.position = position;
    
                const visible =
                    position === "center" ||
                    (window.innerWidth >= 1024 &&
                        (position === "left" || position === "right"));
    
                card.setAttribute(
                    "aria-hidden",
                    String(!visible)
                );
            });
        }
    
        function changeSlide(direction) {
            activeIndex =
                (activeIndex + direction + total) % total;
    
            updateCards();
        }
    
        prev.addEventListener("click", () => {
            changeSlide(-1);
        });
    
        next.addEventListener("click", () => {
            changeSlide(1);
        });
    
        
        ring.addEventListener("keydown", (event) => {
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                changeSlide(-1);
            }
    
            if (event.key === "ArrowRight") {
                event.preventDefault();
                changeSlide(1);
            }
        });
    
        
        let startX = null;
        let startY = null;
        let ignoreClick = false;
    
        stage.addEventListener("pointerdown", (event) => {
            if (event.pointerType === "mouse" && event.button !== 0) {
                return;
            }
    
            startX = event.clientX;
            startY = event.clientY;
        });
    
        stage.addEventListener("pointerup", (event) => {
            if (startX === null) return;
    
            const dx = event.clientX - startX;
            const dy = event.clientY - startY;
    
            startX = null;
            startY = null;
    
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
                changeSlide(dx < 0 ? 1 : -1);
    
                
                ignoreClick = true;
    
                setTimeout(() => {
                    ignoreClick = false;
                }, 350);
            }
        });
    
        stage.addEventListener("pointercancel", () => {
            startX = null;
            startY = null;
        });
    
        stage.addEventListener("click", (event) => {
            if (!ignoreClick) return;
    
            event.preventDefault();
            event.stopImmediatePropagation();
            ignoreClick = false;
        }, true);
    
        window.addEventListener("resize", updateCards);
    
        updateCards();
    }
    document.addEventListener("DOMContentLoaded", initOpinionRing);

    function initProgressRings() {
        const progressSection = document.querySelector("#postepy");
        const progressRings = document.querySelectorAll(".progress-ring__value");

        if (!progressSection || progressRings.length === 0) return;

        const animateRings = () => {
            progressRings.forEach((ring) => ring.classList.add("animate"));
        };

        if (!("IntersectionObserver" in window)) {
            animateRings();
            return;
        }

        const progressObserver = new IntersectionObserver(
            (entries, observer) => {
                const [entry] = entries;

                if (!entry?.isIntersecting) return;

                animateRings();
                observer.unobserve(entry.target);
            },
            {
                root: null,
                rootMargin: "-40% 0px -40% 0px",
                threshold: 0,
            }
        );

        progressObserver.observe(progressSection);
    }
    function initGalleryLightbox() {
        const images = document.querySelectorAll(".gallery-img");
        const lightbox = document.querySelector("#lightbox");
        const lightboxImg = document.querySelector("#lightbox-img");
    
        if (!lightbox || !lightboxImg) return;
    
        images.forEach((img) => {
            img.addEventListener("click", () => {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
    
                lightbox.classList.remove("hidden");
    
                requestAnimationFrame(() => {
                    lightbox.classList.add("flex");
                    lightbox.classList.remove("opacity-0");
                    lightbox.classList.add("opacity-100");
                });
            });
        });
    
        lightbox.addEventListener("click", (event) => {
            if (event.target !== lightbox) return;
    
            lightbox.classList.remove("opacity-100");
            lightbox.classList.add("opacity-0");
    
            setTimeout(() => {
                lightbox.classList.remove("flex");
                lightbox.classList.add("hidden");
            }, 300);
        });
    }


    function initDesktopMenu() {
        const menu = document.querySelector("#desktop-menu");
        const toggle = document.querySelector("#desktop-menu-toggle");
    
        if (!menu || !toggle) return;
    
        const desktop = window.matchMedia("(min-width: 1024px)");
    
        function openMenu() {
            if (!desktop.matches) return;
    
            menu.classList.add("is-open");
            toggle.setAttribute("aria-expanded", "true");
        }
    
        function closeMenu() {
            menu.classList.remove("is-open");
            toggle.setAttribute("aria-expanded", "false");
        }
    
        
        menu.addEventListener("pointerenter", (event) => {
            if (event.pointerType === "mouse") {
                openMenu();
            }
        });
    
       
        menu.addEventListener("pointerleave", (event) => {
            if (event.pointerType === "mouse") {
                closeMenu();
            }
        });
    
        
        toggle.addEventListener("click", () => {
            if (!desktop.matches) return;
    
            if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
                return;
            }
    
            if (menu.classList.contains("is-open")) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    
       
        menu.addEventListener("focusin", openMenu);
    
        menu.addEventListener("focusout", (event) => {
            if (!menu.contains(event.relatedTarget)) {
                closeMenu();
            }
        });
    
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeMenu();
            }
        });
    
        
        menu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", closeMenu);
        });
    
        
        document.addEventListener("pointerdown", (event) => {
            if (!menu.contains(event.target)) {
                closeMenu();
            }
        });
    
        desktop.addEventListener("change", closeMenu);
    }
    function initPageLoader() {
        const loader = document.getElementById("page-loader");
    
        if (!loader) return;
    
        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
    
        let finished = false;
    
        function hideLoader() {
            if (finished) return;
            finished = true;
    

            const remaining = reduceMotion
                ? 0
                : Math.max(0, 2500 - performance.now());
    
            setTimeout(() => {
                loader.classList.add("is-hidden");
    
                setTimeout(() => {
                    loader.remove();
                }, reduceMotion ? 0 : 950);
    
            }, remaining);
        }
    
        
        if (document.readyState === "complete") {
            hideLoader();
        } else {
            window.addEventListener("load", hideLoader, {
                once: true
            });
        }
    
        
        setTimeout(hideLoader, 3500);
    }


    initPageLoader();
    initDesktopMenu();
    initTheme();
    initMobileMenu();;
    initProgressRings();
    initGalleryLightbox();


})();
