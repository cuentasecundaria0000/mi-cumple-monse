/* =========================================================
   CONFIGURACIÓN
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
let musicWasPlaying = false;


/* =========================================================
   BLOQUEAR SCROLL MIENTRAS ESTÁ EL SOBRE
========================================================= */

document.body.style.overflow = "hidden";


/* =========================================================
   ABRIR INVITACIÓN
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

            /*
             * Mostramos inmediatamente todos los elementos
             * que tengan la clase reveal.
             */
            invitationContent
                .querySelectorAll(".reveal")
                .forEach((element) => {
                    element.classList.add("visible");
                });
        }

        document.body.style.overflow = "auto";

        window.scrollTo(0, 0);

        tryPlayMusic();

    }, CONFIG.openingDelay);
}


/* =========================================================
   EVENTOS DEL SOBRE
========================================================= */

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
        musicIcon.textContent = isPlaying
            ? "❚❚"
            : "♫";
    }

}


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

            musicWasPlaying = false;

            updateMusicButton(false);

        }

    });

}


/* =========================================================
   PAUSAR MÚSICA AL CAMBIAR DE PESTAÑA
========================================================= */

document.addEventListener("visibilitychange", () => {

    if (document.hidden) {

        if (music && !music.paused) {

            musicWasPlaying = true;

            music.pause();

        }

    } else {

        if (
            music &&
            musicWasPlaying &&
            invitationOpened
        ) {

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
   PAUSAR MÚSICA AL SALIR DE LA PÁGINA
========================================================= */

window.addEventListener("pagehide", () => {

    if (music) {
        music.pause();
    }

});


/* =========================================================
   CUENTA REGRESIVA
========================================================= */

const eventTime = new Date(CONFIG.eventDate).getTime();


function updateCountdown() {

    const countdown = document.getElementById("countdown");

    const countdownMessage =
        document.getElementById("countdownMessage");

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


    const days = Math.floor(
        distance / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
        (distance / (1000 * 60 * 60)) % 24
    );

    const minutes = Math.floor(
        (distance / (1000 * 60)) % 60
    );

    const seconds = Math.floor(
        (distance / 1000) % 60
    );


    const values = {
        days,
        hours,
        minutes,
        seconds
    };


    Object.entries(values).forEach(
        ([id, value]) => {

            const element =
                document.getElementById(id);

            if (element) {

                element.textContent =
                    String(value).padStart(2, "0");

            }

        }
    );

}


updateCountdown();

setInterval(updateCountdown, 1000);


/* =========================================================
   ANIMACIONES AL DESPLAZARSE
========================================================= */

const revealElements =
    document.querySelectorAll(".reveal");


if ("IntersectionObserver" in window) {

    const observer =
        new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.16
            }
        );


    revealElements.forEach((element) => {

        observer.observe(element);

    });

} else {

    /*
     * Compatibilidad con navegadores que no
     * soportan IntersectionObserver.
     */

    revealElements.forEach((element) => {

        element.classList.add("visible");

    });

}


/* =========================================================
   EFECTOS DECORATIVOS KUROMI
========================================================= */

function createKuromiPetal() {

    if (document.hidden) return;


    const petal = document.createElement("span");

    petal.className = "petal";


    const items = [
        "💀",
        "💜",
        "🖤",
        "✦",
        "🎀",
        "✨"
    ];


    petal.setAttribute(
        "data-char",
        items[
            Math.floor(
                Math.random() * items.length
            )
        ]
    );


    const left =
        Math.random() * 100;


    const duration =
        6 + Math.random() * 6;


    const drift =
        `${-80 + Math.random() * 160}px`;


    const scale =
        0.7 + Math.random() * 0.8;


    petal.style.left =
        `${left}vw`;


    petal.style.animationDuration =
        `${duration}s`;


    petal.style.setProperty(
        "--drift",
        drift
    );


    petal.style.transform =
        `scale(${scale})`;


    document.body.appendChild(petal);


    setTimeout(() => {

        petal.remove();

    }, duration * 1000);

}


setInterval(
    createKuromiPetal,
    800
);


/* =========================================================
   DATOS DEL INVITADO DESDE LA URL
========================================================= */

const params =
    new URLSearchParams(
        window.location.search
    );


const invitedGuest =
    params.get("invitado");


const invitedPasses =
    params.get("pases");


const invitedTable =
    params.get("mesa");


/* =========================================================
   NOMBRE DEL INVITADO
========================================================= */

const guestNameElements =
    document.querySelectorAll(".guestName");


if (invitedGuest) {

    guestNameElements.forEach((element) => {

        element.textContent =
            invitedGuest;

    });

}


/* =========================================================
   NÚMERO DE PASES
========================================================= */

const guestPassesElement =
    document.getElementById("guestPasses");


const peopleWordElement =
    document.getElementById("peopleWord");


if (
    invitedPasses &&
    guestPassesElement
) {

    const passes =
        Math.max(
            1,
            Number(invitedPasses) || 1
        );


    guestPassesElement.textContent =
        passes;


    if (peopleWordElement) {

        peopleWordElement.textContent =
            passes === 1
                ? "persona"
                : "personas";

    }

}


/* =========================================================
   MESA DEL INVITADO
========================================================= */

const guestTableElement =
    document.getElementById("guestTable");


const tableTextElement =
    document.getElementById("tableText");


if (
    invitedTable &&
    guestTableElement &&
    tableTextElement
) {

    guestTableElement.textContent =
        invitedTable;


    tableTextElement.hidden =
        false;

}


/* =========================================================
   CARRUSEL DE FOTOS - SWIPER
========================================================= */

/*
 * IMPORTANTE:
 * La galería actualmente está comentada en el HTML.
 *
 * Por eso primero comprobamos que exista
 * .gallery-swiper antes de intentar crear Swiper.
 */

let gallerySwiper = null;


const galleryElement =
    document.querySelector(
        ".gallery-swiper"
    );


if (
    galleryElement &&
    typeof Swiper !== "undefined"
) {

    gallerySwiper =
        new Swiper(
            ".gallery-swiper",
            {

                effect: "coverflow",

                grabCursor: true,

                centeredSlides: true,

                slidesPerView: "auto",

                initialSlide: 0,

                loop: true,

                loopedSlides: 4,

                observer: true,

                observeParents: true,

                speed: 1200,


                autoplay: {

                    delay: 1800,

                    disableOnInteraction: false,

                    pauseOnMouseEnter: false,

                    waitForTransition: true

                },


                coverflowEffect: {

                    rotate: 8,

                    stretch: 0,

                    depth: 250,

                    modifier: 1.2,

                    scale: 0.88,

                    slideShadows: false

                },


                pagination: {

                    el: ".swiper-pagination",

                    clickable: true

                },


                touchRatio: 0.8,

                resistanceRatio: 0.65,

                watchSlidesProgress: true

            }
        );


    window.addEventListener(
        "load",
        () => {

            setTimeout(() => {

                if (
                    gallerySwiper &&
                    gallerySwiper.autoplay
                ) {

                    gallerySwiper.autoplay.start();

                }

            }, 500);

        }
    );

}


/* =========================================================
   FIN DEL SCRIPT
========================================================= */
