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
  { slug: 'instagram-reel-resizer', preset: 'ig-reel', published: ['en', 'pt'] },
  { slug: 'youtube-thumbnail-resizer', preset: 'youtube', published: ['en', 'ja', 'pt'] },
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
          'Instagram Reels play full-screen in a vertical 9:16 format, matching the 1080 × 1920 pixel resolution commonly recommended for Reels. But unlike a Story — which lives for 24 hours and auto-loops in the Stories tray — a Reel is permanent content: it appears in the Reels tab, can be shown to non-followers on the Explore page, and its cover image is exactly what visitors see on your profile grid. The cover is what earns the tap, so it deserves the same care as any other profile photo.',
          'Because the Reel frame is tall and narrow, center your main subject and leave room around the edges. The interface elements of the Reel player occupy the top and bottom of the screen, so keep critical content within the central area.',
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
        { h2: 'Instagram Reel safe zone', p: [
          'The Reel player places interface elements — your profile name, caption, and action buttons — along the top and bottom edges of the screen. To keep text, logos, and faces clearly visible, leave roughly the top 14% and the bottom 20% of the frame free of critical content. The safest approach is to keep important subjects in the central horizontal band.',
        ] },
        { h2: 'See how it looks before you post', p: [
          'After you CUT the image, tap the <em>See how it looks</em> button to preview your Reel cover inside a realistic Instagram Reel mockup. Check the mobile view to confirm your subject reads well at a glance before you export.',
        ] },
        { h2: 'Related tools', p: [
          'Resizing for Instagram? You might also need the <a href="/en/instagram-story-resizer/">Instagram Story Resizer</a>, the <a href="/en/tiktok-image-resizer/">TikTok Image Resizer</a>, or the <a href="/en/twitter-image-resizer/">X (Twitter) Image Resizer</a>.',
        ] },
      ],
      faq: [
        { q: 'What ratio should a Reel image use?', a: 'Reels are vertical at a 9:16 ratio, commonly 1080 × 1920 pixels.' },
        { q: 'Is this private?', a: 'Yes. Every image is processed locally in your browser; nothing is uploaded.' },
        { q: 'What image formats are supported?', a: 'Input accepts JPG, JPEG, PNG, and WebP. You can export as PNG, JPEG, or WebP.' },
        { q: 'Is there a file-size limit?', a: 'No hard limit is enforced, but very large images (roughly over 20 megapixels) may slow an older or low-memory browser.' },
      ],
    },
    pt: {
      title: 'Redimensionador de Reels do Instagram | RealResizer',
      description: 'Recorte e redimensione imagens para o formato vertical 9:16 dos Reels (1080 × 1920) direto no navegador. Privado, com pré-visualização em mockup antes de exportar.',
      h1: 'Redimensionador de Reels do Instagram',
      intro: 'Deixe sua capa de Reel no formato vertical 9:16, pronta para o seu perfil. O RealResizer já deixa o preset de Reel selecionado nesta página e processa tudo localmente, sem upload de imagem.',
      rows: [
        { h2: 'Formato dos Reels', p: [
          'Os Reels são exibidos em tela cheia, no formato vertical 9:16 — frequentemente produzidos em 1080 × 1920 pixels. A diferença em relação ao Story é importante: um Story aparece no topo por cerca de 24 horas e depois desaparece. Já um Reel é um conteúdo mais duradouro: enquanto estiver disponível, ele pode aparecer no seu perfil, na guia Reels e em superfícies como o Explorar, dependendo do comportamento atual do produto Instagram. Como a capa do Reel é o que as pessoas veem primeiro, vale dedicar o mesmo cuidado que você dá a uma foto de perfil. Esses valores são uma orientação prática e podem mudar; confirme as orientações atuais do Instagram antes de publicar.',
        ] },
        { h2: 'Como recortar a imagem', ul: [
          'Envie sua imagem ou arraste e solte na ferramenta.',
          'Nesta página, o preset de Reel do Instagram (9:16) já vem selecionado.',
          'Ajuste o recorte com as réguas e as alças para enquadrar o assunto.',
          'Corte e visualize o resultado no mockup de Reel.',
          'Exporte em PNG, JPEG ou WebP.',
        ] },
        { h2: 'Qualidade e exportação', p: [
          'Capa de Reel costuma ser analisada rapidamente no feed, então detalhes precisam continuar nítidos. Exporte em PNG (sem perdas) ou em JPEG/WebP com alta qualidade, principalmente se a imagem tiver texto ou um produto que você quer que fique claro à primeira vista. Evite compressão desnecessária que possa borrar letras pequenas.',
        ] },
        { h2: 'Área segura', p: [
          'O player de Reels pode posicionar nome, legenda e botões de ação próximos às bordas do quadro. O posicionamento varia conforme a versão do app e o tipo de conteúdo. Como orientação prática — e não uma especificação fixa — mantenha o conteúdo importante na faixa central do quadro; de modo geral, deixar livres aproximadamente os 14% superiores e os 20% inferiores ajuda a proteger texto, rostos e logotipos.',
        ] },
        { h2: 'Veja o Reel antes de publicar', p: [
          'Depois de cortar, toque no botão <em>Ver como fica</em> para pré-visualizar sua capa dentro de um mockup de Reel. Use a visualização mobile para confirmar que nada importante está nas bordas antes de exportar.',
        ] },
        { h2: 'Ferramentas relacionadas', p: [
          'Preparando outros conteúdos do Instagram? Experimente o <a href="/pt/instagram-story-resizer/">Redimensionador de Stories</a> ou o <a href="/pt/youtube-thumbnail-resizer/">Redimensionador de Miniaturas do YouTube</a>. Para o formato vertical de outra plataforma, veja o <a href="/en/tiktok-image-resizer/">TikTok Image Resizer</a>. A <a href="/pt/">página inicial do RealResizer</a> lista todas as ferramentas.',
        ] },
      ],
      faq: [
        { q: 'Quais são as dimensões de um Reel?', a: 'Os Reels são verticais em 9:16, frequentemente produzidos em 1080 × 1920 pixels. São valores orientativos e podem mudar.' },
        { q: 'Qual é a diferença entre Reel e Story?', a: 'Um Story aparece no topo por cerca de 24 horas. Um Reel é um conteúdo mais duradouro: enquanto estiver disponível, pode aparecer na guia Reels, no perfil e em superfícies como o Explorar, dependendo do comportamento atual do Instagram.' },
        { q: 'O processamento é local?', a: 'Sim. Tudo acontece no seu navegador e a imagem nunca sai do seu dispositivo.' },
        { q: 'Quais formatos de exportação existem?', a: 'PNG (sem perdas), JPEG e WebP.' },
        { q: 'Os valores recomendados podem mudar?', a: 'Sim. Confirme as orientações atuais do Instagram antes de publicar.' },
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
          'The commonly recommended YouTube thumbnail size is 1280 × 720 pixels at a 16:9 widescreen ratio. Despite the 720p resolution, viewers almost never see a thumbnail at full size — it appears small in search results, on the home page, and in the related-video rail, and even smaller before it is scaled up on a TV. Because the crop is final on YouTube’s side, pre-cropping yourself to exactly 16:9 is the only way to control how your thumbnail is framed.',
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
        { h2: 'YouTube thumbnail safe zone', p: [
          'The bottom-right corner of a thumbnail is overlaid by the video duration badge on desktop, and mobile viewers see thumbnails at a very small size. Keep faces, text, and logos in the central 80–90% of the frame and avoid the bottom-right corner. If your thumbnail contains text, keep it large and centered so it stays legible when the thumbnail is displayed at thumbnail size in search results.',
        ] },
        { h2: 'See how it looks before you post', p: [
          'After you CUT the image, tap the <em>See how it looks</em> button to preview your thumbnail across desktop, mobile, and TV views. Check each device to confirm your subject reads clearly at small sizes.',
        ] },
        { h2: 'Related tools', p: [
          'Pairing your thumbnail with a Shorts video? Try the <a href="/en/youtube-shorts-resizer/">YouTube Shorts Resizer</a>. You might also need the <a href="/en/facebook-cover-resizer/">Facebook Cover Resizer</a> or the <a href="/en/spotify-image-resizer/">Spotify Cover Resizer</a> for your channel assets.',
        ] },
      ],
      faq: [
        { q: 'What size is a YouTube thumbnail?', a: 'The commonly recommended size is 1280 × 720 pixels at a 16:9 ratio.' },
        { q: 'Do I need a minimum resolution?', a: 'Sharpness matters because thumbnails are shown small. Export at high resolution to keep detail.' },
        { q: 'What if my original image is not 16:9?', a: 'The tool crops to 16:9 so nothing is distorted. YouTube would otherwise scale or crop non-16:9 images itself.' },
        { q: 'Which export formats keep thumbnails sharp?', a: 'PNG is lossless. JPEG and WebP are also supported with adjustable quality, though they trade a little detail for smaller files.' },
      ],
    },
    ja: {
      title: 'YouTubeサムネイルのサイズ調整・切り抜き | RealResizer',
      description: 'YouTubeサムネイルを16:9（1280×720）の形式に、ブラウザ上でそのままリサイズ・切り抜き。アップロード不要、デスクトップ・モバイル・TVのプレビューを書き出す前に確認できます。',
      h1: 'YouTubeサムネイル リサイズ＆クロップ',
      intro: 'YouTubeのサムネイルは、検索結果やおすすめ、関連動画などで比較的小さく表示されることが多くあります。そのため、何をはっきり見せたいかという構図と、文字の読みやすさがとても大切です。RealResizerなら、YouTubeサムネイル用のプリセットで画像をブラウザ上でそのまま切り抜けます。アップロードの必要はなく、画像が端末の外に出ることもありません。',
      rows: [
        { h2: 'サムネイルの推奨サイズ（16:9）', p: [
          'YouTubeでよく使われるサムネイルの作業サイズは1280×720ピクセル、16:9のワイド比率です。解像度と同じくらい重要なのがアスペクト比です。16:9で切り抜いておかないと、投稿後にYouTube側で拡大・クロップされて狙った構図が崩れてしまうことがあります。またサムネイルは検索結果やおすすめ欄では小さく表示されます。細かいディテールを詰め込むより、小さい表示でも印象が伝わる構図を優先しましょう。推奨サイズは変わる可能性があるため、投稿前にYouTubeの最新のガイドラインを確認することをおすすめします。',
        ] },
        { h2: 'サムネイル用に画像を切り抜く手順', ul: [
          '画像をアップロードするか、ツールにドラッグ＆ドロップします。',
          'このページではYouTubeサムネイルのプリセット（16:9）があらかじめ選択されています。',
          'ルーラーとハンドルでクロップを調整し、見せたい部分をフレームの中心近くに配置します。',
          'カットしたら、サムネイルのモックアップでデスクトップ・モバイル・TVの各表示にプレビューします。',
          'PNG・JPEG・WebPで書き出します。',
        ] },
        { h2: '目を引くサムネイルのコツ', ul: [
          '被写体をフレームの中央寄りに配置し、何を伝えたいのかが一目で分かる構図にします。',
          '小さすぎるテキストは避け、縮小表示でも読める大きさを保ちます。',
          '余白を残し、情報を詰め込みすぎないようにします。',
          '書き出す前にクロップの位置を確認し、狙った構図になっているか見直します。',
          'コントラストを高め、検索結果でも背景から浮き上がるようにします。',
        ] },
        { h2: '安全領域と構図', p: [
          'サムネイルには、表示される場所よって再生時間のバッジや関連動画のUIなどの要素が重なることがあります。例えばデスクトップのYouTubeでは右下に再生時間が表示されることがあります。こうした要素は表示環境によって変わるため、「厳密な公式の仕様」ではなく「実用的な構図の目安」として考えてください。顔やテキスト、ロゴはフレームの中央付近、おおよそ中央80〜90%の範囲に収めると安全です。',
        ] },
        { h2: '公開前にプレビューで確認', p: [
          'カットしたら<em>見え方を確認</em>ボタンをタップすると、デスクトップ・モバイル・TVの各表示でサムネイルをプレビューできます。小さなサイズでも被写体がはっきり読めるか、書き出す前にそれぞれの表示で確認しましょう。',
        ] },
        { h2: '関連ツール', p: [
          'YouTubeの他のコンテンツも準備しますか？ <a href="/en/youtube-shorts-resizer/">YouTubeショート リサイズ</a>や<a href="/ja/instagram-story-resizer/">Instagramストーリー リサイズ</a>もお試しください。ホームの<a href="/ja/">RealResizer（日本語）</a>では全てのツールを一覧できます。',
        ] },
      ],
      faq: [
        { q: 'YouTubeサムネイルはどのサイズにすればよいですか？', a: 'よく使われる作業サイズは1280×720ピクセル（16:9）です。ただしこれは目安で、変わる可能性があります。投稿前にYouTubeの最新のガイドラインを確認してください。' },
        { q: '画像はサーバーに送信されますか？', a: 'いいえ。処理はすべてブラウザ内で行われ、画像が端末の外に出ることはありません。' },
        { q: '16:9以外の画像も使えますか？', a: 'はい。このツールが16:9にクロップするため、画像が歪むことはありません。そのまま投稿するとYouTube側でクロップされる可能性がありますが、事前に切り抜いておくことで構図を自分で制御できます。' },
        { q: '書き出しにはどの形式を使えますか？', a: 'PNG（ロスレス）・JPEG・WebPから選択できます。テキストを含むサムネイルは、高品質のPNGかJPEGで書き出すと細部がくっきり残ります。' },
        { q: '推奨サイズは今後変わる可能性がありますか？', a: 'はい。プラットフォームの推奨サイズは変わることがあります。投稿前にYouTubeの最新情報を確認することをおすすめします。' },
      ],
    },
    pt: {
      title: 'Redimensionador de Miniaturas do YouTube | RealResizer',
      description: 'Recorte e redimensione imagens para a proporção 16:9 (1280 × 720) das miniaturas do YouTube, direto no navegador. Privado, com pré-visualização em desktop, mobile e TV antes de exportar.',
      h1: 'Redimensionador de Miniaturas do YouTube',
      intro: 'Miniaturas aparecem pequenas em resultados de busca, na página inicial e em sugestões de vídeo — e é por isso que o enquadramento e a legibilidade fazem tanta diferença. Com o RealResizer você recorta sua imagem na proporção de miniatura do YouTube direto no navegador, sem enviar o arquivo para nenhum servidor.',
      rows: [
        { h2: 'Tamanho e proporção recomendados', p: [
          'O tamanho de trabalho mais usado para miniaturas do YouTube é 1280 × 720 pixels, na proporção widescreen 16:9. A proporção importa tanto quanto a resolução: se você não recortar para 16:9, o próprio YouTube redimensiona ou recorta a imagem, e o enquadramento deixa de estar sob seu controle. Além disso, uma miniatura aparece em tamanhos muito diferentes — pequena nos resultados de busca e no celular, maior na TV. Por isso, prefira uma composição que comunique a ideia de relance, em vez de detalhes finos. Esses valores são uma orientação prática e podem mudar; confirme as diretrizes atuais do YouTube antes de publicar.',
        ] },
        { h2: 'Como recortar a imagem', ul: [
          'Envie sua imagem ou arraste e solte na ferramenta.',
          'Nesta página, o preset de Miniatura do YouTube (16:9) já vem selecionado.',
          'Ajuste o recorte com as réguas e as alças para enquadrar o assunto.',
          'Corte e visualize o resultado no mockup em desktop, mobile e TV.',
          'Exporte em PNG, JPEG ou WebP.',
        ] },
        { h2: 'Dicas para uma miniatura mais clara', ul: [
          'Mantenha o assunto principal claro e próximo do centro da composição.',
          'Use texto grande o suficiente para continuar legível em telas pequenas.',
          'Prefira uma composição simples, sem detalhes minúsculos.',
          'Confira o preview em vários tamanhos antes de exportar.',
          'Preserve contraste para a imagem se destacar na grade de resultados.',
        ] },
        { h2: 'Área segura e composição', p: [
          'Dependendo de onde a miniatura é exibida, elementos da interface podem se sobrepor a partes da imagem — por exemplo, o selo de duração no canto inferior direito no desktop. Essas sobreposições variam conforme o dispositivo, então trate as áreas seguras como um guia prático de composição, e não como uma especificação fixa. Manter rostos, texto e logotipos na região central do quadro geralmente é suficiente.',
        ] },
        { h2: 'Veja o resultado antes de publicar', p: [
          'Depois de cortar, toque no botão <em>Ver como fica</em> para pré-visualizar a sua miniatura em desktop, mobile e TV. Confirme que o assunto continua legível mesmo nos tamanhos menores antes de exportar.',
        ] },
        { h2: 'Ferramentas relacionadas', p: [
          'Preparando outros conteúdos em vídeo? Experimente o <a href="/pt/instagram-reel-resizer/">Redimensionador de Reels do Instagram</a> ou o <a href="/pt/instagram-story-resizer/">Redimensionador de Stories</a>. Para Shorts, veja o <a href="/en/youtube-shorts-resizer/">YouTube Shorts Resizer</a>. A <a href="/pt/">página inicial do RealResizer</a> lista todas as ferramentas.',
        ] },
      ],
      faq: [
        { q: 'Qual é o tamanho recomendado para uma miniatura do YouTube?', a: 'O tamanho de trabalho mais usado é 1280 × 720 pixels na proporção 16:9. É uma orientação prática — confirme as diretrizes atuais do YouTube antes de publicar.' },
        { q: 'A imagem é enviada para algum servidor?', a: 'Não. Todo o processamento acontece no seu navegador e a imagem nunca sai do seu dispositivo.' },
        { q: 'Posso usar uma imagem que não é 16:9?', a: 'Sim. A ferramenta recorta para 16:9 sem distorcer a imagem, devolvendo o controle do enquadramento para você.' },
        { q: 'Quais formatos de exportação existem?', a: 'PNG (sem perdas), JPEG e WebP. Para miniaturas com texto, exportar em alta qualidade mantém os detalhes nítidos.' },
        { q: 'As recomendações de tamanho podem mudar?', a: 'Sim. Os valores adequados podem mudar conforme a plataforma evolui, então confirme as orientações atuais antes de publicar.' },
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
          'YouTube Shorts are vertical and full-screen, using the familiar 9:16 ratio, commonly produced at 1080 × 1920 pixels. A Shorts cover differs from a standard video thumbnail in one important way: it largely appears on the Shorts shelf and in autoplaying loops, where viewers catch it for a fraction of a second before scrolling past. A single clear subject that reads instantly — not a busy collage — performs far better.',
          'Because Shorts are watched full-screen on phones, the right edge of the frame carries the action buttons in most mobile layouts. Keep your subject centered and clear of that right-side rail.',
        ] },
        { h2: 'How to resize an image for YouTube Shorts', ul: [
          'Upload or drag and drop an image into the tool.',
          'The Shorts preset (9:16) is pre-selected on this page.',
          'Adjust the crop with the rulers or the corner handle.',
          'Preview in the Shorts mockup, checking the mobile view.',
          'Export in your preferred format.',
        ] },
        { h2: 'YouTube Shorts safe zone', p: [
          'The Shorts player places its action buttons — like, comment, share, and the channel avatar — in a rail along the right edge, with the caption and username near the bottom-left. That right rail is the main safe-zone concern: keep names, faces, and text clear of roughly the right 15% of the frame and off the bottom caption area. The central band is the safest spot for critical detail.',
        ] },
        { h2: 'See how it looks before you post', p: [
          'After you CUT the image, tap the <em>See how it looks</em> button to preview your still inside a realistic Shorts mockup. Use the mobile view to confirm your subject reads well near the screen edges.',
        ] },
        { h2: 'Related tools', p: [
          'Also building a thumbnail for the same video? Try the <a href="/en/youtube-thumbnail-resizer/">YouTube Thumbnail Resizer</a>. You might also want the <a href="/en/tiktok-image-resizer/">TikTok Image Resizer</a> or the <a href="/en/instagram-reel-resizer/">Instagram Reel Resizer</a>.',
        ] },
      ],
      faq: [
        { q: 'What ratio are YouTube Shorts?', a: 'Shorts are vertical at a 9:16 ratio, commonly 1080 × 1920 pixels.' },
        { q: 'Do my images stay private?', a: 'Yes — processing happens entirely in your browser.' },
        { q: 'Can I use a regular 16:9 video thumbnail for a Shorts cover?', a: 'It will be cropped by the player. A 9:16 crop keeps your cover’s framing under your control.' },
        { q: 'What formats does the tool accept?', a: 'JPG, JPEG, PNG, and WebP are supported, with no hard file-size limit.' },
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
          'For desktop, the Facebook page cover is commonly prepared at a ratio close to 851 × 315 pixels (roughly 2.7:1). The surprising part is how differently the same cover displays on mobile: Facebook crops the tall cover down to a smaller central area on phones, so text placed near the far left or right edge of the desktop frame simply disappears on mobile. Design for the mobile crop first, then check the desktop view.',
          'The profile picture overlaps the bottom-left of the cover on desktop, and call-to-action buttons sit near the bottom-right. Keep faces, text, and logos in the central horizontal band — commonly the inner 820 × 360 safe area — so nothing critical hides behind the avatar or buttons.',
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
        { h2: 'Facebook cover safe zone', p: [
          'On desktop the profile picture overlaps the bottom-left of the cover, and across devices buttons are placed near the bottom-right. Keep text and logos within the central region — commonly the inner 820 × 360 safe area — and clear of the bottom-left where the profile photo sits.',
        ] },
        { h2: 'See how it looks before you post', p: [
          'After you CUT the image, tap the <em>See how it looks</em> button to preview your cover inside a realistic Facebook profile mockup. Check the desktop view to confirm no critical content hides behind the profile picture.',
        ] },
        { h2: 'Related tools', p: [
          'Preparing other Facebook posts? You might also want the <a href="/en/linkedin-image-resizer/">LinkedIn Image Resizer</a> or the <a href="/en/twitter-image-resizer/">X (Twitter) Image Resizer</a> for your other profile pages.',
        ] },
      ],
      faq: [
        { q: 'What ratio is a Facebook cover?', a: 'The desktop cover is commonly prepared at about 851 × 315 pixels, near a 2.7:1 ratio.' },
        { q: 'Is my cover image uploaded?', a: 'No. Everything is processed locally in your browser.' },
        { q: 'Why does my cover look different on mobile?', a: 'Facebook crops the tall desktop cover to a smaller central area on phones, so content placed at the far edges of the desktop frame is not visible on mobile.' },
        { q: 'What file formats are supported?', a: 'JPG, JPEG, PNG, and WebP for input; PNG, JPEG, or WebP for export, with no hard file-size limit.' },
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
          'LinkedIn feed images are commonly shared at a landscape 1.91:1 ratio, frequently prepared at 1200 × 627 pixels. LinkedIn is a professional, mostly text-driven feed, and a large part of it is consumed on mobile. That means most of your audience sees the image at a small width with your headline around it — so a clean crop with a clear focal point beats a busy design, and any text inside the image should stay readable at thumbnail size.',
          'The feed also auto-crops images to its preview frame; if your image is not already 1.91:1, LinkedIn picks the crop for you. Locking the ratio yourself keeps the composition under your control.',
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
        { h2: 'LinkedIn safe zone', p: [
          'LinkedIn crops feed images to fit its preview frame on mobile and desktop, and company page banners gain UI text over the left edge. Keep essential text and logos in the central horizontal band and toward the right when preparing a banner, so nothing critical is hidden behind the company name or profile elements.',
        ] },
        { h2: 'See how it looks before you post', p: [
          'After you CUT the image, tap the <em>See how it looks</em> button to preview your image inside a realistic LinkedIn mockup before uploading it to the feed.',
        ] },
        { h2: 'Related tools', p: [
          'Tidying up your other profile pages? Try the <a href="/en/facebook-cover-resizer/">Facebook Cover Resizer</a> or the <a href="/en/twitter-image-resizer/">X (Twitter) Image Resizer</a>.',
        ] },
      ],
      faq: [
        { q: 'What ratio is a LinkedIn post image?', a: 'Feed images are commonly shared at a 1.91:1 landscape ratio, often 1200 × 627 pixels.' },
        { q: 'Are my images private?', a: 'Yes — all processing happens locally in your browser.' },
        { q: 'What happens if I upload a non-1.91:1 image?', a: 'LinkedIn may auto-crop it to fit its preview frame. Cropping to 1.91:1 yourself keeps the composition in your control.' },
        { q: 'Can I edit my company page banner here?', a: 'Yes — the editor also includes the profile banner (1584 × 396) and company banner (1128 × 191) ratios.' },
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
          'TikTok content plays full-screen in a vertical 9:16 ratio, commonly produced at 1080 × 1920 pixels. Video covers on TikTok are subtly different from other platforms: the cover is what appears in the grid for a split second before autoplay starts, and for photo-mode carousels the first image in the set is the whole hook. A single strong subject that reads instantly outperforms a busy design.',
          'The TikTok player stacks its action buttons — like, comment, bookmark, and share — in a column along the right edge, with the caption and username near the bottom. Keep faces, text, and logos clear of that right-edge rail.',
          'The same editor can also prepare a TikTok profile picture (400 × 400) and other full-screen formats, so resizing an image for TikTok covers both your content and your profile.',
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
        { h2: 'TikTok safe zone', p: [
          'The TikTok player stacks action buttons (like, comment, share) along the right edge and shows the caption with the username near the bottom of the screen. These overlays sit roughly within the right third and the bottom sixth of the frame. Keep important content centered and clear of the right-edge action column.',
        ] },
        { h2: 'See how it looks before you post', p: [
          'After you CUT the image, tap the <em>See how it looks</em> button to preview your cover inside a realistic TikTok mockup. Use the mobile view to confirm nothing important sits behind the right-edge buttons.',
        ] },
        { h2: 'Related tools', p: [
          'Creating content for other vertical platforms? Try the <a href="/en/instagram-reel-resizer/">Instagram Reel Resizer</a> or the <a href="/en/youtube-shorts-resizer/">YouTube Shorts Resizer</a>.',
        ] },
      ],
      faq: [
        { q: 'What ratio is a TikTok image?', a: 'TikTok uses a vertical 9:16 ratio, commonly 1080 × 1920 pixels.' },
        { q: 'Do my images get uploaded?', a: 'No. All processing is done locally in your browser.' },
        { q: 'What about TikTok photo-mode carousels?', a: 'They use the same 9:16 vertical ratio. The first image sets the hook, so treat it as the most important crop.' },
        { q: 'Which formats can I export?', a: 'PNG (lossless), JPEG, or WebP with adjustable quality.' },
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
          'The X profile header is wide and short, commonly prepared around 1500 × 500 pixels (a 3:1 ratio). X applies noticeable image compression in many views, so starting from a sharp, high-quality source matters more than on some other platforms.',
          'The header is also cropped aggressively on mobile — phones show only the center of the banner, roughly the middle 1280 × 330 pixels — while in-stream post images display in a wide 16:9 frame (often 1600 × 900) and the profile photo is shown as a circle, not a square. Prepare each shape so the important content survives the platform’s cropping and compression.',
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
        { h2: 'X (Twitter) profile header safe zone', p: [
          'On mobile the header is heavily cropped and with limited height, and in-stream the grid crops the far edges. Keep your name, logo, and any text within the central region — commonly the inner 1280 × 330 safe area of the 1500 × 500 header — so nothing essential is cut off on small screens.',
        ] },
        { h2: 'See how it looks before you post', p: [
          'After you CUT the image, tap the <em>See how it looks</em> button to preview your header and posts inside a realistic X (Twitter) mockup, and check the mobile view to confirm the safe area looks right.',
        ] },
        { h2: 'Related tools', p: [
          'Also refreshing your other profiles? Try the <a href="/en/linkedin-image-resizer/">LinkedIn Image Resizer</a> or the <a href="/en/facebook-cover-resizer/">Facebook Cover Resizer</a>.',
        ] },
      ],
      faq: [
        { q: 'What size is an X (Twitter) header?', a: 'The profile header is commonly prepared at about 1500 × 500 pixels, a 3:1 ratio.' },
        { q: 'Are my images private?', a: 'Yes — all processing happens locally in your browser.' },
        { q: 'Does X resize my images?', a: 'X compresses uploaded images, so exporting at high quality from a sharp source keeps detail. Cropping to the platform ratio yourself prevents X from choosing its own crop.' },
        { q: 'Why does my header look cut off on a phone?', a: 'Mobile shows only the central area of the 1500 × 500 banner. Keep text and logos within the middle 1280 × 330 region.' },
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
          'Spotify album and playlist artwork is square (1:1), commonly at 1080 × 1080 pixels. Where the crop really bites is in the player: Spotify shows covers as small circles in the now-playing bar on mobile, as rounded squares in search and artist pages, and full-screen on the now-playing view. Detail meant for the full-size view is lost in the tiny circular thumbnail, so keeping a strong central focal point is the difference between an artwork that works everywhere and one that only works at full size.',
          'Many distributors and labels ask for square artwork at specific resolutions (commonly a 3000 × 3000 file for album covers) — check your distributor’s current requirements before you upload. Resizing an image for Spotify with a square preset keeps this consistent.',
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
        { h2: 'Spotify cover safe zone', p: [
          'Spotify crops artwork into circular tiles and shows text over the bottom band of Artist pages. Keep faces, titles, and logos inside the central 80% of the square so nothing important is clipped by the circular crop or the artist-header UI.',
        ] },
        { h2: 'See how it looks before you post', p: [
          'After you CUT the image, tap the <em>See how it looks</em> button to preview your artwork inside a realistic Spotify mockup. Confirm the tile looks right at a glance before you upload the cover.',
        ] },
        { h2: 'Related tools', p: [
          'Releasing music across platforms? Try the <a href="/en/apple-music-image-resizer/">Apple Music Cover Resizer</a> or the <a href="/en/soundcloud-image-resizer/">SoundCloud Banner Resizer</a>. You might also want the <a href="/en/youtube-thumbnail-resizer/">YouTube Thumbnail Resizer</a> for your channel art.',
        ] },
      ],
      faq: [
        { q: 'What size is a Spotify cover?', a: 'Spotify album and playlist artwork is square, commonly 1080 × 1080 pixels. Many distributors commonly ask for a 3000 × 3000 file before accepting a release — confirm the current requirement with your distributor.' },
        { q: 'Does my artwork get uploaded?', a: 'No. All processing happens locally in your browser.' },
        { q: 'Will my cover be cropped by Spotify?', a: 'Covers stay square, but they are shown as small circles in the mobile player. A strong central focal point keeps the artwork legible at every display size.' },
        { q: 'What formats can I use?', a: 'JPG, JPEG, PNG, and WebP are supported for input, with PNG, JPEG, or WebP available on export.' },
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
          'Apple Music album cover art is square (1:1) and commonly prepared at 3000 × 3000 pixels. That large footprint exists because a single artwork file is used across every surface Apple controls — the iTunes Store, Apple Music search, recommendations, the now-playing view, CarPlay, and connected devices like the HomePod — and it is scaled down far more often than it is up-scaled. Shipping the square at maximum resolution means it stays crisp in every size.',
          'Playlist covers are also square (1080 × 1080), while the Apple Music artist profile uses a wide banner (2048 × 1152, 16:9) that appears across the artist page header. Because of the small circular and square crops used in the store, keeping key artwork — logos, titles, faces — inside the central ~80% of the square avoids awkward clipping.',
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
        { h2: 'Apple Music cover safe zone', p: [
          'Apple Music crops cover art into rounded tiles and small search rows, and the iTunes Store overlays nothing onto the art itself — so the main risk is detail getting lost at small sizes. Keep text and logos inside the central 80% of the square to stay legible in search results and compact tiles.',
        ] },
        { h2: 'See how it looks before you post', p: [
          'After you CUT the image, tap the <em>See how it looks</em> button to preview your artwork inside a realistic Apple Music mockup before you submit the release.',
        ] },
        { h2: 'Related tools', p: [
          'Also releasing on other platforms? Try the <a href="/en/spotify-image-resizer/">Spotify Cover Resizer</a> or the <a href="/en/soundcloud-image-resizer/">SoundCloud Banner Resizer</a>.',
        ] },
      ],
      faq: [
        { q: 'What size is Apple Music cover art?', a: 'Apple Music album cover art is square, commonly prepared at 3000 × 3000 pixels so it stays sharp at every display size.' },
        { q: 'Is my artwork processed privately?', a: 'Yes — everything happens locally in your browser.' },
        { q: 'What is the artist page banner ratio?', a: 'The Apple Music artist profile banner is 2048 × 1152 (16:9).' },
        { q: 'Which formats does the tool support?', a: 'JPG, JPEG, PNG, and WebP input; PNG, JPEG, or WebP export with no hard file-size limit.' },
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
          'The SoundCloud profile banner is very wide and short, commonly prepared around 2480 × 620 pixels (a 4:1 ratio) — among the widest banner formats of any platform. On the web profile the banner spans the full header width, but the artist name, follower count, and the Follow button are overlaid near the bottom-left of that same banner, sitting directly on top of your artwork.',
          'Because the banner is so wide, a tall source image will have most of its height cropped away, and on mobile the banner is reduced to a much narrower strip. Keep key text and logos within the central horizontal band — the practical safe area is roughly the inner 80% — and clear of where the artist name and stats sit on the left.',
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
        { h2: 'SoundCloud banner safe zone', p: [
          'Because the banner spans a 4:1 ratio, the far left and right edges are often cropped on narrower screens. Keep text, logos, and your artist name within the central horizontal band — roughly the inner 80% of the image — so they stay visible across devices.',
        ] },
        { h2: 'See how it looks before you post', p: [
          'After you CUT the image, tap the <em>See how it looks</em> button to preview your banner inside a realistic SoundCloud mockup and confirm the center band reads well.',
        ] },
        { h2: 'Related tools', p: [
          'Care about your whole music presence? Try the <a href="/en/spotify-image-resizer/">Spotify Cover Resizer</a> or the <a href="/en/apple-music-image-resizer/">Apple Music Cover Resizer</a>.',
        ] },
      ],
      faq: [
        { q: 'What size is a SoundCloud banner?', a: 'The SoundCloud profile banner is commonly prepared at about 2480 × 620 pixels, a 4:1 ratio.' },
        { q: 'Are my images private?', a: 'Yes — all processing happens locally in your browser.' },
        { q: 'Why is my banner being overlapped by my artist name?', a: 'SoundCloud places the artist name, follower count, and Follow button over the bottom-left of the banner. Keep text and logos out of that area.' },
        { q: 'Can I also prepare track artwork?', a: 'Yes. Track and playlist artwork is square (1:1), and the editor can crop for it as well.' },
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
          'The Instagram Story fills the full phone screen in portrait orientation. The commonly used Story size is 1080 × 1920 pixels — the familiar 9:16 vertical aspect ratio. A Story is temporary content: it appears in the Stories tray for 24 hours, auto-advances to the next Story, and auto-loops while viewed. Because viewers mostly catch it for seconds at a time, a single clear subject that reads instantly matters more than fine detail.',
          'The Story interface paints the top band (your name, date, and controls) and the bottom band (caption, reply field, and link sticker) directly over the image. Keeping text and faces out of roughly the top 14% and bottom 20% of the 1080 × 1920 frame keeps them visible, and the central horizontal band is the safest place for what matters.',
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
        { h2: 'Instagram Story safe zone', p: [
          'The Story player places your name and other interface elements along the top and bottom of the screen. To keep text and faces clearly visible, leave roughly the top 14% and the bottom 20% of the 1080 × 1920 frame free of critical content — the safest place for important subjects is the central horizontal band.',
        ] },
        { h2: 'See how it looks before you post', p: [
          'After you CUT the image, tap the <em>See how it looks</em> button to preview your photo inside a realistic Instagram Story mockup. Use the mobile view to confirm your subject reads well at a glance before you export.',
        ] },
        { h2: 'Related tools', p: [
          'Preparing other Instagram content? Try the <a href="/en/instagram-reel-resizer/">Instagram Reel Resizer</a> or the <a href="/en/tiktok-image-resizer/">TikTok Image Resizer</a>.',
        ] },
      ],
      faq: [
        { q: 'Does the image get uploaded anywhere?', a: 'No. All processing happens in your browser and your image never leaves your device.' },
        { q: 'What is the Instagram Story size?', a: 'Stories are displayed at a 9:16 vertical ratio, commonly produced at 1080 × 1920 pixels.' },
        { q: 'What image formats are supported?', a: 'JPG, JPEG, PNG, and WebP are accepted. Export is available as PNG (lossless), JPEG, or WebP.' },
        { q: 'Is there a file-size limit?', a: 'No hard limit is enforced. Very large images (roughly over 20 megapixels) may slow down an older or low-memory browser.' },
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
        { h2: 'Zona segura de las Historias de Instagram', p: [
          'El reproductor de Historias muestra tu nombre y otros elementos de la interfaz en la parte superior e inferior de la pantalla. Para que el texto y los rostros se vean con claridad, deja libre aproximadamente el 14% superior y el 20% inferior del marco de 1080 × 1920: el lugar más seguro para los sujetos importantes es la banda central.',
        ] },
        { h2: 'Mira cómo se verá antes de publicar', p: [
          'Después de recortar, toca el botón <em>Ver cómo se ve</em> para previsualizar tu foto dentro de una maqueta realista de Instagram. Usa la vista móvil para confirmar que tu tema se lee bien de un vistazo antes de exportar.',
        ] },
        { h2: 'Herramientas relacionadas', p: [
          '¿Preparas otro contenido para Instagram? Prueba el <a href="/en/instagram-reel-resizer/">Redimensionador de Reels de Instagram</a> o el <a href="/en/tiktok-image-resizer/">Redimensionador de Imágenes para TikTok</a>.',
        ] },
      ],
      faq: [
        { q: '¿La imagen se sube a algún sitio?', a: 'No. Todo el procesamiento ocurre en tu navegador y tu imagen nunca sale de tu dispositivo.' },
        { q: '¿Qué tamaño tiene una Historia de Instagram?', a: 'Las Historias se muestran en proporción vertical 9:16 y normalmente se crean a 1080 × 1920 píxeles.' },
        { q: '¿Qué formatos de imagen se admiten?', a: 'Se aceptan JPG, JPEG, PNG y WebP. Puedes exportar en PNG (sin pérdida), JPEG o WebP.' },
        { q: '¿Hay un límite de tamaño de archivo?', a: 'No se aplica un límite estricto. Las imágenes muy grandes (más de unos 20 megapíxeles) pueden hacer más lento un navegador antiguo o con poca memoria.' },
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
        { h2: 'Instagramストーリーのセーフゾーン', p: [
          'ストーリープレイヤーは画面上部と下部に名前などのインターフェース要素を表示します。テキストや顔をはっきり見せるには、1080×1920のフレームのおよそ上部14%と下部20%に重要なコンテンツを置かないでください。主要な被写体は中央の横帯に配置するのが最も安全です。',
        ] },
        { h2: '投稿する前に見え方を確認', p: [
          'カットしたら<em>見え方を確認</em>ボタンをタップして、リアルなInstagramストーリーのモックアップで写真をプレビュー。モバイル表示で、被写体がひと目で分かるかを書き出す前に確認しましょう。',
        ] },
        { h2: '関連ツール', p: [
          'Instagramの他のコンテンツも準備しますか？ <a href="/en/instagram-reel-resizer/">Instagramリール リサイズ</a>や<a href="/en/tiktok-image-resizer/">TikTok画像 リサイズ</a>もお試しください。',
        ] },
      ],
      faq: [
        { q: '画像はどこかにアップロードされますか？', a: 'いいえ。処理はすべてブラウザ内で行われ、画像が端末の外に出ることはありません。' },
        { q: 'Instagramストーリーのサイズは？', a: 'ストーリーは9:16の縦長比率で表示され、一般的には1080×1920ピクセルで作成されます。' },
        { q: '対応している画像形式は？', a: 'JPG・JPEG・PNG・WebPに対応。書き出しはPNG（ロスレス）・JPEG・WebPから選択できます。' },
        { q: 'ファイルサイズの上限はありますか？', a: '厳密な上限はありません。ただし非常に大きな画像（約2000万画素以上）は、古いブラウザやメモリの少ない環境で動作が遅くなる可能性があります。' },
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
        { h2: 'Sichere Zone für Instagram Storys', p: [
          'Der Story-Player zeigt Ihren Namen und andere Oberflächenelemente am oberen und unteren Bildschirmrand. Damit Text und Gesichter klar sichtbar bleiben, lassen Sie etwa die oberen 14 % und die unteren 20 % des 1080 × 1920-Rahmens frei von wichtigen Inhalten – am sichersten liegen die Hauptmotive im mittleren horizontalen Band.',
        ] },
        { h2: 'So sieht es vor dem Posten aus', p: [
          'Nach dem Ausschneiden tippen Sie auf die Schaltfläche <em>Ansehen</em>, um Ihr Foto in einer realistischen Story-Mockup-Vorschau zu betrachten. Nutzen Sie die mobile Ansicht, um sicherzugehen, dass Ihr Motiv auf einen Blick erkennbar ist, bevor Sie exportieren.',
        ] },
        { h2: 'Verwandte Werkzeuge', p: [
          'Bereiten Sie weitere Instagram-Inhalte vor? Probieren Sie den <a href="/en/instagram-reel-resizer/">Instagram Reel Resizer</a> oder den <a href="/en/tiktok-image-resizer/">TikTok Image Resizer</a>.',
        ] },
      ],
      faq: [
        { q: 'Wird das Bild irgendwo hochgeladen?', a: 'Nein. Die gesamte Verarbeitung erfolgt in Ihrem Browser, und Ihr Bild verlässt nie Ihr Gerät.' },
        { q: 'Welche Größe hat eine Instagram Story?', a: 'Storys werden im vertikalen Verhältnis 9:16 angezeigt, üblicherweise mit 1080 × 1920 Pixeln erzeugt.' },
        { q: 'Welche Bildformate werden unterstützt?', a: 'Akzeptiert werden JPG, JPEG, PNG und WebP. Der Export erfolgt als PNG (verlustfrei), JPEG oder WebP.' },
        { q: 'Gibt es eine Dateigrößenbegrenzung?', a: 'Es wird keine harte Grenze erzwungen. Sehr große Bilder (über etwa 20 Megapixel) können ältere oder speicherschwache Browser verlangsamen.' },
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
        { h2: 'Zona segura dos Stories do Instagram', p: [
          'O player de Stories mostra seu nome e outros elementos da interface na parte superior e inferior da tela. Para manter texto e rostos claramente visíveis, deixe livres aproximadamente os 14% superiores e os 20% inferiores do quadro de 1080 × 1920 — o lugar mais seguro para os assuntos principais é a faixa central.',
        ] },
        { h2: 'Veja como fica antes de publicar', p: [
          'Depois de recortar, toque no botão <em>Ver como fica</em> para pré-visualizar sua foto dentro de um mockup realista do Instagram. Use a visualização mobile para confirmar se o assunto fica claro à primeira vista antes de exportar.',
        ] },
        { h2: 'Ferramentas relacionadas', p: [
          'Preparando outro conteúdo do Instagram? Experimente o <a href="/en/instagram-reel-resizer/">Redimensionador de Reels do Instagram</a> ou o <a href="/en/tiktok-image-resizer/">Redimensionador de Imagens para TikTok</a>.',
        ] },
      ],
      faq: [
        { q: 'A imagem é enviada para algum lugar?', a: 'Não. Todo o processamento acontece no seu navegador e a sua imagem nunca sai do seu dispositivo.' },
        { q: 'Qual é o tamanho de um Story do Instagram?', a: 'Os Stories são exibidos na proporção vertical 9:16, geralmente criados em 1080 × 1920 pixels.' },
        { q: 'Quais formatos de imagem são aceitos?', a: 'JPG, JPEG, PNG e WebP são aceitos. Você pode exportar em PNG (sem perdas), JPEG ou WebP.' },
        { q: 'Existe um limite de tamanho de arquivo?', a: 'Nenhum limite rígido é imposto. Imagens muito grandes (mais de cerca de 20 megapixels) podem deixar navegadores antigos ou com pouca memória mais lentos.' },
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
    '.highlight-item:nth-of-type(2)': 'Procesamiento en el navegador',
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
    '.highlight-item:nth-of-type(2)': 'ブラウザ内で処理',
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
    '.highlight-item:nth-of-type(2)': 'Verarbeitung im Browser',
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
    '.highlight-item:nth-of-type(2)': 'Processamento no navegador',
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
  en: { home: 'Home', allTools: 'All tools', sitemap: 'Sitemap', breadcrumbHome: 'Home', relatedLabel: 'Related tools', faqHeading: 'Frequently asked questions', footerHome: 'Home', footerAllTools: 'All tools', footerAbout: 'About', footerPrivacy: 'Privacy Policy', footerTerms: 'Terms', footerContact: 'Contact' },
  es: { home: 'Inicio', allTools: 'Todas las herramientas', sitemap: 'Mapa del sitio', breadcrumbHome: 'Inicio', relatedLabel: 'Herramientas relacionadas', faqHeading: 'Preguntas frecuentes', footerHome: 'Inicio', footerAllTools: 'Todas las herramientas', footerAbout: 'Acerca de', footerPrivacy: 'Política de privacidad', footerTerms: 'Términos', footerContact: 'Contacto' },
  ja: { home: 'ホーム', allTools: 'すべてのツール', sitemap: 'サイトマップ', breadcrumbHome: 'ホーム', relatedLabel: '関連ツール', faqHeading: 'よくある質問', footerHome: 'ホーム', footerAllTools: 'すべてのツール', footerAbout: 'このサイトについて', footerPrivacy: 'プライバシーポリシー', footerTerms: '利用規約', footerContact: 'お問い合わせ' },
  de: { home: 'Startseite', allTools: 'Alle Werkzeuge', sitemap: 'Sitemap', breadcrumbHome: 'Startseite', relatedLabel: 'Verwandte Werkzeuge', faqHeading: 'Häufige Fragen', footerHome: 'Startseite', footerAllTools: 'Alle Werkzeuge', footerAbout: 'Über uns', footerPrivacy: 'Datenschutzerklärung', footerTerms: 'Nutzungsbedingungen', footerContact: 'Kontakt' },
  pt: { home: 'Início', allTools: 'Todas as ferramentas', sitemap: 'Mapa do site', breadcrumbHome: 'Início', relatedLabel: 'Ferramentas relacionadas', faqHeading: 'Perguntas frequentes', footerHome: 'Início', footerAllTools: 'Todas as ferramentas', footerAbout: 'Sobre', footerPrivacy: 'Política de Privacidade', footerTerms: 'Termos', footerContact: 'Contato' },
};


