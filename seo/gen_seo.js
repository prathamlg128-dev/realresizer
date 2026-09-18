#!/usr/bin/env node
/* ==========================================================================
   RealResizer — Static SEO page generator (deterministic)
   ==========================================================================
   Reads ONLY from ./config.js (locale registry, page metadata, translations)
   and the app source (index.html) to emit all static SEO pages, robots.txt
   and sitemap.xml into the repository root.

   SITE_BASE_URL is configurable and read from the environment so the
   production domain is never hard-coded across the codebase:

       REALRESIZER_SITE_BASE_URL=https://your-domain.com node seo/gen_seo.js

   If not provided, the safe placeholder __SITE_BASE_URL__ is used and a
   prominent reminder is printed. The production build MUST supply a real
   value (never ship with the placeholder). Use --check to validate the
   output for leftover placeholders before deploying.

   Usage:
     node seo/gen_seo.js                 # dev (placeholder site base, prints warning)
     REALRESIZER_SITE_BASE_URL=... node seo/gen_seo.js   # production
     node seo/gen_seo.js --check         # validate generated output
   ========================================================================== */

const fs = require('fs');
const path = require('path');

const {
  LOCALES,
  DEFAULT_LOCALE,
  TOOLS,
  PAGES,
  CONTENT,
  APP_UI,
  SWITCH_LABEL,
  COMMON,
  FOOTER_NOTES,
  TRUST_REGISTRY,
  TRUST_LOCALIZED,
  NAV_LABELS,
} = require('./config');

// ---------------------------------------------------------------------------
// Configurable site base (single source for all absolute URLs)
// ---------------------------------------------------------------------------
const PLACEHOLDER_BASE = '__SITE_BASE_URL__';
const SITE_BASE_URL = process.env.REALRESIZER_SITE_BASE_URL || PLACEHOLDER_BASE;

const ROOT = path.join(__dirname, '..');
const CHECK = process.argv.includes('--check');

console.log('=== RealResizer SEO generator ===');
if (SITE_BASE_URL === PLACEHOLDER_BASE) {
  console.warn('\n[!] WARNING: SITE_BASE_URL is not set. Using placeholder:');
  console.warn(`    ${PLACEHOLDER_BASE}`);
  console.warn('    Canonical/hreflang/og/sitemap URLs will contain the placeholder.');
  console.warn('    Set REALRESIZER_SITE_BASE_URL for production. Do NOT deploy this output.\n');
} else {
  console.log(`Using SITE_BASE_URL = ${SITE_BASE_URL}\n`);
}

// ---------------------------------------------------------------------------
// App shell extraction (re-rooted assets, header split, H1 demotion)
// ---------------------------------------------------------------------------
const src = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const bodyMatch = src.match(/<body>([\s\S]*?)<\/body>/);
if (!bodyMatch) throw new Error('Could not extract body from index.html');
let appShell = bodyMatch[1];

appShell = appShell.replace('href="style.css"', 'href="/style.css"');
appShell = appShell.replace('src="app.js"', 'src="/app.js"');
appShell = appShell.replace(/\s*<script src="\/app\.js"><\/script>\s*$/, '');
appShell = appShell.replace(/\s*<footer class="app-footer">[\s\S]*?<\/footer>/, '');
// The app shell (root index.html) also carries its own crawlable seo-footer.
// Strip it too: generated pages must have exactly ONE footer — the unified,
// locale-aware one that buildPage emits below (prevents duplicate footers).
appShell = appShell.replace(/\s*<footer class="seo-footer">[\s\S]*?<\/footer>/, '');
// index.html (the root /) carries its own inline language-switch script for the
// live root page. Remove ALL inline <script> blocks from the extracted shell so
// generated SEO pages rely only on the scripts the generator injects itself
// (language-switch popover + localizer). Without this, the toggle script would
// run twice and the dropdown could never open. app.js is re-added by buildPage.
appShell = appShell.replace(/<script>(?!<\/script>)[\s\S]*?<\/script>/g, '');
// The root app shell carries an inline AdSense unit, but the live SEO pages do
// not show ads. Strip it from the extracted shell so a regeneration does not
// change ad behavior on the generated pages (ads remain root-only).
appShell = appShell.replace(/\s*<!-- Google AdSense -->[\s\S]*?<\/div>\s*/, '');
// Root-only SEO copy: the root index.html carries crawlable preview-first copy
// that must NOT appear inside every generated page. Strip it from the extracted
// shell using the explicit comment delimiters.
appShell = appShell.replace(/<!-- SEO-ROOT-COPY-START -->[\s\S]*?<!-- SEO-ROOT-COPY-END -->\s*/g, '');

const headerMatch = appShell.match(/\s*<header class="app-header">[\s\S]*?<\/header>/);
if (!headerMatch) throw new Error('Could not extract app-header');
let appHeaderBlock = headerMatch[0];
appShell = appShell.replace(/\s*<header class="app-header">[\s\S]*?<\/header>/, '');

