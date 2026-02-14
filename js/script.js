/* ============================================
   shorto. — SPA Controller + i18n
   ============================================ */

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ---- i18n ----

const langs = {
    ru: {
        // Nav
        "nav.signin": "Войти",
        "nav.signout": "Выйти",
        "nav.dashboard": "Панель",
        "nav.api": "API",
        // Home
        "home.tagline": "Короткие ссылки, точная аналитика",
        "home.paste": "Вставьте длинный URL...",
        "home.shorten": "Сократить",
        "home.copy": "Копировать",
        "home.copied": "Скопировано!",
        "home.cta_link": "Войдите",
        "home.cta_after": ", чтобы отслеживать клики и управлять ссылками",
        // Auth
        "auth.tagline": "Войдите для управления ссылками",
        "auth.signin": "Войти",
        "auth.register": "Создать аккаунт",
        "auth.back": "\u2190 Назад к сокращателю",
        "auth.username": "Имя пользователя",
        "auth.email": "Эл. почта",
        "auth.password": "Пароль",
        // Dashboard
        "dash.title": "Панель управления",
        "dash.greeting": "С возвращением,",
        "dash.stat_links": "Всего ссылок",
        "dash.stat_clicks": "Всего кликов",
        "dash.stat_avg": "Среднее / ссылка",
        "dash.stat_today": "Сегодня",
        "dash.top": "Лучшие ссылки",
        "dash.top_empty": "Пока нет данных о кликах",
        "dash.your_links": "Ваши ссылки",
        "dash.no_links": "Ссылок пока нет. Вставьте URL выше, чтобы начать.",
        "dash.clicks": "кликов",
        "dash.bulk": "Массовое создание",
        "dash.bulk_placeholder": "По одному URL на строку...",
        "dash.bulk_submit": "Сократить все",
        "dash.bulk_result": "Создано",
        "dash.bulk_errors": "Ошибки",
        "dash.bulk_copy_all": "Копировать все",
        "dash.bulk_close": "Закрыть",
        // Detail
        "detail.back": "\u2190 Назад к панели",
        "detail.clicks": "кликов",
        "detail.short_url": "Короткий URL",
        "detail.created": "Создано",
        "detail.chart": "Активность кликов",
        "detail.copy": "Копировать короткий URL",
        "detail.delete": "Удалить ссылку",
        "detail.confirm": "Удалить эту ссылку навсегда?",
        "detail.deleted": "Ссылка удалена",
        "detail.copied": "Скопировано в буфер",
        "detail.export_csv": "Экспорт CSV",
        "detail.edit": "Изменить URL",
        "detail.save": "Сохранить",
        "detail.cancel": "Отмена",
        "detail.updated": "Ссылка обновлена",
        // Analytics
        "analytics.title": "Аналитика",
        "analytics.countries": "Страны",
        "analytics.devices": "Устройства",
        "analytics.browsers": "Браузеры",
        "analytics.os": "Операционные системы",
        "analytics.hourly": "Клики по часам",
        "analytics.timeline": "Хронология кликов",
        "analytics.recent": "Последние клики",
        "analytics.empty": "Пока нет данных о кликах",
        "analytics.ip": "IP",
        "analytics.country": "Страна",
        "analytics.city": "Город",
        "analytics.device": "Устройство",
        "analytics.browser": "Браузер",
        "analytics.time": "Время",
        // API
        "api.title": "Справочник API",
        "api.subtitle": "Интегрируйте shorto. в ваши приложения и сервисы",
        "api.auth_title": "Аутентификация",
        "api.auth_desc": "Включите ваш API токен во все запросы через заголовок",
        "api.header_format": "Формат заголовка",
        "api.your_token": "Ваш токен",
        "api.show": "Показать",
        "api.hide": "Скрыть",
        "api.copy": "Копировать",
        "api.copied": "Скопировано!",
        "api.regenerate": "Перегенерировать",
        "api.regen_confirm": "Старый токен перестанет работать. Продолжить?",
        "api.regen_ok": "API токен обновлён",
        "api.token_hint": "— не истекает, используйте для API-интеграций",
        "api.endpoints": "Эндпоинты",
        "api.req_body": "Тело запроса",
        "api.response": "Ответ",
        "api.examples": "Примеры",
        "api.ep1": "Создать короткую ссылку. Работает с авторизацией и без. С токеном — ссылка привяжется к аккаунту.",
        "api.ep2": "Список всех ваших сокращённых ссылок с кликами. Требуется авторизация.",
        "api.ep3": "Получить статистику по конкретной короткой ссылке.",
        "api.ep4": "Удалить сокращённую ссылку навсегда. Только владелец может удалить.",
        // Time
        "time.now": "только что",
        "time.m": "мин назад",
        "time.h": "ч назад",
        "time.d": "дн назад",
    },
    en: {
        "nav.signin": "Sign in",
        "nav.signout": "Sign out",
        "nav.dashboard": "Dashboard",
        "nav.api": "API",
        "home.tagline": "Short links, sharp insights",
        "home.paste": "Paste a long URL here...",
        "home.shorten": "Shorten",
        "home.copy": "Copy",
        "home.copied": "Copied!",
        "home.cta_link": "Sign in",
        "home.cta_after": " to track clicks and manage your links",
        "auth.tagline": "Sign in to manage your links",
        "auth.signin": "Sign in",
        "auth.register": "Create account",
        "auth.back": "\u2190 Back to shortener",
        "auth.username": "Username",
        "auth.email": "Email",
        "auth.password": "Password",
        "dash.title": "Dashboard",
        "dash.greeting": "Welcome back,",
        "dash.stat_links": "Total links",
        "dash.stat_clicks": "Total clicks",
        "dash.stat_avg": "Avg clicks / link",
        "dash.stat_today": "Today",
        "dash.top": "Top performing",
        "dash.top_empty": "No click data yet",
        "dash.your_links": "Your links",
        "dash.no_links": "No links yet. Paste a URL above to get started.",
        "dash.clicks": "clicks",
        "dash.bulk": "Bulk create",
        "dash.bulk_placeholder": "One URL per line...",
        "dash.bulk_submit": "Shorten all",
        "dash.bulk_result": "Created",
        "dash.bulk_errors": "Errors",
        "dash.bulk_copy_all": "Copy all",
        "dash.bulk_close": "Close",
        "detail.back": "\u2190 Back to dashboard",
        "detail.clicks": "clicks",
        "detail.short_url": "Short URL",
        "detail.created": "Created",
        "detail.chart": "Click activity",
        "detail.copy": "Copy short URL",
        "detail.delete": "Delete link",
        "detail.confirm": "Delete this link permanently?",
        "detail.deleted": "Link deleted",
        "detail.copied": "Copied to clipboard",
        "detail.export_csv": "Export CSV",
        "detail.edit": "Edit URL",
        "detail.save": "Save",
        "detail.cancel": "Cancel",
        "detail.updated": "Link updated",
        "analytics.title": "Analytics",
        "analytics.countries": "Countries",
        "analytics.devices": "Devices",
        "analytics.browsers": "Browsers",
        "analytics.os": "Operating systems",
        "analytics.hourly": "Clicks by hour",
        "analytics.timeline": "Clicks timeline",
        "analytics.recent": "Recent clicks",
        "analytics.empty": "No click data yet",
        "analytics.ip": "IP",
        "analytics.country": "Country",
        "analytics.city": "City",
        "analytics.device": "Device",
        "analytics.browser": "Browser",
        "analytics.time": "Time",
        "api.title": "API Reference",
        "api.subtitle": "Integrate shorto. into your apps and workflows",
        "api.auth_title": "Authentication",
        "api.auth_desc": "Include your API token in all requests using the",
        "api.header_format": "Header format",
        "api.your_token": "Your token",
        "api.show": "Show",
        "api.hide": "Hide",
        "api.copy": "Copy",
        "api.copied": "Copied!",
        "api.regenerate": "Regenerate",
        "api.regen_confirm": "The old token will stop working. Continue?",
        "api.regen_ok": "API token regenerated",
        "api.token_hint": "— never expires, use for API integrations",
        "api.endpoints": "Endpoints",
        "api.req_body": "Request body",
        "api.response": "Response",
        "api.examples": "Examples",
        "api.ep1": "Create a shortened URL. Works with or without authentication. Authenticated requests link the URL to your account.",
        "api.ep2": "List all your shortened URLs with click counts. Requires authentication.",
        "api.ep3": "Get detailed statistics for a specific shortened URL.",
        "api.ep4": "Permanently delete a shortened URL. Only the owner can delete their URLs.",
        "time.now": "just now",
        "time.m": "m ago",
        "time.h": "h ago",
        "time.d": "d ago",
    }
};

