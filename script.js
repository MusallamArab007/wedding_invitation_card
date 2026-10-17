/* =========================================================
   WEDDING INVITATION — JAVASCRIPT
   Musallam & Iman
   ========================================================= */

const OPENING_DURATION = 2900;
const CURTAIN_DURATION = 1800;
const MUSIC_VOLUME = 0.7;

function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
}

function setupInvitationOpening() {
    const openButton = document.getElementById("openInvitation");
    const openingScreen = document.getElementById("openingScreen");
    const mainContent = document.getElementById("mainContent");

    if (!openButton || !openingScreen || !mainContent) return;

    openButton.addEventListener("click", () => {
        if (openingScreen.classList.contains("cinematic-opening")) return;

        openingScreen.classList.add("cinematic-opening");

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        window.setTimeout(() => {
            openingScreen.classList.add("hide");
            mainContent.classList.remove("hidden");
            document.body.style.overflow = "auto";
            window.scrollTo({ top: 0, behavior: "auto" });
        }, reducedMotion ? 80 : OPENING_DURATION);
    }, { once: true });
}

function setupCountdown() {
    const countdownSection = document.getElementById("countdown");
    const weddingDateValue =
        countdownSection?.dataset.weddingDate || "2026-11-24T18:30:00";
    const weddingDate = new Date(weddingDateValue);

    if (Number.isNaN(weddingDate.getTime())) return;

    function updateCountdown() {
        const difference = weddingDate.getTime() - Date.now();
        const totalSeconds = Math.max(0, Math.floor(difference / 1000));
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        setText("days", String(days).padStart(2, "0"));
        setText("hours", String(hours).padStart(2, "0"));
        setText("minutes", String(minutes).padStart(2, "0"));
        setText("seconds", String(seconds).padStart(2, "0"));
    }

    updateCountdown();
    window.setInterval(updateCountdown, 1000);
    setupDateReveal(weddingDate);
}

function setupDateReveal(weddingDate) {
    const revealButton = document.getElementById("revealDateButton");
    const dateReveal = document.getElementById("dateReveal");
    const calendarButton = document.getElementById("addToCalendar");

    if (!revealButton || !dateReveal) return;

    setText("revealedDay", weddingDate.getDate());
    setText(
        "revealedMonth",
        weddingDate.toLocaleDateString("en-US", { month: "long" }).toUpperCase()
    );
    setText(
        "revealedYearDay",
        `${weddingDate.getFullYear()} • ${weddingDate
            .toLocaleDateString("en-US", { weekday: "long" })
            .toUpperCase()}`
    );

    revealButton.addEventListener("click", () => {
        dateReveal.classList.add("is-revealed");
        revealButton.setAttribute("aria-expanded", "true");
        revealButton.disabled = true;
        if (calendarButton) calendarButton.disabled = false;
    }, { once: true });

    if (calendarButton) {
        calendarButton.addEventListener("click", () => {
            const eventEnd = new Date(weddingDate.getTime() + 3 * 60 * 60 * 1000);
            const formatCalendarDate = (date) => [
                date.getFullYear(),
                String(date.getMonth() + 1).padStart(2, "0"),
                String(date.getDate()).padStart(2, "0")
            ].join("") + "T" + [
                String(date.getHours()).padStart(2, "0"),
                String(date.getMinutes()).padStart(2, "0"),
                "00"
            ].join("");
            const calendarFile = [
                "BEGIN:VCALENDAR",
                "VERSION:2.0",
                "BEGIN:VEVENT",
                `DTSTART:${formatCalendarDate(weddingDate)}`,
                `DTEND:${formatCalendarDate(eventEnd)}`,
                "SUMMARY:Musallam & Iman's Nikah",
                "LOCATION:Mohammadiya Masjid, Aurangabad",
                "DESCRIPTION:With the blessings of Allah.",
                "END:VEVENT",
                "END:VCALENDAR"
            ].join("\r\n");

            const download = document.createElement("a");
            download.href = URL.createObjectURL(
                new Blob([calendarFile], { type: "text/calendar" })
            );
            download.download = "musallam-iman-wedding.ics";
            download.click();
            URL.revokeObjectURL(download.href);
        });
    }
}

function setupCurtainAndMusic() {
    const curtainButton = document.getElementById("openCurtainBtn");
    const intro = document.getElementById("wedding-intro");
    const introContent = document.querySelector(".intro-content");
    const leftCurtain = document.querySelector(".curtain-left");
    const rightCurtain = document.querySelector(".curtain-right");
    const weddingMusic = document.getElementById("weddingMusic");
    const musicToggle = document.getElementById("musicToggle");

    function setMusicState(isPlaying) {
        musicToggle?.classList.toggle("playing", isPlaying);
    }

    function playMusic() {
        if (!weddingMusic) return;

        weddingMusic.play()
            .then(() => setMusicState(true))
            .catch(() => setMusicState(false));
    }

    if (curtainButton && intro && leftCurtain && rightCurtain) {
        curtainButton.addEventListener("click", () => {
            curtainButton.disabled = true;
            if (introContent) introContent.style.opacity = "0";

            leftCurtain.style.transform = "translateX(-100%)";
            rightCurtain.style.transform = "translateX(100%)";

            if (weddingMusic) {
                weddingMusic.volume = 0;
                playMusic();

                let volume = 0;
                const fadeIn = window.setInterval(() => {
                    volume = Math.min(MUSIC_VOLUME, volume + 0.05);
                    weddingMusic.volume = volume;
                    if (volume >= MUSIC_VOLUME) window.clearInterval(fadeIn);
                }, 100);
            }

            window.setTimeout(() => {
                intro.style.transition = "opacity 1s ease";
                intro.style.opacity = "0";
                window.setTimeout(() => {
                    intro.style.display = "none";
                }, 1000);
            }, CURTAIN_DURATION);
        }, { once: true });
    }

    if (musicToggle && weddingMusic) {
        musicToggle.addEventListener("click", () => {
            if (weddingMusic.paused) {
                playMusic();
            } else {
                weddingMusic.pause();
                setMusicState(false);
            }
        });

        window.setTimeout(() => {
            musicToggle.style.opacity = "1";
            musicToggle.style.pointerEvents = "auto";
        }, 2200);
    }
}

function initializeInvitation() {
    const openingScreen = document.getElementById("openingScreen");
    if (openingScreen) document.body.style.overflow = "hidden";

    setupInvitationOpening();
    setupCountdown();
    setupCurtainAndMusic();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeInvitation, { once: true });
} else {
    initializeInvitation();
}