appShell = appShell.replace('<h1 class="hero-title">', '<h2 class="hero-title">');
appShell = appShell.replace('</h1>', '</h2>');
appHeaderBlock = appHeaderBlock.replace('href="#" class="brand-logo"', 'href="/" class="brand-logo"');
// The app shell (index.html, i.e. the root /) now carries the language switch
// itself. Strip that static copy from the extracted header so the generator can
// inject a single, correctly localized switcher per page (avoids duplication).
appHeaderBlock = appHeaderBlock.replace(/\s*<nav class="seo-lang-switch"[\s\S]*?<\/nav>/, '');

const indent = (s, n = 4) => s.split('\n').map(l => ' '.repeat(n) + l).join('\n');

// ---------------------------------------------------------------------------
// Locale-aware routing
// ---------------------------------------------------------------------------
// Canonical route for a page, per kind:
//   home  : en -> '/',            other -> '/<locale>/'
//   trust : en -> '/<page>/',     other -> '/<locale>/<page>/'
//   tool  : always '/<locale>/<page>/'
// English is canonical at the root for both home ('/') and trust ('/<page>/');
// every other locale is grouped under its own /<locale>/ prefix so the two
// never collide.
function homeRoute(localeCode) {
  return localeCode === DEFAULT_LOCALE ? '/' : `/${localeCode}/`;
}
function trustRoute(localeCode, slug) {
  return localeCode === DEFAULT_LOCALE ? `/${slug}/` : `/${localeCode}/${slug}/`;
}
function toolRoute(localeCode, slug) {
  return `/${localeCode}/${slug}/`;
}
// Best link for (targetLocale, pageKind, pageSlug): keep the visitor on the
// SAME page but in the target locale when one exists; otherwise fall back to
// that page's English version — never to the target locale's Home.
function langPreservingHref(localeCode, kind, pageSlug) {
  if (kind === 'home') return homeRoute(localeCode);
  if (kind === 'trust') return trustRoute(localeCode, pageSlug);
  if (kind === 'tool' && pageSlug) {
    const page = PAGES.find(p => p.slug === pageSlug);
    const published = page && page.published.includes(localeCode);
    return published ? toolRoute(localeCode, pageSlug) : toolRoute(DEFAULT_LOCALE, pageSlug);
  }
  return homeRoute(localeCode);
}
// Localized content for a trust page; null when the locale has no translation.
function trustContentFor(localeCode, slug) {
  return (TRUST_LOCALIZED[slug] && TRUST_LOCALIZED[slug][localeCode]) || null;
}

// Theme toggle (dark/light) for standalone trust pages that do not load app.js.
// Mirrors app.js behaviour so the toggle stays live on pages without the tool.
const themeToggleScript = `    <script>
      (function () {
        var btn = document.getElementById('btn-theme-toggle');
        if (!btn) return;
        var darkIcon = btn.querySelector('.theme-dark-icon');
        var lightIcon = btn.querySelector('.theme-light-icon');
        function apply(theme) {
          var isLight = theme === 'light';
          if (isLight) document.documentElement.setAttribute('data-theme', 'light');
          else document.documentElement.removeAttribute('data-theme');
          btn.setAttribute('aria-pressed', String(isLight));
          btn.title = isLight ? 'Switch to dark theme' : 'Switch to light theme';
          btn.setAttribute('aria-label', btn.title);
          btn.classList.toggle('active', isLight);
          if (darkIcon) darkIcon.classList.toggle('hidden', isLight);
          if (lightIcon) lightIcon.classList.toggle('hidden', !isLight);
        }
        var saved = 'dark';
        try { saved = localStorage.getItem('rr_theme') || 'dark'; } catch (e) {}
        apply(saved);
        btn.addEventListener('click', function () {
          var next = btn.getAttribute('aria-pressed') === 'true' ? 'dark' : 'light';
          apply(next);
          try { localStorage.setItem('rr_theme', next); } catch (e) {}
        });
      })();
    </script>`;

// ---------------------------------------------------------------------------
// Language switcher (compact dropdown) — injected into header
// ---------------------------------------------------------------------------
// A single compact toggle labelled with the CURRENT locale's native language
// name. The selected language is determined purely by the page's URL/locale
// (no IP or browser-language detection, no redirects). Choosing a language
// navigates to the equivalent localized URL via the multilingual/hreflang map.
// The menu keeps real crawlable <a href> links so it degrades gracefully and
// stays indexable. A tiny optional inline script toggles the popover.
//
// For a page of (locale, kind, pageSlug), build the locale links so choosing a
// language always keeps the visitor on the SAME page, in that language:
// - kind 'home'  -> each locale links to that locale's home route
// - kind 'trust' -> each locale links to /<slug>/<page>/   (all locales exist)
// - kind 'tool'  -> /<slug>/<page>/ when published there, else the page's
//                   English /en/<page>/ (never that locale's Home)
function langSwitch(localeCode, kind, pageSlug) {
  const current = LOCALES.find(l => l.code === localeCode);
  const label = (SWITCH_LABEL[current.code] || SWITCH_LABEL.en);
  const items = LOCALES.map(loc => {
    const href = langPreservingHref(loc.code, kind, pageSlug);
    const active = loc.code === current.code ? ' aria-current="true"' : '';
    const role = ` role="menuitem"`;
    return `            <a href="${href}" hreflang="${loc.htmlLang}" lang="${loc.htmlLang}"${active}${role}>${loc.name}</a>`;
  }).join('\n');
  return `        <nav class="seo-lang-switch" aria-label="${label}">
          <button type="button" class="seo-lang-toggle" aria-haspopup="true" aria-expanded="false" aria-label="${label}">
            <span class="seo-lang-current">${current.name}</span>
            <svg class="seo-lang-caret" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <div class="seo-lang-menu" role="menu" aria-label="${label}">
${items}
          </div>
        </nav>`;
}

