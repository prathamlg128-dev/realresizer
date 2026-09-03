/* ==========================================================================
   RealResizer — SEO & Localization Configuration (single source of truth)
   ==========================================================================
   This file is the ONE authoritative place to define:

     - the published locales (locale registry)
     - the set of SEO pages and their localized metadata
     - the human-written translations for each localized page
     - the app-UI label dictionary used on localized pages
     - inter-page relations (related tools, breadcrumbs)

   The generator (gen_seo.js) reads ONLY from here to produce all static
   HTML, robots.txt and sitemap.xml deterministically. English is the
   fallback / default locale. Do not duplicate this information elsewhere.
   ========================================================================== */

// ---------------------------------------------------------------------------
// Locale registry — the authoritative list of published languages.
// Only entries here get localized SEO pages + hreflang annotations.
// ---------------------------------------------------------------------------
const LOCALES = [
  { code: 'en', name: 'English', htmlLang: 'en', dir: 'ltr', slug: 'en' },
  { code: 'es', name: 'Español', htmlLang: 'es', dir: 'ltr', slug: 'es' },
  { code: 'ja', name: '日本語', htmlLang: 'ja', dir: 'ltr', slug: 'ja' },
  { code: 'de', name: 'Deutsch', htmlLang: 'de', dir: 'ltr', slug: 'de' },
  { code: 'pt', name: 'Português', htmlLang: 'pt', dir: 'ltr', slug: 'pt' },
];

// x-default always points at the English (default/global) equivalent page.
const DEFAULT_LOCALE = 'en';

// ---------------------------------------------------------------------------
// Page model
// ---------------------------------------------------------------------------
// Each tool page has a stable URL slug (independent of language) plus a
// per-locale meta block. `preset` is the app preset activated on that page
// via window.REALRESIZER_DEFAULT_PRESET (must exist in PRESET_REGISTRY).
// `related` lists sibling tool slugs for the crawlable related-tools nav.
// ---------------------------------------------------------------------------

const TOOLS = ['instagram-story-resizer', 'instagram-reel-resizer', 'youtube-thumbnail-resizer', 'youtube-shorts-resizer', 'facebook-cover-resizer', 'linkedin-image-resizer', 'tiktok-image-resizer', 'twitter-image-resizer', 'spotify-image-resizer', 'apple-music-image-resizer', 'soundcloud-image-resizer'];

// Every localized page in every locale. A page is published for a locale when
// its metadata + content exist below. Only add a locale here when real,
// high-quality localized content is provided (no thin machine translations).
const PAGES = [
  {
    slug: 'instagram-story-resizer',
    preset: 'ig-story',
    // Describes whether this tool is published in a given locale.
    published: ['en', 'es', 'ja', 'de', 'pt'],
  },
  // The remaining tools are currently published in English only. Their
  // definition stays here so the system scales, but only `published` locales
  // get generated pages.
  { slug: 'instagram-reel-resizer', preset: 'ig-reel', published: ['en'] },
  { slug: 'youtube-thumbnail-resizer', preset: 'youtube', published: ['en'] },
  { slug: 'youtube-shorts-resizer', preset: 'youtube-short', published: ['en'] },
  { slug: 'facebook-cover-resizer', preset: 'fb-cover', published: ['en'] },
  { slug: 'linkedin-image-resizer', preset: 'linkedin', published: ['en'] },
  { slug: 'tiktok-image-resizer', preset: 'tiktok', published: ['en'] },
  { slug: 'twitter-image-resizer', preset: 'twitter-header', published: ['en'] },
  { slug: 'spotify-image-resizer', preset: 'spotify-cover', published: ['en'] },
  { slug: 'apple-music-image-resizer', preset: 'apple-cover', published: ['en'] },
  { slug: 'soundcloud-image-resizer', preset: 'soundcloud-banner', published: ['en'] },
];

// ---------------------------------------------------------------------------
// Localized page content — hand-written natural copy per locale.
// ---------------------------------------------------------------------------
// Structure per page/slug -> { [code]: { title, description, h1, intro,
//   rows: [{h2, p[], ul[]}], faq: [{q,a}], relatedLabel, footerNote } }
// ---------------------------------------------------------------------------

const FOOTER_NOTES = {
  en: 'All image processing happens locally in your browser.',
  es: 'Todo el procesamiento de imágenes ocurre localmente en tu navegador.',
  ja: 'すべての画像処理はブラウザ内でローカルに実行されます。',
  de: 'Die gesamte Bildverarbeitung erfolgt lokal in Ihrem Browser.',
  pt: 'Todo o processamento de imagens acontece localmente no seu navegador.',
};

