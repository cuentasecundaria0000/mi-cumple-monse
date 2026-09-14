/* =========================================================
   CONFIGURACIÓN PRINCIPAL
========================================================= */

const CONFIG = {
    eventDate: "September 19, 2026 15:00:00",
    whatsappNumber: "5210000000000",
    openingDelay: 1850,

    photos: [
        "img/img1.png",
        "img/img2.png",
        "img/img3.png",
        "img/img4.png",
        "img/img5.png",
        "img/img6.png",
        "img/img7.png"
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
document.body.style.position = "fixed";
document.body.style.width = "100%";
document.body.style.top = "0";
document.body.style.left = "0";

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

        // Libera el bloqueo de scroll
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.width = "";
        document.body.style.top = "";
        document.body.style.left = "";

        // Fuerza el inicio de la página, con varios intentos
        // para asegurar que quede al tope aunque el navegador
        // aplique el layout con un frame de retraso.
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        requestAnimationFrame(() => {
            window.scrollTo(0, 0);

            requestAnimationFrame(() => {
                window.scrollTo(0, 0);
            });
        });

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

```javascript
/* =========================================================
   MÚSICA
========================================================= */

let musicWasPlaying = false;

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

/* =========================================================
   REPRODUCIR MÚSICA
========================================================= */

function tryPlayMusic() {
    if (!music) return;

    music.volume = 0.55;

    music.play()
        .then(() => {
            musicWasPlaying = true;
            updateMusicButton(true);
        })
        .catch(() => {
            musicWasPlaying = false;
            updateMusicButton(false);
        });
}

/* =========================================================
   BOTÓN DE MÚSICA
========================================================= */

if (musicButton && music) {
    musicButton.addEventListener("click", () => {

        if (music.paused) {

            music.play()
                .then(() => {
                    musicWasPlaying = true;
                    updateMusicButton(true);
                })
                .catch(() => {
                    updateMusicButton(false);
                });

        } else {

            music.pause();

            // El usuario la pausó manualmente
            musicWasPlaying = false;

            updateMusicButton(false);
        }
    });
}

/* =========================================================
   PAUSAR CUANDO SE SALE DE LA INVITACIÓN
========================================================= */

document.addEventListener("visibilitychange", () => {

    if (!music) return;

    if (document.hidden) {

        // Guardamos si estaba sonando antes de salir
        if (!music.paused) {
            musicWasPlaying = true;
            music.pause();
        }

    } else {

        // Al regresar, solamente continúa si estaba reproduciéndose
        if (musicWasPlaying && invitationOpened) {

            music.play()
                .then(() => {
                    updateMusicButton(true);
                })
                .catch(() => {
                    updateMusicButton(false);
                });

        }
    }
});

/* =========================================================
   CUANDO LA PÁGINA SE DESCARGA O SE ABANDONA
========================================================= */

window.addEventListener("pagehide", () => {

    if (!music) return;

    music.pause();
    music.currentTime = music.currentTime;
    musicWasPlaying = false;

});
```

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

/* =========================================================
   CARRUSEL DE FOTOS (formato pos0-pos5 + puntitos)
   Genera las imágenes y los puntos de paginación desde
   CONFIG.photos dentro de:
   <div class="carousel-xv">
     <div class="carousel-track"></div>
     <div class="carousel-dots"></div>
   </div>

   Reparte las fotos de forma simétrica alrededor del centro
   sin importar cuántas sean (1, 3, 4, 6, 10...), evitando que
   una misma foto aparezca dos veces a la vez.
========================================================= */

function initCarousel() {
    const carouselTrack = document.querySelector(".carousel-track");
    const carouselDots = document.querySelector(".carousel-dots");

    if (!carouselTrack || !CONFIG.photos || !CONFIG.photos.length) return;

    const photos = CONFIG.photos;
    const total = photos.length;

    // Genera las imágenes
    carouselTrack.innerHTML = "";

    const fotos = photos.map((src, index) => {
        const img = document.createElement("img");
        img.src = src;
        img.alt = `Foto ${index + 1}`;
        img.className = "carousel-img";
        carouselTrack.appendChild(img);
        return img;
    });

    // Genera los puntitos de paginación (uno por foto)
    let dots = [];

    if (carouselDots) {
        carouselDots.innerHTML = "";

        dots = photos.map((_, index) => {
            const dot = document.createElement("span");
            dot.className = "carousel-dot";

            dot.addEventListener("click", () => {
                center = index;
                render();
            });

            carouselDots.appendChild(dot);
            return dot;
        });
    }

    // Mapa fijo de desplazamiento (offset respecto al centro) -> clase pos
    const offsetToPos = {
        "-3": "pos0",
        "-2": "pos1",
        "-1": "pos2",
        "0": "pos3",
        "1": "pos4",
        "2": "pos5",
        "3": "pos6"
    };

    // Orden de prioridad para ir sumando fotos según cuántas haya,
    // manteniendo siempre el centro y creciendo simétricamente
    // (izquierda, derecha, izquierda, derecha...) hasta un máximo
    // de 7 fotos visibles a la vez (patrón 3-1-3).
    const priority = [0, -1, 1, -2, 2, -3, 3];
    const slotsCount = Math.min(total, 7);
    const activeOffsets = priority.slice(0, slotsCount);

    let center = 0;

    function render() {
        fotos.forEach((foto) => {
            foto.className = "carousel-img";
        });

        activeOffsets.forEach((offset) => {
            const index = ((center + offset) % total + total) % total;
            const posClass = offsetToPos[String(offset)];
            fotos[index].classList.add(posClass);
        });

        dots.forEach((dot, index) => {
            dot.classList.toggle("active", index === center);
        });
    }

    render();

    setInterval(() => {
        center = (center + 1) % total;
        render();
    }, 2500);
}

initCarousel();