// Small self-contained script that turns the language switch into a popover.
// Safe to run on any page; it no-ops when the switch is absent.
const langSwitchScript = `(function () {
  document.querySelectorAll('.seo-lang-toggle').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var sw = btn.closest('.seo-lang-switch');
      var open = sw.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
  document.addEventListener('click', function () {
    document.querySelectorAll('.seo-lang-switch.is-open').forEach(function (sw) {
      sw.classList.remove('is-open');
      sw.querySelector('.seo-lang-toggle').setAttribute('aria-expanded', 'false');
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.seo-lang-switch.is-open').forEach(function (sw) {
        sw.classList.remove('is-open');
        sw.querySelector('.seo-lang-toggle').setAttribute('aria-expanded', 'false');
      });
    }
  });
})();`;

// ---------------------------------------------------------------------------
// Head builder (canonical, og, hreflang alternates)
// ---------------------------------------------------------------------------
// Crawlable physical favicon files (kept in sync with root index.html).
// Do not inline favicons as data URIs: Google and browsers cannot fetch them,
// so the generic/failed favicon is shown in search results and tabs.
const FAVICON_LINKS = `    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="icon" type="image/png" sizes="512x512" href="/favicon.png">
    <link rel="icon" href="/favicon.ico">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">`;

// alternates: array of {lang, url}; include x-default + every published locale.
function buildAlternates(alternates) {
  if (!alternates || !alternates.length) return '';
  return alternates.map(a =>
    `    <link rel="alternate" hreflang="${a.lang}" href="${a.url}">`
  ).join('\n');
}

function head({ htmlLang, dir, title, description, url, alternates }) {
  const ogType = 'website';
  return `  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="${url}">
${buildAlternates(alternates)}
    <meta property="og:type" content="${ogType}">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:site_name" content="RealResizer">
    <meta property="og:locale" content="${htmlLang.replace('-', '_')}">
    <meta property="og:image" content="${SITE_BASE_URL}/assets/og-preview.png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="RealResizer — preview how your image looks on every platform before you post">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${SITE_BASE_URL}/assets/og-preview.png">
    ${FAVICON_LINKS}
    <meta name="theme-color" content="#0a0a0a">
    <link rel="stylesheet" href="/style.css">
    <link rel="stylesheet" href="/seo.css">
    <meta name="google-adsense-account" content="ca-pub-7094442385340621">
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-NPX45SSSCG"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-NPX45SSSCG');
    </script>
  </head>`;
}

// ---------------------------------------------------------------------------
// Breadcrumb / related / content builders
// ---------------------------------------------------------------------------
function breadcrumb(items) {
  const li = items.map(it =>
    `        <li>${it.href ? `<a href="${it.href}">${it.label}</a>` : `<span aria-current="page">${it.label}</span>`}</li>`
  ).join('\n');
  return `      <nav class="seo-breadcrumb" aria-label="Breadcrumb">
        <ol>
${li}
        </ol>
      </nav>`;
}

// Related-tools nav. Links only to pages that exist: a tool is linked to its
// localized page when published in that locale, otherwise to the English page
// (always real). This guarantees no broken internal links.
function relatedToolsFor(page, localeCode) {
  const c = COMMON[localeCode] || COMMON.en;
  const others = TOOLS.filter(t => t !== page.slug);
  const links = others.map(slug => {
    const pubInLocale = CONTENT[slug] && CONTENT[slug][localeCode];
    const href = pubInLocale ? `/${localeCode}/${slug}/` : `/${DEFAULT_LOCALE}/${slug}/`;
    const label = (NAV_LABELS[slug] && NAV_LABELS[slug][localeCode]) || (NAV_LABELS[slug] && NAV_LABELS[slug].en) || CONTENT[slug][DEFAULT_LOCALE].h1;
    return `          <li><a href="${href}">${label}</a></li>`;
  }).join('\n');
  return `      <section class="seo-related" aria-label="${c.relatedLabel}">
        <h3>${c.relatedLabel}</h3>
        <ul>
${links}
        </ul>
      </section>`;
}

function faqBlock(items, localeCode) {
  const c = COMMON[localeCode] || COMMON.en;
  const details = items.map(f => `          <details class="seo-faq">
            <summary>${f.q}</summary>
            <p>${f.a}</p>
          </details>`).join('\n');
  return `      <section class="seo-faq-wrap" aria-label="${c.faqHeading}">
        <h2>${c.faqHeading}</h2>
${details}
      </section>`;
}

