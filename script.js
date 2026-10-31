// ===== FOOTER YEAR =====
document.getElementById("year").textContent = new Date().getFullYear();

// ===== MOBILE NAVIGATION =====
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navItems = document.querySelectorAll(".nav-link");

menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", isOpen);
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
    );
    menuToggle.textContent = isOpen ? "✕" : "☰";
});

navItems.forEach((link) => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
        menuToggle.textContent = "☰";
    });
});

// ===== TYPING ANIMATION =====
const typingText = document.getElementById("typingText");
const words = [
    "I am A Student !",
    "A Creative Learner !",
    "And A Dreamer ✨"
];

let wordIndex = 0;
let charIndex = 0;
let deleting = false;

const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

function typeEffect() {
    const currentWord = words[wordIndex];

    if (deleting) {
        charIndex--;
    } else {
        charIndex++;
    }

    typingText.textContent = currentWord.substring(0, charIndex);

    let delay = deleting ? 45 : 90;

    if (!deleting && charIndex === currentWord.length) {
        deleting = true;
        delay = 1500;
    } else if (deleting && charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = 350;
    }

    setTimeout(typeEffect, delay);
}

if (reduceMotion) {
    typingText.textContent = "BSIT Student";
} else {
    typeEffect();
}

// ===== SCROLL REVEAL ANIMATION =====
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && !reduceMotion) {
    const observer = new IntersectionObserver(
        (entries, observerInstance) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observerInstance.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach((element) => {
        observer.observe(element);
    });
} else {
    revealElements.forEach((element) => {
        element.classList.add("visible");
    });
}

// ===== SCROLL PROGRESS BAR =====
const scrollProgress = document.getElementById("scrollProgress");

function updateScrollProgress() {
    const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;

    const progress = scrollableHeight > 0
        ? (window.scrollY / scrollableHeight) * 100
        : 0;

    scrollProgress.style.width = `${progress}%`;
}

window.addEventListener("scroll", updateScrollProgress, {
    passive: true
});

updateScrollProgress();

// ===== ACTIVE NAVIGATION LINK =====
const sections = document.querySelectorAll("main section[id]");

if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Ang "about" section naglakip sa slider: gamita ang slide nga naka-show karon
                    const sectionId = entry.target.id === "about"
                        ? (window.activeSlideName || "about")
                        : entry.target.id;

                    navItems.forEach((link) => {
                        const isActive =
                            link.getAttribute("href") === `#${sectionId}`;

                        link.classList.toggle("active", isActive);
                    });
                }
            });
        },
        {
            rootMargin: "-30% 0px -55% 0px"
        }
    );

    sections.forEach((section) => {
        sectionObserver.observe(section);
    });
}

// ===== CONTACT FORM VALIDATION =====
const contactForm = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");

contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
        formNote.textContent = "Please complete all fields.";
        return;
    }

    formNote.textContent =
        `Thank you, ${name}! Your form is valid, but this demo does not send messages.`;

    contactForm.reset();
});


// ===== PROFILE CARD PHOTO SLIDER =====
(function () {
    const slides = document.querySelectorAll(".photo-slider .ps-slide");
    const dotsBox = document.getElementById("psDots");

    if (!slides.length || !dotsBox) return;

    const DELAY = 3500; // 3500 = 3.5 segundos kada picture
    let current = 0;

    slides.forEach(() => dotsBox.appendChild(document.createElement("i")));
    const dots = dotsBox.children;
    dots[0].classList.add("on");

    function showSlide(next) {
        slides.forEach((s) => s.classList.remove("out"));
        slides[current].classList.remove("active");
        slides[current].classList.add("out");
        dots[current].classList.remove("on");

        current = (next + slides.length) % slides.length;

        slides[current].classList.add("active");
        dots[current].classList.add("on");
    }

    setInterval(() => showSlide(current + 1), DELAY);
})();


// ===== INTERACTIVE: tilt, bubble messages, spotlight, back-to-top =====
(function () {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 1. Photo slider mo-tilt (3D) kung i-hover
    const photoSlider = document.querySelector(".photo-slider");
    if (photoSlider && !reduce) {
        photoSlider.addEventListener("mousemove", (e) => {
            const r = photoSlider.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            photoSlider.style.transform =
                `perspective(700px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale(1.02)`;
        });
        photoSlider.addEventListener("mouseleave", () => {
            photoSlider.style.transform = "";
        });
    }

    // 2. "Keep shining!" i-click = bag-ong message + sparkles
    const bubble = document.querySelector(".floating-bubble");
    const messages = ["Keep shining!", "You got this! 💪", "Dream big ✨", "Believe in yourself 💜", "Keep learning 📚", "Stay inspired ♡"];
    let m = 0;

    function sparkles(x, y) {
        if (reduce) return;
        const icons = ["✦", "✧", "♡", "✨"];
        for (let i = 0; i < 12; i++) {
            const s = document.createElement("span");
            s.textContent = icons[Math.floor(Math.random() * icons.length)];
            s.style.cssText = `position:fixed;left:${x}px;top:${y}px;z-index:500;pointer-events:none;` +
                `font-size:${14 + Math.random() * 14}px;color:${["#8B5CF6", "#E0559B", "#5B3FD6", "#FF7DB5"][i % 4]}`;
            document.body.appendChild(s);
            const a = Math.random() * Math.PI * 2, d = 50 + Math.random() * 80;
            s.animate(
                [{ transform: "translate(0,0) scale(1)", opacity: 1 },
                 { transform: `translate(${Math.cos(a) * d}px,${Math.sin(a) * d}px) scale(.3)`, opacity: 0 }],
                { duration: 900 + Math.random() * 400, easing: "ease-out" }
            ).onfinish = () => s.remove();
        }
    }

    if (bubble) {
        bubble.setAttribute("role", "button");
        bubble.setAttribute("tabindex", "0");
        const next = () => {
            m = (m + 1) % messages.length;
            bubble.textContent = messages[m];
            const r = bubble.getBoundingClientRect();
            sparkles(r.left + r.width / 2, r.top + r.height / 2);
        };
        bubble.addEventListener("click", next);
        bubble.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); next(); }
        });
    }

    // 3. Spotlight nga mosunod sa mouse sa sulod sa cards
    document.querySelectorAll(".info-card").forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            const r = card.getBoundingClientRect();
            card.style.setProperty("--mx", `${e.clientX - r.left}px`);
            card.style.setProperty("--my", `${e.clientY - r.top}px`);
        });
    });

    // 4. Back-to-top button (mogawas kung naka-scroll na)
    const topBtn = document.createElement("button");
    topBtn.className = "back-to-top-btn";
    topBtn.setAttribute("aria-label", "Back to top");
    topBtn.textContent = "↑";
    document.body.appendChild(topBtn);
    topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    window.addEventListener("scroll", () => {
        topBtn.classList.toggle("show", window.scrollY > 500);
    }, { passive: true });
})();