function getLang() {
    const saved = localStorage.getItem("lang");
    if (saved) return saved;
    const browserLang = (navigator.language || "").toLowerCase();
    return browserLang.startsWith("ru") ? "ru" : "en";
}

async function detectLang() {
    if (localStorage.getItem("lang")) return;
    try {
        const resp = await fetch("/api/geo");
        const data = await resp.json();
        if (data.country === "Russia" && getLang() !== "ru") {
            setLang("ru");
        }
    } catch {}
}

function setLang(lang) {
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang === "ru" ? "ru" : "en";
    document.title = lang === "ru" ? "shorto. — Сокращатель ссылок" : "shorto. — URL Shortener";
    router.render();
}

function langPicker(current) {
    const items = [
        { code: "ru", flag: "\ud83c\uddf7\ud83c\uddfa", label: "\u0420\u0443\u0441\u0441\u043a\u0438\u0439" },
        { code: "en", flag: "\ud83c\uddec\ud83c\udde7", label: "English" },
    ];
    const active = items.find(i => i.code === current) || items[0];
    return `
        <div class="lang-picker">
            <button class="lang-picker__btn" onclick="toggleLangMenu(event)">
                <span class="lang-picker__flag">${active.flag}</span>
                <span class="lang-picker__code">${active.code.toUpperCase()}</span>
                <span class="lang-picker__arrow">&#9662;</span>
            </button>
            <div class="lang-picker__menu hidden" id="lang-menu">
                ${items.map(i => `
                    <button class="lang-picker__item${i.code === current ? ' lang-picker__item--active' : ''}" onclick="setLang('${i.code}')">
                        <span class="lang-picker__flag">${i.flag}</span>
                        <span>${i.label}</span>
                        ${i.code === current ? '<span class="lang-picker__check">&#10003;</span>' : ''}
                    </button>
                `).join("")}
            </div>
        </div>
    `;
}

function toggleLangMenu(e) {
    e.stopPropagation();
    const menu = $("#lang-menu");
    menu.classList.toggle("hidden");
    const close = (ev) => {
        if (!ev.target.closest(".lang-picker")) {
            menu.classList.add("hidden");
            document.removeEventListener("click", close);
        }
    };
    if (!menu.classList.contains("hidden")) {
        document.addEventListener("click", close);
    }
}

function t(key) {
    return langs[getLang()][key] || langs.en[key] || key;
}

function pluralRu(n, one, few, many) {
    const abs = Math.abs(n) % 100;
    const last = abs % 10;
    if (abs > 10 && abs < 20) return many;
    if (last > 1 && last < 5) return few;
    if (last === 1) return one;
    return many;
}

function linkCount(n) {
    if (getLang() === "ru") return `${n} ${pluralRu(n, "ссылка", "ссылки", "ссылок")}`;
    return `${n} link${n !== 1 ? "s" : ""}`;
}

// ---- API helper ----

async function api(path, opts = {}) {
    const headers = { "Content-Type": "application/json" };
    const token = localStorage.getItem("token");
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const resp = await fetch(path, { ...opts, headers });
    const data = resp.status !== 204 ? await resp.json() : null;

    if (!resp.ok) {
        const err = new Error(data?.error || data?.detail || "Request failed");
        err.status = resp.status;
        throw err;
    }
    return data;
}

// ---- Toast ----

function toast(msg) {
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
}

// ---- Router ----

const router = {
    _current: null,
    _param: null,

    go(view, param) {
        this._current = view;
        this._param = param;
        this.render();
    },

    render() {
        const app = $("#app");
        const token = localStorage.getItem("token");
        const lang = getLang();
        const otherLang = lang === "ru" ? "EN" : "RU";

        // Update nav
        const navRight = $("#nav-right");
        if (token) {
            const userStr = localStorage.getItem("user");
            const user = (userStr && userStr !== "undefined") ? JSON.parse(userStr) : {};
            const cur = this._current;
            navRight.innerHTML = `
                <div class="nav__links">
                    <a class="nav__link${cur === 'dashboard' ? ' nav__link--active' : ''}" href="#" onclick="router.go('dashboard')">${t("nav.dashboard")}</a>
                    <a class="nav__link${cur === 'api' ? ' nav__link--active' : ''}" href="#" onclick="router.go('api')">${t("nav.api")}</a>
                </div>
                <div class="nav__divider"></div>
                <span class="nav__user">${user.username || "User"}</span>
                <button class="nav__logout" onclick="logout()">${t("nav.signout")}</button>
                ${langPicker(lang)}
            `;
        } else {
            navRight.innerHTML = `
                <button class="nav__logout" onclick="router.go('auth')">${t("nav.signin")}</button>
                ${langPicker(lang)}
            `;
        }

        // Yandex.Metrika SPA hit
        if (typeof ym === "function") {
            const pageUrl = "/" + (this._current || "");
            ym(106741879, "hit", pageUrl, { title: document.title });
        }

        // Render view
        switch (this._current) {
            case "home":      renderHome(app); break;
            case "auth":      renderAuth(app); break;
            case "dashboard": renderDashboard(app); break;
            case "detail":    renderDetail(app, this._param); break;
            case "api":       renderApi(app); break;
            default:          this.go(token ? "dashboard" : "home"); return;
        }
    }
};

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.go("home");
}

// ---- Shared: wire shorten form ----

