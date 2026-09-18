/* ==========================================================================
   RealResizer — Localized trust-page content (Spanish / Japanese / German /
   Portuguese). English lives in TRUST_REGISTRY inside config.js as the
   canonical version; this module holds the translated equivalents so the
   generator can emit per-locale trust pages at /<locale>/<page>/.

   These translations preserve the meaning of the canonical English copy.
   ========================================================================== */

const TRUST_LOCALIZED = {
  about: {
    es: {
      h1: 'Acerca de RealResizer',
      lede: 'RealResizer es una herramienta gratuita de imágenes que funciona en el navegador y te muestra exactamente cómo se verá tu imagen en cada plataforma antes de publicar.',
      rows: [
        { h2: 'Qué es RealResizer', p: [
          'RealResizer es una utilidad gratuita de imágenes que funciona en el navegador y centra todo su esfuerzo en una sola cosa: mostrarte exactamente cómo se verá tu imagen en una plataforma concreta antes de publicarla. En lugar de adivinar si una foto cabe en una Historia de Instagram, una miniatura de YouTube o una publicación de LinkedIn, eliges un ajuste de destino, recortas y redimensionas a las dimensiones exactas de la plataforma y previsualizas el resultado dentro de una maqueta realista de esa plataforma.',
        ] },
        { h2: 'Por qué existe RealResizer', p: [
          'Cada día se publican millones de imágenes sin comprobar nunca cómo se ven dentro de la interfaz real de la plataforma. El texto se corta, los logotipos caen en zonas seguras y las caras quedan detrás de los elementos de la interfaz. RealResizer existe para cerrar esa brecha: recorta, redimensiona y previsualiza tu imagen dentro de maquetas realistas de plataformas para que veas el aspecto final antes de que cualquier cosa salga de tu dispositivo.',
        ] },
        { h2: 'Ajustes de plataforma y vistas previas', p: [
          'La herramienta incluye ajustes de dimensiones para los destinos más habituales: Historias, Reels y publicaciones de Instagram; miniaturas, Shorts y arte de canal de YouTube; TikTok; portadas de Facebook; publicaciones y banners de LinkedIn; encabezados y publicaciones de X (Twitter); portadas de Spotify y Apple Music; y banners de SoundCloud. Después de recortar una imagen, un solo toque abre una vista previa realista para comprobar cómo se lee de un vistazo, incluidas las vistas móvil, escritorio y TV donde la plataforma se comporta de forma distinta según el dispositivo.',
        ] },
        { h2: 'Guía de zonas seguras', p: [
          'Las páginas de RealResizer explican las zonas seguras de cada plataforma: las áreas donde los elementos de la interfaz (nombre de perfil, pies de foto, insignias de duración y botones de acción) se superponen a la imagen. Esa guía te ayuda a mantener el texto, los logotipos y las caras en la parte del encuadre que sigue siendo visible, en lugar de descubrir después de publicar que un detalle importante quedó oculto.',
        ] },
        { h2: 'Exportaciones compatibles', p: [
          'Cuando tu recorte esté listo, exporta como PNG (sin pérdida), JPEG o WebP. Las dimensiones de exportación coinciden con el ajuste que elegiste y la calidad de JPEG/WebP es ajustable. El PNG conserva cada píxel intacto; el JPEG y el WebP intercambian algo de detalle por archivos mucho más pequeños.',
        ] },
        { h2: 'Procesamiento local en el navegador y privacidad', p: [
          'Todo se ejecuta dentro de tu navegador. No subes nada y todo el procesamiento ocurre localmente: tu imagen se carga en un lienzo en memoria y nunca se transmite. Sin cuentas, sin registro y sin procesamiento en el servidor. Tu imagen nunca sale de tu dispositivo.',
        ] },
        { h2: 'Quién está detrás de RealResizer', p: [
          'RealResizer está creado y mantenido por Pratham como una herramienta independiente y gratuita. Es un proyecto de una sola persona y se apoya en Google Analytics para estadísticas de uso anónimas y en Google AdSense para publicidad, ambas declaradas en la Política de privacidad.',
        ] },
        { h2: 'Comentarios y solicitudes de ajustes', p: [
          'RealResizer se impulsa con los comentarios de los usuarios. Si falta un ajuste de plataforma, una dimensión parece desactualizada o algo no se comporta como se espera, puedes solicitarlo a través de la <a href="/es/contact/">página de contacto</a>. Las solicitudes de ajustes se revisan y, cuando es viable, se añaden.',
        ] },
      ],
      faq: [
        { q: '¿RealResizer es realmente gratis?', a: 'Sí. RealResizer es gratis, sin marcas de agua, sin cuentas y sin necesidad de registrarse.' },
        { q: '¿Mi imagen se sube a algún sitio?', a: 'No. Tu imagen se procesa por completo en tu navegador, se carga en un lienzo en memoria y nunca sale de tu dispositivo.' },
        { q: '¿Qué formatos puedo exportar?', a: 'PNG, JPEG y WebP. La exportación PNG no tiene pérdida; la calidad de JPEG y WebP se puede ajustar al exportar.' },
        { q: '¿Qué hago si falta un ajuste o está desactualizado?', a: 'Escríbenos a través de la <a href="/es/contact/">página de contacto</a> con el nombre de la plataforma y lo revisaremos.' },
        { q: '¿Necesito registrarme para usar la herramienta?', a: 'No. No hay cuentas ni registro. Abre la página, sube una imagen y empieza a trabajar de inmediato.' },
      ],
    },
    ja: {
      h1: 'RealResizerについて',
      lede: 'RealResizerはブラウザ上で動作する無料の画像ツールです。投稿する前に、画像が各プラットフォームでどのように見えるかを正確に確認できます。',
      rows: [
        { h2: 'RealResizerとは', p: [
          'RealResizerはブラウザ上で動作する無料の画像ユーティリティで、1つのことに集中しています。それは「画像が特定のプラットフォームで実際にどう見えるかを、投稿する前に正確に確認できる」ことです。Instagramのストーリー、YouTubeのサムネイル、LinkedInの投稿に画像が収まるかを推測する代わりに、投稿先のプリセットを選び、プラットフォームの正確な寸法にトリミング・リサイズして、そのプラットフォームのリアルなモックアップの中で結果をプレビューできます。',
        ] },
        { h2: 'RealResizerが存在する理由', p: [
          '毎日、何百万もの画像が実際のプラットフォームの画面で確認されることなく投稿されています。テキストが切れたり、ロゴがセーフゾーンにかかったり、顔がインターフェース要素の裏に隠れたりします。RealResizerはそのギャップを埋めるためにあります。画像をトリミング・リサイズし、リアルなプラットフォームのモックアップ内でプレビューして、端末の外に出る前に最終的な見え方を確認できます。',
        ] },
        { h2: 'プラットフォームのプリセットとプレビュー', p: [
          'このツールには、よく使われる投稿先の寸法プリセットが用意されています。Instagramのストーリー・リール・フィード投稿、YouTubeのサムネイル・Shorts・チャンネルアート、TikTok、Facebookのカバー、LinkedInの投稿とバナー、X（Twitter）のヘッダーと投稿、SpotifyとApple Musicのジャケット、SoundCloudのバナーなど。画像をトリミングしたら、ワンタップでリアルなプレビューを開き、一目でどう読めるかを確認できます。プラットフォームが端末によって表示を変える場合も、モバイル・デスクトップ・TVの各ビューで確認できます。',
        ] },
        { h2: 'セーフゾーンのガイド', p: [
          'RealResizerの各ツールページでは、各プラットフォームのセーフゾーンを説明しています。プロフィール名、キャプション、時間バッジ、アクション（操作）ボタンなどのUI要素が画像の上に重なる領域のことです。このガイドを参考に、テキスト・ロゴ・顔を、投稿後に重要なディテールが隠れてしまう場所ではなく、常に表示されるフレーム内に配置できます。',
        ] },
        { h2: '対応している書き出し形式', p: [
          'トリミングが完了したら、PNG（ロスレス）、JPEG、WebPで書き出せます。書き出し寸法は選んだプリセットに一致し、JPEG/WebPの品質は調整可能です。PNGは全ピクセルをそのまま保持し、JPEGとWebPはわずかなディテールと引き換えにファイルを大幅に小さくします。',
        ] },
        { h2: 'ブラウザ内でのローカル処理とプライバシー', p: [
          'すべてブラウザ内で実行されます。アップロードは不要で、処理はすべてローカルで完結します。画像はメモリ内のキャンバスに読み込まれ、送信されることはありません。アカウントもサインアップもサーバー側の処理もありません。画像が端末の外に出ることはありません。',
        ] },
        { h2: 'RealResizerの運営者', p: [
          'RealResizerは、Prathamが独立した無料ツールとして開発・保守しています。個人によるプロジェクトであり、匿名の利用統計のためにGoogle Analytics、広告表示のためにGoogle AdSenseを使用しています。いずれもプライバシーポリシーで宣言されています。',
        ] },
        { h2: 'フィードバックとプリセットのリクエスト', p: [
          'RealResizerはユーザーのフィードバックをもとに進化しています。プラットフォームのプリセットが足りない、寸法が古そう、期待通りに動作しない、といった場合は、<a href="/ja/contact/">お問い合わせページ</a>からご連絡ください。プリセットのリクエストは確認のうえ、実現可能なものから追加されます。',
        ] },
      ],
      faq: [
        { q: 'RealResizerは本当に無料ですか？', a: 'はい。RealResizerは無料で、透かしもアカウントもサインアップも不要です。' },
        { q: '画像はどこかにアップロードされますか？', a: 'いいえ。画像はブラウザ内で完全に処理され、メモリ内のキャンバスに読み込まれて送信されることはありません。端末の外に出ることはありません。' },
        { q: 'どの形式で書き出せますか？', a: 'PNG・JPEG・WebPです。PNG書き出しはロスレスで、JPEGとWebPの品質は書き出し時に調整できます。' },
        { q: 'プリセットが足りない場合や古い場合は？', a: '<a href="/ja/contact/">お問い合わせページ</a>からプラットフォーム名を添えてご連絡ください。確認します。' },
        { q: '登録は必要ですか？', a: 'いいえ。アカウントもサインアップもありません。ページを開いて画像をアップロードし、すぐに作業を始められます。' },
      ],
    },
    de: {
      h1: 'Über RealResizer',
      lede: 'RealResizer ist ein kostenloses, browserbasiertes Bildtool, das Ihnen genau zeigt, wie Ihr Bild auf jeder Plattform aussieht, bevor Sie es veröffentlichen.',
      rows: [
        { h2: 'Was RealResizer ist', p: [
          'RealResizer ist ein kostenloses, browserbasiertes Bild-Werkzeug, das sich auf genau eine Sache konzentriert: Ihnen zu zeigen, wie Ihr Bild auf einer bestimmten Plattform aussehen wird, bevor Sie es veröffentlichen. Statt zu raten, ob ein Foto in eine Instagram-Story, eine YouTube-Miniatur oder einen LinkedIn-Beitrag passt, wählen Sie eine Zielvorlage, schneiden und skalieren Sie auf die exakten Plattform-Maße und sehen eine Vorschau in einem realistischen Mock-up dieser Plattform.',
        ] },
        { h2: 'Warum es RealResizer gibt', p: [
          'Jeden Tag werden Millionen von Bildern gepostet, ohne jemals in der echten Oberfläche der Plattform geprüft zu werden. Text wird abgeschnitten, Logos liegen in Sicherheitszonen und Gesichter verschwinden hinter UI-Elementen. RealResizer schließt diese Lücke: Schneiden, skalieren und Vorschau in realistischen Plattform-Mockups, damit Sie den finalen Look sehen, bevor irgendetwas Ihr Gerät verlässt.',
        ] },
        { h2: 'Plattform-Vorlagen und Vorschauen', p: [
          'Das Tool enthält Größen-Vorlagen für die gängigsten Ziele: Instagram-Storys, Reels und Feed-Beiträge; YouTube-Miniaturen, Shorts und Kanal-Art; TikTok; Facebook-Cover; LinkedIn-Beiträge und Banner; X-(Twitter-)Header und Beiträge; Spotify- und Apple-Music-Cover sowie SoundCloud-Banner. Nach dem Zuschneiden öffnet ein Tippen die realistische Vorschau, um zu prüfen, wie gut das Bild auf den ersten Blick erkennbar ist — einschließlich Mobil-, Desktop- und TV-Ansichten, wo die Plattform je nach Gerät anders anzeigt.',
        ] },
        { h2: 'Leitfaden zu Sicherheitszonen', p: [
          'Die RealResizer-Seiten erklären die Sicherheitszonen jeder Plattform: die Bereiche, in denen UI-Elemente (Profilname, Bildunterschrift, Zeit-Badges und Aktionsschaltflächen) das Bild überlagern. Dieser Leitfaden hilft Ihnen, Text, Logos und Gesichter in dem Bereich des Frames zu halten, der sichtbar bleibt — statt erst nach dem Veröffentlichen zu entdecken, dass ein wichtiges Detail verdeckt wird.',
        ] },
        { h2: 'Unterstützte Exporte', p: [
          'Wenn Ihr Zuschnitt fertig ist, exportieren Sie als PNG (verlustfrei), JPEG oder WebP. Die Exportmaße entsprechen der gewählten Vorlage, und die JPEG-/WebP-Qualität ist einstellbar. PNG erhält jedes Pixel; JPEG und WebP tauschen ein wenig Detail gegen deutlich kleinere Dateien.',
        ] },
        { h2: 'Lokale Verarbeitung im Browser und Datenschutz', p: [
          'Alles läuft in Ihrem Browser. Sie laden nichts hoch und die gesamte Verarbeitung erfolgt lokal: Ihr Bild wird auf eine Leinwand im Arbeitsspeicher geladen und nie übertragen. Keine Konten, keine Anmeldung und keine Serververarbeitung. Ihr Bild verlässt nie Ihr Gerät.',
        ] },
        { h2: 'Wer steckt hinter RealResizer', p: [
          'RealResizer wird von Pratham als unabhängiges, kostenloses Tool entwickelt und gepflegt. Es ist ein Ein-Personen-Projekt und verwendet Google Analytics für anonyme Nutzungsstatistiken sowie Google AdSense für Werbung; beides ist in der Datenschutzerklärung offengelegt.',
        ] },
        { h2: 'Feedback und Vorgaben-Anfragen', p: [
          'RealResizer lebt vom Feedback seiner Nutzer. Fehlt eine Plattform-Vorlage, wirkt eine Größe veraltet oder verhält sich etwas nicht wie erwartet, können Sie über die <a href="/de/contact/">Kontaktseite</a> Anfragen senden. Anfragen zu Vorgaben werden geprüft und, wo machbar, umgesetzt.',
        ] },
      ],
      faq: [
        { q: 'Ist RealResizer wirklich kostenlos?', a: 'Ja. RealResizer ist kostenlos nutzbar — ohne Wasserzeichen, ohne Konten und ohne Anmeldung.' },
        { q: 'Wird mein Bild irgendwo hochgeladen?', a: 'Nein. Ihr Bild wird vollständig in Ihrem Browser verarbeitet, auf eine Leinwand im Arbeitsspeicher geladen und nie übertragen. Es verlässt nie Ihr Gerät.' },
        { q: 'In welchen Formaten kann ich exportieren?', a: 'PNG, JPEG und WebP. Der PNG-Export ist verlustfrei; die Qualität von JPEG und WebP lässt sich beim Export einstellen.' },
        { q: 'Was, wenn eine Vorlage fehlt oder veraltet ist?', a: 'Melden Sie es über die <a href="/de/contact/">Kontaktseite</a> mit dem Namen der Plattform — wir prüfen das.' },
        { q: 'Muss ich mich registrieren?', a: 'Nein. Es gibt keine Konten und keine Anmeldung. Öffnen Sie die Seite, laden Sie ein Bild hoch und starten Sie sofort.' },
      ],
    },
    pt: {
      h1: 'Sobre o RealResizer',
      lede: 'O RealResizer é uma ferramenta gratuita de imagens baseada no navegador que mostra exatamente como sua imagem ficará em cada plataforma antes de você publicar.',
      rows: [
        { h2: 'O que é o RealResizer', p: [
          'O RealResizer é uma utilidade gratuita de imagens que roda no navegador e concentra todo o esforço em uma única coisa: mostrar exatamente como sua imagem ficará em uma plataforma específica antes de você publicar. Em vez de adivinhar se uma foto cabe em um Story do Instagram, uma miniatura do YouTube ou um post do LinkedIn, você escolhe uma predefinição de destino, recorta e redimensiona para as dimensões exatas da plataforma e visualiza o resultado dentro de uma maquete realista dela.',
        ] },
        { h2: 'Por que o RealResizer existe', p: [
          'Todos os dias, milhões de imagens são publicadas sem nunca serem conferidas dentro da interface real da plataforma. Textos são cortados, logotipos ficam em zonas seguras e rostos somem atrás de elementos da interface. O RealResizer existe para fechar essa lacuna: recorte, redimensione e visualize sua imagem dentro de maquetes realistas de plataformas para ver o resultado final antes que qualquer coisa saia do seu dispositivo.',
        ] },
        { h2: 'Predefinições de plataforma e visualizações', p: [
          'A ferramenta inclui predefinições de dimensões para os destinos mais comuns: Stories, Reels e posts do Instagram; miniaturas, Shorts e artes de canal do YouTube; TikTok; capas do Facebook; posts e banners do LinkedIn; cabeçalhos e posts do X (Twitter); capas do Spotify e do Apple Music; e banners do SoundCloud. Depois de recortar uma imagem, um toque abre uma visualização realista para conferir como ela se lê à primeira vista, incluindo visualizações de celular, desktop e TV, onde a plataforma exibe de forma diferente por dispositivo.',
        ] },
        { h2: 'Guia de zonas seguras', p: [
          'As páginas do RealResizer explicam as zonas seguras de cada plataforma: as áreas onde os elementos da interface (nome do perfil, legendas, selos de duração e botões de ação) se sobrepõem à imagem. Esse guia ajuda você a manter texto, logotipos e rostos na parte do enquadramento que continua visível, em vez de só descobrir depois da publicação que um detalhe importante ficou escondido.',
        ] },
        { h2: 'Exportações compatíveis', p: [
          'Quando o recorte estiver pronto, exporte como PNG (sem perdas), JPEG ou WebP. As dimensões de exportação correspondem à predefinição escolhida e a qualidade de JPEG/WebP é ajustável. O PNG mantém cada pixel intacto; o JPEG e o WebP trocam um pouco de detalhe por arquivos bem menores.',
        ] },
        { h2: 'Processamento local no navegador e privacidade', p: [
          'Tudo roda dentro do seu navegador. Você não envia nada e todo o processamento acontece localmente: sua imagem é carregada em uma tela na memória e nunca é transmitida. Sem contas, sem cadastro e sem processamento no servidor. Sua imagem nunca sai do seu dispositivo.',
        ] },
        { h2: 'Quem está por trás do RealResizer', p: [
          'O RealResizer é criado e mantido por Pratham como uma ferramenta gratuita e independente. É um projeto de uma pessoa só e usa o Google Analytics para estatísticas de uso anônimas e o Google AdSense para publicidade, ambos declarados na Política de Privacidade.',
        ] },
        { h2: 'Feedback e pedidos de predefinições', p: [
          'O RealResizer é movido pelo feedback dos usuários. Se faltar uma predefinição de plataforma, uma dimensão parecer desatualizada ou algo não se comportar como esperado, você pode pedir pela <a href="/pt/contact/">página de contato</a>. Pedidos de predefinições são analisados e, quando viáveis, adicionados.',
        ] },
      ],
      faq: [
        { q: 'O RealResizer é realmente gratuito?', a: 'Sim. O RealResizer é gratuito, sem marcas d\u2019água, sem contas e sem necessidade de cadastro.' },
        { q: 'Minha imagem é enviada para algum lugar?', a: 'Não. Sua imagem é processada inteiramente no seu navegador, carregada em uma tela na memória e nunca transmitida. Ela nunca sai do seu dispositivo.' },
        { q: 'Quais formatos posso exportar?', a: 'PNG, JPEG e WebP. A exportação em PNG é sem perdas; a qualidade de JPEG e WebP pode ser ajustada na exportação.' },
        { q: 'E se faltar uma predefinição ou ela estiver desatualizada?', a: 'Envie uma mensagem pela <a href="/pt/contact/">página de contato</a> com o nome da plataforma e vamos analisar.' },
        { q: 'Preciso me cadastrar para usar a ferramenta?', a: 'Não. Não há contas nem cadastro. Abra a página, carregue uma imagem e comece imediatamente.' },
      ],
    },
  },

  'privacy-policy': {
    es: {
      h1: 'Política de privacidad',
      lede: 'Esta política explica qué ocurre con tus imágenes y qué herramientas utiliza el propio sitio. Tus imágenes se procesan localmente en tu navegador y nunca se suben a nuestros servidores.',
      rows: [
        { h2: 'Tus imágenes', p: [
          'RealResizer procesa las imágenes por completo en tu navegador. Tu imagen nunca sale de tu dispositivo: no se sube a nuestros servidores. Esta es la promesa principal de privacidad de la herramienta.',
        ] },
        { h2: 'Analítica y publicidad', p: [
          'Para entender cómo se usa el sitio y mantenerlo gratuito, RealResizer utiliza Google Analytics (GA4) y la publicidad de Google AdSense. Son tecnologías web habituales que pueden usar cookies para recopilar estadísticas de uso que no te identifican por nombre ni correo electrónico. No ven tus imágenes, que permanecen locales en tu dispositivo y nunca se comparten con Google ni con nadie más.',
        ] },
        { h2: 'ads.txt', p: [
          'Como es necesario, RealResizer sirve un archivo ads.txt en /ads.txt que declara su relación de venta directa con Google AdSense.',
        ] },
      ],
      faq: [
        { q: '¿Ves mis imágenes?', a: 'No. Las imágenes se procesan localmente en tu navegador y nunca cruzan la red.' },
        { q: '¿Google Analytics ve mis imágenes?', a: 'No. GA4 y AdSense solo recopilan datos estándar de uso del sitio que no te identifican por nombre ni correo electrónico; los datos de tus imágenes nunca salen de tu dispositivo.' },
      ],
    },
    ja: {
      h1: 'プライバシーポリシー',
      lede: 'このポリシーでは、あなたの画像に何が起きるか、サイト自体がどのようなツールを使うかを説明します。画像はブラウザ内でローカルに処理され、当社のサーバーにアップロードされることはありません。',
      rows: [
        { h2: 'あなたの画像', p: [
          'RealResizerは画像をすべてブラウザ内で処理します。画像が端末の外に出ることはありません。当社のサーバーへのアップロードは一切ありません。これがこのツールの中核となるプライバシーの約束です。',
        ] },
        { h2: 'アクセス解析と広告', p: [
          'サイトの利用状況の把握と無料での提供を続けるため、RealResizerはGoogle Analytics（GA4）とGoogle AdSense広告を使用しています。これらは一般的なウェブ技術で、氏名やメールアドレスでは特定できない利用統計を収集するためにCookieを使用することがあります。画像は端末内に留まり、Googleを含む他の誰かと共有されることはありません。',
        ] },
        { h2: 'ads.txt', p: [
          '必要な対応として、RealResizerは /ads.txt にGoogle AdSenseとの直接販売関係を宣言するads.txtファイルを配信しています。',
        ] },
      ],
      faq: [
        { q: '画像は見られますか？', a: 'いいえ。画像はブラウザ内でローカルに処理され、ネットワーク上を送信されることはありません。' },
        { q: 'Google Analyticsは画像を見ますか？', a: 'いいえ。GA4とAdSenseは氏名やメールアドレスでは特定できない標準的なサイト利用データのみを収集し、画像データが端末の外に出ることはありません。' },
      ],
    },
    de: {
      h1: 'Datenschutzerklärung',
      lede: 'Diese Richtlinie erklärt, was mit Ihren Bildern passiert und welche Werkzeuge die Website selbst verwendet. Ihre Bilder werden lokal in Ihrem Browser verarbeitet und niemals auf unsere Server hochgeladen.',
      rows: [
        { h2: 'Ihre Bilder', p: [
          'RealResizer verarbeitet Bilder vollständig in Ihrem Browser. Ihr Bild verlässt nie Ihr Gerät: Es gibt keinen Upload auf unsere Server. Das ist das zentrale Datenschutzversprechen des Tools.',
        ] },
        { h2: 'Analysen und Werbung', p: [
          'Um zu verstehen, wie die Website genutzt wird, und um sie kostenlos zu halten, verwendet RealResizer Google Analytics (GA4) und Google-AdSense-Werbung. Dies sind übliche Webtechnologien, die Cookies verwenden, um Nutzungsstatistiken zu erfassen, die Sie nicht über Name oder E-Mail identifizieren. Sie sehen Ihre Bilder nicht, die lokal auf Ihrem Gerät bleiben und niemals mit Google oder anderen geteilt werden.',
        ] },
        { h2: 'ads.txt', p: [
          'Wie erforderlich stellt RealResizer unter /ads.txt eine ads.txt-Datei bereit, die die direkte Verkaufsbeziehung zu Google AdSense erklärt.',
        ] },
      ],
      faq: [
        { q: 'Sehen Sie meine Bilder?', a: 'Nein. Bilder werden lokal in Ihrem Browser verarbeitet und verlassen nie das Netzwerk.' },
        { q: 'Sieht Google Analytics meine Bilder?', a: 'Nein. GA4 und AdSense erfassen nur standardmäßige Nutzungsdaten, die Sie nicht über Name oder E-Mail identifizieren; Ihre Bilddaten verlassen nie Ihr Gerät.' },
      ],
    },
    pt: {
      h1: 'Política de Privacidade',
      lede: 'Esta política explica o que acontece com suas imagens e quais ferramentas o próprio site utiliza. Suas imagens são processadas localmente no seu navegador e nunca são enviadas aos nossos servidores.',
      rows: [
        { h2: 'Suas imagens', p: [
          'O RealResizer processa imagens inteiramente no seu navegador. Sua imagem nunca sai do seu dispositivo: não há envio aos nossos servidores. Essa é a promessa central de privacidade da ferramenta.',
        ] },
        { h2: 'Análise e publicidade', p: [
          'Para entender como o site é usado e mantê-lo gratuito, o RealResizer usa o Google Analytics (GA4) e a publicidade do Google AdSense. São tecnologias web comuns que podem usar cookies para coletar estatísticas de uso que não identificam você pelo nome ou e-mail. Elas não veem suas imagens, que permanecem locais no seu dispositivo e nunca são compartilhadas com o Google nem com ninguém.',
        ] },
        { h2: 'ads.txt', p: [
          'Como exigido, o RealResizer disponibiliza um arquivo ads.txt em /ads.txt declarando sua relação de venda direta com o Google AdSense.',
        ] },
      ],
      faq: [
        { q: 'Vocês veem minhas imagens?', a: 'Não. As imagens são processadas localmente no seu navegador e nunca cruzam a rede.' },
        { q: 'O Google Analytics vê minhas imagens?', a: 'Não. O GA4 e o AdSense coletam apenas dados padrão de uso do site que não identificam você pelo nome ou e-mail; os dados das suas imagens nunca saem do seu dispositivo.' },
      ],
    },
  },

  terms: {
    es: {
      h1: 'Términos del Servicio',
      lede: 'Estos términos rigen tu uso de RealResizer. Al usar la herramienta aceptas estos términos.',
      rows: [
        { h2: 'Uso aceptable', p: [
          'Puedes usar RealResizer para cualquier fin lícito. No lo uses para procesar contenido que no tengas derecho a usar.',
        ] },
        { h2: 'Sin garantía', p: [
          'RealResizer se ofrece «tal cual», sin garantía de ningún tipo. Aunque la herramienta está diseñada para redimensionar y previsualizar imágenes con precisión, no garantizamos resultados específicos en todas las plataformas para todas las imágenes.',
        ] },
        { h2: 'Cambios', p: [
          'Podemos actualizar estos términos de vez en cuando. El uso continuado de la herramienta tras los cambios implica que aceptas los términos actualizados.',
        ] },
      ],
      faq: [
        { q: '¿Necesito una cuenta?', a: 'No. RealResizer no requiere cuenta ni registro.' },
      ],
    },
    ja: {
      h1: '利用規約',
      lede: '本規約はRealResizerの利用に適用されます。ツールを使用することで、本規約に同意したものとみなされます。',
      rows: [
        { h2: '許容される利用', p: [
          'RealResizerは合法的な目的にのみ使用できます。利用する権利のないコンテンツの処理には使用しないでください。',
        ] },
        { h2: '保証の否認', p: [
          'RealResizerは、いかなる保証もなく「現状のまま」提供されます。正確なリサイズとプレビューを目的として設計されていますが、すべてのプラットフォーム・すべての画像で特定の結果を保証するものではありません。',
        ] },
        { h2: '変更', p: [
          '本規約は随時更新されることがあります。変更後にツールを使い続けた場合、更新された規約に同意したものとみなされます。',
        ] },
      ],
      faq: [
        { q: 'アカウントは必要ですか？', a: 'いいえ。RealResizerはアカウントもサインアップも不要です。' },
      ],
    },
    de: {
      h1: 'Nutzungsbedingungen',
      lede: 'Diese Bedingungen gelten für Ihre Nutzung von RealResizer. Durch die Nutzung des Tools stimmen Sie ihnen zu.',
      rows: [
        { h2: 'Zulässige Nutzung', p: [
          'Sie dürfen RealResizer für jeden rechtmäßigen Zweck verwenden. Verwenden Sie es nicht, um Inhalte zu verarbeiten, die Sie nicht nutzen dürfen.',
        ] },
        { h2: 'Keine Gewährleistung', p: [
          'RealResizer wird „wie gesehen" ohne jegliche Gewährleistung bereitgestellt. Das Tool ist darauf ausgelegt, Bilder präzise zu skalieren und vorzuzeigen; wir garantieren jedoch keine bestimmten Ergebnisse auf jeder Plattform für jedes Bild.',
        ] },
        { h2: 'Änderungen', p: [
          'Wir können diese Bedingungen von Zeit zu Zeit aktualisieren. Die fortgesetzte Nutzung des Tools nach Änderungen bedeutet, dass Sie die aktualisierten Bedingungen akzeptieren.',
        ] },
      ],
      faq: [
        { q: 'Brauche ich ein Konto?', a: 'Nein. RealResizer benötigt kein Konto und keine Anmeldung.' },
      ],
    },
    pt: {
      h1: 'Termos de Serviço',
      lede: 'Estes termos regem o seu uso do RealResizer. Ao usar a ferramenta, você concorda com eles.',
      rows: [
        { h2: 'Uso aceitável', p: [
          'Você pode usar o RealResizer para qualquer finalidade lícita. Não o use para processar conteúdo que você não tem o direito de usar.',
        ] },
        { h2: 'Sem garantia', p: [
          'O RealResizer é fornecido «como está», sem qualquer tipo de garantia. Embora a ferramenta seja projetada para redimensionar e visualizar imagens com precisão, não garantimos resultados específicos em todas as plataformas para todas as imagens.',
        ] },
        { h2: 'Alterações', p: [
          'Podemos atualizar estes termos de tempos em tempos. O uso contínuo da ferramenta após alterações significa que você aceita os termos atualizados.',
        ] },
      ],
      faq: [
        { q: 'Preciso de uma conta?', a: 'Não. O RealResizer não exige conta nem cadastro.' },
      ],
    },
  },

  contact: {
    es: {
      h1: 'Contacto con RealResizer',
      lede: '¿Preguntas, comentarios o una solicitud de ajuste faltante? Escríbenos.',
      rows: [
        { h2: 'Correo electrónico', p: [
          'Escríbenos a <a href="mailto:pratham.lg.128@gmail.com">pratham.lg.128@gmail.com</a> para soporte, comentarios, consultas comerciales o para solicitar un ajuste de plataforma que falte.',
        ] },
        { h2: 'Tiempo de respuesta', p: [
          'Intentamos responder en unas pocas horas.',
        ] },
      ],
      faq: [
        { q: '¿Puedo solicitar un nuevo ajuste de plataforma?', a: 'Sí: escríbenos con el nombre de la plataforma y veremos cómo añadirla.' },
      ],
    },
    ja: {
      h1: 'RealResizerへのお問い合わせ',
      lede: 'ご質問、フィードバック、未対応プリセットのリクエストは下記までご連絡ください。',
      rows: [
        { h2: 'メール', p: [
          'サポート、フィードバック、ビジネスに関するお問い合わせ、未対応のプラットフォームプリセットのリクエストは <a href="mailto:pratham.lg.128@gmail.com">pratham.lg.128@gmail.com</a> までご連絡ください。',
        ] },
        { h2: '返信時間', p: [
          '数時間以内に返信いたします。',
        ] },
      ],
      faq: [
        { q: '新しいプラットフォームのプリセットをリクエストできますか？', a: 'はい。プラットフォーム名を添えてメールをお送りください。追加を検討します。' },
      ],
    },
    de: {
      h1: 'Kontakt zu RealResizer',
      lede: 'Fragen, Feedback oder einen fehlenden Vorgabewert gesucht? Schreiben Sie uns.',
      rows: [
        { h2: 'E-Mail', p: [
          'Schreiben Sie uns an <a href="mailto:pratham.lg.128@gmail.com">pratham.lg.128@gmail.com</a> für Support, Feedback, geschäftliche Anfragen oder um einen fehlenden Plattform-Vorgabewert anzufragen.',
        ] },
        { h2: 'Antwortzeit', p: [
          'Wir antworten in der Regel innerhalb weniger Stunden.',
        ] },
      ],
      faq: [
        { q: 'Kann ich einen neuen Plattform-Vorgabewert anfragen?', a: 'Ja — schreiben Sie uns mit dem Plattformnamen und wir prüfen, ihn hinzuzufügen.' },
      ],
    },
    pt: {
      h1: 'Contato com o RealResizer',
      lede: 'Perguntas, feedback ou um pedido de predefinição ausente? Fale conosco.',
      rows: [
        { h2: 'E-mail', p: [
          'Envie um e-mail para <a href="mailto:pratham.lg.128@gmail.com">pratham.lg.128@gmail.com</a> para suporte, feedback, consultas comerciais ou para solicitar uma predefinição de plataforma ausente.',
        ] },
        { h2: 'Tempo de resposta', p: [
          'Pretendemos responder em algumas horas.',
        ] },
      ],
      faq: [
        { q: 'Posso solicitar uma nova predefinição de plataforma?', a: 'Sim — envie um e-mail com o nome da plataforma e avaliaremos a inclusão.' },
      ],
    },
  },
};

module.exports = { TRUST_LOCALIZED };