// Short, natural link labels for the crawlable "Popular resizers" / related
// tools navigation (independent of the page H1s).
const NAV_LABELS = {
  'instagram-story-resizer': { en: 'Instagram Story Resizer', es: 'Redimensionador de Historias', ja: 'Instagramストーリー リサイズ', de: 'Instagram Story Resizer', pt: 'Redimensionador de Stories' },
  'instagram-reel-resizer': { en: 'Instagram Reel Resizer', es: 'Redimensionador de Reels', ja: 'Instagramリール リサイズ', de: 'Instagram Reel Resizer', pt: 'Redimensionador de Reels' },
  'youtube-thumbnail-resizer': { en: 'YouTube Thumbnail Resizer', es: 'Redimensionador de Miniaturas', ja: 'YouTubeサムネイル リサイズ', de: 'YouTube-Thumbnail Resizer', pt: 'Redimensionador de Miniaturas' },
  'youtube-shorts-resizer': { en: 'YouTube Shorts Resizer', es: 'Redimensionador de Shorts', ja: 'YouTubeショート リサイズ', de: 'YouTube Shorts Resizer', pt: 'Redimensionador de Shorts' },
  'facebook-cover-resizer': { en: 'Facebook Cover Resizer', es: 'Redimensionador de Portadas', ja: 'Facebookカバー リサイズ', de: 'Facebook Cover Resizer', pt: 'Redimensionador de Capa' },
  'linkedin-image-resizer': { en: 'LinkedIn Image Resizer', es: 'Redimensionador de Imágenes', ja: 'LinkedIn画像 リサイズ', de: 'LinkedIn Image Resizer', pt: 'Redimensionador de Imagens' },
  'tiktok-image-resizer': { en: 'TikTok Image Resizer', es: 'Redimensionador de Imágenes', ja: 'TikTok画像 リサイズ', de: 'TikTok Image Resizer', pt: 'Redimensionador de Imagens' },
  'twitter-image-resizer': { en: 'X (Twitter) Image Resizer', es: 'Redimensionador de Imágenes para X', ja: 'X（Twitter）画像 リサイズ', de: 'X (Twitter) Image Resizer', pt: 'Redimensionador de Imagens para X' },
  'spotify-image-resizer': { en: 'Spotify Image Resizer', es: 'Redimensionador de Imágenes de Spotify', ja: 'Spotify画像 リサイズ', de: 'Spotify Image Resizer', pt: 'Redimensionador de Imagens do Spotify' },
  'apple-music-image-resizer': { en: 'Apple Music Cover Resizer', es: 'Redimensionador de Portadas de Apple Music', ja: 'Apple Musicカバー リサイズ', de: 'Apple Music Cover Resizer', pt: 'Redimensionador de Capas do Apple Music' },
  'soundcloud-image-resizer': { en: 'SoundCloud Banner Resizer', es: 'Redimensionador de Banners de SoundCloud', ja: 'SoundCloudバナー リサイズ', de: 'SoundCloud Banner Resizer', pt: 'Redimensionador de Banners do SoundCloud' },
};