function wireShortenForm(onSuccess, selectors = {}) {
    const formSel = selectors.form || "#shorten-form";
    const inputSel = selectors.input || "#shorten-input";
    const resultSel = selectors.result || "#shorten-result";
    const urlSel = selectors.url || "#shorten-url";
    const copySel = selectors.copy || "#copy-btn";
    
    const form = $(formSel);
    if (!form) return;
    
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const input = $(inputSel);
        const url = input.value.trim();
        if (!url) return;

        try {
            const data = await api("/api/shorten", { method: "POST", body: JSON.stringify({ url }) });
            const resultEl = $(resultSel);
            $(urlSel).textContent = data.short_url;
            resultEl.classList.remove("hidden");
            input.value = "";
            if (onSuccess) onSuccess();
        } catch (err) {
            toast(err.message);
        }
    });

    const copyBtn = $(copySel);
    if (copyBtn) {
        copyBtn.addEventListener("click", () => {
            const url = $(urlSel).textContent;
            navigator.clipboard.writeText(url).then(() => {
                copyBtn.textContent = t("home.copied");
                setTimeout(() => { copyBtn.textContent = t("home.copy"); }, 1500);
            });
        });
    }
}

// ---- HOME VIEW (public) ----

function renderHome(container) {
    const tpl = $("#tpl-home").content.cloneNode(true);
    container.innerHTML = "";
    container.appendChild(tpl);

    $(".home__tagline").textContent = t("home.tagline");
    $("#shorten-input").placeholder = t("home.paste");
    $(".shorten--hero .btn--primary").textContent = t("home.shorten");
    $("#copy-btn").textContent = t("home.copy");
    const cta = $(".home__cta");
    if (localStorage.getItem("token")) {
        cta.classList.add("hidden");
    } else {
        cta.innerHTML = `<a href="#" onclick="router.go('auth')">${t("home.cta_link")}</a>${t("home.cta_after")}`;
    }

    wireShortenForm();
}

// ---- AUTH VIEW ----

function renderAuth(container) {
    const tpl = $("#tpl-auth").content.cloneNode(true);
    container.innerHTML = "";
    container.appendChild(tpl);

    $(".auth__tagline").textContent = t("auth.tagline");
    $$(".auth__tab").forEach(tab => {
        tab.textContent = tab.dataset.tab === "login" ? t("auth.signin") : t("auth.register");
    });
    $(".auth__footer a").textContent = t("auth.back");

    let mode = "login";

    function setMode(m) {
        mode = m;
        $$(".auth__tab").forEach(tab => tab.classList.toggle("auth__tab--active", tab.dataset.tab === m));
        $("#auth-submit").textContent = m === "login" ? t("auth.signin") : t("auth.register");
        $("#auth-error").classList.add("hidden");
        renderFields();
    }

    function renderFields() {
        const fields = $("#auth-fields");
        if (mode === "login") {
            fields.innerHTML = `
                <div class="field">
                    <label class="field__label">${t("auth.username")}</label>
                    <input class="field__input" name="username" autocomplete="username" required>
                </div>
                <div class="field">
                    <label class="field__label">${t("auth.password")}</label>
                    <input class="field__input" name="password" type="password" autocomplete="current-password" required>
                </div>
            `;
        } else {
            fields.innerHTML = `
                <div class="field">
                    <label class="field__label">${t("auth.username")}</label>
                    <input class="field__input" name="username" autocomplete="username" required>
                </div>
                <div class="field">
                    <label class="field__label">${t("auth.password")}</label>
                    <input class="field__input" name="password" type="password" autocomplete="new-password" required minlength="6">
                </div>
            `;
        }
        const first = $(".field__input", fields);
        if (first) setTimeout(() => first.focus(), 50);
    }

    $$(".auth__tab").forEach(tab => {
        tab.addEventListener("click", () => setMode(tab.dataset.tab));
    });

    $("#auth-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const errEl = $("#auth-error");
        errEl.classList.add("hidden");

        const fd = new FormData(e.target);
        const body = Object.fromEntries(fd);

        try {
            const endpoint = mode === "login" ? "/api/login" : "/api/register";
            const data = await api(endpoint, { method: "POST", body: JSON.stringify(body) });
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            router.go("dashboard");
        } catch (err) {
            errEl.textContent = err.message;
            errEl.classList.remove("hidden");
        }
    });

    renderFields();
}

// ---- DASHBOARD VIEW ----

function renderDashboard(container) {
    const token = localStorage.getItem("token");
    if (!token) { router.go("home"); return; }

    const tpl = $("#tpl-dashboard").content.cloneNode(true);
    container.innerHTML = "";
    container.appendChild(tpl);

    // Header
    $(".dash__title").textContent = t("dash.title");
    const userStr = localStorage.getItem("user");
    const user = (userStr && userStr !== "undefined" && userStr !== "null") ? JSON.parse(userStr) : {};
    $("#dash-greeting").textContent = `${t("dash.greeting")} ${user.username || "User"}`;
    $("#shorten-input").placeholder = t("home.paste");
    $(".shorten .btn--primary").textContent = t("home.shorten");
    const dashCopyBtn = $("#dash-copy-btn");
    if (dashCopyBtn) dashCopyBtn.textContent = t("home.copy");

    // KPI labels
    const kpiLabels = $$("#kpi-row .kpi-bar__label");
    if (kpiLabels[0]) kpiLabels[0].textContent = t("dash.stat_links");
    if (kpiLabels[1]) kpiLabels[1].textContent = t("dash.stat_clicks");
    if (kpiLabels[2]) kpiLabels[2].textContent = t("dash.stat_avg");
    if (kpiLabels[3]) kpiLabels[3].textContent = t("dash.stat_today");

    // Section titles via IDs
    const titleMap = {
        "dash-timeline-title": "analytics.timeline",
        "dash-top-title": "dash.top",
        "dash-devices-title": "analytics.devices",
        "dash-countries-title": "analytics.countries",
        "dash-browsers-title": "analytics.browsers",
        "dash-hourly-title": "analytics.hourly",
    };
    Object.entries(titleMap).forEach(([id, key]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = t(key);
    });


    // Other labels
    const topEmptyP = $("#top-empty p");
    if (topEmptyP) topEmptyP.textContent = t("dash.top_empty");
    const linksTitle = $(".links__title");
    if (linksTitle) linksTitle.textContent = t("dash.your_links");
    const linksEmptyP = $("#links-empty p");
    if (linksEmptyP) linksEmptyP.textContent = t("dash.no_links");
    const chartEmpty = $("#dash-chart-empty");
    if (chartEmpty) {
        const span = chartEmpty.querySelector("span");
        if (span) span.textContent = t("analytics.empty");
    }

    wireShortenForm(() => { loadLinks(); loadDashAnalytics(); }, {
        result: "#dash-shorten-result",
        url: "#dash-shorten-url", 
        copy: "#dash-copy-btn"
    });
    wireBulkModal();
    loadLinks();
    loadDashAnalytics();
}

