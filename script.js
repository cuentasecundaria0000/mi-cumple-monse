/* =========================================================
   CONFIGURACIÓN PRINCIPAL
========================================================= */

const CONFIG = {
    eventDate: "September 19, 2026 15:00:00",
    whatsappNumber: "5210000000000",
    openingDelay: 1850,

    photos: [
        "img/img1.jpeg",
        "img/img5.jpeg",
        "img/img3.jpeg",
        "img/img4.jpeg"
    ]
};

/* =========================================================
   ELEMENTOS PRINCIPALES
========================================================= */

const welcomeScreen = document.getElementById("welcomeScreen");
const envelopeWrapper = document.getElementById("envelopeWrapper");
const openInvitationButton = document.getElementById("openInvitation");
const invitationContent = document.getElementById("invitationContent");

const music = document.getElementById("backgroundMusic");
const musicButton = document.getElementById("musicButton");
const musicText = document.getElementById("musicText");
const musicIcon = document.getElementById("musicIcon");

let invitationOpened = false;

document.body.style.overflow = "hidden";

/* =========================================================
   APERTURA DEL SOBRE
========================================================= */

function openInvitation() {
    if (invitationOpened) return;

    invitationOpened = true;

    if (envelopeWrapper) {
        envelopeWrapper.classList.add("open");
    }

    setTimeout(() => {
        if (welcomeScreen) {
            welcomeScreen.classList.add("hidden");
        }

        if (invitationContent) {
            invitationContent.classList.add("visible");
        }

        document.body.style.overflow = "auto";
        window.scrollTo(0, 0);
        tryPlayMusic();
    }, CONFIG.openingDelay);
}

if (openInvitationButton) {
    openInvitationButton.addEventListener("click", (event) => {
        event.stopPropagation();
        openInvitation();
    });
}

if (envelopeWrapper) {
    envelopeWrapper.addEventListener("click", openInvitation);
}

/* =========================================================
   MÚSICA
========================================================= */

function updateMusicButton(isPlaying) {
    if (musicText) {
        musicText.textContent = isPlaying
            ? "Pausar música"
            : "Reproducir música";
    }

    if (musicIcon) {
        musicIcon.textContent = isPlaying ? "❚❚" : "♫";
    }
}

function tryPlayMusic() {
    if (!music) return;

    music.volume = 0.55;

    music.play()
        .then(() => updateMusicButton(true))
        .catch(() => updateMusicButton(false));
}

if (musicButton && music) {
    musicButton.addEventListener("click", () => {
        if (music.paused) {
            music.play()
                .then(() => updateMusicButton(true))
                .catch(() => updateMusicButton(false));
        } else {
            music.pause();
            updateMusicButton(false);
        }
    });
}

/* =========================================================
   CONTADOR
========================================================= */

const eventTime = new Date(CONFIG.eventDate).getTime();

function updateCountdown() {
    const countdown = document.getElementById("countdown");
    const countdownMessage = document.getElementById("countdownMessage");

    const now = Date.now();
    const distance = eventTime - now;

    if (distance <= 0) {
        if (countdown) {
            countdown.style.display = "none";
        }

        if (countdownMessage) {
            countdownMessage.textContent =
                "¡Llegó el gran día! Gracias por celebrar conmigo. 🖤✨";
        }

        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);

    const values = {
        days,
        hours,
        minutes,
        seconds
    };

    Object.entries(values).forEach(([id, value]) => {
        const element = document.getElementById(id);

        if (element) {
            element.textContent = String(value).padStart(2, "0");
        }
    });
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* =========================================================
   ANIMACIONES AL DESPLAZARSE
========================================================= */

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element) => {
    observer.observe(element);
});

/* =========================================================
   ELEMENTOS DECORATIVOS CAYENDO (ESTRELLAS / CALAVERAS / CORAZONES)
========================================================= */

function createKuromiPetal() {
    if (document.hidden) return;

    const petal = document.createElement("span");
    petal.className = "petal";

    const items = ["💀", "💜", "🖤", "✦", "🎀", "✨"];
    petal.setAttribute("data-char", items[Math.floor(Math.random() * items.length)]);

    const left = Math.random() * 100;
    const duration = 6 + Math.random() * 6;
    const drift = `${-80 + Math.random() * 160}px`;
    const scale = 0.7 + Math.random() * 0.8;

    petal.style.left = `${left}vw`;
    petal.style.animationDuration = `${duration}s`;
    petal.style.setProperty("--drift", drift);
    petal.style.transform = `scale(${scale})`;

    document.body.appendChild(petal);

    setTimeout(() => {
        petal.remove();
    }, duration * 1000);
}

setInterval(createKuromiPetal, 800);

/* =========================================================
   DATOS PERSONALIZADOS
========================================================= */

const params = new URLSearchParams(window.location.search);

const invitedGuest = params.get("invitado");
const invitedPasses = params.get("pases");
const invitedTable = params.get("mesa");

const guestNameElements = document.querySelectorAll(".guestName");

if (invitedGuest) {
    guestNameElements.forEach((element) => {
        element.textContent = invitedGuest;
    });
}

const guestPassesElement = document.getElementById("guestPasses");
const peopleWordElement = document.getElementById("peopleWord");

if (invitedPasses && guestPassesElement) {
    const passes = Math.max(1, Number(invitedPasses) || 1);

    guestPassesElement.textContent = passes;

    if (peopleWordElement) {
        peopleWordElement.textContent =
            passes === 1 ? "persona" : "personas";
    }
}

const guestTableElement = document.getElementById("guestTable");
const tableTextElement = document.getElementById("tableText");

if (invitedTable && guestTableElement && tableTextElement) {
    guestTableElement.textContent = invitedTable;
    tableTextElement.hidden = false;
}
// ============================================
// CARRUSEL DE FOTOS - ESTILO ELEGANTE
// ============================================
const gallerySwiper = new Swiper('.gallery-swiper', {
    effect: 'coverflow',

    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',

    initialSlide: 0,
    loop: true,
    loopedSlides: 4,

    // Hace que los cambios del DOM no rompan el carrusel
    observer: true,
    observeParents: true,

    // Transición más elegante
    speed: 1200,

    // Autoplay suave
    autoplay: {
        delay: 1800,
        disableOnInteraction: false,
        pauseOnMouseEnter: false,
        waitForTransition: true,
    },

    // ========================================
    // EFECTO 3D ELEGANTE
    // ========================================
    coverflowEffect: {
        rotate: 8,
        stretch: 0,
        depth: 250,
        modifier: 1.2,
        scale: 0.88,
        slideShadows: false,
    },

    // ========================================
    // PAGINACIÓN
    // ========================================
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },

    // Permite movimiento táctil suave
    touchRatio: 0.8,
    resistanceRatio: 0.65,

    // Mejora la fluidez
    watchSlidesProgress: true,
});

// ============================================
// INICIAR AUTOPLAY AL CARGAR
// ============================================
window.addEventListener('load', () => {
    setTimeout(() => {
        if (gallerySwiper && gallerySwiper.autoplay) {
            gallerySwiper.autoplay.start();
        }
    }, 500);
});
