document.addEventListener('DOMContentLoaded', function() {
    
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

        if(dEl) dEl.innerText = d.toString().padStart(2, '0');
        if(hEl) hEl.innerText = h.toString().padStart(2, '0');
        if(mEl) mEl.innerText = m.toString().padStart(2, '0');
        if(sEl) sEl.innerText = s.toString().padStart(2, '0');
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
        galleryToggle.addEventListener('click', function() {
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
    const rsvpForm = document.getElementById('weddingRSVP');
    const rsvpSuccess = document.getElementById('rsvpSuccess');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            rsvpForm.classList.add('submitting');
            setTimeout(() => {
                rsvpForm.style.display = 'none';
                document.querySelector('.rsvp-section .foil-title').style.display = 'none';
                document.querySelector('.rsvp-intro-light').style.display = 'none';
                rsvpSuccess.style.display = 'block';
                document.getElementById('rsvp').scrollIntoView({ behavior: 'smooth' });
            }, 600);
        });
    }

    // --- 7. OVERLAY & MUSIC ---
    const overlay = document.getElementById('invitation-overlay');
    const openBtn = document.getElementById('open-invitation-btn');
    const music = document.getElementById('wedding-music');
    const musicBtn = document.querySelector('.floating-music');

    if (overlay) document.body.classList.add('no-scroll');

    if (openBtn) {
        openBtn.addEventListener('click', function() {
            if(music) music.play().catch(() => {});
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
    if(backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});



// // 1. Particle Magic (Vibrant Gold Sparkles)
// const canvas = document.getElementById('canvas');
// const ctx = canvas.getContext('2d');

// let particles = [];
// const particleCount = 80; // Slightly reduced for cleaner look

// function resize() {
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
// }

// window.addEventListener('resize', resize);
// resize();

// class Particle {
//     constructor() {
//         this.reset();
//     }

//     reset() {
//         this.x = Math.random() * canvas.width;
//         this.y = Math.random() * canvas.height + canvas.height; 
//         this.size = Math.random() * 4 + 1.5; // Slightly larger
//         this.speedY = Math.random() * 0.8 + 0.3;
//         this.opacity = Math.random() * 0.6 + 0.3; // Increased base opacity
//         this.twinkle = Math.random() * 0.015;
//     }

//     update() {
//         this.y -= this.speedY;
        
//         // Twinkle effect
//         this.opacity += this.twinkle;
//         if (this.opacity > 0.9 || this.opacity < 0.2) this.twinkle *= -1;

//         if (this.y < -50) {
//             this.reset();
//             this.y = canvas.height + 50;
//         }
//     }

//     draw() {
//         ctx.beginPath();
//         // Vibrant Gold Color
//         ctx.fillStyle = `rgba(255, 215, 0, ${this.opacity})`; 
//         ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
        
//         // Add a slight glow/bloom to particles
//         ctx.shadowBlur = 8;
//         ctx.shadowColor = "rgba(255, 223, 0, 0.8)";
        
//         ctx.fill();
//         ctx.shadowBlur = 0; // Reset for next particle performance
//     }
// }

// function initMagic() {
//     particles = [];
//     for (let i = 0; i < particleCount; i++) {
//         particles.push(new Particle());
//     }
// }

// function animate() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     particles.forEach(p => {
//         p.update();
//         p.draw();
//     });
//     requestAnimationFrame(animate);
// }

// initMagic();
// animate();

// // 2. Countdown Timer
// const weddingDate = new Date("September 6, 2026 14:00:00").getTime();

// setInterval(() => {
//     const now = new Date().getTime();
//     const diff = weddingDate - now;

//     const d = Math.floor(diff / (1000 * 60 * 60 * 24));
//     const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//     const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
//     const s = Math.floor((diff % (1000 * 60)) / 1000);

//     document.getElementById("days").innerText = d.toString().padStart(2, '0');
//     document.getElementById("hours").innerText = h.toString().padStart(2, '0');
//     document.getElementById("mins").innerText = m.toString().padStart(2, '0');
//     document.getElementById("secs").innerText = s.toString().padStart(2, '0');
// }, 1000);

// // 3. Parallax Scroll Effect
// window.addEventListener('scroll', () => {
//     const scrolled = window.pageYOffset;
//     const heroContent = document.querySelector('.hero-content');
//     if (heroContent) {
//         heroContent.style.transform = `translateY(${scrolled * 0.25}px)`;
//         heroContent.style.opacity = 1 - (scrolled / 1000);
//     }
// });

// // 4. Smooth Reveal Animation
// const observer = new IntersectionObserver((entries) => {
//     entries.forEach(entry => {
//         if (entry.isIntersecting) {
//             entry.target.classList.add('appear');
//         }
//     });
// }, { threshold: 0.1 });

// document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));


// // --- MOBILE NAVBAR LOGIC ---
// const hamburger = document.getElementById('hamburger');
// const navMenu = document.getElementById('nav-menu');
// const navLinks = document.querySelectorAll('.nav-links a');

// // Toggle Menu
// hamburger.addEventListener('click', () => {
//     hamburger.classList.toggle('active');
//     navMenu.classList.toggle('active');
// });

// // Close menu when a link is clicked (important for single page)
// navLinks.forEach(link => {
//     link.addEventListener('click', () => {
//         hamburger.classList.remove('active');
//         navMenu.classList.remove('active');
//     });
// });

// // Change Navbar background on scroll
// window.addEventListener('scroll', () => {
//     const navbar = document.querySelector('.navbar');
//     if (window.scrollY > 50) {
//         navbar.style.padding = "15px 60px";
//         navbar.style.background = "rgba(0, 0, 0, 0.8)"; // Darker on scroll
//     } else {
//         navbar.style.padding = "20px 60px";
//         navbar.style.background = "rgba(0, 0, 0, 0.2)";
//     }
// });


// // --- GALLERY TOGGLE LOGIC ---
// const galleryBtn = document.getElementById('gallery-toggle');
// const extraItems = document.querySelectorAll('.gallery-item.extra');

// galleryBtn.addEventListener('click', function() {
//     const isShowingMore = galleryBtn.innerText === 'Show More';
    
//     extraItems.forEach(item => {
//         if (isShowingMore) {
//             item.classList.add('visible');
//             // If the item has a mosaic class (tall, wide, big), 
//             // ensure it displays correctly in the grid
//             if (item.classList.contains('tall') || item.classList.contains('big') || item.classList.contains('wide')) {
//                 item.style.display = 'block'; 
//             }
//         } else {
//             item.classList.remove('visible');
//             item.style.display = 'none';
//         }
//     });

//     if (isShowingMore) {
//         galleryBtn.innerText = 'Show Less';
//     } else {
//         galleryBtn.innerText = 'Show More';
//         // Optional: Scroll back to gallery header when hiding
//         document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
//     }
// });

// // Keep your openLightbox function from before...
// function openLightbox(element) {
//     const src = element.querySelector('img').src;
//     document.getElementById('lightbox-img').src = src;
//     document.getElementById('lightbox').style.display = 'flex';
// }



// document.addEventListener('DOMContentLoaded', function() {
//     const galleryToggle = document.getElementById('gallery-toggle');
//     const extraImages = document.querySelectorAll('.gallery-item.extra');

//     if (galleryToggle) {
//         galleryToggle.addEventListener('click', function() {
//             const currentState = galleryToggle.getAttribute('data-state');

//             if (currentState === 'hidden') {
//                 // 1. First make them part of the layout
//                 extraImages.forEach(img => {
//                     img.style.display = 'block';
//                 });

//                 // 2. Use a tiny timeout to trigger the CSS transition
//                 setTimeout(() => {
//                     extraImages.forEach(img => {
//                         img.classList.add('is-animated');
//                     });
//                 }, 10); 

//                 galleryToggle.textContent = 'Show Less';
//                 galleryToggle.setAttribute('data-state', 'visible');

//             } else {
//                 // 1. Start the fade-out animation
//                 extraImages.forEach(img => {
//                     img.classList.remove('is-animated');
//                 });

//                 // 2. Wait for the animation (600ms) to finish before removing from layout
//                 setTimeout(() => {
//                     extraImages.forEach(img => {
//                         img.style.display = 'none';
//                     });
//                 }, 600);

//                 galleryToggle.textContent = 'Show More Images';
//                 galleryToggle.setAttribute('data-state', 'hidden');
                
//                 // 3. Smooth scroll back up
//                 const gallerySection = document.getElementById('gallery');
//                 window.scrollTo({
//                     top: gallerySection.offsetTop - 50,
//                     behavior: 'smooth'
//                 });
//             }
//         });
//     }
// });


// // --- RSVP FORM SUBMISSION LOGIC ---
// document.addEventListener('DOMContentLoaded', function() {
//     const rsvpForm = document.getElementById('weddingRSVP');
//     const rsvpSuccess = document.getElementById('rsvpSuccess');
//     const rsvpHeader = document.querySelector('.rsvp-section .foil-title');
//     const rsvpIntro = document.querySelector('.rsvp-intro-light');

//     if (rsvpForm) {
//         rsvpForm.addEventListener('submit', function(e) {
//             e.preventDefault(); // Prevents the page from refreshing

//             // 1. Add a visual "submitting" state
//             rsvpForm.classList.add('submitting');

//             // 2. Wait a split second to simulate sending, then swap content
//             setTimeout(() => {
//                 // Hide the original form and headers
//                 rsvpForm.style.display = 'none';
//                 if(rsvpHeader) rsvpHeader.style.display = 'none';
//                 if(rsvpIntro) rsvpIntro.style.display = 'none';

//                 // Show the success message
//                 rsvpSuccess.style.display = 'block';

//                 // Optional: Scroll to the top of the RSVP section to show the message
//                 document.getElementById('rsvp').scrollIntoView({ behavior: 'smooth' });
//             }, 600);
//         });
//     }
// });

// // --- INVITATION OVERLAY & MUSIC LOGIC ---
// document.addEventListener('DOMContentLoaded', function() {
//     const overlay = document.getElementById('invitation-overlay');
//     const openBtn = document.getElementById('open-invitation-btn');
//     const music = document.getElementById('wedding-music');
//     const musicBtn = document.querySelector('.floating-music');

//     // Start by blocking scroll
//     document.body.classList.add('no-scroll');

//     if (openBtn) {
//         openBtn.addEventListener('click', function() {
//             // 1. Play Music
//             music.play().catch(error => console.log("Playback blocked by browser"));

//             // 2. Hide Overlay
//             overlay.classList.add('hidden');

//             // 3. Enable Scrolling
//             document.body.classList.remove('no-scroll');

//             // 4. Cleanup: Remove from DOM after transition
//             setTimeout(() => {
//                 overlay.style.display = 'none';
//             }, 1500);
//         });
//     }

//     // Update Floating Music Button Logic
//     if (musicBtn) {
//         musicBtn.addEventListener('click', () => {
//             if (music.paused) {
//                 music.play();
//                 musicBtn.innerText = '♫';
//                 musicBtn.style.animation = 'pulse 2s infinite';
//             } else {
//                 music.pause();
//                 musicBtn.innerText = '🔇';
//                 musicBtn.style.animation = 'none';
//             }
//         });
//     }
// });

// // Add a pulse animation for the music button when playing
// const style = document.createElement('style');
// style.innerHTML = `
// @keyframes pulse {
//     0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4); }
//     70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(212, 175, 55, 0); }
//     100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); }
// }`;
// document.head.appendChild(style);

// // --- BACK TO TOP LOGIC ---
// const backToTopBtn = document.getElementById('backToTop');

// window.addEventListener('scroll', () => {
//     // Show button after scrolling 500px (roughly past the hero section)
//     if (window.scrollY > 500) {
//         backToTopBtn.classList.add('show');
//     } else {
//         backToTopBtn.classList.remove('show');
//     }
// });

// backToTopBtn.addEventListener('click', () => {
//     window.scrollTo({
//         top: 0,
//         behavior: 'smooth'
//     });
// });