const CONTENT = {
  // ======================================================================
  // The remaining tools are English-only for now, but their English content
  // is preserved verbatim here so the generator reproduces the existing
  // English pages exactly (URLs and metadata unchanged).
  // ======================================================================
  'instagram-reel-resizer': {
    en: {
      title: 'Instagram Reel Resizer & Cropper | RealResizer',
      description: 'Crop and resize images and thumbnails to the Instagram Reel format in your browser. Private, precise, with an accurate Reel preview before export.',
      h1: 'Instagram Reel Resizer & Cropper',
      intro: 'Frame your content for the Instagram Reel format — full-screen, vertical, and ready to post. Preview the result in a Reel-style mockup before you cut.',
      rows: [
        { h2: 'Instagram Reels size and aspect ratio', p: [
          'Instagram Reels play full-screen in a vertical 9:16 format, matching the 1080 × 1920 pixel resolution commonly recommended for Reels. RealResizer’s Reel preset locks that 9:16 ratio so your full-frame image is ready to pair with a video cover or a still designed for the Reel feed.',
          'Because the Reel frame is tall and narrow, center your main subject and leave room around the edges. The interface elements of the Reel player occupy the top and bottom of the screen, so keep critical content within the central area.',
          'The same editor also prepares square Instagram feed posts (1080 × 1080) and portrait feed images (1080 × 1350), so you can resize an image for the whole Instagram feed from one place.',
        ] },
        { h2: 'How to crop an image for a Reel cover', ul: [
          'Upload or drag and drop an image into the tool.',
          'The Reel preset (9:16) is pre-selected on this page.',
          'Drag the rulers or the corner handle to frame the thumbnail.',
          'Cut, then preview it in the Reel mockup.',
          'Export in your preferred format.',
        ] },
        { h2: 'Quality and export', p: [
          'Stills you pair with Reels should stay sharp and high-resolution. Export in PNG or high-quality JPEG/WebP to keep fine detail, especially if your image contains text or a product you want viewers to read clearly at a glance.',
        ] },
      ],
      faq: [
        { q: 'What ratio should a Reel image use?', a: 'Reels are vertical at a 9:16 ratio, commonly 1080 × 1920 pixels.' },
        { q: 'Is this private?', a: 'Yes. Every image is processed locally in your browser; nothing is uploaded.' },
      ],
    },
  },
  'youtube-thumbnail-resizer': {
    en: {
      title: 'YouTube Thumbnail Resizer | RealResizer',
      description: 'Resize and crop images to the 1280×720 YouTube thumbnail ratio (16:9) in your browser. Private, precise, and ready for your next video.',
      h1: 'YouTube Thumbnail Resizer',
      intro: 'Crop and resize images to the 16:9 YouTube thumbnail format so your videos stand out in search and suggestions.',
      rows: [
        { h2: 'YouTube thumbnail size and aspect ratio', p: [
          'The standard YouTube thumbnail is 1280 × 720 pixels at a 16:9 widescreen ratio. RealResizer’s YouTube preset locks this 16:9 ratio so your image is framed exactly the way thumbnails are displayed across desktop, mobile, and TV.',
          'It helps to separate “resolution” from “aspect ratio.” Aspect ratio (16:9) decides the shape of the frame; resolution (1280×720) decides how much detail the file holds. RealResizer keeps the crop at the right 16:9 shape, and you can export a high-resolution PNG or JPEG to keep it crisp.',
          'Beyond video thumbnails, the editor can also prepare a YouTube channel banner (2560 × 1440) and profile avatar (800 × 800), so your entire channel art stays consistent as you resize an image for YouTube.',
        ] },
        { h2: 'How to resize an image for a YouTube thumbnail', ul: [
          'Upload or drag and drop an image into the tool.',
          'The YouTube Thumbnail preset (16:9) is pre-selected on this page.',
          'Adjust the crop to frame the most eye-catching part of the image.',
          'Check the desktop, mobile, and TV previews in the thumbnail mockup.',
          'Export at high quality so text stays sharp.',
        ] },
        { h2: 'Considerations for a great thumbnail', ul: [
          'Put faces and key subjects in the center–left, where thumbnail text often does not overlap.',
          'Keep any text large and legible at small thumbnail sizes.',
          'Preview across device sizes — most viewers see tiny thumbnails.',
          'Use high contrast so the image stands out in the results grid.',
        ] },
      ],
      faq: [
        { q: 'What size is a YouTube thumbnail?', a: 'The commonly recommended size is 1280 × 720 pixels at a 16:9 ratio.' },
        { q: 'Do I need a minimum resolution?', a: 'Sharpness matters because thumbnails are shown small. Export at high resolution to keep detail.' },
      ],
    },
  },
  'youtube-shorts-resizer': {
    en: {
      title: 'YouTube Shorts Resizer | RealResizer',
      description: 'Crop and resize images to the vertical 9:16 YouTube Shorts format in your browser. Private, precise, with a Shorts preview before you export.',
      h1: 'YouTube Shorts Resizer',
      intro: 'Frame your images for the vertical, full-screen YouTube Shorts format and preview how they’ll look before you post.',
      rows: [
        { h2: 'YouTube Shorts size and aspect ratio', p: [
          'YouTube Shorts are vertical and full-screen, using the familiar 9:16 ratio, commonly produced at 1080 × 1920 pixels. RealResizer’s Shorts preset locks that 9:16 ratio so your cover image or still is framed for the Shorts feed.',
          'As with other vertical formats, the Shorts player shows interface elements at the top and bottom of the screen. Keep important content in the central area of the frame and center your subject.',
          'When a Shorts cover needs a 16:9 pairing, the editor can also prepare a standard video thumbnail or channel banner, so resizing an image for YouTube Shorts and your channel stays consistent.',
        ] },
        { h2: 'How to resize an image for YouTube Shorts', ul: [
          'Upload or drag and drop an image into the tool.',
          'The Shorts preset (9:16) is pre-selected on this page.',
          'Adjust the crop with the rulers or the corner handle.',
          'Preview in the Shorts mockup, checking the mobile view.',
          'Export in your preferred format.',
        ] },
      ],
      faq: [
        { q: 'What ratio are YouTube Shorts?', a: 'Shorts are vertical at a 9:16 ratio, commonly 1080 × 1920 pixels.' },
        { q: 'Do my images stay private?', a: 'Yes — processing happens entirely in your browser.' },
      ],
    },
  },
  'facebook-cover-resizer': {
    en: {
      title: 'Facebook Cover Resizer | RealResizer',
      description: 'Crop and resize images for your Facebook cover in your browser. Use the suggested 851×315 ratio, keep it private, and preview before you post.',
      h1: 'Facebook Cover Resizer',
      intro: 'Resize and crop an image for your Facebook page cover and see how it will look before you publish.',
      rows: [
        { h2: 'Facebook cover dimensions and ratio', p: [
          'For desktop, the Facebook page cover is commonly prepared at a ratio close to 851 × 315 pixels (roughly 2.7:1). RealResizer’s Facebook Cover preset locks this wide, banner-like ratio so your cover is framed the way a cover is displayed.',
          'Covers are wide and short, so a tall source image will have most of its height cropped away. Crop with the central horizontal band in mind, and keep critical content away from the left edge where the profile picture overlaps the cover.',
          'The same editor can prepare other Facebook content too — a standard post image (1200 × 630), a square post (1080 × 1080), or an event cover (1920 × 1080) — so resizing an image for Facebook stays consistent across your page.',
        ] },
        { h2: 'How to resize an image for a Facebook cover', ul: [
          'Upload or drag and drop an image into the tool.',
          'The Facebook Cover preset is pre-selected on this page.',
          'Adjust the crop to frame the horizontal composition.',
          'Cut and preview the result.',
          'Export as PNG, JPEG, or WebP.',
        ] },
        { h2: 'Practical cropping considerations', p: [
          'Because covers display at a very wide ratio, design for the horizontal center of the image. Keep any text or key subjects well within the 2.7:1 frame, and avoid cropping out subjects near the very top and bottom of a tall source photo.',
        ] },
      ],
      faq: [
        { q: 'What ratio is a Facebook cover?', a: 'The desktop cover is commonly prepared at about 851 × 315 pixels, near a 2.7:1 ratio.' },
        { q: 'Is my cover image uploaded?', a: 'No. Everything is processed locally in your browser.' },
      ],
    },
  },
  'linkedin-image-resizer': {
    en: {
      title: 'LinkedIn Image Resizer | RealResizer',
      description: 'Crop and resize images for your LinkedIn posts, feed, and profile in your browser. Private, precise, and ready to share.',
      h1: 'LinkedIn Image Resizer',
      intro: 'Resize and crop images for LinkedIn posts and banners, keeping your feed content crisp and correctly proportioned.',
      rows: [
        { h2: 'LinkedIn image size and ratio', p: [
          'LinkedIn feed images are commonly shared at a landscape 1.91:1 ratio, frequently prepared at 1200 × 627 pixels. RealResizer’s LinkedIn preset locks this wide 1.91:1 ratio so your post image fits the feed cleanly.',
          'The same wide aspect ratio also suits many LinkedIn banners and hero images. Keeping a consistent landscape ratio across your feed and profile makes your page look polished and professional.',
          'The editor can also handle the LinkedIn profile banner (1584 × 396) and the company banner (1128 × 191), so resizing an image for LinkedIn keeps every part of your presence on-brand.',
        ] },
        { h2: 'How to resize an image for LinkedIn', ul: [
          'Upload or drag and drop an image into the tool.',
          'The LinkedIn preset (1.91:1) is pre-selected on this page.',
          'Adjust the crop to frame the horizontal composition.',
          'Cut and preview the result.',
          'Export in your preferred format.',
        ] },
        { h2: 'Considerations for a professional look', p: [
          'LinkedIn content is often viewed on mobile feeds, so keep text legible and subjects centered. A clean landscape crop that matches the 1.91:1 ratio reads well and avoids awkward empty bands when the feed automatically crops the image.',
        ] },
      ],
      faq: [
        { q: 'What ratio is a LinkedIn post image?', a: 'Feed images are commonly shared at a 1.91:1 landscape ratio, often 1200 × 627 pixels.' },
        { q: 'Are my images private?', a: 'Yes — all processing happens locally in your browser.' },
      ],
    },
  },
  'tiktok-image-resizer': {
    en: {
      title: 'TikTok Image Resizer | RealResizer',
      description: 'Crop and resize images for the vertical TikTok format in your browser. Use the 9:16 ratio, preview before you post, and keep it private.',
      h1: 'TikTok Image Resizer',
      intro: 'Frame your images for the full-screen, vertical TikTok format and preview how they’ll look before you post.',
      rows: [
        { h2: 'TikTok image size and aspect ratio', p: [
          'TikTok content plays full-screen in a vertical 9:16 ratio, commonly produced at 1080 × 1920 pixels. RealResizer’s TikTok preset locks that 9:16 ratio so your cover, still, or photo post is framed for the full-screen TikTok experience.',
          'As with other vertical formats, the interface places elements at the top and bottom of the screen. Keep important content in the central area and center your subject.',
          'The same editor can also prepare a shape for TikTok Reels and a TikTok profile picture (400 × 400), so resizing an image for TikTok covers both your content and your profile.',
        ] },
        { h2: 'How to resize an image for TikTok', ul: [
          'Upload or drag and drop an image into the tool.',
          'The TikTok preset (9:16) is pre-selected on this page.',
          'Adjust the crop to frame your subject.',
          'Cut and preview in the vertical TikTok mockup.',
          'Export in your preferred format.',
        ] },
        { h2: 'Cropping and export notes', p: [
          'TikTok is heavily viewed on mobile, so check that text and key subjects read at small sizes. Export at high quality to keep detail crisp on large phone screens.',
        ] },
      ],
      faq: [
        { q: 'What ratio is a TikTok image?', a: 'TikTok uses a vertical 9:16 ratio, commonly 1080 × 1920 pixels.' },
        { q: 'Do my images get uploaded?', a: 'No. All processing is done locally in your browser.' },
      ],
    },
  },
  'twitter-image-resizer': {
    en: {
      title: 'X (Twitter) Image Resizer | RealResizer',
      description: 'Crop and resize images for your X (Twitter) profile header, in-stream posts, and profile photo in your browser. Private, precise, and ready to post.',
      h1: 'X (Twitter) Image Resizer',
      intro: 'Resize and crop images for your X (Twitter) header, posts, and profile photo so your account looks polished on any device.',
      rows: [
        { h2: 'X (Twitter) header and post sizes', p: [
          'The X profile header is wide and short, commonly prepared around 1500 × 500 pixels (a 3:1 ratio). RealResizer’s X preset locks that exact shape so your header banner is framed correctly across mobile and desktop.',
          'In-stream images on X are displayed in a wide 16:9 frame (often 1600 × 900), and your profile photo is a square. The same tool can switch between these, so you can prepare a consistent header, post, and avatar without leaving the editor.',
        ] },
        { h2: 'How to resize an image for X (Twitter)', ul: [
          'Upload or drag and drop an image into the tool.',
          'Choose the X header, post, or profile preset to match your destination.',
          'Adjust the crop to frame the most important part of the image.',
          'Cut and preview the result across devices.',
          'Export in your preferred format.',
        ] },
        { h2: 'Cropping considerations for X', p: [
          'Banners are almost fully covered on mobile, so keep text and logos within the central safe area rather than the far edges. For post images, a wide 16:9 crop reads well in the feed and avoids the awkward auto-cropping that happens when the platform resizes your image.',
        ] },
      ],
      faq: [
        { q: 'What size is an X (Twitter) header?', a: 'The profile header is commonly prepared at about 1500 × 500 pixels, a 3:1 ratio.' },
        { q: 'Are my images private?', a: 'Yes — all processing happens locally in your browser.' },
      ],
    },
  },
  'spotify-image-resizer': {
    en: {
      title: 'Spotify Cover Resizer | RealResizer',
      description: 'Crop and resize images for your Spotify album cover, playlist artwork, canvas, and artist header in your browser. Private, precise, and ready to upload.',
      h1: 'Spotify Cover Resizer',
      intro: 'Resize and crop images for Spotify album covers, playlists, canvases, and artist headers so your music looks professional on every screen.',
      rows: [
        { h2: 'Spotify image sizes and ratios', p: [
          'Spotify album and playlist artwork is square (1:1), commonly at 1080 × 1080 pixels. RealResizer’s Spotify preset locks that square ratio so your cover fills the rounded tile cleanly without awkward cropping.',
          'Beyond the cover, Spotify also uses a vertical Canvas format (720 × 1280, 9:16) and a wide artist header (1920 × 640, 3:1). Preparing all three from one editor keeps your artist profile visually consistent.',
        ] },
        { h2: 'How to resize an image for a Spotify cover', ul: [
          'Upload or drag and drop an image into the tool.',
          'The Spotify cover preset (square 1:1) is pre-selected on this page.',
          'Adjust the crop to keep faces and titles within the safe area.',
          'Cut and preview the result before exporting.',
          'Export as a high-quality PNG or JPEG.',
        ] },
        { h2: 'Considerations for Spotify artwork', p: [
          'Spotify displays album art in small circular tiles as well as large full-screen views. Keep key text and artwork centered so it stays legible at thumbnail size, and use a high-resolution source so your cover stays sharp on big screens.',
        ] },
      ],
      faq: [
        { q: 'What size is a Spotify cover?', a: 'Spotify album and playlist artwork is square, commonly 1080 × 1080 pixels.' },
        { q: 'Does my artwork get uploaded?', a: 'No. All processing happens locally in your browser.' },
      ],
    },
  },
  'apple-music-image-resizer': {
    en: {
      title: 'Apple Music Cover Resizer | RealResizer',
      description: 'Crop and resize images for your Apple Music album cover, playlist cover, and artist banner in your browser. Private, precise, and ready to release.',
      h1: 'Apple Music Cover Resizer',
      intro: 'Resize and crop images for Apple Music album covers, playlists, and artist banners so your releases look sharp in the Apple Music catalog.',
      rows: [
        { h2: 'Apple Music image sizes and ratios', p: [
          'Apple Music album cover art is square (1:1) and commonly prepared at 3000 × 3000 pixels for maximum quality. RealResizer’s Apple Music preset locks this square ratio so your cover art displays correctly across the catalog.',
          'Playlist covers are also square (1080 × 1080), while the Apple Music artist profile uses a wide banner (2048 × 1152, 16:9). Covering all three with one editor keeps your artist page cohesive.',
        ] },
        { h2: 'How to resize an image for Apple Music', ul: [
          'Upload or drag and drop an image into the tool.',
          'The Apple Music cover preset (square 1:1) is pre-selected on this page.',
          'Adjust the crop to frame the artwork.',
          'Cut and preview before exporting.',
          'Export at high resolution to keep detail.',
        ] },
        { h2: 'Considerations for Apple Music artwork', p: [
          'Apple Music shows cover art at many sizes, from tiny search results to large full-screen views. Keep important elements centered and within the safe area, and export a high-resolution file so your artwork stays crisp wherever it appears.',
        ] },
      ],
      faq: [
        { q: 'What size is Apple Music cover art?', a: 'Apple Music album cover art is square, commonly prepared at 3000 × 3000 pixels.' },
        { q: 'Is my artwork processed privately?', a: 'Yes — everything happens locally in your browser.' },
      ],
    },
  },
  'soundcloud-image-resizer': {
    en: {
      title: 'SoundCloud Banner Resizer | RealResizer',
      description: 'Crop and resize images for your SoundCloud profile banner and artwork in your browser. Private, precise, and ready to share.',
      h1: 'SoundCloud Banner Resizer',
      intro: 'Resize and crop images for your SoundCloud profile banner and track artwork so your page looks sharp and on-brand.',
      rows: [
        { h2: 'SoundCloud banner size and ratio', p: [
          'The SoundCloud profile banner is very wide and short, commonly prepared around 2480 × 620 pixels (a 4:1 ratio). RealResizer’s SoundCloud preset locks that wide, banner-like shape so your artwork spans the page without distortion.',
          'Because the banner is so wide, a tall source image will have most of its height cropped away. Keep key text and logos within the central horizontal band so they stay visible on smaller screens.',
        ] },
        { h2: 'How to resize an image for SoundCloud', ul: [
          'Upload or drag and drop an image into the tool.',
          'The SoundCloud banner preset (4:1) is pre-selected on this page.',
          'Adjust the crop to frame the horizontal composition.',
          'Cut and preview the result.',
          'Export as PNG, JPEG, or WebP.',
        ] },
        { h2: 'Cropping considerations for SoundCloud', p: [
          'Banners look best when the main subject and text sit in the center band, well clear of the far left and right edges that get cut on narrower devices. A clean, wide crop keeps your profile looking professional.',
        ] },
      ],
      faq: [
        { q: 'What size is a SoundCloud banner?', a: 'The SoundCloud profile banner is commonly prepared at about 2480 × 620 pixels, a 4:1 ratio.' },
        { q: 'Are my images private?', a: 'Yes — all processing happens locally in your browser.' },
      ],
    },
  },

  // ======================================================================
  // Instagram Story — the multilingual pilot tool
  // ======================================================================
  'instagram-story-resizer': {
    en: {
      title: 'Instagram Story Resizer & Cropper | RealResizer',
      description: 'Crop and resize images to the 9:16 Instagram Story ratio right in your browser. Private, no uploads, and an accurate Story preview before you export.',
      h1: 'Instagram Story Resizer & Cropper',
      intro: 'Resize your photos to the 9:16 full-screen Story format and preview how they’ll look in an Instagram Story before you post.',
      rows: [
        { h2: 'The right dimensions for an Instagram Story', p: [
          'Instagram Stories fill the full phone screen in portrait orientation. The standard Story size is 1080 × 1920 pixels — the familiar 9:16 vertical aspect ratio. RealResizer’s Story preset locks this ratio automatically so your image is framed the way Stories expect.',
          'Because a Story is tall and narrow, a landscape source image will leave large areas cropped away on the sides. Use the crop preview to choose which part of your photo stays in frame, and keep key subjects away from the very top and bottom edges where the interface and safe zones live.',
          'The same editor can also prepare other Instagram formats — square feed posts (1080 × 1080), portrait feed images (1080 × 1350), and Reel covers (9:16) — so you can keep every image on your profile consistent as you resize an image for Instagram.',
        ] },
        { h2: 'How to resize an image for a Story', ul: [
          'Upload your image, or drag and drop it onto the tool.',
          'The Instagram Story preset (9:16) is pre-selected on this page.',
          'Adjust the crop with the rulers and the top-left handle to frame your subject.',
          'Cut, then preview the result in the Story mockup using the mobile view.',
          'Export as PNG, JPEG, or WebP.',
        ] },
        { h2: 'Cropping tips for Stories', ul: [
          'Keep important content comfortably inside the frame; focus on the center of the composition.',
          'Avoid placing text or faces too close to the top and bottom edges, where interface overlays can sit.',
          'Preview at mobile size to check that your subject reads well at a glance.',
        ] },
      ],
      faq: [
        { q: 'Does the image get uploaded anywhere?', a: 'No. All processing happens in your browser and your image never leaves your device.' },
        { q: 'What is the Instagram Story size?', a: 'Stories are displayed at a 9:16 vertical ratio, commonly produced at 1080 × 1920 pixels.' },
      ],
    },
    es: {
      title: 'Redimensionador y Recortador de Historias de Instagram | RealResizer',
      description: 'Recorta y redimensiona imágenes a la proporción 9:16 de las Historias de Instagram directamente en tu navegador. Privado, sin subidas y con una vista previa fiel antes de exportar.',
      h1: 'Redimensionador y Recortador de Historias de Instagram',
      intro: 'Ajusta tus fotos al formato 9:16 a pantalla completa de las Historias y comprueba cómo se verán antes de publicarlas.',
      rows: [
        { h2: 'Las dimensiones correctas para una Historia', p: [
          'Las Historias de Instagram ocupan toda la pantalla del móvil en posición vertical. El tamaño estándar de una Historia es de 1080 × 1920 píxeles, es decir, la conocida proporción vertical 9:16. El ajuste de Historia de RealResizer fija automáticamente esta proporción para que tu imagen quede encuadrada como espera la aplicación.',
          'Como una Historia es alta y estrecha, una imagen horizontal dejará mucho espacio recortado a los lados. Usa la vista previa de recorte para elegir qué parte de tu foto queda en el encuadre y mantén los sujetos importantes lejos de los bordes superior e inferior, donde se sitúan la interfaz y las zonas seguras.',
        ] },
        { h2: 'Cómo redimensionar una imagen para una Historia', ul: [
          'Sube tu imagen o arrástrala y suéltala en la herramienta.',
          'El ajuste de Historia de Instagram (9:16) viene preseleccionado en esta página.',
          'Ajusta el recorte con las reglas y la esquina superior izquierda para encuadrar tu tema.',
          'Recorta y luego mira el resultado en la maqueta de Historia con la vista móvil.',
          'Exporta en PNG, JPEG o WebP.',
        ] },
        { h2: 'Consejos de recorte para Historias', ul: [
          'Mantén el contenido importante cómodamente dentro del encuadre y céntrate en el centro de la composición.',
          'Evita colocar texto o caras demasiado cerca de los bordes superior e inferior, donde pueden aparecer elementos de la interfaz.',
          'Revisa la vista previa en tamaño móvil para comprobar que tu tema se lee bien de un vistazo.',
        ] },
      ],
      faq: [
        { q: '¿La imagen se sube a algún sitio?', a: 'No. Todo el procesamiento ocurre en tu navegador y tu imagen nunca sale de tu dispositivo.' },
        { q: '¿Qué tamaño tiene una Historia de Instagram?', a: 'Las Historias se muestran en proporción vertical 9:16 y normalmente se crean a 1080 × 1920 píxeles.' },
      ],
    },
    ja: {
      title: 'Instagramストーリー リサイズ・トリミング | RealResizer',
      description: '画像をInstagramストーリーの9:16の縦横比に、ブラウザ上でそのままリサイズ・トリミング。アップロード不要でプライベート、書き出す前に忠実なプレビューも確認できます。',
      h1: 'Instagramストーリー リサイズ・トリミングツール',
      intro: '写真を9:16の全画面ストーリー形式に整え、投稿する前にInstagramストーリーでの見え方をプレビューできます。',
      rows: [
        { h2: 'Instagramストーリーに合う正しいサイズ', p: [
          'Instagramストーリーは縦向きでスマートフォン画面いっぱいに表示されます。標準的なストーリーのサイズは1080×1920ピクセル、つまりおなじみの9:16の縦長アスペクト比です。RealResizerのストーリープリセットはこの比率を自動で固定するので、ストーリーで想定される形に画像が収まります。',
          'ストーリーは縦長のため、横長の元画像は左右が大きく切り取られます。クロップのプレビューで写真のどの部分をフレームに残すかを選び、インターフェースやセーフゾーンがある上下の端から主要な被写体を離して配置してください。',
        ] },
        { h2: 'ストーリー用に画像をリサイズする手順', ul: [
          '画像をアップロードするか、ツールにドラッグ＆ドロップします。',
          'このページではInstagramストーリーのプリセット（9:16）があらかじめ選択されています。',
          'ルーラーと左上のハンドルでクロップを調整し、被写体をフレームに収めます。',
          'カットしたら、モバイル表示でストーリーのモックアップに結果をプレビューします。',
          'PNG・JPEG・WebPで書き出します。',
        ] },
        { h2: 'ストーリーのクロップのコツ', ul: [
          '重要なコンテンツはフレーム内に余裕を持たせ、構図の中心に重点を置いてください。',
          'テキストや顔は、インターフェース要素が重なる可能性のある上下の端から離してください。',
          'モバイルサイズでプレビューし、被写体がひと目で分かるか確認しましょう。',
        ] },
      ],
      faq: [
        { q: '画像はどこかにアップロードされますか？', a: 'いいえ。処理はすべてブラウザ内で行われ、画像が端末の外に出ることはありません。' },
        { q: 'Instagramストーリーのサイズは？', a: 'ストーリーは9:16の縦長比率で表示され、一般的には1080×1920ピクセルで作成されます。' },
      ],
    },
    de: {
      title: 'Instagram Story Resizer – Bilder für Storys zuschneiden | RealResizer',
      description: 'Bilder auf das 9:16-Format für Instagram Storys direkt im Browser zuschneiden und skalieren. Privat, ohne Upload, mit realistischer Vorschau vor dem Export.',
      h1: 'Bilder für Instagram Storys zuschneiden',
      intro: 'Bringen Sie Ihre Fotos in das 9:16-Vollbild-Story-Format und sehen Sie vor dem Posten, wie sie in einer Instagram Story aussehen.',
      rows: [
        { h2: 'Die richtigen Maße für eine Instagram Story', p: [
          'Instagram Storys füllen im Hochformat den gesamten Telefonbildschirm. Die übliche Story-Größe beträgt 1080 × 1920 Pixel – das bekannte vertikale Seitenverhältnis 9:16. Der Story-Vorgabewert von RealResizer setzt dieses Verhältnis automatisch, sodass Ihr Bild genau so gerahmt ist, wie Storys es erwarten.',
          'Da eine Story hoch und schmal ist, werden bei einem Querformat-Bild an den Seiten große Bereiche abgeschnitten. Nutzen Sie die Zuschneide-Vorschau, um zu wählen, welcher Teil Ihres Fotos im Bild bleibt, und halten Sie wichtige Motive von den oberen und unteren Kanten fern, wo sich die Oberfläche und die sicheren Zonen befinden.',
        ] },
        { h2: 'So passen Sie ein Bild für eine Story an', ul: [
          'Laden Sie Ihr Bild hoch oder ziehen Sie es per Drag & Drop in das Werkzeug.',
          'Der Instagram-Story-Vorgabewert (9:16) ist auf dieser Seite vorausgewählt.',
          'Passen Sie den Ausschnitt mit den Linealen und dem Griff oben links an Ihr Motiv an.',
          'Schneiden Sie aus und zeigen Sie das Ergebnis in der Story-Vorschau mit der mobilen Ansicht an.',
          'Exportieren Sie als PNG, JPEG oder WebP.',
        ] },
        { h2: 'Tipps zum Zuschneiden für Storys', ul: [
          'Halten Sie wichtige Inhalte bequem innerhalb des Rahmens und konzentrieren Sie sich auf die Bildmitte.',
          'Vermeiden Sie Text oder Gesichter zu nahe an den oberen und unteren Kanten, wo Oberflächenelemente liegen können.',
          'Sehen Sie sich die Vorschau in mobiler Größe an, um zu prüfen, ob Ihr Motiv auf einen Blick erkennbar ist.',
        ] },
      ],
      faq: [
        { q: 'Wird das Bild irgendwo hochgeladen?', a: 'Nein. Die gesamte Verarbeitung erfolgt in Ihrem Browser, und Ihr Bild verlässt nie Ihr Gerät.' },
        { q: 'Welche Größe hat eine Instagram Story?', a: 'Storys werden im vertikalen Verhältnis 9:16 angezeigt, üblicherweise mit 1080 × 1920 Pixeln erzeugt.' },
      ],
    },
    pt: {
      title: 'Redimensionador e Recortador de Stories do Instagram | RealResizer',
      description: 'Recorte e redimensione imagens para a proporção 9:16 dos Stories do Instagram direto no navegador. Privado, sem uploads e com uma pré-visualização fiel antes de exportar.',
      h1: 'Redimensionador e Recortador de Stories do Instagram',
      intro: 'Ajuste suas fotos ao formato 9:16 de tela cheia dos Stories e veja como elas vão ficar antes de publicar.',
      rows: [
        { h2: 'As dimensões certas para um Story', p: [
          'Os Stories do Instagram ocupam toda a tela do celular na orientação vertical. O tamanho padrão de um Story é 1080 × 1920 pixels — a conhecida proporção vertical 9:16. O preset de Story do RealResizer fixa essa proporção automaticamente para que a sua imagem fique enquadrada como o Instagram espera.',
          'Como um Story é alto e estreito, uma imagem em paisagem deixa grandes áreas cortadas nas laterais. Use a pré-visualização de recorte para escolher qual parte da foto permanece no enquadramento e mantenha os assuntos principais longe das bordas superior e inferior, onde ficam a interface e as zonas seguras.',
        ] },
        { h2: 'Como redimensionar uma imagem para um Story', ul: [
          'Envie sua imagem ou arraste e solte na ferramenta.',
          'O preset de Story do Instagram (9:16) já vem selecionado nesta página.',
          'Ajuste o recorte com as réguas e a alça do canto superior esquerdo para enquadrar o assunto.',
          'Recorte e depois veja o resultado no mockup de Story usando a visualização mobile.',
          'Exporte em PNG, JPEG ou WebP.',
        ] },
        { h2: 'Dicas de recorte para Stories', ul: [
          'Mantenha o conteúdo importante confortavelmente dentro do quadro e foque no centro da composição.',
          'Evite textos ou rostos muito próximos das bordas superior e inferior, onde podem aparecer elementos da interface.',
          'Faça a pré-visualização em tamanho mobile para conferir se o assunto fica claro à primeira vista.',
        ] },
      ],
      faq: [
        { q: 'A imagem é enviada para algum lugar?', a: 'Não. Todo o processamento acontece no seu navegador e a sua imagem nunca sai do seu dispositivo.' },
        { q: 'Qual é o tamanho de um Story do Instagram?', a: 'Os Stories são exibidos na proporção vertical 9:16, geralmente criados em 1080 × 1920 pixels.' },
      ],
    },
  },
};