function content(localeCode, pageContent) {
  const c = COMMON[localeCode] || COMMON.en;
  const rowHtml = pageContent.rows.map(r => {
    const html = [];
    if (r.h2) html.push(`            <h2>${r.h2}</h2>`);
    (r.p || []).forEach(p => html.push(`            <p>${p}</p>`));
    if (r.ul) {
      html.push('            <ul>');
      r.ul.forEach(li => html.push(`              <li>${li}</li>`));
      html.push('            </ul>');
    }
    return `          <section class="seo-block">
${html.join('\n')}
          </section>`;
  }).join('\n');
  return `    <section class="seo-content">
        <div class="seo-container">
${rowHtml}
        </div>
        ${pageContent.faq ? faqBlock(pageContent.faq, localeCode) : ''}
    </section>`;
}

// ---------------------------------------------------------------------------
// App-UI localizer (whitelisted static labels only, preserves child elements)
// ---------------------------------------------------------------------------
// Builds an inline script that rewrites only the safe static labels for the
// page locale. It preserves SVG/child elements by editing text nodes, never
// clobbering whole element innerHTML (dropping icons) and never touching
// JS-generated strings. Placeholder attributes are handled for inputs.
function localizerScript(localeCode) {
  const dict = APP_UI[localeCode];
  if (!dict) return '';
  const firstTextNode = (el) => {
    let node = null;
    el.childNodes.forEach((n) => { if (n.nodeType === 3 && n.textContent.trim()) { if (!node) node = n; } });
    return node;
  };
  const lines = Object.keys(dict).map(sel => {
    const text = JSON.stringify(dict[sel]);
    return `      els('${sel}', ${text});`;
  }).join('\n');
  return `    <script>
      (function () {
        if (document.documentElement.getAttribute('lang') !== ${JSON.stringify(localeCode)}) return;
        function setInput(el, v) { if (el.tagName === 'INPUT') { el.placeholder = v; return true; } return false; }
        function setText(el, v) {
          var node = null;
          el.childNodes.forEach(function (n) {
            if (n.nodeType === 3 && n.textContent.trim() && !node) node = n;
          });
          if (node) node.textContent = v;
          else el.appendChild(document.createTextNode(v));
        }
        function els(sel, text) {
          document.querySelectorAll(sel).forEach(function (el) {
            if (setInput(el, text)) return;
            setText(el, text);
          });
        }
${lines}
      })();
    </script>`;
}