function wireBulkModal() {
    const modal = $("#bulk-modal");
    const textarea = $("#bulk-textarea");
    const results = $("#bulk-results");
    const bulkBtn = $("#bulk-btn");
    if (!modal || !bulkBtn) return;

    // i18n
    bulkBtn.textContent = t("dash.bulk");
    const titleEl = $("#bulk-title");
    if (titleEl) titleEl.textContent = t("dash.bulk");
    if (textarea) textarea.placeholder = t("dash.bulk_placeholder");
    const submitBtn = $("#bulk-submit");
    if (submitBtn) submitBtn.textContent = t("dash.bulk_submit");
    const closeBtn = $("#bulk-close");
    if (closeBtn) closeBtn.textContent = t("dash.bulk_close");

    function openModal() { modal.classList.remove("hidden"); textarea.value = ""; results.classList.add("hidden"); results.innerHTML = ""; textarea.focus(); }
    function closeModal() { modal.classList.add("hidden"); }

    bulkBtn.addEventListener("click", openModal);
    $("#bulk-close-x").addEventListener("click", closeModal);
    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

    submitBtn.addEventListener("click", async () => {
        const urls = textarea.value.split("\n").map(u => u.trim()).filter(Boolean);
        if (urls.length === 0) return;

        submitBtn.disabled = true;
        submitBtn.textContent = "...";

        try {
            const data = await api("/api/shorten/bulk", { method: "POST", body: JSON.stringify({ urls }) });

            let html = `<div class="bulk-modal__summary">`;
            if (data.results.length > 0) html += `<span class="bulk-modal__summary-ok">${t("dash.bulk_result")}: ${data.results.length}</span>`;
            if (data.errors.length > 0) html += `<span class="bulk-modal__summary-err">${t("dash.bulk_errors")}: ${data.errors.length}</span>`;
            html += `</div>`;

            data.results.forEach(r => {
                html += `<div class="bulk-modal__result-item bulk-modal__result-item--ok">
                    <span class="bulk-modal__result-url" title="${escHtml(r.url)}">${escHtml(r.url)}</span>
                    <span class="bulk-modal__result-short">${escHtml(r.short_url)}</span>
                </div>`;
            });
            data.errors.forEach(e => {
                html += `<div class="bulk-modal__result-item bulk-modal__result-item--err">
                    <span>${escHtml(e.url)}</span>
                    <span>${escHtml(e.error)}</span>
                </div>`;
            });

            if (data.results.length > 0) {
                const allShort = data.results.map(r => r.short_url).join("\n");
                html += `<button class="btn btn--ghost btn--small" style="margin-top:12px" onclick="navigator.clipboard.writeText('${allShort.replace(/'/g, "\\'")}').then(()=>toast('${t("home.copied")}'))">${t("dash.bulk_copy_all")}</button>`;
            }

            results.innerHTML = html;
            results.classList.remove("hidden");
            loadLinks();
            loadDashAnalytics();
        } catch (err) {
            toast(err.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = t("dash.bulk_submit");
        }
    });
}

async function loadLinks() {
    try {
        const data = await api("/api/urls");
        const urls = data.urls || [];
        const list = $("#links-list");
        const empty = $("#links-empty");
        const count = $("#links-count");

        const total = urls.length;
        const totalClicks = urls.reduce((s, u) => s + u.clicks, 0);
        const avg = total > 0 ? (totalClicks / total).toFixed(1) : "0";

        $("#stat-total").textContent = total;
        $("#stat-clicks").textContent = totalClicks;
        $("#stat-avg").textContent = avg;

        buildTopLinks(urls);

        if (total === 0) {
            list.innerHTML = "";
            empty.classList.remove("hidden");
            count.textContent = "";
            return;
        }

        empty.classList.add("hidden");
        count.textContent = linkCount(total);

        list.innerHTML = urls.map((u, i) => `
            <div class="link-row" style="--i:${i}" onclick="router.go('detail', '${u.code}')">
                <div class="link-row__info">
                    <div class="link-row__code">${u.short_url}</div>
                    <div class="link-row__original">${escHtml(u.original_url)}</div>
                </div>
                <div class="link-row__clicks">
                    ${u.clicks}
                    <span class="link-row__clicks-label">${t("dash.clicks")}</span>
                </div>
                <div class="link-row__date">${formatDate(u.created_at)}</div>
            </div>
        `).join("");
    } catch (err) {
        if (err.status === 401) { logout(); }
    }
}

async function loadDashAnalytics() {
    let data;
    try {
        data = await api("/api/analytics");
    } catch (err) {
        if (err.status === 401) logout();
        return;
    }

    // Today's clicks from by_day
    try {
        const todayStr = new Date().toISOString().slice(0, 10);
        const todayEntry = (data.by_day || []).find(d => d.date === todayStr);
        const todayEl = $("#stat-today");
        if (todayEl) todayEl.textContent = todayEntry ? todayEntry.count : 0;
    } catch (e) { console.warn("dash: today stat", e); }

    // Hero area chart
    try {
        const chartEl = $("#dash-area-chart");
        const chartEmpty = $("#dash-chart-empty");
        if (data.by_day && data.by_day.length > 0) {
            if (chartEmpty) chartEmpty.remove();
            buildAreaChart(chartEl, data.by_day);
        }
    } catch (e) { console.warn("dash: area chart", e); }

    // Countries horizontal bars
    try {
        buildHBarChart($("#dash-countries"), data.by_country, "");
    } catch (e) { console.warn("dash: countries", e); }

    // Browsers horizontal bars
    try {
        buildHBarChart($("#dash-browsers"), data.by_browser, "analytics__bar-fill--browser");
    } catch (e) { console.warn("dash: browsers", e); }

    // Devices donut
    try {
        buildDonutChart($("#dash-donut"), data.by_device);
    } catch (e) { console.warn("dash: donut", e); }

    // Hourly heatmap
    try {
        buildHeatmap($("#dash-heatmap"), data.by_hour);
    } catch (e) { console.warn("dash: heatmap", e); }
}

function buildAreaChart(container, byDay) {
    const dateMap = {};
    byDay.forEach(d => { dateMap[d.date] = d.count; });
    const dates = byDay.map(d => d.date).sort();
    const start = new Date(dates[0]);
    const end = new Date(dates[dates.length - 1]);
    const allDates = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const key = d.toISOString().slice(0, 10);
        allDates.push({ date: key, count: dateMap[key] || 0 });
    }
    // Ensure at least 7 days for a decent chart
    if (allDates.length < 7) {
        const first = new Date(allDates[0].date);
        while (allDates.length < 7) {
            first.setDate(first.getDate() - 1);
            allDates.unshift({ date: first.toISOString().slice(0, 10), count: 0 });
        }
    }
    const display = allDates.length >= 14 ? allDates.slice(-30) : allDates;
    if (display.length < 2) return;

    const max = Math.max(...display.map(d => d.count), 1);
    const loc = getLang() === "ru" ? "ru-RU" : "en-US";

    const W = 1000;
    const H = 200;
    const padLeft = 45;
    const padRight = 15;
    const padTop = 10;
    const padBottom = 30;
    const chartW = W - padLeft - padRight;
    const chartH = H - padTop - padBottom;

    const points = display.map((d, i) => {
        const x = padLeft + (i / Math.max(display.length - 1, 1)) * chartW;
        const y = padTop + chartH - (d.count / max) * chartH;
        return { x, y, ...d };
    });

    // Smooth curve through points
    function catmullRom(pts) {
        if (pts.length < 2) return `M${pts[0].x},${pts[0].y}`;
        let path = `M${pts[0].x},${pts[0].y}`;
        for (let i = 0; i < pts.length - 1; i++) {
            const p0 = pts[Math.max(i - 1, 0)];
            const p1 = pts[i];
            const p2 = pts[i + 1];
            const p3 = pts[Math.min(i + 2, pts.length - 1)];
            const cp1x = p1.x + (p2.x - p0.x) / 6;
            const cp1y = p1.y + (p2.y - p0.y) / 6;
            const cp2x = p2.x - (p3.x - p1.x) / 6;
            const cp2y = p2.y - (p3.y - p1.y) / 6;
            path += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
        }
        return path;
    }

    const linePath = catmullRom(points);
    const areaPath = linePath + ` L${points[points.length - 1].x},${padTop + chartH} L${points[0].x},${padTop + chartH} Z`;

    // Y-axis labels (4-5 ticks)
    const tickCount = 4;
    let yLabels = '';
    let gridLines = '';
    for (let i = 0; i <= tickCount; i++) {
        const val = Math.round((max / tickCount) * i);
        const y = padTop + chartH - (i / tickCount) * chartH;
        yLabels += `<text x="${padLeft - 8}" y="${y + 4}" text-anchor="end" fill="var(--text-faint)" font-size="10" font-family="var(--font-mono)">${val}</text>`;
        gridLines += `<line x1="${padLeft}" y1="${y}" x2="${W - padRight}" y2="${y}" stroke="var(--border)" stroke-width="0.5" stroke-dasharray="4,4"/>`;
    }

    // X-axis labels (show ~6 labels evenly)
    const labelCount = Math.min(6, display.length);
    let xLabels = '';
    for (let i = 0; i < labelCount; i++) {
        const idx = Math.round((i / (labelCount - 1)) * (display.length - 1));
        const pt = points[idx];
        const label = new Date(pt.date + "T00:00:00").toLocaleDateString(loc, { month: "short", day: "numeric" });
        xLabels += `<text x="${pt.x}" y="${H - 5}" text-anchor="middle" fill="var(--text-faint)" font-size="10" font-family="var(--font-mono)">${label}</text>`;
    }

    // Hover dots
    const dots = points.map(p => {
        const label = new Date(p.date + "T00:00:00").toLocaleDateString(loc, { month: "short", day: "numeric" });
        return `<circle cx="${p.x}" cy="${p.y}" r="8" fill="#FF6B2C" stroke="#0B0D14" stroke-width="3" opacity="0" style="transition:opacity .15s">
            <title>${label}: ${p.count} ${t("dash.clicks")}</title>
        </circle>`;
    }).join("");

    container.innerHTML = `
        <svg viewBox="0 0 ${W} ${H}">
            <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#FF6B2C" stop-opacity="0.30"/>
                    <stop offset="80%" stop-color="#FF6B2C" stop-opacity="0.04"/>
                    <stop offset="100%" stop-color="#FF6B2C" stop-opacity="0"/>
                </linearGradient>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stop-color="#FF6B2C"/>
                    <stop offset="100%" stop-color="#FF9F43"/>
                </linearGradient>
                <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>
            ${gridLines}
            ${yLabels}
            ${xLabels}
            <path d="${areaPath}" fill="url(#areaGrad)" />
            <path d="${linePath}" fill="none" stroke="url(#lineGrad)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)"/>
            ${dots}
        </svg>
    `;

    // Hover show dots
    const svg = container.querySelector("svg");
    svg.addEventListener("mousemove", (e) => {
        const rect = svg.getBoundingClientRect();
        const scaleX = W / rect.width;
        const mouseX = (e.clientX - rect.left) * scaleX;
        const circles = svg.querySelectorAll("circle");
        circles.forEach(c => {
            const cx = parseFloat(c.getAttribute("cx"));
            c.setAttribute("opacity", Math.abs(cx - mouseX) < chartW / display.length ? "1" : "0");
        });
    });
    svg.addEventListener("mouseleave", () => {
        svg.querySelectorAll("circle").forEach(c => c.setAttribute("opacity", "0"));
    });
}

