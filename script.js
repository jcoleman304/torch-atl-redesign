/* TORCH ATL — Redesign interactions */

document.addEventListener('DOMContentLoaded', () => {

    /* Preloader */
    const preloader = document.getElementById('preloader');
    const hidePreloader = () => { preloader?.classList.add('hidden'); document.body.classList.remove('loading'); };
    window.addEventListener('load', () => setTimeout(hidePreloader, 1400));
    setTimeout(hidePreloader, 2600); // fallback if 'load' already fired

    /* Navbar scroll state */
    const navbar = document.getElementById('navbar');
    if (navbar) {
        const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 60);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

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
    if (burger && overlay && closeBtn) {
        burger.addEventListener('click', openMenu);
        closeBtn.addEventListener('click', closeMenu);
        overlay.querySelectorAll('.menu-link, .menu-member').forEach(l => l.addEventListener('click', closeMenu));
        document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
    }

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
    const stats = document.querySelectorAll('.stat-number[data-target]');
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

    /* Carousels */
    document.querySelectorAll('.carousel').forEach((car) => {
        const track = car.querySelector('.carousel-track');
        if (!track) return;
        const slides = Array.from(track.children);
        const n = slides.length;
        const dotsWrap = car.querySelector('.carousel-dots');
        let idx = 0, timer = null;
        const delay = parseInt(car.dataset.autoplay, 10) || 0;
        const dots = [];
        if (dotsWrap) {
            slides.forEach((_, i) => {
                const b = document.createElement('button');
                b.className = 'carousel-dot' + (i === 0 ? ' active' : '');
                b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
                b.addEventListener('click', () => { go(i); restart(); });
                dotsWrap.appendChild(b);
                dots.push(b);
            });
        }
        function go(i) {
            idx = (i + n) % n;
            track.style.transform = 'translateX(-' + (idx * 100) + '%)';
            dots.forEach((d, j) => d.classList.toggle('active', j === idx));
        }
        function play() { if (delay && n > 1) timer = setInterval(() => go(idx + 1), delay); }
        function stop() { clearInterval(timer); }
        function restart() { stop(); play(); }
        car.querySelector('.carousel-prev')?.addEventListener('click', () => { go(idx - 1); restart(); });
        car.querySelector('.carousel-next')?.addEventListener('click', () => { go(idx + 1); restart(); });
        car.addEventListener('mouseenter', stop);
        car.addEventListener('mouseleave', play);
        let x0 = null;
        track.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; stop(); }, { passive: true });
        track.addEventListener('touchend', (e) => {
            if (x0 === null) return;
            const dx = e.changedTouches[0].clientX - x0;
            if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1));
            x0 = null; play();
        }, { passive: true });
        play();
    });

    /* Crossfade media (split sections) */
    document.querySelectorAll('.media-fade').forEach((mf) => {
        const imgs = Array.from(mf.querySelectorAll('img'));
        if (imgs.length < 2) return;
        let i = 0;
        setInterval(() => {
            imgs[i].classList.remove('is-active');
            i = (i + 1) % imgs.length;
            imgs[i].classList.add('is-active');
        }, 5000);
    });

    /* Lightbox for gallery / photo grids / mosaic */
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightbox-img');
    const lbItems = Array.from(document.querySelectorAll('.carousel-slide img, .gallery-item img, .photo-grid img, .mosaic-item img'));
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
