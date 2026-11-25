/* ==========================================================
   Shared site behaviour
   - Top bar (mobile menu + "scrolled" state)
   - Project boards: curved carousel on the home page
   - Inline project detail panel (opens on the same page, not a popup)
   - Certificate viewer
   ========================================================== */
(function () {
    "use strict";

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[c]);

    /* ---------------- Top bar ---------------- */
    function initTopbar() {
        const bar = document.querySelector(".topbar");
        if (!bar) return;
        const btn = bar.querySelector(".topbar__menu");
        const links = bar.querySelector(".topbar__links");

        const setOpen = (open) => {
            links.classList.toggle("is-open", open);
            btn.setAttribute("aria-expanded", String(open));
            btn.innerHTML = open ? '<i class="ri-close-line"></i>' : '<i class="ri-menu-line"></i>';
        };
        btn?.addEventListener("click", (e) => {
            e.stopPropagation();
            setOpen(!links.classList.contains("is-open"));
        });
        document.addEventListener("click", (e) => {
            if (!bar.contains(e.target)) setOpen(false);
        });
        links.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });

        const onScroll = () => bar.classList.toggle("is-scrolled", window.scrollY > 40);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
    }

    /* ---------------- Board + detail markup ---------------- */
    function boardHTML(p) {
        const media = p.image
            ? `<img src="${esc(p.image)}" alt="" class="${p.cover ? "is-cover" : ""}" loading="lazy"
                    onerror="this.replaceWith(Object.assign(document.createElement('i'),{className:'${esc(p.icon || "ri-code-s-slash-line")}'}))">`
            : `<i class="${esc(p.icon || "ri-code-s-slash-line")}"></i>`;
        return `
            <button class="board board--${esc(p.theme || "light")}" type="button"
                    data-id="${esc(p.id)}"
                    aria-expanded="false" aria-controls="project-detail">
                <span class="board__media">${media}<span class="board__open"><i class="ri-arrow-right-up-line"></i></span></span>
                <span class="board__body">
                    <span class="board__cat">${esc(p.category)}</span>
                    <span class="board__name">${esc(p.name)}</span>
                    <span class="board__brief">${esc(p.brief)}</span>
                </span>
            </button>`;
    }

    function linkBtn(href, label, icon, style) {
        return href
            ? `<a class="pill-btn ${style}" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${label}<span class="pill-btn__ic"><i class="${icon}"></i></span></a>`
            : `<span class="pill-btn ${style}" aria-disabled="true">${label}<span class="pill-btn__ic"><i class="${icon}"></i></span></span>`;
    }

    function detailHTML(p) {
        const logo = p.image
            ? `<img src="${esc(p.image)}" alt="" onerror="this.replaceWith(Object.assign(document.createElement('i'),{className:'${esc(p.icon)}'}))">`
            : `<i class="${esc(p.icon || "ri-code-s-slash-line")}"></i>`;
        const tools = p.tools && p.tools.length
            ? `<div><p class="detail__label">Tools used</p><div class="chips">${p.tools.map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div></div>`
            : "";

        return `
            <button class="detail__close" type="button" aria-label="Close project details"><i class="ri-close-line"></i></button>
            <div class="detail__main">
                <div class="detail__head">
                    <div class="detail__logo">${logo}</div>
                    <div>
                        <p class="eyebrow">${esc(p.category)}</p>
                        <h2 class="detail__title" tabindex="-1">${esc(p.name)}</h2>
                    </div>
                </div>
                <p class="detail__brief">${esc(p.brief)}</p>
                <p class="detail__desc">${esc(p.description)}</p>
                <div class="detail__links">
                    ${linkBtn(p.demo, "Live demo", "ri-arrow-right-up-line", "pill-btn--accent")}
                    ${p.website ? linkBtn(p.website, "Website", "ri-global-line", "pill-btn--glass") : ""}
                    ${p.github === undefined ? "" : linkBtn(p.github, "GitHub repo", "ri-github-fill", "pill-btn--glass")}
                </div>
            </div>
            <div class="detail__side">
                ${tools}
            </div>`;
    }

    /* ---------------- Detail panel controller ---------------- */
    function createDetail(onClose) {
        const el = document.createElement("div");
        el.className = "detail";
        el.id = "project-detail";
        el.setAttribute("role", "region");
        el.setAttribute("aria-label", "Project details");
        el.inert = true;
        el.innerHTML = '<div class="detail__clip"><div class="detail__pad"><article class="detail__card"></article></div></div>';
        const card = el.querySelector(".detail__card");
        let currentId = null;

        card.addEventListener("click", (e) => { if (e.target.closest(".detail__close")) api.close(); });

        const api = {
            el,
            get id() { return currentId; },
            open(p) {
                currentId = p.id;
                card.innerHTML = detailHTML(p);
                el.inert = false;
                // next frame so the open transition runs
                requestAnimationFrame(() => el.classList.add("is-open"));
                history.replaceState(null, "", "#" + p.id);
                setTimeout(() => {
                    el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
                    card.querySelector(".detail__title")?.focus({ preventScroll: true });
                }, reduceMotion ? 0 : 320);
            },
            close() {
                if (!currentId) return;
                const id = currentId;
                currentId = null;
                el.classList.remove("is-open");
                el.inert = true;
                history.replaceState(null, "", location.pathname + location.search);
                onClose(id);
            }
        };
        document.addEventListener("keydown", (e) => { if (e.key === "Escape") api.close(); });
        return api;
    }

    function setActive(boards, id) {
        boards.forEach((b) => {
            const on = b.dataset.id === id;
            b.classList.toggle("is-active", on);
            b.setAttribute("aria-expanded", String(on));
        });
    }

    /* ---------------- Home: curved carousel ---------------- */
    function initCarousel(root, projects) {
        const track = root.querySelector(".showcase__track");
        track.innerHTML = projects.map(boardHTML).join("");
        const boards = [...track.querySelectorAll(".board")];
        const prev = root.querySelector("[data-prev]");
        const next = root.querySelector("[data-next]");
        const dots = root.querySelector(".showcase__dots");
        dots.innerHTML = boards.map(() => "<span></span>").join("");
        const dotEls = [...dots.children];

        const detail = createDetail((id) => {
            setActive(boards, null);
            boards.find((b) => b.dataset.id === id)?.focus({ preventScroll: true });
        });
        root.appendChild(detail.el);

        let current = 0;
        const step = () => boards[0].offsetWidth + parseFloat(getComputedStyle(track).columnGap || 0);

        function render() {
            const center = track.scrollLeft + track.clientWidth / 2;
            const s = step();
            let nearest = 0, best = Infinity;
            boards.forEach((b, i) => {
                const off = (b.offsetLeft + b.offsetWidth / 2 - center) / s;
                const a = Math.max(-3.2, Math.min(3.2, off));
                b.style.setProperty("--tilt", (a * 15).toFixed(2) + "deg");
                b.style.setProperty("--scale", (1 - Math.min(Math.abs(a), 3) * 0.08).toFixed(3));
                b.style.setProperty("--lift", (a * a * 7).toFixed(1) + "px");
                b.style.setProperty("--fade", (1 - Math.max(0, Math.abs(a) - 2) * 0.35).toFixed(2));
                b.style.zIndex = String(10 - Math.round(Math.abs(a)));
                if (Math.abs(off) < best) { best = Math.abs(off); nearest = i; }
            });
            current = nearest;
            dotEls.forEach((d, i) => d.classList.toggle("is-on", i === nearest));
            prev.disabled = nearest === 0;
            next.disabled = nearest === boards.length - 1;
        }

        function goTo(i, smooth = true) {
            const b = boards[Math.max(0, Math.min(boards.length - 1, i))];
            track.scrollTo({
                left: b.offsetLeft + b.offsetWidth / 2 - track.clientWidth / 2,
                behavior: smooth && !reduceMotion ? "smooth" : "auto"
            });
        }

        let ticking = false;
        track.addEventListener("scroll", () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => { render(); ticking = false; });
        }, { passive: true });
        window.addEventListener("resize", () => { render(); });

        prev.addEventListener("click", () => goTo(current - 1));
        next.addEventListener("click", () => goTo(current + 1));
        track.addEventListener("keydown", (e) => {
            if (e.key === "ArrowRight") { e.preventDefault(); goTo(current + 1); boards[Math.min(current + 1, boards.length - 1)].focus({ preventScroll: true }); }
            if (e.key === "ArrowLeft") { e.preventDefault(); goTo(current - 1); boards[Math.max(current - 1, 0)].focus({ preventScroll: true }); }
        });

        // Mouse drag to scroll (touch already scrolls natively)
        let startX = 0, startLeft = 0, dragging = false, moved = false;
        track.addEventListener("pointerdown", (e) => {
            if (e.pointerType !== "mouse" || e.button !== 0) return;
            dragging = true; moved = false;
            startX = e.clientX; startLeft = track.scrollLeft;
        });
        window.addEventListener("pointermove", (e) => {
            if (!dragging) return;
            const dx = e.clientX - startX;
            if (!moved && Math.abs(dx) > 6) { moved = true; track.classList.add("is-dragging"); }
            if (moved) track.scrollLeft = startLeft - dx;
        });
        window.addEventListener("pointerup", () => {
            if (!dragging) return;
            dragging = false;
            if (moved) {
                track.classList.remove("is-dragging");
                render();
                goTo(current);
            }
        });
        track.addEventListener("click", (e) => {
            if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; }
        }, true);

        // Open / toggle a project
        track.addEventListener("click", (e) => {
            const b = e.target.closest(".board");
            if (!b) return;
            if (detail.id === b.dataset.id) { detail.close(); return; }
            const p = projects.find((x) => x.id === b.dataset.id);
            goTo(boards.indexOf(b));
            setActive(boards, p.id);
            detail.open(p);
        });

        // Start on the middle card (or the one in the URL hash)
        const hashId = location.hash.slice(1);
        const fromHash = boards.findIndex((b) => b.dataset.id === hashId);
        goTo(fromHash >= 0 ? fromHash : Math.floor(boards.length / 2), false);
        render();
        if (fromHash >= 0) {
            setActive(boards, hashId);
            detail.open(projects[fromHash]);
        }
    }

    /* ---------------- Certificate viewer ---------------- */
    function initViewer() {
        const viewer = document.querySelector(".viewer");
        if (!viewer) return;
        const img = viewer.querySelector("img");
        const cap = viewer.querySelector(".viewer__caption");
        const closeBtn = viewer.querySelector(".viewer__close");
        let opener = null;

        const close = () => {
            viewer.classList.remove("is-open");
            viewer.inert = true;
            document.body.style.overflow = "";
            opener?.focus();
        };
        document.querySelectorAll("[data-viewer]").forEach((btn) => btn.addEventListener("click", () => {
            opener = btn;
            img.src = btn.dataset.src;
            img.alt = btn.dataset.title;
            cap.textContent = btn.dataset.title;
            viewer.inert = false;
            viewer.classList.add("is-open");
            document.body.style.overflow = "hidden";
            closeBtn.focus();
        }));
        viewer.inert = true;
        closeBtn.addEventListener("click", close);
        viewer.addEventListener("click", (e) => { if (e.target === viewer) close(); });
        document.addEventListener("keydown", (e) => { if (e.key === "Escape" && viewer.classList.contains("is-open")) close(); });
    }

    document.addEventListener("DOMContentLoaded", () => {
        initTopbar();
        const projects = window.PROJECTS || [];
        const showcase = document.querySelector("[data-showcase]");
        if (showcase && projects.length) initCarousel(showcase, projects);
        initViewer();
        const year = document.querySelector("[data-year]");
        if (year) year.textContent = new Date().getFullYear();
    });
})();