function buildDonutChart(container, byDevice) {
    if (!byDevice || byDevice.length === 0) {
        container.innerHTML = `<span style="font-size:12px;color:var(--text-faint)">${t("analytics.empty")}</span>`;
        return;
    }

    const colors = {
        desktop: "#3B82F6",
        mobile: "#FF6B2C",
        tablet: "#22C55E",
        bot: "#A855F7",
        other: "#F87171",
    };

    const total = byDevice.reduce((s, d) => s + d.count, 0);
    if (total === 0) {
        container.innerHTML = `<span style="font-size:12px;color:var(--text-faint)">${t("analytics.empty")}</span>`;
        return;
    }

    let gradParts = [];
    let cumPct = 0;
    byDevice.forEach(d => {
        const pct = (d.count / total) * 100;
        const deviceName = (d.name || 'Unknown').toLowerCase();
        const color = colors[deviceName] || colors.other;
        gradParts.push(`${color} ${cumPct}% ${cumPct + pct}%`);
        cumPct += pct;
    });

    const legend = byDevice.map(d => {
        const deviceName = (d.name || 'Unknown').toLowerCase();
        const color = colors[deviceName] || colors.other;
        return `<div class="dash__donut-legend-item">
            <span class="dash__donut-legend-dot" style="background:${color}"></span>
            <span>${escHtml(d.name || 'Unknown')}</span>
            <span class="dash__donut-legend-count">${d.count}</span>
        </div>`;
    }).join("");

    container.innerHTML = `
        <div class="dash__donut" style="background: conic-gradient(${gradParts.join(', ')})">
            <div class="dash__donut-hole">
                <span class="dash__donut-total">${total}</span>
                <span class="dash__donut-lbl">${t("dash.clicks")}</span>
            </div>
        </div>
        <div class="dash__donut-legend">${legend}</div>
    `;
}

function buildHeatmap(container, byHour) {
    if (!byHour || byHour.length === 0) {
        container.innerHTML = `<span style="font-size:12px;color:var(--text-faint)">${t("analytics.empty")}</span>`;
        return;
    }

    // byHour is an array of numbers [0,1,2,3,...]
    const max = Math.max(...byHour, 1);

    const cells = byHour.map((count, hour) => {
        let level = "";
        if (count === 0) level = "";
        else if (count / max <= 0.2) level = "dash__heatmap-cell--l1";
        else if (count / max <= 0.4) level = "dash__heatmap-cell--l2";
        else if (count / max <= 0.6) level = "dash__heatmap-cell--l3";
        else if (count / max <= 0.8) level = "dash__heatmap-cell--l4";
        else level = "dash__heatmap-cell--l5";
        return `<div>
            <div class="dash__heatmap-cell ${level}" title="${hour}:00 — ${count} ${t("dash.clicks")}"></div>
            <div class="dash__heatmap-label">${hour}</div>
        </div>`;
    }).join("");

    container.innerHTML = cells;
}

