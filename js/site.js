(function () {
    'use strict';

    // ---- Header: shadow once the page is scrolled, mobile menu toggle
    var header = document.getElementById('site-header');
    function onScroll() {
        if (header) header.classList.toggle('scrolled', window.scrollY > 4);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    var toggle = document.getElementById('nav-toggle');
    var nav = document.getElementById('site-nav');
    if (toggle && nav) {
        toggle.addEventListener('click', function () {
            var open = nav.classList.toggle('open');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    // ---- External links open in a new tab
    Array.prototype.forEach.call(document.querySelectorAll('a[href^="http"]'), function (a) {
        if (a.hostname && a.hostname !== window.location.hostname) {
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
        }
    });

    // ---- Email link assembled in the browser (keeps the address out of the page source)
    Array.prototype.forEach.call(document.querySelectorAll('.email-link'), function (a) {
        var addr = a.getAttribute('data-user') + '@' + a.getAttribute('data-domain');
        a.href = 'mailto:' + addr;
        var label = a.querySelector('.email-text');
        (label || a).textContent = addr;
    });

    // ---- Publication lists: search, filters and pagination
    var PAGE_SIZE = 25;

    // Fold case and accents, and drop BibTeX markup ({ } \ " ') so that
    // "Ozgur" finds "{\"{O}}zg{\"{u}}r" and "Al-Zyoud" finds "Al{-}Zyoud".
    function norm(s) {
        return (s || '')
            .normalize('NFD').replace(/[̀-ͯ]/g, '')
            .toLowerCase()
            .replace(/[{}\\"']/g, '')
            .replace(/[-‐-―]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function pageList(current, total) {
        var pages = [], last = 0;
        for (var i = 1; i <= total; i++) {
            if (i === 1 || i === total || Math.abs(i - current) <= 1) {
                if (last && i - last > 1) pages.push('…');
                pages.push(i);
                last = i;
            }
        }
        return pages;
    }

    function initPubs(container) {
        var pager = container.parentNode.querySelector('.pager');
        var items = Array.prototype.slice.call(container.querySelectorAll('.pub'));
        var groups = Array.prototype.slice.call(container.querySelectorAll('.pub-year'));
        var search = document.getElementById('pub-search');
        var yearSel = document.getElementById('pub-year');
        var typeSel = document.getElementById('pub-type');
        var count = document.getElementById('pub-count');
        var empty = document.getElementById('pub-empty');
        var page = 1;

        items.forEach(function (el) { el._hay = norm(el.getAttribute('data-search')); });

        function matches() {
            var terms = search ? norm(search.value).split(' ').filter(Boolean) : [];
            var year = yearSel ? yearSel.value : '', type = typeSel ? typeSel.value : '';
            return items.filter(function (el) {
                return (!year || el.getAttribute('data-year') === year) &&
                       (!type || el.getAttribute('data-type') === type) &&
                       terms.every(function (t) { return el._hay.indexOf(t) !== -1; });
            });
        }

        function render(scroll) {
            var found = matches();
            var pages = Math.max(1, Math.ceil(found.length / PAGE_SIZE));
            if (page > pages) page = pages;
            var visible = found.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
            items.forEach(function (el) { el.hidden = visible.indexOf(el) === -1; });
            groups.forEach(function (g) { g.hidden = !g.querySelector('.pub:not([hidden])'); });
            if (count) {
                count.textContent = (found.length === items.length)
                    ? items.length + ' publications'
                    : found.length + ' of ' + items.length + ' publications';
            }
            if (empty) empty.hidden = found.length !== 0;
            if (pager) {
                pager.hidden = pages <= 1;
                pager.innerHTML = '';
                if (pages > 1) {
                    var add = function (label, target, cls, disabled) {
                        var b = document.createElement('button');
                        b.type = 'button';
                        b.textContent = label;
                        b.className = cls || '';
                        if (disabled) b.disabled = true;
                        else b.addEventListener('click', function () { page = target; render(true); });
                        pager.appendChild(b);
                    };
                    add('‹ Prev', page - 1, 'pager-step', page === 1);
                    pageList(page, pages).forEach(function (p) {
                        if (p === '…') {
                            var s = document.createElement('span');
                            s.textContent = '…';
                            s.className = 'pager-gap';
                            pager.appendChild(s);
                        } else {
                            add(String(p), p, p === page ? 'current' : '', false);
                        }
                    });
                    add('Next ›', page + 1, 'pager-step', page === pages);
                }
            }
            if (scroll) {
                var top = container.getBoundingClientRect().top + window.scrollY - 140;
                window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
            }
        }

        [search, yearSel, typeSel].forEach(function (el) {
            if (!el) return;
            el.addEventListener(el === search ? 'input' : 'change', function () { page = 1; render(false); });
        });
        render(false);
    }
    Array.prototype.forEach.call(document.querySelectorAll('[data-pubs]'), initPubs);

    // ---- Gallery: list / grid toggle and lightbox
    var gallery = document.getElementById('gallery');
    if (gallery) {
        var buttons = document.querySelectorAll('.view-toggle button');
        function setView(view) {
            gallery.classList.toggle('gallery-grid', view === 'grid');
            gallery.classList.toggle('gallery-list', view === 'list');
            Array.prototype.forEach.call(buttons, function (b) {
                b.classList.toggle('active', b.getAttribute('data-view') === view);
            });
            try { localStorage.setItem('gallery-view', view); } catch (e) { /* ignore */ }
        }
        Array.prototype.forEach.call(buttons, function (b) {
            b.addEventListener('click', function () { setView(b.getAttribute('data-view')); });
        });
        try { var saved = localStorage.getItem('gallery-view'); if (saved) setView(saved); } catch (e) { /* ignore */ }

        var box = document.getElementById('lightbox');
        var boxImg = document.getElementById('lightbox-img');
        var boxCap = document.getElementById('lightbox-caption');
        function close() { box.hidden = true; document.body.classList.remove('no-scroll'); }
        gallery.addEventListener('click', function (e) {
            var thumb = e.target.closest('.gallery-thumb');
            if (!thumb) return;
            boxImg.src = thumb.getAttribute('data-full');
            boxImg.alt = thumb.getAttribute('data-caption') || '';
            boxCap.textContent = thumb.getAttribute('data-caption') || '';
            box.hidden = false;
            document.body.classList.add('no-scroll');
        });
        box.addEventListener('click', close);
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !box.hidden) close(); });
    }
})();
