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