// ---- DETAIL VIEW ----

function renderDetail(container, code) {
    const token = localStorage.getItem("token");
    if (!token) { router.go("home"); return; }

    const tpl = $("#tpl-detail").content.cloneNode(true);
    container.innerHTML = "";
    container.appendChild(tpl);

    $("#detail-back").textContent = t("detail.back");
    $(".detail__clicks-label").textContent = t("detail.clicks");
    $$(".detail__meta-label").forEach((el, i) => {
        el.textContent = i === 0 ? t("detail.short_url") : t("detail.created");
    });
    $(".detail__chart-title").textContent = t("detail.chart");
    $("#detail-copy").textContent = t("detail.copy");
    $("#detail-delete").textContent = t("detail.delete");
    $("#detail-export").textContent = t("detail.export_csv");
    $("#detail-edit").title = t("detail.edit");
    $("#detail-edit-save").textContent = t("detail.save");
    $("#detail-edit-cancel").textContent = t("detail.cancel");

    // Analytics i18n
    $("#analytics-country-title").textContent = t("analytics.countries");
    $("#analytics-device-title").textContent = t("analytics.devices");
    $("#analytics-browser-title").textContent = t("analytics.browsers");
    $("#analytics-os-title").textContent = t("analytics.os");
    $("#analytics-hourly-title").textContent = t("analytics.hourly");
    $("#analytics-recent-title").textContent = t("analytics.recent");
    $("#analytics-empty").textContent = t("analytics.empty");
    $("#th-country").textContent = t("analytics.country");
    $("#th-city").textContent = t("analytics.city");
    $("#th-device").textContent = t("analytics.device");
    $("#th-browser").textContent = t("analytics.browser");
    $("#th-time").textContent = t("analytics.time");

    $("#detail-back").addEventListener("click", () => router.go("dashboard"));
    loadDetail(code);
}

async function loadDetail(code) {
    try {
        const [d, clickData] = await Promise.all([
            api(`/api/stats/${code}`),
            api(`/api/clicks/${code}`),
        ]);

        $("#detail-code").textContent = d.code;
        $("#detail-original").textContent = d.original_url;
        $("#detail-original").href = d.original_url;
        $("#detail-clicks").textContent = d.clicks;
        $("#detail-short").textContent = d.short_url;
        $("#detail-created").textContent = new Date(d.created_at).toLocaleString();

        buildDayChart(clickData.by_day);
        buildAnalytics(clickData);

        // Edit URL inline
        const editBtn = $("#detail-edit");
        const editRow = $("#detail-edit-row");
        const editInput = $("#detail-edit-input");
        const originalLink = $("#detail-original");

        editBtn.addEventListener("click", () => {
            editInput.value = originalLink.textContent;
            originalLink.parentElement.classList.add("hidden");
            editRow.classList.remove("hidden");
            editInput.focus();
        });

        $("#detail-edit-cancel").addEventListener("click", () => {
            editRow.classList.add("hidden");
            originalLink.parentElement.classList.remove("hidden");
        });

        $("#detail-edit-save").addEventListener("click", async () => {
            const newUrl = editInput.value.trim();
            if (!newUrl) return;
            try {
                const updated = await api(`/api/urls/${code}`, {
                    method: "PUT",
                    body: JSON.stringify({ url: newUrl }),
                });
                originalLink.textContent = updated.original_url;
                originalLink.href = updated.original_url;
                editRow.classList.add("hidden");
                originalLink.parentElement.classList.remove("hidden");
                toast(t("detail.updated"));
            } catch (err) {
                toast(err.message);
            }
        });

        editInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") { e.preventDefault(); $("#detail-edit-save").click(); }
            if (e.key === "Escape") { $("#detail-edit-cancel").click(); }
        });

        $("#detail-copy").addEventListener("click", () => {
            navigator.clipboard.writeText(d.short_url).then(() => toast(t("detail.copied")));
        });

        $("#detail-export").addEventListener("click", () => {
            exportClicksCsv(clickData.clicks, code);
        });

        $("#detail-delete").addEventListener("click", async () => {
            if (!confirm(t("detail.confirm"))) return;
            try {
                await api(`/api/urls/${code}`, { method: "DELETE" });
                toast(t("detail.deleted"));
                router.go("dashboard");
            } catch (err) {
                toast(err.message);
            }
        });
    } catch (err) {
        toast(err.message);
        router.go("dashboard");
    }
}

function buildDayChart(byDay) {
    const chart = $("#detail-chart");
    if (!byDay || byDay.length === 0) {
        chart.innerHTML = '<div class="chart-bar chart-bar--zero" style="height:3%;flex:1"></div>';
        return;
    }

    // Fill gaps in dates for continuous chart
    const dateMap = {};
    byDay.forEach(d => { dateMap[d.date] = d.count; });

    const dates = byDay.map(d => d.date).sort();
    const start = new Date(dates[0]);
    const end = new Date(dates[dates.length - 1]);
    const allDates = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const key = d.toISOString().slice(0, 10);
        allDates.push({ date: key, count: dateMap[key] || 0 });
    }

    // Show at least last 14 days
    const display = allDates.length >= 14 ? allDates.slice(-14) : allDates;
    const max = Math.max(...display.map(d => d.count), 1);
    const loc = getLang() === "ru" ? "ru-RU" : "en-US";

    chart.innerHTML = display.map(d => {
        const h = Math.max((d.count / max) * 100, 3);
        const cls = d.count === 0 ? "chart-bar chart-bar--zero" : "chart-bar";
        const label = new Date(d.date + "T00:00:00").toLocaleDateString(loc, { month: "short", day: "numeric" });
        return `<div class="${cls}" style="height:${h}%" title="${label}: ${d.count} ${t("dash.clicks")}"></div>`;
    }).join("");
}

function buildHBarChart(container, items, fillClass) {
    if (!items || items.length === 0) {
        container.innerHTML = `<span style="font-size:12px;color:var(--text-faint)">${t("analytics.empty")}</span>`;
        return;
    }
    const max = items[0]?.count || 1;
    container.innerHTML = items.slice(0, 6).map(item => {
        const pct = Math.max((item.count / max) * 100, 3);
        const label = Object.values(item)[0]; // first value is the label key
        return `
            <div class="analytics__bar-row">
                <span class="analytics__bar-label" title="${escHtml(String(label))}">${escHtml(String(label))}</span>
                <div class="analytics__bar-track">
                    <div class="analytics__bar-fill ${fillClass}" style="width:${pct}%"></div>
                </div>
                <span class="analytics__bar-count">${item.count}</span>
            </div>
        `;
    }).join("");
}

function buildHourChart(byHour) {
    const container = $("#analytics-hours");
    if (!byHour || byHour.length === 0) return;
    const max = Math.max(...byHour.map(h => h.count), 1);
    container.innerHTML = byHour.map(h => {
        const height = Math.max((h.count / max) * 100, 2);
        const cls = h.count === 0 ? "analytics__hour-bar analytics__hour-bar--zero" : "analytics__hour-bar";
        return `<div class="${cls}" style="height:${height}%" title="${h.hour}:00 — ${h.count} ${t("dash.clicks")}"></div>`;
    }).join("");
}

