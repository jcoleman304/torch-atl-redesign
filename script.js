/* TORCH ATL — Redesign interactions */

document.addEventListener('DOMContentLoaded', () => {

    /* Preloader */
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.classList.remove('loading');
        }, 1400);
    });
    // Fallback in case 'load' already fired
    setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.classList.remove('loading');
    }, 2600);

    /* Navbar scroll state */
    const navbar = document.getElementById('navbar');
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    /* Fullscreen menu overlay */
    const burger = document.getElementById('nav-burger');
    const overlay = document.getElementById('menu-overlay');
    const closeBtn = document.getElementById('menu-close');
    const openMenu = () => {
        overlay.classList.add('active');
        burger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    };
    const closeMenu = () => {
        overlay.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    };
    burger.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);
    overlay.querySelectorAll('.menu-link, .menu-member').forEach(l => l.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

    /* Hero slideshow */
    const slides = Array.from(document.querySelectorAll('.hero-slide'));
    if (slides.length > 1) {
        let idx = 0;
        setInterval(() => {
            slides[idx].classList.remove('is-active');
            idx = (idx + 1) % slides.length;
            slides[idx].classList.add('is-active');
        }, 5500);
    }

    /* Reveal on scroll */
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(en => {
                if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
        revealEls.forEach(el => io.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('in'));
    }

    /* Animated stat counters */
    const stats = document.querySelectorAll('.stat-number');
    const animateStat = (el) => {
        const target = parseInt(el.dataset.target, 10);
        const dur = 1600, start = performance.now();
        const fmt = (n) => n.toLocaleString('en-US');
        const tick = (now) => {
            const p = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = fmt(Math.round(target * eased));
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    };
    if ('IntersectionObserver' in window) {
        const so = new IntersectionObserver((entries) => {
            entries.forEach(en => { if (en.isIntersecting) { animateStat(en.target); so.unobserve(en.target); } });
        }, { threshold: 0.5 });
        stats.forEach(s => so.observe(s));
    } else {
        stats.forEach(s => s.textContent = parseInt(s.dataset.target, 10).toLocaleString('en-US'));
    }

    /* Lightbox for gallery / photo grids / mosaic */
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightbox-img');
    const lbItems = Array.from(document.querySelectorAll('.gallery-item img, .photo-grid img, .mosaic-item img'));
    let lbIndex = 0;
    const showLb = (i) => {
        lbIndex = (i + lbItems.length) % lbItems.length;
        lbImg.src = lbItems[lbIndex].src;
        lbImg.alt = lbItems[lbIndex].alt || '';
    };
    const openLb = (i) => { showLb(i); lightbox.classList.add('active'); document.body.style.overflow = 'hidden'; };
    const closeLb = () => { lightbox.classList.remove('active'); document.body.style.overflow = ''; };
    lbItems.forEach((img, i) => img.addEventListener('click', () => openLb(i)));
    if (lightbox) {
        document.getElementById('lightbox-close').addEventListener('click', closeLb);
        document.getElementById('lightbox-prev').addEventListener('click', (e) => { e.stopPropagation(); showLb(lbIndex - 1); });
        document.getElementById('lightbox-next').addEventListener('click', (e) => { e.stopPropagation(); showLb(lbIndex + 1); });
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLb(); });
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLb();
            else if (e.key === 'ArrowLeft') showLb(lbIndex - 1);
            else if (e.key === 'ArrowRight') showLb(lbIndex + 1);
        });
    }

    /* Inquiry form — graceful note (FormSubmit handles POST natively) */
    const form = document.getElementById('inquire-form');
    if (form) {
        form.addEventListener('submit', () => {
            const btn = form.querySelector('button[type="submit"]');
            if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; }
        });
    }
});

/* Member login modal (preview stub) */
function showLoginModal(e) {
    if (e) e.preventDefault();
    document.getElementById('login-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeLoginModal() {
    document.getElementById('login-modal').classList.remove('active');
    document.body.style.overflow = '';
}
function handleMemberLogin(e) {
    e.preventDefault();
    const err = document.getElementById('login-error');
    err.textContent = 'Member portal opens at launch. Contact bookings@torchatl.com for access.';
    err.classList.add('visible');
}

/* A Room waitlist signup */
function handleAroomSignup(e) {
    e.preventDefault();
    const form = e.target;
    const email = form.querySelector('input[name="email"]').value;
    const note = document.getElementById('aroom-note');
    const btn = form.querySelector('button');
    if (btn) { btn.textContent = 'Added'; btn.disabled = true; }
    fetch('https://formsubmit.co/ajax/bookings@torchatl.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email: email, _subject: 'A Room Waitlist — TORCH ATL' })
    }).catch(() => {});
    if (note) note.classList.add('visible');
    form.querySelector('input[name="email"]').style.display = 'none';
    return false;
}