// ---------------------------------------------------------------------------
// App UI label dictionary (runtime, whitelisted static labels only)
// ---------------------------------------------------------------------------
// Localizes only the user-facing labels that are static in the HTML shell and
// are NOT rewritten by application logic. JS-generated strings (preset names,
// dimensions, status, toast, dynamic meta) intentionally stay English to avoid
// any risk of regressing the cropper. This is a deliberate correctness-first
// trade-off: English is the documented fallback for anything not here.
// Keys reference selectors used by the localizer on the SEO pages.
// ---------------------------------------------------------------------------
const APP_UI = {
  es: {
    '.upload-heading': 'Subir una imagen',
    '.upload-subtext': 'Arrastra y suelta aquí, pega desde el portapapeles o <span class="browse-link">explora archivos</span>',
    '.highlight-item:nth-of-type(1)': 'Subida cero al servidor',
    '.highlight-item:nth-of-type(2)': 'Procesamiento sin pérdida',
    '.highlight-item:nth-of-type(3)': 'Ajustes por plataforma',
    '#btn-mode-custom span': 'Personalizado',
    '#btn-mode-presets span': 'Ajustes',
    '.drawer-title': 'Elegir destino',
    '#presets-search': 'Buscar ajustes (p. ej. Instagram, YouTube, Twitter)…',
    '#btn-cut span': 'CORTAR',
    '#btn-undo span': 'Deshacer',
    '#btn-replace span': 'Reemplazar',
    '#btn-clear span': 'Cancelar',
    '#btn-preview span': 'Ver cómo se ve',
    '#btn-download-open span': 'Descargar',
    '#post-cut-preview-cta span': 'Ver cómo se ve',
    '#btn-execute-download': 'Exportar',
    '#btn-preview-close span': 'Volver a editar',
    '.privacy-badge span': '100% Local · Privado',
  },
  ja: {
    '.upload-heading': '画像をアップロード',
    '.upload-subtext': 'ここにドラッグ＆ドロップ、クリップボードから貼り付けるか、<span class="browse-link">ファイルを選択</span>',
    '.highlight-item:nth-of-type(1)': 'サーバーへアップロードなし',
    '.highlight-item:nth-of-type(2)': 'ロスレスのブラウザ処理',
    '.highlight-item:nth-of-type(3)': 'プラットフォーム別プリセット',
    '#btn-mode-custom span': 'カスタム',
    '#btn-mode-presets span': 'プリセット',
    '.drawer-title': '保存先を選択',
    '#presets-search': 'プリセットを検索（例: Instagram、YouTube、Twitter）…',
    '#btn-cut span': 'カット',
    '#btn-undo span': '元に戻す',
    '#btn-replace span': '画像を変更',
    '#btn-clear span': 'キャンセル',
    '#btn-preview span': '見え方を確認',
    '#btn-download-open span': 'ダウンロード',
    '#post-cut-preview-cta span': '見え方を確認',
    '#btn-execute-download': '書き出し',
    '#btn-preview-close span': '編集に戻る',
    '.privacy-badge span': '100% ローカル・プライベート',
  },
  de: {
    '.upload-heading': 'Bild hochladen',
    '.upload-subtext': 'Hierher ziehen, aus der Zwischenablage einfügen oder <span class="browse-link">Dateien durchsuchen</span>',
    '.highlight-item:nth-of-type(1)': 'Kein Server-Upload',
    '.highlight-item:nth-of-type(2)': 'Verlustfreie Verarbeitung',
    '.highlight-item:nth-of-type(3)': 'Vorgaben je Plattform',
    '#btn-mode-custom span': 'Benutzerdefiniert',
    '#btn-mode-presets span': 'Vorgaben',
    '.drawer-title': 'Ziel wählen',
    '#presets-search': 'Vorgaben suchen (z. B. Instagram, YouTube, Twitter)…',
    '#btn-cut span': 'SCHNEIDEN',
    '#btn-undo span': 'Rückgängig',
    '#btn-replace span': 'Ersetzen',
    '#btn-clear span': 'Abbrechen',
    '#btn-preview span': 'Ansehen',
    '#btn-download-open span': 'Herunterladen',
    '#post-cut-preview-cta span': 'Ansehen',
    '#btn-execute-download': 'Exportieren',
    '#btn-preview-close span': 'Zurück zum Editor',
    '.privacy-badge span': '100% Lokal · Privat',
  },
  pt: {
    '.upload-heading': 'Enviar uma imagem',
    '.upload-subtext': 'Arraste e solte aqui, cole da área de transferência ou <span class="browse-link">procure arquivos</span>',
    '.highlight-item:nth-of-type(1)': 'Zero upload para servidores',
    '.highlight-item:nth-of-type(2)': 'Processamento sem perdas',
    '.highlight-item:nth-of-type(3)': 'Predefinições por plataforma',
    '#btn-mode-custom span': 'Personalizado',
    '#btn-mode-presets span': 'Predefinições',
    '.drawer-title': 'Escolher destino',
    '#presets-search': 'Pesquisar predefinições (ex.: Instagram, YouTube, Twitter)…',
    '#btn-cut span': 'RECORTAR',
    '#btn-undo span': 'Desfazer',
    '#btn-replace span': 'Substituir',
    '#btn-clear span': 'Cancelar',
    '#btn-preview span': 'Ver como fica',
    '#btn-download-open span': 'Baixar',
    '#post-cut-preview-cta span': 'Ver como fica',
    '#btn-execute-download': 'Exportar',
    '#btn-preview-close span': 'Voltar para edição',
    '.privacy-badge span': '100% Local · Privado',
  },
};