function buildClicksTable(clicks) {
    const tbody = $("#analytics-tbody");
    const empty = $("#analytics-empty");
    const table = $("#analytics-table");

    if (!clicks || clicks.length === 0) {
        table.classList.add("hidden");
        empty.classList.remove("hidden");
        return;
    }

    empty.classList.add("hidden");
    table.classList.remove("hidden");
    const loc = getLang() === "ru" ? "ru-RU" : "en-US";

    tbody.innerHTML = clicks.slice(0, 50).map(c => `
        <tr>
            <td class="td-ip">${escHtml(c.ip_address || "—")}</td>
            <td>${escHtml(c.country || "—")}</td>
            <td>${escHtml(c.city || "—")}</td>
            <td>${escHtml(c.device_type || "—")}</td>
            <td>${escHtml(c.browser || "—")}</td>
            <td>${c.clicked_at ? new Date(c.clicked_at).toLocaleString(loc) : "—"}</td>
        </tr>
    `).join("");
}

function buildAnalytics(data) {
    buildHBarChart($("#analytics-countries"), data.by_country, "");
    buildHBarChart($("#analytics-devices"), data.by_device, "analytics__bar-fill--device");
    buildHBarChart($("#analytics-browsers"), data.by_browser, "analytics__bar-fill--browser");
    buildHBarChart($("#analytics-os"), data.by_os, "analytics__bar-fill--os");
    buildHourChart(data.by_hour);
    buildClicksTable(data.clicks);
}

// ---- TOP LINKS CHART ----

function buildTopLinks(urls) {
    const container = $("#top-links");
    const empty = $("#top-empty");
    if (!container) return;

    const sorted = [...urls].sort((a, b) => b.clicks - a.clicks).slice(0, 5);

    if (sorted.length === 0 || sorted[0].clicks === 0) {
        container.innerHTML = "";
        if (empty) empty.classList.remove("hidden");
        return;
    }

    if (empty) empty.classList.add("hidden");
    const max = sorted[0].clicks;

    container.innerHTML = sorted.map((u, i) => {
        const pct = Math.max((u.clicks / max) * 100, 3);
        return `
            <div class="top-link" style="--i:${i}" onclick="router.go('detail', '${u.code}')">
                <div class="top-link__header">
                    <span class="top-link__rank">${i + 1}</span>
                    <div class="top-link__info">
                        <code class="top-link__code">${u.code}</code>
                        <span class="top-link__clicks">${u.clicks}</span>
                    </div>
                </div>
                <div class="top-link__bar-track">
                    <div class="top-link__bar" style="width:${pct}%"></div>
                </div>
            </div>
        `;
    }).join("");
}

// ---- API REFERENCE VIEW ----