// ---------------------------------------------------------------------------
// Page assembly
// ---------------------------------------------------------------------------
function buildPage(opts) {
  const {
    localeCode, kind, toolSlug, preset, url, title, description, h1, intro,
    contentSection, jsonLdHtml, alternates, isHome, isTrust, currentCrumbs,
    breadcrumbHtml, isEnglishOnlyTool,
  } = opts;
  const loc = LOCALES.find(l => l.code === localeCode);
  const c = COMMON[localeCode] || COMMON.en;
  const parts = [];
  parts.push('<!DOCTYPE html>');
  parts.push(`<html lang="${loc.htmlLang}" dir="${loc.dir}">`);
  let headHtml = head({ htmlLang: loc.htmlLang, dir: loc.dir, title, description, url, alternates });
  if (jsonLdHtml) headHtml = headHtml.replace('  </head>', `${jsonLdHtml}\n  </head>`);
  parts.push(headHtml);
  parts.push('  <body>');

  // App masthead with the language switcher injected. The switch is placed as
  // the LAST item inside .header-actions so the header keeps exactly two flex
  // children (.header-brand left, .header-actions right) and all existing
  // controls plus the language selector stay grouped on the right.
  const switchHtml = langSwitch(localeCode, kind, toolSlug || null);
  let headerWithSwitch = appHeaderBlock.replace(
    /\n(\s*)<\/div>\n\s*<\/header>/,
    `\n$1  ${indent(switchHtml, 2)}\n$1</div>\n      </header>`
  );
  // Standalone trust pages do not load app.js, so header controls that depend on
  // it (sound fx + fullscreen) would be clickable but inert. Keep only the theme
  // toggle (wired by themeToggleScript) and the privacy badge on those pages.
  if (isTrust) {
    headerWithSwitch = headerWithSwitch
      .replace(/\s*<!-- Sound Toggle -->[\s\S]*?<\/button>/, '')
      .replace(/\s*<button type="button" class="btn-icon" id="btn-fullscreen"[\s\S]*?<\/button>/, '');
  }
  parts.push(`    <div class="seo-app-header-seat">
${indent(headerWithSwitch)}
    </div>`);

  // Breadcrumb (tool/SEO sub-pages only; the localized homepages render no
  // "Home" breadcrumb ribbon).
  if (!isHome) parts.push(breadcrumbHtml || breadcrumb(currentCrumbs));

  // SEO H1 + lede and the embedded app. On home pages the app/upload UI is the
  // first thing users see, so the SEO hero moves BELOW the app but stays the
  // page's single H1. On tool pages the original order (hero above tool) is kept.
  // Standalone trust pages render only the hero (no in-page tool/upload UI).
  const heroHtml = `    <section class="seo-hero">
      <h1>${h1}</h1>
      ${intro ? `<p class="seo-hero-lede">${intro}</p>` : ''}
    </section>`;
  const toolHtml = `    <div class="seo-tool-wrap${isHome ? ' seo-tool-wrap-home' : ''}">
${indent(appShell)}
    </div>`;
  if (isTrust) {
    parts.push(heroHtml);
  } else if (isHome) {
    parts.push(toolHtml);
    parts.push(heroHtml);
  } else {
    parts.push(heroHtml);
    parts.push(toolHtml);
  }

  // Supporting content (below the tool).
  parts.push(contentSection);

  // Unified footer.
  parts.push('<footer class="seo-footer">');
  if (!isHome && kind !== 'trust' && toolSlug) parts.push(relatedToolsFor(PAGES.find(p=>p.slug===toolSlug), localeCode));
  const footerHomeHref = homeRoute(localeCode);
  parts.push(`      <nav class="seo-footer-nav" aria-label="Footer">
        <ul>
          <li><a href="${footerHomeHref}">${c.footerHome}</a></li>
          <li><a href="${footerHomeHref}">${c.footerAllTools}</a></li>
          <li><a href="/sitemap.xml">${c.sitemap}</a></li>
          <li><a href="${trustRoute(localeCode, 'about')}">${c.footerAbout}</a></li>
          <li><a href="${trustRoute(localeCode, 'privacy-policy')}">${c.footerPrivacy}</a></li>
          <li><a href="${trustRoute(localeCode, 'terms')}">${c.footerTerms}</a></li>
          <li><a href="${trustRoute(localeCode, 'contact')}">${c.footerContact}</a></li>
          <li><span class="shortcut-hint"><kbd>Cmd</kbd>/<kbd>Ctrl</kbd> + <kbd>V</kbd> to paste</span></li>
        </ul>
      </nav>
      <p class="seo-footer-note">&copy; <span id="yr"></span> RealResizer &middot; ${FOOTER_NOTES[localeCode] || FOOTER_NOTES.en}</p>
    </footer>`);

  // Default preset init + footer year + language-switch popover + app bootstrap.
  // Trust pages never embed the tool (no app.js, no localizer): they only need
  // their own theme-toggle so the header's dark/light button stays live.
  const presetLine = (!isHome && !isTrust && preset) ? `window.REALRESIZER_DEFAULT_PRESET = '${preset}';` : '';
  parts.push(`    <script>
      ${presetLine}
      document.getElementById('yr').textContent = new Date().getFullYear();
      ${langSwitchScript}
    </script>`);
  if (isTrust) {
    parts.push(themeToggleScript);
  } else {
    const locScript = localizerScript(localeCode);
    if (locScript) parts.push(locScript);
    parts.push('    <script src="/app.js"></script>');
  }

  parts.push('  </body>');
  parts.push('</html>');
  // Normalize output: strip trailing whitespace from every line so generated
  // pages stay clean and diff-friendly regardless of app-shell whitespace.
  return parts.join('\n').replace(/[ \t]+$/gm, '');
}

// ---------------------------------------------------------------------------
// JSON-LD helpers
// ---------------------------------------------------------------------------
function jsonLdScripts(blocks) {
  return blocks.map(b => `    <script type="application/ld+json">${JSON.stringify(b)}</script>`).join('\n');
}

// Build hreflang alternates for a page: every locale that publishes the same
// kind/page (home, trust) or same tool, plus x-default -> English equivalent.
function alternatesFor(localeCode, kind, pageSlug) {
  const alts = [];
  const locales = (kind === 'home' || kind === 'trust')
    ? [...LOCALES]
    : LOCALES.filter(loc => {
        const page = PAGES.find(p => p.slug === pageSlug);
        return page && page.published.includes(loc.code);
      });
  // Order: en first, then others, for stable deterministic output.
  const ordered = [...locales].sort((a, b) => (a.code === DEFAULT_LOCALE ? -1 : b.code === DEFAULT_LOCALE ? 1 : a.code.localeCompare(b.code)));
  for (const loc of ordered) {
    let url;
    if (kind === 'home') url = `${SITE_BASE_URL}${homeRoute(loc.code)}`;
    else if (kind === 'trust') url = `${SITE_BASE_URL}${trustRoute(loc.code, pageSlug)}`;
    else url = `${SITE_BASE_URL}${toolRoute(loc.code, pageSlug)}`;
    alts.push({ lang: loc.htmlLang, url });
  }
  // x-default -> English equivalent (root / for home).
  let xDefaultUrl;
  if (kind === 'home') xDefaultUrl = `${SITE_BASE_URL}${homeRoute(DEFAULT_LOCALE)}`;
  else if (kind === 'trust') xDefaultUrl = `${SITE_BASE_URL}${trustRoute(DEFAULT_LOCALE, pageSlug)}`;
  else xDefaultUrl = `${SITE_BASE_URL}${toolRoute(DEFAULT_LOCALE, pageSlug)}`;
  alts.push({ lang: 'x-default', url: xDefaultUrl });
  return alts;
}

// ---------------------------------------------------------------------------
// Emit helper
// ---------------------------------------------------------------------------
function emit(relPath, contents) {
  const abs = path.join(ROOT, relPath);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, contents);
  console.log('WROTE', relPath, `(${contents.length} bytes)`);
}

