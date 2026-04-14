document.addEventListener('DOMContentLoaded', function () {

    // --- 1. PARTICLE MAGIC (Gold Sparkles) ---
    const canvas = document.getElementById('canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = window.innerWidth < 768 ? 40 : 80; // Fewer particles on mobile for performance

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height + canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedY = Math.random() * 0.8 + 0.3;
                this.opacity = Math.random() * 0.5 + 0.2;
                this.twinkle = Math.random() * 0.01;
            }
            update() {
                this.y -= this.speedY;
                this.opacity += this.twinkle;
                if (this.opacity > 0.8 || this.opacity < 0.2) this.twinkle *= -1;
                if (this.y < -50) { this.reset(); this.y = canvas.height + 50; }
            }
            draw() {
                ctx.beginPath();
                ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
                ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initMagic() {
            for (let i = 0; i < particleCount; i++) particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animate);
        }
        initMagic();
        animate();
    }

    // --- 2. COUNTDOWN TIMER ---
    const weddingDate = new Date("September 6, 2026 14:00:00").getTime();
    const timerFunc = setInterval(() => {
        const now = new Date().getTime();
        const diff = weddingDate - now;
        if (diff < 0) { clearInterval(timerFunc); return; }

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        const dEl = document.getElementById("days");
        const hEl = document.getElementById("hours");
        const mEl = document.getElementById("mins");
        const sEl = document.getElementById("secs");

        if (dEl) dEl.innerText = d.toString().padStart(2, '0');
        if (hEl) hEl.innerText = h.toString().padStart(2, '0');
        if (mEl) mEl.innerText = m.toString().padStart(2, '0');
        if (sEl) sEl.innerText = s.toString().padStart(2, '0');
    }, 1000);

    // --- 3. MOBILE NAVBAR LOGIC ---
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // --- 4. SCROLL EFFECTS (Navbar & Reveal) ---
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.background = "rgba(0, 0, 0, 0.9)";
                navbar.style.padding = "10px 20px";
            } else {
                navbar.style.background = "rgba(0, 0, 0, 0.2)";
                navbar.style.padding = "20px 20px";
            }
        }

        const backToTopBtn = document.getElementById('backToTop');
        if (backToTopBtn) {
            window.scrollY > 500 ? backToTopBtn.classList.add('show') : backToTopBtn.classList.remove('show');
        }
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('appear');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // --- 5. GALLERY TOGGLE LOGIC ---
    const galleryToggle = document.getElementById('gallery-toggle');
    const extraImages = document.querySelectorAll('.gallery-item.extra');

    if (galleryToggle) {
        galleryToggle.addEventListener('click', function () {
            const isHidden = galleryToggle.getAttribute('data-state') === 'hidden';

            if (isHidden) {
                extraImages.forEach(img => img.style.display = 'block');
                setTimeout(() => {
                    extraImages.forEach(img => img.classList.add('is-animated'));
                }, 10);
                galleryToggle.textContent = 'Show Less';
                galleryToggle.setAttribute('data-state', 'visible');
            } else {
                extraImages.forEach(img => img.classList.remove('is-animated'));
                setTimeout(() => {
                    extraImages.forEach(img => img.style.display = 'none');
                }, 600);
                galleryToggle.textContent = 'Show More Images';
                galleryToggle.setAttribute('data-state', 'hidden');
                document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // --- 6. RSVP FORM LOGIC ---
    // const rsvpForm = document.getElementById('weddingRSVP');
    // const rsvpSuccess = document.getElementById('rsvpSuccess');
    // if (rsvpForm) {
    //     rsvpForm.addEventListener('submit', function(e) {
    //         e.preventDefault();
    //         rsvpForm.classList.add('submitting');
    //         setTimeout(() => {
    //             rsvpForm.style.display = 'none';
    //             document.querySelector('.rsvp-section .foil-title').style.display = 'none';
    //             document.querySelector('.rsvp-intro-light').style.display = 'none';
    //             rsvpSuccess.style.display = 'block';
    //             document.getElementById('rsvp').scrollIntoView({ behavior: 'smooth' });
    //         }, 600);
    //     });
    // }

    // --- 6. RSVP FORM LOGIC (Google Sheets Integrated) ---
    const rsvpForm = document.getElementById('weddingRSVP');
    const rsvpSuccess = document.getElementById('rsvpSuccess');
    const rsvpHeader = document.querySelector('.rsvp-header-main');
    const rsvpText = document.querySelector('.rsvp-script-wrap');
    const rsvpDeadline = document.querySelector('.rsvp-deadline-text');

    // Your specific Apps Script URL
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzEzedIOiaP8AEf8H_wnuIXLHOvB26UR2cDH7IEPJ7nKiIgWglOUHU8kOiqktKS3yKF/exec';

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', e => {
            e.preventDefault();

            // Show loading state
            const submitBtn = rsvpForm.querySelector('button');
            submitBtn.disabled = true;
            submitBtn.innerText = "SENDING...";

            // Send data to Google Sheets
            fetch(scriptURL, {
                method: 'POST',
                body: new FormData(rsvpForm)
            })
                .then(response => {
                    console.log('Success!', response);

                    // 1. Hide the form and text
                    rsvpForm.style.display = 'none';
                    if (rsvpHeader) rsvpHeader.style.display = 'none';
                    if (rsvpText) rsvpText.style.display = 'none';
                    if (rsvpDeadline) rsvpDeadline.style.display = 'none';

                    // 2. Show the Success message
                    if (rsvpSuccess) rsvpSuccess.style.display = 'block';

                    // 3. Scroll to the top of the RSVP section
                    document.getElementById('rsvp').scrollIntoView({ behavior: 'smooth' });
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    submitBtn.disabled = false;
                    submitBtn.innerText = "TRY AGAIN";
                    alert("Sorry, there was an error sending your response. Please try again.");
                });
        });
    }

    // --- 7. OVERLAY & MUSIC ---
    const overlay = document.getElementById('invitation-overlay');
    const openBtn = document.getElementById('open-invitation-btn');
    const music = document.getElementById('wedding-music');
    const musicBtn = document.querySelector('.floating-music');

    if (overlay) document.body.classList.add('no-scroll');

    if (openBtn) {
        openBtn.addEventListener('click', function () {
            if (music) music.play().catch(() => { });
            overlay.classList.add('hidden');
            document.body.classList.remove('no-scroll');
            setTimeout(() => { overlay.style.display = 'none'; }, 1500);
        });
    }

    if (musicBtn && music) {
        musicBtn.addEventListener('click', () => {
            if (music.paused) {
                music.play();
                musicBtn.innerText = '♫';
            } else {
                music.pause();
                musicBtn.innerText = '🔇';
            }
        });
    }

    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});

// --- FAQ ACCORDION LOGIC ---
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    header.addEventListener('click', () => {
        // Check if this item is already open
        const isOpen = item.classList.contains('active');

        // Close all other items (Optional: remove this if you want multiple open at once)
        faqItems.forEach(otherItem => otherItem.classList.remove('active'));

        // Toggle current item
        if (!isOpen) {
            item.classList.add('active');
        }
    });
});



document.addEventListener('mousemove', (e) => {
    const orb = document.querySelector('.glow-orb');
    if (orb) {
        const x = e.clientX;
        const y = e.clientY;
        // Moves the orb slowly toward the mouse for a "dreamy" look
        orb.style.transform = `translate(calc(-50% + ${x / 50}px), calc(-50% + ${y / 50}px))`;
    }
});

// Staggered Fade-in for names
const eObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "all 1.2s ease-out";
    eObserver.observe(el);
});