// ---------------------------------------------------------------------------
// Language switcher labels (native names come from the LOCALES registry)
// ---------------------------------------------------------------------------
const SWITCH_LABEL = {
  en: 'Language',
  es: 'Idioma',
  ja: '言語',
  de: 'Sprache',
  pt: 'Idioma',
};

const COMMON = {
  en: { home: 'Home', allTools: 'All tools', sitemap: 'Sitemap', breadcrumbHome: 'Home', relatedLabel: 'Related tools', faqHeading: 'Frequently asked questions', footerHome: 'Home', footerAllTools: 'All tools' },
  es: { home: 'Inicio', allTools: 'Todas las herramientas', sitemap: 'Mapa del sitio', breadcrumbHome: 'Inicio', relatedLabel: 'Herramientas relacionadas', faqHeading: 'Preguntas frecuentes', footerHome: 'Inicio', footerAllTools: 'Todas las herramientas' },
  ja: { home: 'ホーム', allTools: 'すべてのツール', sitemap: 'サイトマップ', breadcrumbHome: 'ホーム', relatedLabel: '関連ツール', faqHeading: 'よくある質問', footerHome: 'ホーム', footerAllTools: 'すべてのツール' },
  de: { home: 'Startseite', allTools: 'Alle Werkzeuge', sitemap: 'Sitemap', breadcrumbHome: 'Startseite', relatedLabel: 'Verwandte Werkzeuge', faqHeading: 'Häufige Fragen', footerHome: 'Startseite', footerAllTools: 'Alle Werkzeuge' },
  pt: { home: 'Início', allTools: 'Todas as ferramentas', sitemap: 'Mapa do site', breadcrumbHome: 'Início', relatedLabel: 'Ferramentas relacionadas', faqHeading: 'Perguntas frequentes', footerHome: 'Início', footerAllTools: 'Todas as ferramentas' },
};

module.exports = {
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
};
