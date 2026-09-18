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
        { h2: 'Por qué existe RealResizer', p: [
          'Cada día se publican millones de imágenes sin comprobar nunca cómo se ven dentro de la interfaz real de la plataforma. El texto se corta, los logotipos caen en zonas seguras y las caras quedan detrás de los elementos de la interfaz. RealResizer existe para cerrar esa brecha: recorta, redimensiona y previsualiza tu imagen dentro de maquetas realistas de plataformas para que veas el aspecto final antes de que cualquier cosa salga de tu dispositivo.',
        ] },
        { h2: 'Cómo funciona', p: [
          'Todo se ejecuta dentro de tu navegador. No subes nada y todo el procesamiento ocurre localmente en el navegador. Tu imagen nunca sale de tu dispositivo.',
        ] },
        { h2: 'Quién está detrás de RealResizer', p: [
          'RealResizer está creado y mantenido por Pratham como una herramienta independiente y gratuita: sin cuentas, sin registro y sin procesamiento en el servidor.',
        ] },
      ],
      faq: [
        { q: '¿RealResizer es realmente gratis?', a: 'Sí. RealResizer es gratis, sin marcas de agua y sin necesidad de registrarse.' },
        { q: '¿Mi imagen se sube a algún sitio?', a: 'No. Tu imagen se procesa por completo en tu navegador y nunca sale de tu dispositivo.' },
      ],
    },
    ja: {
      h1: 'RealResizerについて',
      lede: 'RealResizerはブラウザ上で動作する無料の画像ツールです。投稿する前に、画像が各プラットフォームでどのように見えるかを正確に確認できます。',
      rows: [
        { h2: 'RealResizerが存在する理由', p: [
          '毎日、何百万もの画像が実際のプラットフォームの画面で確認されることなく投稿されています。テキストが切れたり、ロゴがセーフゾーンにかかったり、顔がインターフェース要素の裏に隠れたりします。RealResizerはそのギャップを埋めるためにあります。画像をトリミング・リサイズし、リアルなプラットフォームのモックアップ内でプレビューして、端末の外に出る前に最終的な見え方を確認できます。',
        ] },
        { h2: '仕組み', p: [
          'すべてブラウザ内で実行されます。アップロードは不要で、処理はすべてブラウザ内でローカルに完結します。画像が端末の外に出ることはありません。',
        ] },
        { h2: 'RealResizerの運営者', p: [
          'RealResizerはPrathamが個人で開発・運営する無料ツールです。アカウント不要、サインアップ不要、サーバー側の処理もありません。',
        ] },
      ],
      faq: [
        { q: 'RealResizerは本当に無料ですか？', a: 'はい。RealResizerは無料で、透かしもサインアップも不要です。' },
        { q: '画像はどこかにアップロードされますか？', a: 'いいえ。画像はブラウザ内で完全に処理され、端末の外に出ることはありません。' },
      ],
    },
    de: {
      h1: 'Über RealResizer',
      lede: 'RealResizer ist ein kostenloses, browserbasiertes Bildtool, das Ihnen genau zeigt, wie Ihr Bild auf jeder Plattform aussieht, bevor Sie es veröffentlichen.',
      rows: [
        { h2: 'Warum es RealResizer gibt', p: [
          'Jeden Tag werden Millionen von Bildern gepostet, ohne jemals in der echten Oberfläche der Plattform geprüft zu werden. Text wird abgeschnitten, Logos liegen in Sicherheitszonen und Gesichter verschwinden hinter UI-Elementen. RealResizer schließt diese Lücke: Schneiden, skalieren und Vorschau in realistischen Plattform-Mockups, damit Sie den finalen Look sehen, bevor irgendetwas Ihr Gerät verlässt.',
        ] },
        { h2: 'So funktioniert es', p: [
          'Alles läuft in Ihrem Browser. Sie laden nichts hoch und die gesamte Verarbeitung erfolgt lokal im Browser. Ihr Bild verlässt nie Ihr Gerät.',
        ] },
        { h2: 'Wer steckt hinter RealResizer', p: [
          'RealResizer wird von Pratham als unabhängiges, kostenloses Tool entwickelt und gepflegt — keine Konten, keine Anmeldung und keine Serververarbeitung.',
        ] },
      ],
      faq: [
        { q: 'Ist RealResizer wirklich kostenlos?', a: 'Ja. RealResizer ist kostenlos nutzbar, ohne Wasserzeichen und ohne Anmeldung.' },
        { q: 'Wird mein Bild irgendwo hochgeladen?', a: 'Nein. Ihr Bild wird vollständig in Ihrem Browser verarbeitet und verlässt nie Ihr Gerät.' },
      ],
    },
    pt: {
      h1: 'Sobre o RealResizer',
      lede: 'O RealResizer é uma ferramenta gratuita de imagens baseada no navegador que mostra exatamente como sua imagem ficará em cada plataforma antes de você publicar.',
      rows: [
        { h2: 'Por que o RealResizer existe', p: [
          'Todos os dias, milhões de imagens são publicadas sem nunca serem conferidas dentro da interface real da plataforma. Textos são cortados, logotipos ficam em zonas seguras e rostos somem atrás de elementos da interface. O RealResizer existe para fechar essa lacuna: recorte, redimensione e visualize sua imagem dentro de maquetes realistas de plataformas para ver o resultado final antes que qualquer coisa saia do seu dispositivo.',
        ] },
        { h2: 'Como funciona', p: [
          'Tudo roda dentro do seu navegador. Você não envia nada e todo o processamento acontece localmente no navegador. Sua imagem nunca sai do seu dispositivo.',
        ] },
        { h2: 'Quem está por trás do RealResizer', p: [
          'O RealResizer é criado e mantido por Pratham como uma ferramenta gratuita e independente — sem contas, sem cadastro e sem processamento no servidor.',
        ] },
      ],
      faq: [
        { q: 'O RealResizer é realmente gratuito?', a: 'Sim. O RealResizer é gratuito, sem marcas d\u2019água e sem necessidade de cadastro.' },
        { q: 'Minha imagem é enviada para algum lugar?', a: 'Não. Sua imagem é processada inteiramente no seu navegador e nunca sai do seu dispositivo.' },
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