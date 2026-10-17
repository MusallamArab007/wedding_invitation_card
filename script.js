/* =========================================================
   WEDDING INVITATION — JAVASCRIPT
   Musallam & Iman
   ========================================================= */


/* =========================================================
   ELEMENTS
   ========================================================= */

const openButton = document.getElementById("openInvitation");
const openingScreen = document.getElementById("openingScreen");
const mainContent = document.getElementById("mainContent");


/* ============================================
   INITIAL PAGE STATE
============================================ */

document.body.style.overflow = "hidden";


/* ============================================
   OPEN INVITATION
============================================ */

document.addEventListener("DOMContentLoaded", function () {

    const openButton = document.getElementById("openInvitation");
    const openingScreen = document.getElementById("openingScreen");
    const mainContent = document.getElementById("mainContent");

    if (!openButton || !openingScreen || !mainContent) {
        console.error("Wedding invitation elements not found.");
        return;
    }

    openButton.addEventListener("click", function () {

        /* Prevent double clicks */
        if (openingScreen.classList.contains("opening")) {
            return;
        }

        /* Start opening animation */
        openingScreen.classList.add("opening");

        /*
            Give the animation time to complete,
            then reveal the main website.
        */
        setTimeout(function () {

            openingScreen.classList.add("hide");

            mainContent.classList.remove("hidden");

            document.body.style.overflow = "auto";

            window.scrollTo({
                top: 0,
                behavior: "auto"
            });

        }, 1100);

    });

});

/* =========================================================
   COUNTDOWN TIMER
   ========================================================= */

/*
    TEMPORARY NIKAH DATE & TIME

    Current temporary value:
    24 November 2026
    06:30 PM

    TODO:
    Change this when the exact Nikah
    date and time are confirmed.

    Example:

    "2026-11-24T18:30:00"
*/


const weddingDate =
    new Date("2026-11-24T18:30:00").getTime();


function updateCountdown() {

    const now = new Date().getTime();

    const difference = weddingDate - now;


    /* If wedding has started */
    if (difference <= 0) {

        document.getElementById("days").innerText = "00";
        document.getElementById("hours").innerText = "00";
        document.getElementById("minutes").innerText = "00";
        document.getElementById("seconds").innerText = "00";

        return;
    }


    /* Days */
    const days = Math.floor(
        difference /
        (1000 * 60 * 60 * 24)
    );


    /* Hours */
    const hours = Math.floor(
        (difference %
            (1000 * 60 * 60 * 24)) /
        (1000 * 60 * 60)
    );


    /* Minutes */
    const minutes = Math.floor(
        (difference %
            (1000 * 60 * 60)) /
        (1000 * 60)
    );


    /* Seconds */
    const seconds = Math.floor(
        (difference %
            (1000 * 60)) /
        1000
    );


    /* Update HTML */

    document.getElementById("days").innerText =
        String(days).padStart(2, "0");

    document.getElementById("hours").innerText =
        String(hours).padStart(2, "0");

    document.getElementById("minutes").innerText =
        String(minutes).padStart(2, "0");

    document.getElementById("seconds").innerText =
        String(seconds).padStart(2, "0");
}


/* =========================================================
   START COUNTDOWN
   ========================================================= */

updateCountdown();

setInterval(updateCountdown, 1000);


/* =========================================================
   Intro section
   ========================================================= */

const openCurtainBtn = document.getElementById("openCurtainBtn");

const intro = document.getElementById("wedding-intro");

const leftCurtain = document.querySelector(".curtain-left");

const rightCurtain = document.querySelector(".curtain-right");


openCurtainBtn.addEventListener("click", () => {

    // Disable button
    openCurtainBtn.style.pointerEvents = "none";

    // Hide center content
    document.querySelector(".intro-content").style.opacity = "0";

    // Open curtains
    leftCurtain.style.transform = "translateX(-100%)";

    rightCurtain.style.transform = "translateX(100%)";


    // Remove intro after animation
    setTimeout(() => {

        intro.style.transition = "opacity 1s ease";
        intro.style.opacity = "0";

        setTimeout(() => {
            intro.style.display = "none";
        }, 1000);

    }, 1800);

   
    const weddingMusic = document.getElementById("weddingMusic");
    const musicToggle = document.getElementById("musicToggle");

    // openCurtainBtn.addEventListener("click", () => {

        weddingMusic.volume = 0;

        weddingMusic.play()
            .then(() => {

                musicToggle.classList.add("playing");

                // Smooth volume fade-in
                let volume = 0;

                const fadeIn = setInterval(() => {

                    volume += 0.05;

                    if (volume >= 0.7) {
                        volume = 0.7;
                        clearInterval(fadeIn);
                    }

                    weddingMusic.volume = volume;

                }, 100);

            })
            .catch(error => {
                console.log("Music could not start:", error);
            });


        // Your curtain animation
        openCurtainBtn.style.pointerEvents = "none";

        document.querySelector(".intro-content").style.opacity = "0";

        document.querySelector(".curtain-left")
            .style.transform = "translateX(-100%)";

        document.querySelector(".curtain-right")
            .style.transform = "translateX(100%)";

// });


});

musicToggle.addEventListener("click", () => {

    if (weddingMusic.paused) {

        weddingMusic.play();

        musicToggle.classList.add("playing");

    } else {

        weddingMusic.pause();

        musicToggle.classList.remove("playing");

    }

});

setTimeout(() => {

    musicToggle.style.opacity = "1";
    musicToggle.style.pointerEvents = "auto";

}, 2200);