// ===========================================================================
// Build pages
// ===========================================================================
const sitemapEntries = [];

// Localized home-page copy per language.
const HOME_COPY = {
  en: {
    title: 'RealResizer — Free Online Image Crop & Resize Tool',
    description: 'See how your image looks on Instagram, YouTube, TikTok, LinkedIn, X, and more — before you post. Crop and resize in realistic platform previews, entirely in your browser. No uploads, no account.',
    h1: 'See how your image looks on every platform — before you post.',
    intro: 'Crop, resize, and preview your image inside realistic platform mockups — YouTube, Instagram, TikTok, LinkedIn, X, and more. All processing happens locally in your browser. No uploads, no account, no data leaves your device.',
    h2: 'Preview before you publish',
    body: 'RealResizer shows you exactly how your image will appear on any platform — from an Instagram Story to a YouTube thumbnail to a LinkedIn feed post. Pick a destination, crop and resize to the exact dimensions with the platform preset, then cut and preview the result inside a realistic mockup. You see the final look before anything leaves your device. There are no uploads, no accounts, and no server-side processing: everything happens locally in your browser, which keeps your images private and the tool fast.',
    popularHeading: 'Popular resizers',
  },
  es: {
    title: 'RealResizer — Recorta y redimensiona imágenes gratis',
    description: 'Mira cómo se verá tu imagen en Instagram, YouTube, TikTok, LinkedIn, X y más antes de publicarla. Recorta y redimensiona con vistas previas realistas, directamente en tu navegador. Sin subidas, sin cuenta.',
    h1: 'Mira cómo se verá tu imagen en cada plataforma antes de publicar.',
    intro: 'Recorta, redimensiona y previsualiza tu imagen dentro de maquetas realistas de plataformas: YouTube, Instagram, TikTok, LinkedIn, X y más. Todo el procesamiento ocurre en tu navegador, sin subidas, sin cuentas y sin que tus datos salgan de tu dispositivo.',
    h2: 'Previsualiza antes de publicar',
    body: 'RealResizer te muestra exactamente cómo se verá tu imagen en cualquier plataforma, desde una Historia de Instagram hasta una miniatura de YouTube o una publicación en el feed de LinkedIn. Elige un destino, recorta y redimensiona con el ajuste de la plataforma, luego recorta y previsualiza el resultado dentro de una maqueta realista. Ves el resultado final antes de que cualquier cosa salga de tu dispositivo. No hay subidas, ni cuentas, ni procesamiento en servidores: todo ocurre en tu navegador.',
    popularHeading: 'Herramientas populares',
  },
  ja: {
    title: 'RealResizer — 無料のオンライン画像トリミング・リサイズ',
    description: 'Instagram、YouTube、TikTok、LinkedIn、X などで画像がどう見えるか、投稿する前に確認。リアルなプラットフォームプレビュー付きでブラウザのままトリミング・リサイズ。アップロード不要、アカウント不要。',
    h1: '投稿する前に、画像が各プラットフォームでどう見えるか確認。',
    intro: 'YouTube、Instagram、TikTok、LinkedIn、X など、リアルなプラットフォームモックアップ内で画像をトリミング・リサイズ・プレビュー。すべてブラウザ内で完結。アップロード不要、アカウント不要、端末の外にデータが出ません。',
    h2: '投稿する前にプレビュー',
    body: 'RealResizer は、Instagram ストーリーから YouTube サムネイル、LinkedIn フィード投稿まで、あらゆるプラットフォームでの画像の最終的な見え方を正確に表示します。プラットフォームを選んでプリセットでトリミング・リサイズし、カット後にリアルなモックアップでプレビュー。端末から外に出る前に最終イメージを確認できます。アップロードもアカウントもサーバー処理も不要、すべてブラウザ内でローカルに完結します。',
    popularHeading: '人気のツール',
  },
  de: {
    title: 'RealResizer — Bilder gratis online zuschneiden und skalieren',
    description: 'Sehen Sie, wie Ihr Bild auf Instagram, YouTube, TikTok, LinkedIn, X und mehr aussieht — bevor Sie posten. Zuschneiden und skalieren mit realistischen Plattform-Vorschauen, komplett im Browser. Kein Upload, kein Konto.',
    h1: 'Sehen Sie, wie Ihr Bild auf jeder Plattform aussieht — bevor Sie posten.',
    intro: 'Zuschneiden, skalieren und in realistischen Plattform-Mockups vorschauen: YouTube, Instagram, TikTok, LinkedIn, X und mehr. Die gesamte Verarbeitung erfolgt lokal in Ihrem Browser. Kein Upload, kein Konto, Ihre Daten verlassen nie Ihr Gerät.',
    h2: 'Vor dem Veröffentlichen ansehen',
    body: 'RealResizer zeigt Ihnen genau, wie Ihr Bild auf jeder Plattform erscheint — von einer Instagram Story über ein YouTube-Thumbnail bis zum LinkedIn-Feed-Beitrag. Wählen Sie ein Ziel, schneiden Sie mit der Plattform-Vorgabe zu, schneiden Sie aus und sehen Sie das Ergebnis in einem realistischen Mockup. Sie sehen das Endergebnis, bevor irgendetwas Ihr Gerät verlässt. Keine Uploads, keine Konten, keine Serververarbeitung: Alles passiert lokal in Ihrem Browser.',
    popularHeading: 'Beliebte Werkzeuge',
  },
  pt: {
    title: 'RealResizer — Recorte e redimensione imagens grátis',
    description: 'Veja como sua imagem fica no Instagram, YouTube, TikTok, LinkedIn, X e outros — antes de publicar. Recorte e redimensione com visualizações realistas de plataforma, tudo no seu navegador. Sem uploads, sem conta.',
    h1: 'Veja como sua imagem fica em cada plataforma — antes de publicar.',
    intro: 'Recorte, redimensione e previsualize sua imagem dentro de maquetes realistas de plataformas: YouTube, Instagram, TikTok, LinkedIn, X e outros. Todo o processamento acontece no seu navegador. Sem uploads, sem contas e sem que seus dados saiam do dispositivo.',
    h2: 'Previsualize antes de publicar',
    body: 'O RealResizer mostra exatamente como sua imagem aparecerá em qualquer plataforma — de uma Story do Instagram a uma miniatura do YouTube ou uma postagem no feed do LinkedIn. Escolha um destino, recorte e redimensione com a predefinição da plataforma, depois recorte e previsualize o resultado dentro de uma maquete realista. Você vê a aparência final antes que qualquer coisa saia do seu dispositivo. Sem uploads, sem contas e sem processamento em servidores: tudo acontece localmente no seu navegador.',
    popularHeading: 'Ferramentas populares',
  },
};

