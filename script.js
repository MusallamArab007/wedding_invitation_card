/* =========================================================
   WEDDING INVITATION — JAVASCRIPT
   Musallam & Iman
   ========================================================= */

const OPENING_DURATION = 2900;
const CURTAIN_DURATION = 1800;
const MUSIC_VOLUME = 0.7;

function syncViewportHeight() {
    document.documentElement.style.setProperty(
        "--visible-viewport-height",
        `${window.innerHeight}px`
    );
}

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
            document.documentElement.classList.remove("invitation-opening");
            document.body.classList.remove("invitation-opening");
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
        if (isPlaying) musicToggle?.classList.add("is-visible");
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

    }
}

function setupGuestBlessings() {
    const blessingsForm = document.getElementById("blessingsForm");
    const guestName = document.getElementById("guestName");
    const guestBlessing = document.getElementById("guestBlessing");
    const thanks = document.getElementById("blessingsThanks");
    const submitButton = blessingsForm?.querySelector("button[type='submit']");
    const modal = document.getElementById("blessingsModal");
    const modalCard = modal?.querySelector(".blessings-modal__card");
    const modalGuestName = document.getElementById("blessingsGuestName");
    const submissionTarget = document.getElementById("blessingsSubmissionTarget");
    let lastFocusedElement = null;

    if (!blessingsForm || !guestName || !guestBlessing || !thanks || !submitButton) return;

    function closeModal() {
        if (!modal || modal.hidden) return;
        modal.classList.remove("is-visible");
        window.setTimeout(() => {
            modal.hidden = true;
            lastFocusedElement?.focus();
        }, 220);
    }

    function openModal(name) {
        if (!modal || !modalGuestName) return;
        lastFocusedElement = document.activeElement;
        modalGuestName.textContent = name;
        modal.hidden = false;
        requestAnimationFrame(() => modal.classList.add("is-visible"));
        window.setTimeout(() => modalCard?.focus(), 40);
    }

    modal?.querySelectorAll("[data-blessings-close]").forEach((button) => {
        button.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeModal();
    });

    blessingsForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = guestName.value.trim();
        const blessing = guestBlessing.value.trim();
        if (!name) return;

        const defaultButtonText = submitButton.textContent;
        const googleFormUrl = blessingsForm.dataset.googleFormUrl;
        const nameField = blessingsForm.dataset.nameField;
        const blessingField = blessingsForm.dataset.blessingField;
        if (!googleFormUrl || !nameField || !blessingField) return;

        submitButton.disabled = true;
        submitButton.textContent = "Sending your blessing...";
        blessingsForm.setAttribute("aria-busy", "true");
        thanks.textContent = "";

        try {
            if (!submissionTarget) throw new Error("Submission target unavailable");

            const backgroundForm = document.createElement("form");
            backgroundForm.action = googleFormUrl;
            backgroundForm.method = "POST";
            backgroundForm.target = submissionTarget.name;

            [[nameField, name], [blessingField, blessing]].forEach(([field, value]) => {
                const input = document.createElement("input");
                input.type = "hidden";
                input.name = field;
                input.value = value;
                backgroundForm.append(input);
            });

            document.body.append(backgroundForm);
            backgroundForm.submit();
            window.setTimeout(() => backgroundForm.remove(), 0);

            blessingsForm.reset();
            openModal(name);
        } catch (error) {
            thanks.textContent = "Your blessing could not be sent just now. Please try again in a moment.";
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = defaultButtonText;
            blessingsForm.removeAttribute("aria-busy");
        }
    });
}

function initializeInvitation() {
    syncViewportHeight();
    window.addEventListener("resize", syncViewportHeight, { passive: true });
    window.addEventListener("orientationchange", syncViewportHeight, { passive: true });

    const openingScreen = document.getElementById("openingScreen");
    if (openingScreen) {
        document.documentElement.classList.add("invitation-opening");
        document.body.classList.add("invitation-opening");
        document.body.style.overflow = "hidden";
    }

    setupInvitationOpening();
    setupCountdown();
    setupCurtainAndMusic();
    setupGuestBlessings();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeInvitation, { once: true });
} else {
    initializeInvitation();
}
