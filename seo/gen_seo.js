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
// index.html (the root /) carries its own inline language-switch script for the
// live root page. Remove ALL inline <script> blocks from the extracted shell so
// generated SEO pages rely only on the scripts the generator injects itself
// (language-switch popover + localizer). Without this, the toggle script would
// run twice and the dropdown could never open. app.js is re-added by buildPage.
appShell = appShell.replace(/<script>(?!<\/script>)[\s\S]*?<\/script>/g, '');

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
// Language switcher (compact dropdown) — injected into header
// ---------------------------------------------------------------------------
// A single compact toggle labelled with the CURRENT locale's native language
// name. The selected language is determined purely by the page's URL/locale
// (no IP or browser-language detection, no redirects). Choosing a language
// navigates to the equivalent localized URL via the multilingual/hreflang map.
// The menu keeps real crawlable <a href> links so it degrades gracefully and
// stays indexable. A tiny optional inline script toggles the popover.
//
// For a page of (locale, kind, toolSlug), build the locale links:
// - kind 'home'  -> each locale links to /<slug>/   (that locale's home)
// - kind 'tool'  -> each locale links to /<slug>/<toolSlug>/ IF the tool is
//                   published in that locale, else falls back to /<slug>/
function langSwitch(localeCode, kind, toolSlug) {
  const current = LOCALES.find(l => l.code === localeCode);
  const label = (SWITCH_LABEL[current.code] || SWITCH_LABEL.en);
  const items = LOCALES.map(loc => {
    let href;
    if (kind === 'home') {
      href = `/${loc.slug}/`;
    } else {
      const page = PAGES.find(p => p.slug === toolSlug);
      const published = page && page.published.includes(loc.code);
      href = published ? `/${loc.slug}/${toolSlug}/` : `/${loc.slug}/`;
    }
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
const FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23f2f2f2' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='2' y='2' width='20' height='20' rx='2' fill='%230a0a0a'/%3E%3Cpath d='M6 3v18'/%3E%3Cpath d='M18 3v18'/%3E%3Cpath d='M3 6h18'/%3E%3Cpath d='M3 18h18'/%3E%3C/svg%3E";

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
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no">
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
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <link rel="icon" type="image/svg+xml" href="${FAVICON}">
    <meta name="theme-color" content="#0a0a0a">
    <link rel="stylesheet" href="/style.css">
    <link rel="stylesheet" href="/seo.css">
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
    contentSection, jsonLdHtml, alternates, isHome, currentCrumbs, breadcrumbHtml,
    isEnglishOnlyTool,
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
  const headerWithSwitch = appHeaderBlock.replace(
    /\n(\s*)<\/div>\n\s*<\/header>/,
    `\n$1  ${indent(switchHtml, 2)}\n$1</div>\n      </header>`
  );
  parts.push(`    <div class="seo-app-header-seat">
${indent(headerWithSwitch)}
    </div>`);

  // Breadcrumb (tool/SEO sub-pages only; the localized homepages render no
  // "Home" breadcrumb ribbon).
  if (!isHome) parts.push(breadcrumbHtml || breadcrumb(currentCrumbs));

  // SEO H1 + lede and the embedded app. On home pages the app/upload UI is the
  // first thing users see, so the SEO hero moves BELOW the app but stays the
  // page's single H1. On tool pages the original order (hero above tool) is kept.
  const heroHtml = `    <section class="seo-hero">
      <h1>${h1}</h1>
      ${intro ? `<p class="seo-hero-lede">${intro}</p>` : ''}
    </section>`;
  const toolHtml = `    <div class="seo-tool-wrap${isHome ? ' seo-tool-wrap-home' : ''}">
${indent(appShell)}
    </div>`;
  if (isHome) {
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
  if (!isHome) parts.push(relatedToolsFor(PAGES.find(p=>p.slug===toolSlug), localeCode));
  parts.push(`      <nav class="seo-footer-nav" aria-label="Footer">
        <ul>
          <li><a href="/">${c.footerHome}</a></li>
          <li><a href="/${localeCode}/">${c.footerAllTools}</a></li>
          <li><a href="/sitemap.xml">${c.sitemap}</a></li>
          <li><span class="shortcut-hint"><kbd>Cmd</kbd>/<kbd>Ctrl</kbd> + <kbd>V</kbd> to paste</span></li>
        </ul>
      </nav>
      <p class="seo-footer-note">&copy; <span id="yr"></span> RealResizer &middot; ${FOOTER_NOTES[localeCode] || FOOTER_NOTES.en}</p>
    </footer>`);

  // Default preset init + footer year + language-switch popover + app bootstrap.
  const presetLine = (!isHome && preset) ? `window.REALRESIZER_DEFAULT_PRESET = '${preset}';` : '';
  parts.push(`    <script>
      ${presetLine}
      document.getElementById('yr').textContent = new Date().getFullYear();
      ${langSwitchScript}
    </script>`);
  const locScript = localizerScript(localeCode);
  if (locScript) parts.push(locScript);
  parts.push('    <script src="/app.js"></script>');

  parts.push('  </body>');
  parts.push('</html>');
  return parts.join('\n');
}

// ---------------------------------------------------------------------------
// JSON-LD helpers
// ---------------------------------------------------------------------------
function jsonLdScripts(blocks) {
  return blocks.map(b => `    <script type="application/ld+json">${JSON.stringify(b)}</script>`).join('\n');
}

// Build hreflang alternates for a page: every other locale that publishes the
// same page kind (home) or same tool (tool), plus x-default -> English.
function alternatesFor(localeCode, kind, toolSlug) {
  const alts = [];
  const locales = kind === 'home'
    ? LOCALES
    : LOCALES.filter(loc => {
        const page = PAGES.find(p => p.slug === toolSlug);
        return page && page.published.includes(loc.code);
      });
  // Order: en first, then others, for stable deterministic output.
  const ordered = [...locales].sort((a, b) => (a.code === DEFAULT_LOCALE ? -1 : b.code === DEFAULT_LOCALE ? 1 : a.code.localeCompare(b.code)));
  for (const loc of ordered) {
    const url = kind === 'home'
      ? `${SITE_BASE_URL}/${loc.slug}/`
      : `${SITE_BASE_URL}/${loc.slug}/${toolSlug}/`;
    alts.push({ lang: loc.htmlLang, url });
  }
  // x-default -> English equivalent.
  const xDefaultUrl = kind === 'home'
    ? `${SITE_BASE_URL}/${DEFAULT_LOCALE}/`
    : `${SITE_BASE_URL}/${DEFAULT_LOCALE}/${toolSlug}/`;
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
    description: 'Crop and resize images for Instagram, YouTube, TikTok, Facebook, LinkedIn and more, entirely in your browser. No uploads, no accounts, no data leaves your device.',
    h1: 'Crop & resize images online, privately',
    intro: 'A fast, precise, browser-based image cropper and resizer with platform-tailored presets. Upload, pick a destination, adjust the crop, and export — all on your device.',
    h2: 'A privacy-first image resize & crop tool',
    body: 'RealResizer is a client-side image cropper and resizer. Your photos never leave your device: there are no uploads, no accounts, and no server-side processing. Everything happens locally in your browser, which keeps your images private and the tool fast. Choose a destination platform and RealResizer locks in the exact aspect ratio, so you get the framing right the first time — whether you want to resize a photo online for a post or crop an image for a cover.',
    popularHeading: 'Popular resizers',
  },
  es: {
    title: 'RealResizer — Recorta y redimensiona imágenes gratis',
    description: 'Recorta y redimensiona imágenes para Instagram, YouTube, TikTok, Facebook, LinkedIn y más, completamente en tu navegador. Sin subidas, sin cuentas y sin que tus datos salgan de tu dispositivo.',
    h1: 'Recorta y redimensiona imágenes en línea y en privado',
    intro: 'Un recortador y redimensionador de imágenes rápido y preciso que funciona en el navegador, con ajustes pensados para cada plataforma. Sube, elige un destino, ajusta el recorte y exporta: todo en tu dispositivo.',
    h2: 'Una herramienta de recorte y redimensionado que prioriza la privacidad',
    body: 'RealResizer es un recortador y redimensionador de imágenes que funciona en tu navegador. Tus fotos nunca salen de tu dispositivo: no hay subidas, ni cuentas, ni procesamiento en servidores. Todo ocurre localmente, lo que mantiene tus imágenes privadas y la herramienta rápida. Elige una plataforma de destino y RealResizer fija la proporción exacta, para que el encuadre salga bien a la primera.',
    popularHeading: 'Herramientas populares',
  },
  ja: {
    title: 'RealResizer — 無料のオンライン画像トリミング・リサイズ',
    description: 'Instagram、YouTube、TikTok、Facebook、LinkedInなどの画像をブラウザ上でそのままトリミング・リサイズ。アップロード不要、アカウント不要、データは端末の外に出ません。',
    h1: 'オンラインで画像をトリミング・リサイズ、プライベートに',
    intro: 'ブラウザで動作する高速で正確な画像トリミング・リサイズツール。プラットフォーム別のプリセット付き。アップロードして、保存先を選び、クロップを調整して書き出すまで、すべて端末内で完結します。',
    h2: 'プライバシーを最優先する画像リサイズ・トリミングツール',
    body: 'RealResizerはブラウザで動作する画像トリミング・リサイズツールです。写真が端末の外に出ることはありません。アップロードもアカウントもサーバー処理も不要で、すべてブラウザ内で完結します。画像はプライベートに保たれ、ツールも高速です。保存先のプラットフォームを選べば、RealResizerが正確なアスペクト比を自動で設定してくれます。',
    popularHeading: '人気のツール',
  },
  de: {
    title: 'RealResizer — Bilder gratis online zuschneiden und skalieren',
    description: 'Schneiden Sie Bilder für Instagram, YouTube, TikTok, Facebook, LinkedIn u. v. m. direkt im Browser zu und skalieren Sie sie. Kein Upload, keine Konten, Ihre Daten verlassen nie Ihr Gerät.',
    h1: 'Bilder online zuschneiden und skalieren — privat',
    intro: 'Eine schnelle, präzise, im Browser laufende Bild-Zuschneide- und Skalierungsfunktion mit Vorgaben je Plattform. Hochladen, Ziel wählen, Ausschnitt anpassen und exportieren — alles auf Ihrem Gerät.',
    h2: 'Ein datenschutzfreundliches Werkzeug zum Zuschneiden und Skalieren',
    body: 'RealResizer ist ein Bildbeschneider und -skalierer, der in Ihrem Browser läuft. Ihre Fotos verlassen nie Ihr Gerät: kein Upload, keine Konten und keine Serververarbeitung. Alles passiert lokal, sodass Ihre Bilder privat bleiben und das Werkzeug schnell ist. Wählen Sie eine Zielplattform, und RealResizer setzt das exakte Seitenverhältnis, damit der Bildausschnitt auf Anhieb stimmt.',
    popularHeading: 'Beliebte Werkzeuge',
  },
  pt: {
    title: 'RealResizer — Recorte e redimensione imagens grátis',
    description: 'Recorte e redimensione imagens para Instagram, YouTube, TikTok, Facebook, LinkedIn e outros, tudo no seu navegador. Sem uploads, sem contas e sem que seus dados saiam do dispositivo.',
    h1: 'Recorte e redimensione imagens online, de forma privada',
    intro: 'Uma ferramenta rápida e precisa para recortar e redimensionar imagens no navegador, com predefinições por plataforma. Envie, escolha um destino, ajuste o recorte e exporte — tudo no seu dispositivo.',
    h2: 'Uma ferramenta de recorte e redimensionamento que prioriza a privacidade',
    body: 'O RealResizer é um recortador e redimensionador de imagens que roda no seu navegador. Suas fotos nunca saem do seu dispositivo: sem uploads, sem contas e sem processamento em servidores. Tudo acontece localmente, mantendo suas imagens privadas e a ferramenta rápida. Escolha uma plataforma de destino e o RealResizer fixa a proporção exata, para o enquadramento sair certo de primeira.',
    popularHeading: 'Ferramentas populares',
  },
};

// -- Localized home pages (one per published locale) ------------------------
for (const loc of LOCALES) {
  const c = COMMON[loc.code] || COMMON.en;
  const cp = HOME_COPY[loc.code] || HOME_COPY.en;
  const url = `${SITE_BASE_URL}/${loc.slug}/`;

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
  sitemapEntries.push(`/${loc.slug}/`);
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
      { label: c.breadcrumbHome, href: '/' },
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
          { '@type': 'ListItem', position: 1, name: c.breadcrumbHome, item: `${SITE_BASE_URL}/` },
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