// -- Localized home pages (one per published locale) ------------------------
for (const loc of LOCALES) {
  const c = COMMON[loc.code] || COMMON.en;
  const cp = HOME_COPY[loc.code] || HOME_COPY.en;
  const url = loc.code === DEFAULT_LOCALE
    ? `${SITE_BASE_URL}/`
    : `${SITE_BASE_URL}/${loc.slug}/`;

  // Localized "Popular resizers" grid — links only to pages that exist for
  // this locale (published tools), else to that tool's English page.
  const popularLinks = TOOLS.map(slug => {
    const page = PAGES.find(p => p.slug === slug);
    const publishedHere = page.published.includes(loc.code);
    const href = publishedHere ? `/${loc.code}/${slug}/` : `/${DEFAULT_LOCALE}/${slug}/`;
    const label = (NAV_LABELS[slug] && NAV_LABELS[slug][loc.code]) || (NAV_LABELS[slug] && NAV_LABELS[slug].en) || CONTENT[slug][DEFAULT_LOCALE].h1;
    return `              <li><a href="${href}">${label}</a></li>`;
  }).join('\n');
  const popularNav = `
        <nav class="seo-popular" aria-label="${cp.popularHeading}">
          <h2>${cp.popularHeading}</h2>
          <ul>
${popularLinks}
          </ul>
        </nav>
      `;

  const jsonLd = jsonLdScripts([
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'RealResizer',
      url,
      applicationCategory: 'MultimediaApplication',
      operatingSystem: 'Any',
      description: cp.description,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      inLanguage: loc.htmlLang,
    },
    { '@context': 'https://schema.org', '@type': 'WebSite', name: 'RealResizer', url: `${SITE_BASE_URL}/`, inLanguage: loc.htmlLang },
  ]);

  const homeContent = content(loc.code, {
    rows: [{
      h2: cp.h2,
      p: [cp.body, cp.intro],
    }],
  });

  const html = buildPage({
    localeCode: loc.code,
    kind: 'home',
    toolSlug: null,
    preset: null,
    url,
    title: cp.title,
    description: cp.description,
    h1: cp.h1,
    intro: cp.intro,
    contentSection: homeContent + popularNav,
    jsonLdHtml: jsonLd,
    alternates: alternatesFor(loc.code, 'home', null),
    isHome: true,
    currentCrumbs: [{ label: c.home }],
    breadcrumbHtml: breadcrumb([{ label: c.home }]),
    isEnglishOnlyTool: false,
  });
  emit(`${loc.slug}/index.html`, html);
  // For the English home, canonical is root / — avoid adding /en/ to the sitemap
  // since it is a duplicate route (valid 200 but not the canonical home).
  if (loc.code !== DEFAULT_LOCALE) {
    sitemapEntries.push(`/${loc.slug}/`);
  }
}