// ---------------------------------------------------------------------------
// Trust / legal pages (English). Generated once per slug at the SITE_ROOT,
// shared crawlable across every localized page via the unified footer.
// ---------------------------------------------------------------------------
const TRUST_REGISTRY = [
  {
    slug: 'about',
    h1: 'About RealResizer',
    lede: 'RealResizer is a free, browser-based image tool that shows you exactly how your picture will look on each platform before you post.',
    rows: [
      { h2: 'What RealResizer is', p: [
        'RealResizer is a free, browser-based image utility focused on one thing: showing you exactly how your picture will look on a given platform before you publish it. Instead of guessing whether a photo fits an Instagram Story, a YouTube thumbnail, or a LinkedIn feed post, you pick a destination preset, crop and resize to the platform’s exact dimensions, and preview the result inside a realistic mockup of that platform.',
      ] },
      { h2: 'Why RealResizer exists', p: [
        'Every day, millions of images are posted without ever being checked inside the real platform interface. Text gets cut off, logos sit in safe zones, faces fall behind interface elements, and covers get cropped in ways the creator never intended. RealResizer exists to close that gap: crop, resize, and preview your image inside realistic platform mockups so you see the final look before anything leaves your device.',
      ] },
      { h2: 'Platform presets and mockup previews', p: [
        'The tool ships with dimension presets for the most common destinations: Instagram Stories, Reels and feed posts; YouTube thumbnails, Shorts and channel art; TikTok; Facebook covers; LinkedIn posts and banners; X (Twitter) profile headers and posts; Spotify and Apple Music covers; and SoundCloud banners. After you cut an image, one tap opens a realistic preview so you can check how it reads at a glance — including mobile, desktop, and TV views where the platform behaves differently across devices.',
      ] },
      { h2: 'Safe-zone guidance', p: [
        'RealResizer pages explain the safe zones of each platform — the areas where interface elements such as profile names, captions, duration badges, and action buttons overlap the image. That guidance helps you keep text, logos, and faces in the part of the frame that stays visible, rather than discovering after posting that critical detail is hidden.',
      ] },
      { h2: 'Supported exports', p: [
        'Once your crop is ready, export as PNG (lossless), JPEG, or WebP. The export dimensions match the preset you chose, and JPEG/WebP quality is adjustable. PNG keeps every pixel intact; JPEG and WebP trade some detail for much smaller files.',
      ] },
      { h2: 'Local browser processing and privacy', p: [
        'Everything runs inside your browser. You upload nothing, and all processing happens locally — your image is loaded into an in-memory canvas and never transmitted. There are no accounts, no sign-up, and no server-side processing. Your image never leaves your device.',
      ] },
      { h2: 'Who is behind RealResizer', p: [
        'RealResizer is built and maintained by Pratham as an independent, free tool. It is a single-person project, and it is supported by Google Analytics for anonymous usage statistics and Google AdSense for advertising, both declared in the Privacy Policy.',
      ] },
      { h2: 'Feedback and preset requests', p: [
        'RealResizer is feedback-driven. If a platform preset is missing, a dimension looks out of date, or something behaves unexpectedly, you can request a change through the <a href="/contact/">contact page</a>. Preset requests are reviewed and, where feasible, added.',
      ] },
    ],
    faq: [
      { q: 'Is RealResizer really free?', a: 'Yes. RealResizer is free to use with no watermarks, no account, and no sign-up required.' },
      { q: 'Is my image uploaded anywhere?', a: 'No. Your image is processed entirely in your browser, loaded into an in-memory canvas, and never leaves your device.' },
      { q: 'Which formats can I export?', a: 'PNG, JPEG, and WebP. PNG export is lossless; JPEG and WebP quality is adjustable during export.' },
      { q: 'What should I do if a preset is missing or wrong?', a: 'Email us through the <a href="/contact/">contact page</a> with the platform name and we will review it.' },
      { q: 'Do I need to sign up to use the tool?', a: 'No. There are no accounts and no sign-up. Open the page, upload an image, and start working immediately.' },
    ],
  },
  {
    slug: 'privacy-policy',
    h1: 'Privacy Policy',
    lede: 'This policy explains what happens to your images and what tools the site itself uses. Your images are processed locally in your browser and never uploaded to our servers.',
    rows: [
      { h2: 'Your images', p: [
        'RealResizer processes images entirely in your browser. Your image never leaves your device: there is no upload to our servers. This is the core privacy promise of the tool.',
      ] },
      { h2: 'Analytics and advertising', p: [
        'To understand how the site is used and to keep it free, RealResizer uses Google Analytics (GA4) and Google AdSense advertising. These are standard website technologies that may use cookies to collect usage statistics that do not identify you by name or email. They do not see your images, which stay local to your device and are never shared with Google or anyone else.',
      ] },
      { h2: 'ads.txt', p: [
        'As required, RealResizer serves an ads.txt file at /ads.txt declaring its Google AdSense direct-sell relationship.',
      ] },
    ],
    faq: [
      { q: 'Do you see my images?', a: 'No. Images are processed locally in your browser and never cross the network.' },
      { q: 'Does Google Analytics see my images?', a: 'No. GA4 and AdSense only collect standard site-usage data that does not identify you by name or email; your image data never leaves your device.' },
    ],
  },
  {
    slug: 'terms',
    h1: 'Terms of Service',
    lede: 'These terms govern your use of RealResizer. By using the tool you agree to them.',
    rows: [
      { h2: 'Acceptable use', p: [
        'You may use RealResizer for any lawful purpose. Do not use it to process content you do not have the right to use.',
      ] },
      { h2: 'No warranty', p: [
        'RealResizer is provided “as is”, without warranty of any kind. While the tool is designed to resize and preview images accurately, we do not guarantee specific results on every platform for every image.',
      ] },
      { h2: 'Changes', p: [
        'We may update these terms from time to time. Continued use of the tool after changes means you accept the updated terms.',
      ] },
    ],
    faq: [
      { q: 'Do I need an account?', a: 'No. RealResizer needs no account and no sign-up.' },
    ],
  },
  {
    slug: 'contact',
    h1: 'Contact RealResizer',
    lede: 'Questions, feedback, or a request for a missing preset? Reach out below.',
    rows: [
      { h2: 'Email', p: [
        'Email us at <a href="mailto:pratham.lg.128@gmail.com">pratham.lg.128@gmail.com</a> for support, feedback, business enquiries, or to request a missing platform preset.',
      ] },
      { h2: 'Response time', p: [
        'We aim to reply within a few hours.',
      ] },
    ],
    faq: [
      { q: 'Can I request a new platform preset?', a: 'Yes — email us with the platform name and we will look into adding it.' },
    ],
  },
];

const { TRUST_LOCALIZED } = require('./trust_content.js');

// Sitemap: trust pages are appended to the generated sitemap by gen_seo.js
// using TRUST_REGISTRY, so regeneration preserves their URLs.

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
  TRUST_REGISTRY,
  TRUST_LOCALIZED,
};