// ===== ABOUT / SKILLS / HOBBIES SLIDER =====
(function () {
    const slider = document.getElementById("mainSlider");
    const track = document.getElementById("slTrack");
    const dotsBox = document.getElementById("slDots");
    if (!slider || !track || !dotsBox) return;

    const slides = Array.from(track.children);
    const names = slides.map((s) => s.dataset.name); // about, skills, hobbies, motto
    const navAnchors = document.querySelectorAll(".nav-link");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const AUTO_DELAY = 6000; // 6 segundos kada slide
    let current = 0;
    let timer = null;

    // dots
    const dots = slides.map((_, i) => {
        const b = document.createElement("button");
        b.setAttribute("aria-label", `Go to ${names[i]} slide`);
        b.addEventListener("click", () => { goTo(i); restartAuto(); });
        dotsBox.appendChild(b);
        return b;
    });

    function goTo(i, updateNav = true) {
        current = (i + slides.length) % slides.length;
        window.activeSlideName = names[current];
        track.style.transform = `translateX(-${current * 100}%)`;

        slides.forEach((s, idx) => {
            s.toggleAttribute("inert", idx !== current); // dili ma-tab ang hidden slides
            s.setAttribute("aria-hidden", idx !== current);
            s.classList.toggle("is-active", idx === current); // trigger sa motto animation
        });
        dots.forEach((d, idx) => d.classList.toggle("on", idx === current));

        // sa katapusan nga slide, ang right arrow mahimong "balik sa first"
        const isLast = current === slides.length - 1;
        nextBtn.classList.toggle("restart", isLast);
        nextBtn.textContent = isLast ? "↺" : "›";
        nextBtn.setAttribute("aria-label", isLast ? "Back to first slide" : "Next slide");
        nextBtn.title = isLast ? "Back to first slide" : "Next slide";

        if (updateNav) {
            navAnchors.forEach((l) =>
                l.classList.toggle("active", l.getAttribute("href") === `#${names[current]}`)
            );
        }
    }

    // Arrows: left/right, ug sa katapusan mo-balik sa first slide
    const prevBtn = document.getElementById("slPrev");
    const nextBtn = document.getElementById("slNext");
    prevBtn.addEventListener("click", () => { goTo(current - 1); restartAuto(); });
    nextBtn.addEventListener("click", () => { goTo(current + 1); restartAuto(); });

    // keyboard arrows (kung naka-focus sa slider)
    slider.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") { goTo(current - 1); restartAuto(); }
        if (e.key === "ArrowRight") { goTo(current + 1); restartAuto(); }
    });

    // swipe sa cellphone
    let startX = 0;
    slider.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener("touchend", (e) => {
        const diff = e.changedTouches[0].clientX - startX;
        if (Math.abs(diff) > 50) { goTo(diff < 0 ? current + 1 : current - 1); restartAuto(); }
    }, { passive: true });

    // Nav links: Skills ug Hobbies mo-slide sa tama nga slide
    navAnchors.forEach((link) => {
        const target = link.getAttribute("href").replace("#", "");
        const idx = names.indexOf(target);
        if (idx === -1) return;
        link.addEventListener("click", (e) => {
            e.preventDefault();
            goTo(idx);
            document.getElementById("about").scrollIntoView({ behavior: "smooth" });
            restartAuto();
        });
    });

    // AUTO-SLIDE: mo-slide ra siya ug iyaha, ug mohunong sa katapusan (motto)
    let visible = false;

    function tick() {
        if (current >= slides.length - 1) { stopAuto(); return; } // hunong sa motto
        goTo(current + 1);
    }
    function startAuto() {
        stopAuto();
        if (reduce || !visible || current >= slides.length - 1) return;
        timer = setInterval(tick, AUTO_DELAY);
    }
    function stopAuto() { clearInterval(timer); }
    function restartAuto() { startAuto(); }

    // Magsugod lang ang auto-slide kung makita na ang slider sa screen
    if ("IntersectionObserver" in window) {
        new IntersectionObserver((entries) => {
            visible = entries[0].isIntersecting;
            visible ? startAuto() : stopAuto();
        }, { threshold: 0.35 }).observe(slider);
    } else {
        visible = true;
    }

    // I-open ang slide base sa URL (e.g. #hobbies)
    const hashIdx = names.indexOf(location.hash.replace("#", ""));
    goTo(hashIdx === -1 ? 0 : hashIdx);
    startAuto();
})();