// -- Tool pages (all published locales for each tool) -----------------------
for (const page of PAGES) {
  const slug = page.slug;
  const toolContent = CONTENT[slug] || {};
  for (const locCode of page.published) {
    const meta = toolContent[locCode];
    if (!meta) {
      console.warn(`[skip] no content for ${slug} in ${locCode}`);
      continue;
    }
    const loc = LOCALES.find(l => l.code === locCode);
    const c = COMMON[locCode] || COMMON.en;
    const url = `${SITE_BASE_URL}/${locCode}/${slug}/`;
    const isEnglishOnlyTool = page.published.length === 1 && page.published[0] === 'en';

    const crumbs = [
      { label: c.breadcrumbHome, href: homeRoute(locCode) },
      { label: meta.h1 },
    ];
    const jsonLd = jsonLdScripts([
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: meta.h1,
        url,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Any',
        description: meta.description,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        inLanguage: loc.htmlLang,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: c.breadcrumbHome, item: `${SITE_BASE_URL}${homeRoute(locCode)}` },
          { '@type': 'ListItem', position: 2, name: meta.h1, item: url },
        ],
      },
      { '@context': 'https://schema.org', '@type': 'WebSite', name: 'RealResizer', url: `${SITE_BASE_URL}/`, inLanguage: loc.htmlLang },
    ]);

    const html = buildPage({
      localeCode: locCode,
      kind: 'tool',
      toolSlug: slug,
      preset: page.preset,
      url,
      title: meta.title,
      description: meta.description,
      h1: meta.h1,
      intro: meta.intro,
      contentSection: content(locCode, meta),
      jsonLdHtml: jsonLd,
      alternates: isEnglishOnlyTool ? [] : alternatesFor(locCode, 'tool', slug),
      isHome: false,
      currentCrumbs: crumbs,
      breadcrumbHtml: breadcrumb(crumbs),
      isEnglishOnlyTool,
    });
    emit(`${locCode}/${slug}/index.html`, html);
    sitemapEntries.push(`/${locCode}/${slug}/`);
  }
}

// ---------------------------------------------------------------------------
// Trust pages (About / Privacy Policy / Terms / Contact) — one page per locale
// so the footer and language switcher can stay in-language everywhere:
//   en  -> /about/ /privacy-policy/ /terms/ /contact/   (canonical root)
//   es/ja/de/pt -> /<locale>/about/ … /<locale>/contact/
// English stays the canonical fallback for crawlers and the wiki team.
// ---------------------------------------------------------------------------
for (const trustPage of TRUST_REGISTRY) {
  const slug = trustPage.slug;
  for (const loc of LOCALES) {
    // English content lives on the registry entry itself; other locales use the
    // translated copy (every locale is translated, so a page always exists).
    const meta = loc.code === DEFAULT_LOCALE
      ? { h1: trustPage.h1, lede: trustPage.lede, rows: trustPage.rows, faq: trustPage.faq }
      : trustContentFor(loc.code, slug);
    if (!meta) {
      console.warn(`[skip] no trust content for ${slug} in ${loc.code}`);
      continue;
    }
    const c = COMMON[loc.code] || COMMON.en;
    const route = trustRoute(loc.code, slug);
    const url = `${SITE_BASE_URL}${route}`;
    const crumbs = [
      { label: c.breadcrumbHome, href: homeRoute(loc.code) },
      { label: meta.h1 },
    ];
    const jsonLd = jsonLdScripts([
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: meta.h1,
        url,
        inLanguage: loc.htmlLang,
        description: (meta.lede || meta.h1).replace(/<[^>]*>/g, ''),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: c.breadcrumbHome, item: `${SITE_BASE_URL}${homeRoute(loc.code)}` },
          { '@type': 'ListItem', position: 2, name: meta.h1, item: url },
        ],
      },
      { '@context': 'https://schema.org', '@type': 'WebSite', name: 'RealResizer', url: `${SITE_BASE_URL}/`, inLanguage: loc.htmlLang },
    ]);
    const html = buildPage({
      localeCode: loc.code,
      kind: 'trust',
      toolSlug: slug,
      preset: null,
      url,
      title: `${meta.h1} — RealResizer`,
      description: (meta.lede || meta.h1).replace(/<[^>]*>/g, ''),
      h1: meta.h1,
      intro: meta.lede,
      contentSection: content(loc.code, meta),
      jsonLdHtml: jsonLd,
      alternates: alternatesFor(loc.code, 'trust', slug),
      isHome: false,
      isTrust: true,
      isEnglishOnlyTool: false,
      currentCrumbs: crumbs,
      breadcrumbHtml: breadcrumb(crumbs),
    });
    emit(`${route}index.html`, html);
    sitemapEntries.push(route);
  }
}


// ===========================================================================
// robots.txt + sitemap.xml
// ===========================================================================
const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_BASE_URL}/sitemap.xml
`;
emit('robots.txt', robots);

// sitemap entries: root + all published pages (dedupe, stable order).
const sitemapUrls = ['/', ...sitemapEntries.filter((u, i, a) => a.indexOf(u) === i)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(u => `  <url>\n    <loc>${SITE_BASE_URL}${u}</loc>\n  </url>`).join('\n')}
</urlset>
`;
emit('sitemap.xml', sitemap);

// ===========================================================================
// Placeholder guard
// ===========================================================================
if (CHECK || SITE_BASE_URL !== PLACEHOLDER_BASE) {
  if (SITE_BASE_URL === PLACEHOLDER_BASE) {
    console.warn('\n[--check] SITE_BASE_URL is still the placeholder. Generation is production-INVALID.');
    process.exit(1);
  }
  console.log('\n[--check] No placeholder in output; SITE_BASE_URL is', SITE_BASE_URL);
}

console.log('\nDONE');