function renderApi(container) {
    const token = localStorage.getItem("token");
    if (!token) { router.go("home"); return; }

    const tpl = $("#tpl-api").content.cloneNode(true);
    container.innerHTML = "";
    container.appendChild(tpl);

    $(".api-page__title").textContent = t("api.title");
    $(".api-page__subtitle").textContent = t("api.subtitle");

    const userStr = localStorage.getItem("user");
    const user = (userStr && userStr !== "undefined" && userStr !== "null") ? JSON.parse(userStr) : {};
    const apiToken = user.api_token || "";
    const maskedToken = apiToken.length > 15 ? apiToken.substring(0, 10) + "..." + apiToken.substring(apiToken.length - 6) : apiToken;
    const origin = location.origin;

    const endpoints = [
        {
            method: "POST", path: "/api/shorten", desc: t("api.ep1"),
            body: '{\n  "url": "https://example.com/very/long/path"\n}',
            response: '{\n  "short_url": "https://shorto.ru/Xk9mQ2",\n  "code": "Xk9mQ2"\n}',
            curl: `curl -X POST ${origin}/api/shorten \\\n  -H "Authorization: Bearer YOUR_TOKEN" \\\n  -H "Content-Type: application/json" \\\n  -d '{"url": "https://example.com/long"}'`,
            python: `import requests\n\nresp = requests.post("${origin}/api/shorten",\n    headers={"Authorization": "Bearer YOUR_TOKEN"},\n    json={"url": "https://example.com/long"})\n\ndata = resp.json()\nprint(data["short_url"])`,
            js: `const resp = await fetch("${origin}/api/shorten", {\n  method: "POST",\n  headers: {\n    "Authorization": "Bearer YOUR_TOKEN",\n    "Content-Type": "application/json"\n  },\n  body: JSON.stringify({ url: "https://example.com/long" })\n});\nconst data = await resp.json();\nconsole.log(data.short_url);`
        },
        {
            method: "GET", path: "/api/urls", desc: t("api.ep2"),
            body: null,
            response: '[\n  {\n    "code": "Xk9mQ2",\n    "original_url": "https://...",\n    "short_url": "https://shorto.ru/Xk9mQ2",\n    "clicks": 42,\n    "created_at": "2025-01-15T10:30:00"\n  }\n]',
            curl: `curl ${origin}/api/urls \\\n  -H "Authorization: Bearer YOUR_TOKEN"`,
            python: `import requests\n\nresp = requests.get("${origin}/api/urls",\n    headers={"Authorization": "Bearer YOUR_TOKEN"})\n\nfor u in resp.json():\n    print(f"{u['code']} -> {u['clicks']} clicks")`,
            js: `const resp = await fetch("${origin}/api/urls", {\n  headers: { "Authorization": "Bearer YOUR_TOKEN" }\n});\nconst urls = await resp.json();\nurls.forEach(u => console.log(u.code, u.clicks));`
        },
        {
            method: "GET", path: "/api/stats/{code}", desc: t("api.ep3"),
            body: null,
            response: '{\n  "code": "Xk9mQ2",\n  "original_url": "https://...",\n  "short_url": "https://shorto.ru/Xk9mQ2",\n  "clicks": 42,\n  "created_at": "2025-01-15T10:30:00"\n}',
            curl: `curl ${origin}/api/stats/Xk9mQ2 \\\n  -H "Authorization: Bearer YOUR_TOKEN"`,
            python: `import requests\n\nresp = requests.get("${origin}/api/stats/Xk9mQ2",\n    headers={"Authorization": "Bearer YOUR_TOKEN"})\n\nprint(resp.json())`,
            js: `const resp = await fetch("${origin}/api/stats/Xk9mQ2", {\n  headers: { "Authorization": "Bearer YOUR_TOKEN" }\n});\nconst stats = await resp.json();\nconsole.log(stats.clicks);`
        },
        {
            method: "DELETE", path: "/api/urls/{code}", desc: t("api.ep4"),
            body: null,
            response: '{\n  "ok": true\n}',
            curl: `curl -X DELETE ${origin}/api/urls/Xk9mQ2 \\\n  -H "Authorization: Bearer YOUR_TOKEN"`,
            python: `import requests\n\nresp = requests.delete("${origin}/api/urls/Xk9mQ2",\n    headers={"Authorization": "Bearer YOUR_TOKEN"})\n\nprint(resp.json())`,
            js: `const resp = await fetch("${origin}/api/urls/Xk9mQ2", {\n  method: "DELETE",\n  headers: { "Authorization": "Bearer YOUR_TOKEN" }\n});\nconst data = await resp.json();\nconsole.log(data.ok);`
        }
    ];

    const methodClass = { GET: "api-method--get", POST: "api-method--post", DELETE: "api-method--delete" };

    $("#api-content").innerHTML = `
        <div class="api-card">
            <h2 class="api-card__title">${t("api.auth_title")}</h2>
            <p class="api-card__desc">${t("api.auth_desc")} <code>Authorization</code>.</p>
            <div class="api-card__section">
                <span class="api-card__label">${t("api.header_format")}</span>
                <pre class="api-card__pre"><code>Authorization: Bearer &lt;your-token&gt;</code></pre>
            </div>
            <div class="api-card__section">
                <span class="api-card__label">${t("api.your_token")} <span style="font-size:10px;color:var(--text-faint);text-transform:none;letter-spacing:0;font-weight:400">${t("api.token_hint")}</span></span>
                <div class="api-card__token-row">
                    <code class="api-card__token-value" id="api-token-value">${maskedToken}</code>
                    <button class="btn btn--ghost btn--small" id="api-token-toggle">${t("api.show")}</button>
                    <button class="btn btn--ghost btn--small" id="api-token-copy">${t("api.copy")}</button>
                    <button class="btn btn--ghost btn--small" id="api-token-regen">${t("api.regenerate")}</button>
                </div>
            </div>
        </div>

        <h2 class="api-page__section-title">${t("api.endpoints")}</h2>

        ${endpoints.map((ep, idx) => `
            <div class="api-card api-card--endpoint">
                <div class="api-card__endpoint-header">
                    <span class="api-method ${methodClass[ep.method]}">${ep.method}</span>
                    <code class="api-card__path">${ep.path}</code>
                </div>
                <p class="api-card__desc">${ep.desc}</p>
                ${ep.body ? `
                    <div class="api-card__section">
                        <span class="api-card__label">${t("api.req_body")}</span>
                        <pre class="api-card__pre"><code>${escHtml(ep.body)}</code></pre>
                    </div>
                ` : ""}
                <div class="api-card__section">
                    <span class="api-card__label">${t("api.response")}</span>
                    <pre class="api-card__pre"><code>${escHtml(ep.response)}</code></pre>
                </div>
                <div class="api-card__section">
                    <span class="api-card__label">${t("api.examples")}</span>
                    <div class="api-card__tabs" data-ep="${idx}">
                        <button class="api-card__tab api-card__tab--active" data-lang="curl">curl</button>
                        <button class="api-card__tab" data-lang="python">Python</button>
                        <button class="api-card__tab" data-lang="js">JavaScript</button>
                    </div>
                    <pre class="api-card__pre api-card__example" data-ep="${idx}" data-lang="curl"><code>${escHtml(ep.curl)}</code></pre>
                    <pre class="api-card__pre api-card__example hidden" data-ep="${idx}" data-lang="python"><code>${escHtml(ep.python)}</code></pre>
                    <pre class="api-card__pre api-card__example hidden" data-ep="${idx}" data-lang="js"><code>${escHtml(ep.js)}</code></pre>
                </div>
            </div>
        `).join("")}
    `;

    // Wire token actions
    let tokenVisible = false;
    let currentApiToken = apiToken;
    function getMasked(t) { return t.length > 15 ? t.substring(0, 10) + "..." + t.substring(t.length - 6) : t; }

    $("#api-token-toggle").addEventListener("click", () => {
        tokenVisible = !tokenVisible;
        $("#api-token-value").textContent = tokenVisible ? currentApiToken : getMasked(currentApiToken);
        $("#api-token-toggle").textContent = tokenVisible ? t("api.hide") : t("api.show");
    });

    $("#api-token-copy").addEventListener("click", () => {
        navigator.clipboard.writeText(currentApiToken).then(() => {
            $("#api-token-copy").textContent = t("api.copied");
            setTimeout(() => { $("#api-token-copy").textContent = t("api.copy"); }, 1500);
        });
    });

    $("#api-token-regen").addEventListener("click", async () => {
        if (!confirm(t("api.regen_confirm"))) return;
        try {
            const data = await api("/api/token/regenerate", { method: "POST" });
            currentApiToken = data.api_token;
            const userStr = localStorage.getItem("user");
            const u = (userStr && userStr !== "undefined" && userStr !== "null") ? JSON.parse(userStr) : {};
            u.api_token = currentApiToken;
            localStorage.setItem("user", JSON.stringify(u));
            $("#api-token-value").textContent = tokenVisible ? currentApiToken : getMasked(currentApiToken);
            toast(t("api.regen_ok"));
        } catch (err) { toast(err.message); }
    });

    // Wire example tabs
    $$(".api-card__tabs").forEach(tabGroup => {
        const epIdx = tabGroup.dataset.ep;
        $$(".api-card__tab", tabGroup).forEach(tab => {
            tab.addEventListener("click", () => {
                $$(".api-card__tab", tabGroup).forEach(t => t.classList.remove("api-card__tab--active"));
                tab.classList.add("api-card__tab--active");
                $$(`.api-card__example[data-ep="${epIdx}"]`).forEach(ex => {
                    ex.classList.toggle("hidden", ex.dataset.lang !== tab.dataset.lang);
                });
            });
        });
    });
}

function exportClicksCsv(clicks, code) {
    if (!clicks || clicks.length === 0) {
        toast(t("analytics.empty"));
        return;
    }
    const fields = ["clicked_at", "ip_address", "country", "city", "device_type", "os", "browser"];
    const headers = [t("analytics.time"), "IP", t("analytics.country"), t("analytics.city"), t("analytics.device"), t("analytics.os"), t("analytics.browser")];

    let csv = headers.join(",") + "\n";
    clicks.forEach(c => {
        const row = fields.map(f => {
            let val = String(c[f] || "").replace(/"/g, '""');
            if (val.includes(",") || val.includes('"') || val.includes("\n")) val = `"${val}"`;
            return val;
        });
        csv += row.join(",") + "\n";
    });

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `shorto_${code}_clicks.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

function escHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ---- Helpers ----

function formatDate(iso) {
    const d = new Date(iso);
    const now = new Date();
    const diff = now - d;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return t("time.now");
    if (mins < 60) return `${mins} ${t("time.m")}`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} ${t("time.h")}`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} ${t("time.d")}`;
    const loc = getLang() === "ru" ? "ru-RU" : "en-US";
    return d.toLocaleDateString(loc, { month: "short", day: "numeric" });
}

// ---- Init ----
document.documentElement.lang = getLang() === "ru" ? "ru" : "en";
router.go(localStorage.getItem("token") ? "dashboard" : "home");
detectLang();
