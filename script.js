/* ============================================
   INITIAL PAGE STATE
   ============================================ */

document.body.style.overflow = "hidden";

/* ============================================
   OPEN INVITATION
   ============================================ */

/* ============================================
   INTERACTIVE INVITATION OPENING
   ============================================ */

document.body.style.overflow = "hidden";


const openButton =
    document.getElementById("openInvitation");

const openingScreen =
    document.getElementById("openingScreen");

const mainContent =
    document.getElementById("mainContent");


openButton.addEventListener("click", function () {

    /*
        Prevent multiple clicks
    */

    if (openingScreen.classList.contains("opening")) {
        return;
    }


    /*
        Start invitation opening animation
    */

    openingScreen.classList.add("opening");


    /*
        Wait for animation to finish
        before removing the opening screen
    */

    setTimeout(function () {

        openingScreen.classList.add("hide");

        mainContent.classList.remove("hidden");

        document.body.style.overflow = "auto";

        /*
            Bring user to the top of the wedding website
        */

        window.scrollTo({
            top: 0,
            behavior: "instant"
        });

    }, 1100);

});

/* ============================================
   COUNTDOWN TIMER
   ============================================ */

/*
    IMPORTANT:

    CHANGE THE YEAR BELOW.

    Example:

    "2026-11-24T18:30:00"

    The current temporary date/time is:

    24 November 2026
    06:30 PM

    Change this later when your exact
    Nikah date/time is confirmed.
*/

const weddingDate = new Date("2026-11-24T18:30:00").getTime();


function updateCountdown() {

    const now = new Date().getTime();

    const difference = weddingDate - now;


    if (difference <= 0) {

        document.getElementById("days").innerText = "00";
        document.getElementById("hours").innerText = "00";
        document.getElementById("minutes").innerText = "00";
        document.getElementById("seconds").innerText = "00";

        return;
    }


    const days = Math.floor(
        difference / (1000 * 60 * 60 * 24)
    );


    const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24))
        / (1000 * 60 * 60)
    );


    const minutes = Math.floor(
        (difference % (1000 * 60 * 60))
        / (1000 * 60)
    );


    const seconds = Math.floor(
        (difference % (1000 * 60))
        / 1000
    );


    document.getElementById("days").innerText =
        String(days).padStart(2, "0");


    document.getElementById("hours").innerText =
        String(hours).padStart(2, "0");


    document.getElementById("minutes").innerText =
        String(minutes).padStart(2, "0");


    document.getElementById("seconds").innerText =
        String(seconds).padStart(2, "0");

}


/*
    Update every second
*/

setInterval(updateCountdown, 1000);


/*
    Run immediately
*/

updateCountdown();
