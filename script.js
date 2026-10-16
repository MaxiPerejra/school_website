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

    function initSwiper() {
        const slider = document.querySelector(".opinie-desktop");

        if (!slider || typeof window.Swiper !== "function") return;

        new window.Swiper(slider, {
            
            loop: true,
            initialSlide: 1,
            slidesPerView: 1,
            spaceBetween: 10,
            roundLengths: true,
            grabCursor: true,
            watchOverflow: true,
            keyboard: {
                enabled: true,
            },
            a11y: {
                enabled: true,
            },
            navigation: {
                nextEl: ".button-prev",
                prevEl: ".button-next",
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                    centeredSlides: true,
                },
            },
        });
    }

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


    

    initTheme();
    initMobileMenu();
    initSwiper();
    initProgressRings();
    initGalleryLightbox();


})();
