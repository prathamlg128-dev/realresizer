/**
 * RealResizer — Core Application Logic (Stage 2 Two-Mode Preset UI Refinement)
 * Client-side, privacy-first image utility with a 2-rail 4-handle crop model,
 * two-mode segmented switch (Custom vs Presets), liquid dropdown drawer,
 * Web Audio tactile ticks, and liquid Cut/Undo physics.
 */

'use strict';

(function () {
  // ---------------------------------------------------------------------------
  // Extensible Destination Presets Registry
  // ---------------------------------------------------------------------------
  // Standardized exact aspect ratios (width / height) for every platform.
  // Each `ratio` is the mathematically exact w:h of the listed pixel target.
  const PRESET_REGISTRY = [
    // --- Instagram ---
    { id: 'ig-story',        name: 'Instagram',          desc: 'Story (1080 × 1920)',          ratio: 9 / 16,       ratioLabel: '9:16',     targetW: 1080, targetH: 1920 },
    { id: 'ig-reel',         name: 'Instagram',          desc: 'Reel (1080 × 1920)',           ratio: 9 / 16,       ratioLabel: '9:16',     targetW: 1080, targetH: 1920 },
    { id: 'ig-square',       name: 'Instagram',          desc: 'Post / Square (1080 × 1080)',  ratio: 1 / 1,        ratioLabel: '1:1',      targetW: 1080, targetH: 1080 },
    { id: 'ig-portrait',     name: 'Instagram',          desc: 'Portrait Feed (1080 × 1350)',  ratio: 4 / 5,        ratioLabel: '4:5',      targetW: 1080, targetH: 1350 },
    { id: 'ig-landscape',    name: 'Instagram',          desc: 'Landscape Feed (1080 × 566)',  ratio: 1080 / 566,   ratioLabel: '1.91:1',   targetW: 1080, targetH: 566 },
    // --- YouTube ---
    { id: 'youtube',         name: 'YouTube',            desc: 'Video Thumbnail (1280 × 720)',  ratio: 16 / 9,      ratioLabel: '16:9',     targetW: 1280, targetH: 720 },
    { id: 'youtube-banner',  name: 'YouTube Banner',     desc: 'Channel Art (2560 × 1440)',     ratio: 16 / 9,      ratioLabel: '16:9',     targetW: 2560, targetH: 1440 },
    { id: 'youtube-avatar',  name: 'YouTube Avatar',     desc: 'Profile Icon (800 × 800)',      ratio: 1 / 1,       ratioLabel: '1:1',      targetW: 800,  targetH: 800 },
    { id: 'youtube-short',   name: 'YouTube Short',      desc: 'Shorts (1080 × 1920)',         ratio: 9 / 16,      ratioLabel: '9:16',     targetW: 1080, targetH: 1920 },
    // --- Apple Music ---
    { id: 'apple-cover',     name: 'Apple Music Cover',  desc: 'Album Cover Art (3000 × 3000)', ratio: 1 / 1,       ratioLabel: '1:1',      targetW: 3000, targetH: 3000 },
    { id: 'apple-playlist',  name: 'Apple Playlist',     desc: 'Playlist Cover (1080 × 1080)',  ratio: 1 / 1,       ratioLabel: '1:1',      targetW: 1080, targetH: 1080 },
    { id: 'apple-banner',    name: 'Apple Music Artist', desc: 'Profile / Hero Banner (2048 × 1152)', ratio: 16 / 9, ratioLabel: '16:9', targetW: 2048, targetH: 1152 },
    // --- Spotify ---
    { id: 'spotify-cover',   name: 'Spotify Cover',      desc: 'Album / Playlist Artwork (1080 × 1080)', ratio: 1 / 1, ratioLabel: '1:1', targetW: 1080, targetH: 1080 },
    { id: 'spotify-canvas',  name: 'Spotify Canvas',     desc: 'Canvas Video (720 × 1280)',    ratio: 9 / 16,      ratioLabel: '9:16',     targetW: 720,  targetH: 1280 },
    { id: 'spotify-header',  name: 'Spotify Header',     desc: 'Artist Header / Banner (1920 × 640)', ratio: 3 / 1, ratioLabel: '3:1',  targetW: 1920, targetH: 640 },
    // --- X / Twitter ---
    { id: 'twitter-header',  name: 'X / Twitter Header', desc: 'Profile Header (1500 × 500)',  ratio: 3 / 1,        ratioLabel: '3:1',      targetW: 1500, targetH: 500 },
    { id: 'twitter-post',    name: 'X / Twitter Post',   desc: 'In-Stream Post (1600 × 900)',  ratio: 16 / 9,       ratioLabel: '16:9',     targetW: 1600, targetH: 900 },
    { id: 'twitter-avatar',  name: 'X / Twitter Avatar', desc: 'Profile Photo (400 × 400)',    ratio: 1 / 1,        ratioLabel: '1:1',      targetW: 400,  targetH: 400 },
    // --- LinkedIn ---
    { id: 'linkedin',        name: 'LinkedIn',           desc: 'Post Image (1200 × 627)',      ratio: 1200 / 627,   ratioLabel: '1.91:1',   targetW: 1200, targetH: 627 },
    { id: 'linkedin-banner', name: 'LinkedIn Banner',    desc: 'Profile Banner (1584 × 396)',  ratio: 4 / 1,        ratioLabel: '4:1',      targetW: 1584, targetH: 396 },
    { id: 'linkedin-company',name: 'LinkedIn Company',   desc: 'Company Banner (1128 × 191)',  ratio: 1128 / 191,   ratioLabel: '5.9:1',    targetW: 1128, targetH: 191 },
    // --- TikTok / Snapchat ---
    { id: 'tiktok',          name: 'TikTok / Reels',     desc: 'Video / Story (1080 × 1920)',  ratio: 9 / 16,       ratioLabel: '9:16',     targetW: 1080, targetH: 1920 },
    { id: 'snapchat',        name: 'Snapchat',           desc: 'Snap Ad (1080 × 1920)',        ratio: 9 / 16,       ratioLabel: '9:16',     targetW: 1080, targetH: 1920 },
    { id: 'tiktok-avatar',   name: 'TikTok Avatar',      desc: 'Profile Picture (400 × 400)',  ratio: 1 / 1,        ratioLabel: '1:1',      targetW: 400,  targetH: 400 },
    // --- Facebook ---
    { id: 'fb-cover',        name: 'Facebook Cover',     desc: 'Page Cover (851 × 315)',       ratio: 851 / 315,    ratioLabel: '2.7:1',    targetW: 851,  targetH: 315 },
    { id: 'facebook-post',   name: 'Facebook Post',      desc: 'Post Image (1200 × 630)',      ratio: 1200 / 630,   ratioLabel: '1.91:1',   targetW: 1200, targetH: 630 },
    { id: 'facebook-square', name: 'Facebook Square',    desc: 'Square Post (1080 × 1080)',    ratio: 1 / 1,        ratioLabel: '1:1',      targetW: 1080, targetH: 1080 },
    { id: 'fb-event',        name: 'Facebook Event',     desc: 'Event Cover (1920 × 1080)',    ratio: 16 / 9,       ratioLabel: '16:9',     targetW: 1920, targetH: 1080 },
    // --- Pinterest ---
    { id: 'pinterest-pin',   name: 'Pinterest Pin',      desc: 'Standard Pin (1000 × 1500)',   ratio: 2 / 3,        ratioLabel: '2:3',      targetW: 1000, targetH: 1500 },
    // --- Additional platforms ---
    { id: 'twitch-banner',   name: 'Twitch Banner',      desc: 'Profile Banner (1920 × 480)',  ratio: 4 / 1,        ratioLabel: '4:1',      targetW: 1920, targetH: 480 },
    { id: 'twitch-avatar',   name: 'Twitch Avatar',      desc: 'Profile Picture (1:1)',        ratio: 1 / 1,        ratioLabel: '1:1',      targetW: 1500, targetH: 1500 },
    { id: 'discord-banner',  name: 'Discord Banner',     desc: 'Server Banner (1920 × 768)',   ratio: 1920 / 768,   ratioLabel: '2.5:1',    targetW: 1920, targetH: 768 },
    { id: 'soundcloud-banner', name: 'SoundCloud',       desc: 'Profile Banner (2480 × 620)',  ratio: 4 / 1,        ratioLabel: '4:1',      targetW: 2480, targetH: 620 },
    { id: 'custom',          name: 'Custom',             desc: 'Freeform (any ratio)',         ratio: 1,           ratioLabel: 'Custom',   targetW: 1080, targetH: 1080 }
  ];

  const VALID_MIME_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp'
  ];

  const VALID_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

  // ---------------------------------------------------------------------------
  // Web Audio Tactile Synthesizer
  // ---------------------------------------------------------------------------
  class TactileSoundEngine {
    constructor() {
      this.ctx = null;
      this.enabled = true;
      this.lastTickTime = 0;
    }

    init() {
      if (!this.ctx) {
        try {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (AudioCtx) {
            this.ctx = new AudioCtx();
          }
        } catch (e) {}
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    }

    toggle() {
      this.enabled = !this.enabled;
      return this.enabled;
    }

    /**
     * Detented camera-control-wheel tick.
     * Two-oscillator blend: a short sine transient (body) + a shaped
     * noise burst (click texture). Total duration ~18 ms. Throttled to
     * 60 ms minimum gap so rapid drags stay clean, not noisy.
     */
    playTick() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx || this.ctx.state !== 'running') return;

      const now = performance.now();
      if (now - this.lastTickTime < 60) return; // 60 ms throttle
      this.lastTickTime = now;

      try {
        const t = this.ctx.currentTime;
        const D = 0.018; // total duration 18 ms

        // --- Body: sine transient, 1.2 kHz → 600 Hz ---
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, t);
        osc.frequency.exponentialRampToValueAtTime(600, t + D);
        oscGain.gain.setValueAtTime(0.0, t);
        oscGain.gain.linearRampToValueAtTime(0.07, t + 0.001);
        oscGain.gain.exponentialRampToValueAtTime(0.0001, t + D);
        osc.connect(oscGain);
        oscGain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + D);

        // --- Texture: white-noise burst through bandpass ---
        const bufLen = Math.ceil(this.ctx.sampleRate * D);
        const buf = this.ctx.createBuffer(1, bufLen, this.ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
        const noise = this.ctx.createBufferSource();
        noise.buffer = buf;
        const bp = this.ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = 3800;
        bp.Q.value = 1.2;
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.0, t);
        noiseGain.gain.linearRampToValueAtTime(0.04, t + 0.0008);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + D);
        noise.connect(bp);
        bp.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);
        noise.start(t);
        noise.stop(t + D);

        setTimeout(() => {
          try {
            osc.disconnect(); oscGain.disconnect();
            noise.disconnect(); bp.disconnect(); noiseGain.disconnect();
          } catch (_) {}
        }, 60);
      } catch (e) {}
    }

    /**
     * Premium swoosh for CUT, synchronized with the Genie fold-to-bin motion.
     *
     * A short, smooth, modern "whoosh" made from a band-passed noise sweep plus
     * a gentle low sine swell for weight. The filter sweeps upward so the tone
     * rises as the discarded pieces stretch toward the bin, then the gain
     * decays so it finishes exactly as the pieces disappear into the bin — the
     * audio mirrors the visual movement.
     *
     * startMs/endMs are the animation timeline moments (in ms) where the first
     * piece starts moving and the last piece finishes disappearing. The sweep
     * is scheduled for a total duration of (endMs - startMs) — so a longer /
     * more staggered fold gets a correspondingly longer, slower sweep.
     */
    playSweep(startMs, endMs) {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      try {
        const ac = this.ctx;
        const t = ac.currentTime;
        const dur = Math.max(220, (endMs - startMs)) / 1000; // seconds
        const attack = Math.min(0.06, dur * 0.25);
        const release = Math.min(0.12, dur * 0.35);

        // --- Voice 1: band-passed noise sweeping upward (the "whoosh") ---
        const len = Math.ceil(ac.sampleRate * dur);
        const buf = ac.createBuffer(1, len, ac.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
        const noise = ac.createBufferSource();
        noise.buffer = buf;

        const bp = ac.createBiquadFilter();
        bp.type = 'bandpass';
        bp.Q.value = 1.6;
        bp.frequency.setValueAtTime(700, t);
        bp.frequency.exponentialRampToValueAtTime(3200, t + dur);

        const nGain = ac.createGain();
        nGain.gain.setValueAtTime(0.0001, t);
        nGain.gain.exponentialRampToValueAtTime(0.12, t + attack);
        // Hold roughly through the middle, then decay as pieces are drawn in.
        nGain.gain.setValueAtTime(0.12, t + Math.max(attack, dur * 0.55));
        nGain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

        noise.connect(bp);
        bp.connect(nGain);
        nGain.connect(ac.destination);
        noise.start(t);
        noise.stop(t + dur + 0.05);

        // --- Voice 2: soft low swell for physical weight ---
        const osc = ac.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, t);
        osc.frequency.exponentialRampToValueAtTime(120, t + dur);

        const oGain = ac.createGain();
        oGain.gain.setValueAtTime(0.0001, t);
        oGain.gain.exponentialRampToValueAtTime(0.05, t + attack);
        oGain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

        osc.connect(oGain);
        oGain.connect(ac.destination);
        osc.start(t);
        osc.stop(t + dur + 0.05);

        const cleanup = () => {
          try {
            noise.disconnect(); bp.disconnect(); nGain.disconnect();
            osc.disconnect(); oGain.disconnect();
          } catch (_) {}
        };
        noise.onended = cleanup;
      } catch (e) {}
    }

    /**
     * Premium whoosh for CUT — smooth bandpass noise sweep + subtle low swell.
     * ~450ms fixed duration. Clean, professional, no glitch artifacts.
     */
    playCutWhoosh() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      try {
        const ac = this.ctx;
        const t = ac.currentTime;
        const dur = 0.45; // 450ms

        // Voice 1: bandpass noise sweep (the whoosh)
        const len = Math.ceil(ac.sampleRate * dur);
        const buf = ac.createBuffer(1, len, ac.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
        const noise = ac.createBufferSource();
        noise.buffer = buf;

        const bp = ac.createBiquadFilter();
        bp.type = 'bandpass';
        bp.Q.value = 1.2;
        bp.frequency.setValueAtTime(400, t);
        bp.frequency.exponentialRampToValueAtTime(2800, t + dur);

        const nGain = ac.createGain();
        nGain.gain.setValueAtTime(0.0, t);
        nGain.gain.linearRampToValueAtTime(0.1, t + 0.02);
        nGain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

        noise.connect(bp);
        bp.connect(nGain);
        nGain.connect(ac.destination);
        noise.start(t);
        noise.stop(t + dur + 0.02);

        // Voice 2: soft low sine swell for weight
        const osc = ac.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, t);
        osc.frequency.exponentialRampToValueAtTime(80, t + dur);

        const oGain = ac.createGain();
        oGain.gain.setValueAtTime(0.0, t);
        oGain.gain.linearRampToValueAtTime(0.03, t + 0.03);
        oGain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

        osc.connect(oGain);
        oGain.connect(ac.destination);
        osc.start(t);
        osc.stop(t + dur + 0.02);

        const cleanup = () => {
          try {
            noise.disconnect(); bp.disconnect(); nGain.disconnect();
            osc.disconnect(); oGain.disconnect();
          } catch (_) {}
        };
        noise.onended = cleanup;
      } catch (e) {}
    }

    /**
     * Soft pop/restore sound for Undo
     */
    playUndo() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(640, this.ctx.currentTime + 0.045);

        gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.045);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
      } catch (e) {}
    }

    /**
     * Glitch sound for CUT — digital, crisp, ~750ms.
     * Short noise bursts with pitch glitches + bitcrusher feel.
     * Matches the 750ms glitch animation.
     */
    playGlitch() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      try {
        const ac = this.ctx;
        const t = ac.currentTime;
        const dur = 0.75; // 750ms total

        // Voice 1: 3 short noise bursts with bandpass sweeps (the "glitch")
        for (let i = 0; i < 3; i++) {
          const burstT = t + i * 0.2;
          const burstDur = 0.15;

          const len = Math.ceil(ac.sampleRate * burstDur);
          const buf = ac.createBuffer(1, len, ac.sampleRate);
          const data = buf.getChannelData(0);
          for (let j = 0; j < len; j++) data[j] = Math.random() * 2 - 1;

          const noise = ac.createBufferSource();
          noise.buffer = buf;

          const bp = ac.createBiquadFilter();
          bp.type = 'bandpass';
          bp.Q.value = 2;
          bp.frequency.setValueAtTime(2000, burstT);
          bp.frequency.exponentialRampToValueAtTime(500, burstT + burstDur);

          const nGain = ac.createGain();
          nGain.gain.setValueAtTime(0.0, burstT);
          nGain.gain.linearRampToValueAtTime(0.18, burstT + 0.005);
          nGain.gain.exponentialRampToValueAtTime(0.0001, burstT + burstDur);

          noise.connect(bp);
          bp.connect(nGain);
          nGain.connect(ac.destination);
          noise.start(burstT);
          noise.stop(burstT + burstDur + 0.02);
        }

        // Voice 2: Square wave pitch glitches (digital feel)
        for (let i = 0; i < 4; i++) {
          const glitchT = t + 0.05 + i * 0.15;
          const glitchDur = 0.08;

          const osc = ac.createOscillator();
          osc.type = 'square';
          osc.frequency.setValueAtTime(1200, glitchT);
          osc.frequency.exponentialRampToValueAtTime(300, glitchT + glitchDur);

          const oGain = ac.createGain();
          oGain.gain.setValueAtTime(0.0, glitchT);
          oGain.gain.linearRampToValueAtTime(0.06, glitchT + 0.003);
          oGain.gain.exponentialRampToValueAtTime(0.0001, glitchT + glitchDur);

          osc.connect(oGain);
          oGain.connect(ac.destination);
          osc.start(glitchT);
          osc.stop(glitchT + glitchDur);
        }

        // Voice 3: Subtle bitcrusher-style low sample rate texture
        const bitLen = Math.ceil(ac.sampleRate * dur);
        const bitBuf = ac.createBuffer(1, bitLen, ac.sampleRate * 0.125); // 1/8 sample rate = bitcrush
        const bitData = bitBuf.getChannelData(0);
        for (let i = 0; i < bitLen; i++) bitData[i] = (Math.random() * 2 - 1) * 0.3;

        const bitNoise = ac.createBufferSource();
        bitNoise.buffer = bitBuf;
        bitNoise.playbackRate.value = 8; // speed up to compensate

        const bitGain = ac.createGain();
        bitGain.gain.setValueAtTime(0.0, t);
        bitGain.gain.linearRampToValueAtTime(0.04, t + 0.1);
        bitGain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

        bitNoise.connect(bitGain);
        bitGain.connect(ac.destination);
        bitNoise.start(t);
        bitNoise.stop(t + dur + 0.05);

        // Cleanup
        setTimeout(() => {
          try {
            // sources auto-disconnect on stop
          } catch (_) {}
        }, 800);
      } catch (e) {}
    }
  }

  const soundEngine = new TactileSoundEngine();

  // Restore session sound preference (persisted across page reloads in same tab)
  if (sessionStorage.getItem('rr_sound') === 'off') {
    soundEngine.enabled = false;
  }

  // ---------------------------------------------------------------------------
  // Application State
  // ---------------------------------------------------------------------------
  // Per-page default preset (set via window.REALRESIZER_DEFAULT_PRESET before
  // this script runs). Applied automatically once an image is first loaded so
  // SEO landing pages open with the correct platform crop ratio pre-selected.
  let defaultPreset = null;
  const state = {
    file: null,
    image: null,           // Current active HTMLImageElement / Canvas
    originalImage: null,   // Master original image
    fileName: '',
    fileSize: 0,
    fileType: '',
    naturalWidth: 0,
    naturalHeight: 0,
    objectUrl: null,

    // Normalized Crop Box [0..1] relative to source image. The source image is
    // always displayed at 1.0x (never magnified/zoomed); the crop box simply
    // selects a sub-rectangle that CUT exports at native resolution.
    crop: { x: 0, y: 0, width: 1, height: 1 },

    // Active Mode: 'custom' or preset ID ('youtube', 'ig-square', etc.)
    activePreset: 'custom',

    // Crop State Flag
    isCropped: false,

    // Undo State (1-level undo)
    undoState: null,

    // Canvas Viewport Geometry in CSS client pixels
    viewport: {
      width: 0,
      height: 0,
      imageX: 0,
      imageY: 0,
      imageWidth: 0,
      imageHeight: 0,
      scale: 1
    },

    // Dragging & Interaction State
    dragging: null,
    dragStart: { clientX: 0, clientY: 0, crop: null },
    lastDragClientPos: { x: 0, y: 0 },
    // True while the top-left crop-resize puck is actively being dragged.
    scaleDragging: false,

    // Animation flag
    isAnimating: false
  };

  // ---------------------------------------------------------------------------
  // DOM Elements
  // ---------------------------------------------------------------------------
  const elements = {
    // Views
    landingView: document.getElementById('landing-view'),
    loadedView: document.getElementById('loaded-view'),

    // Dropzone & Inputs
    dropzone: document.getElementById('dropzone'),
    fileInput: document.getElementById('file-input'),

    // Header Controls
    btnSoundToggle: document.getElementById('btn-sound-toggle'),
    soundOnIcon: document.querySelector('.sound-on-icon'),
    soundOffIcon: document.querySelector('.sound-off-icon'),
    brandLogo: document.getElementById('brand-logo'),
    btnFullscreen: document.getElementById('btn-fullscreen'),

    // Metadata Display
    thumbnailImg: document.getElementById('thumbnail-img'),
    metaFilename: document.getElementById('meta-filename'),
    metaDimensions: document.getElementById('meta-dimensions'),
    metaAspect: document.getElementById('meta-aspect'),
    metaFilesize: document.getElementById('meta-filesize'),
    metaFormat: document.getElementById('meta-format'),

    // Two-Mode Segmented Control & Presets Drawer
    modeSwitchWrapper: document.getElementById('mode-switch-wrapper'),
    btnModeCustom: document.getElementById('btn-mode-custom'),
    btnModePresets: document.getElementById('btn-mode-presets'),
    presetsDrawer: document.getElementById('presets-drawer'),
    btnCloseDrawer: document.getElementById('btn-close-drawer'),
    presetsGrid: document.getElementById('presets-grid'),
    presetsSearch: document.getElementById('presets-search'),
    presetsBackdrop: document.getElementById('presets-backdrop'),

    // Actions
    btnCut: document.getElementById('btn-cut'),
    btnUndo: document.getElementById('btn-undo'),
    btnReplace: document.getElementById('btn-replace'),
    btnClear: document.getElementById('btn-clear'),
    workspaceActions: document.querySelector('.workspace-actions'),

    // Selection Info Pill (replaces the removed zoom slider)
    zoomBar: document.getElementById('zoom-bar'),
    selectionValue: document.getElementById('selection-value'),

    // Stage & Canvas
    canvasFrame: document.getElementById('canvas-frame'),
    editorViewport: document.getElementById('editor-viewport'),
    canvas: document.getElementById('editor-canvas'),
    scaleHandle: document.getElementById('scale-handle'),
    postCutResult: document.getElementById('post-cut-result'),
    postCutResultImg: document.getElementById('post-cut-result-img'),

    // Two Ruler Rails & Four Handles
    rulerRight: document.getElementById('ruler-right'),
    rulerBottom: document.getElementById('ruler-bottom'),

    handleRightTop: document.getElementById('handle-right-top'),
    handleRightBottom: document.getElementById('handle-right-bottom'),
    handleBottomLeft: document.getElementById('handle-bottom-left'),
    handleBottomRight: document.getElementById('handle-bottom-right'),

    // Four Guide Lines
    guideLineTop: document.getElementById('guide-line-top'),
    guideLineBottom: document.getElementById('guide-line-bottom'),
    guideLineLeft: document.getElementById('guide-line-left'),
    guideLineRight: document.getElementById('guide-line-right'),

    // Cut Bin & Scraps
    cutBin: document.getElementById('cut-bin'),
    binCounter: document.getElementById('bin-counter'),
    scrapLayer: document.getElementById('scrap-layer'),

    // Status Pill
    stageStatusPill: document.getElementById('stage-status-pill'),
    stageStatusText: document.getElementById('stage-status-text'),
    statusDot: document.getElementById('status-dot'),

    // Layout containers (used to measure real available space)
    workspaceBar: document.querySelector('.workspace-bar'),
    stageContainer: document.getElementById('stage-container'),
    appFooter: document.querySelector('.app-footer'),

    // Toast
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toast-message'),
    toastClose: document.getElementById('toast-close')
  };

  // Post-cut panel references (resolved lazily after DOM is ready)
  const postCut = {
    btnPreview: null,
    postCutPreviewCta: null,
    btnDownloadOpen: null,
    downloadPanel: null,
    dlFilename: null,
    dlExtBadge: null,
    dlQualitySlider: null,
    dlQualityVal: null,
    dlQualityRow: null,
    dlLosslessBadge: null,
    dlDimInfo: null,
    previewModal: null,
    previewStage: null,
    previewContextBar: null,
    previewDeviceWrap: null,
    previewDeviceSelect: null,
    btnBaAfter: null,
    btnBaBefore: null
  };

  // Current preview state
  const previewState = {
    context: null,   // active context key (e.g. 'feed', 'reels')
    device: 'mobile', // 'mobile' | 'desktop' (vertical full-screen presets default to the phone view)
    ba: 'after'      // 'after' | 'before'
  };

  let ctx = elements.canvas ? elements.canvas.getContext('2d') : null;

  // Set by setupTwoRailInteractions so the pinch handler can cancel a live
  // single-finger crop/rail drag when a second finger lands.
  let cancelActiveDrag = null;
  let toastTimeout = null;
  let presetCards = [];

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
  }

  function calculateAspectRatio(width, height) {
    if (!width || !height) return '';
    const roundedW = Math.round(width);
    const roundedH = Math.round(height);

    const ratio = roundedW / roundedH;
    const commonRatios = [
      { name: '16:9', val: 16 / 9 },
      { name: '9:16', val: 9 / 16 },
      { name: '4:3', val: 4 / 3 },
      { name: '3:4', val: 3 / 4 },
      { name: '1:1', val: 1 },
      { name: '3:2', val: 3 / 2 },
      { name: '2:3', val: 2 / 3 },
      { name: '21:9', val: 21 / 9 },
      { name: '4:5', val: 4 / 5 },
      { name: '1.91:1', val: 1200 / 627 }
    ];

    const match = commonRatios.find(cr => Math.abs(cr.val - ratio) < 0.02);
    if (match) return match.name;

    const divisor = gcd(roundedW, roundedH);
    const rW = roundedW / divisor;
    const rH = roundedH / divisor;

    if (rW <= 32 && rH <= 32) {
      return `${rW}:${rH}`;
    }

    return `${(ratio).toFixed(2)}:1`;
  }

  function triggerHaptic(duration = 6) {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(duration);
      } catch (e) {}
    }
  }

  function showToast(message) {
    if (!elements.toast || !elements.toastMessage) return;
    elements.toastMessage.textContent = message;
    elements.toast.classList.remove('hidden');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => hideToast(), 4500);
  }

  function hideToast() {
    if (elements.toast) elements.toast.classList.add('hidden');
  }

  function isValidImageFile(file) {
    if (!file) return false;
    if (VALID_MIME_TYPES.includes(file.type.toLowerCase())) return true;
    const lowerName = file.name.toLowerCase();
    return VALID_EXTENSIONS.some(ext => lowerName.endsWith(ext));
  }

  // ---------------------------------------------------------------------------
  // Post-CUT UI helpers
  // ---------------------------------------------------------------------------

function resolvePostCutElements() {
    postCut.btnPreview       = document.getElementById('btn-preview');
    postCut.postCutPreviewCta = document.getElementById('post-cut-preview-cta');
    postCut.btnDownloadOpen  = document.getElementById('btn-download-open');
    postCut.actionsCluster   = document.getElementById('post-cut-actions');
    postCut.downloadPanel    = document.getElementById('download-panel');
    postCut.dlFilename       = document.getElementById('dl-filename');
    postCut.dlExtBadge       = document.getElementById('dl-ext-badge');
    postCut.dlQualitySlider  = document.getElementById('dl-quality');
    postCut.dlQualityVal     = document.getElementById('dl-quality-val');
    postCut.dlQualityRow     = document.getElementById('dl-quality-row');
    postCut.dlLosslessBadge  = document.getElementById('dl-lossless-badge');
    postCut.dlDimInfo        = document.getElementById('dl-dim-info');
    postCut.previewModal     = document.getElementById('preview-modal');
    postCut.previewStage     = document.getElementById('preview-stage');
    postCut.previewContextBar = document.getElementById('preview-context-bar');
    postCut.previewDeviceWrap = document.getElementById('preview-device-wrap');
    postCut.previewDeviceSelect = document.getElementById('preview-device-select');
    postCut.previewDeviceSwitch = document.getElementById('preview-device-switch');
    postCut.btnBaAfter       = document.getElementById('btn-ba-after');
    postCut.btnBaBefore      = document.getElementById('btn-ba-before');
  }

  // Desktop-only POST-CUT: relocate the shared utility action buttons
  // (Cancel / Undo / Download) into the top file information card so they read
  // as a compact action cluster on the card's right side. The buttons are the
  // SAME DOM nodes used by the pre-cut dock (handlers + disabled state intact);
  // they are moved back into the pre-cut dock on exit. Mobile/tablet post-cut
  // is never touched (relocation is gated on the desktop breakpoint).
  function isDesktopPostCut() {
    return window.matchMedia && window.matchMedia('(min-width: 901px)').matches;
  }

  function relocatePostCutActionsToCard() {
    if (!postCut.actionsCluster || !elements.workspaceActions) return;
    const targets = [
      elements.btnClear,
      elements.btnUndo,
      postCut.btnDownloadOpen
    ];
    targets.forEach((btn) => {
      if (btn && btn.parentNode !== postCut.actionsCluster) {
        postCut.actionsCluster.appendChild(btn);
      }
    });
  }

  function restorePostCutActionsToDock() {
    if (!elements.workspaceActions) return;
    const targets = [
      elements.btnClear,
      elements.btnUndo,
      postCut.btnDownloadOpen
    ];
    targets.forEach((btn) => {
      if (btn && btn.parentNode === postCut.actionsCluster) {
        elements.workspaceActions.appendChild(btn);
      }
    });
  }

  function showPostCutActions() {
    if (isDesktopPostCut()) relocatePostCutActionsToCard();
    if (postCut.btnPreview)      postCut.btnPreview.classList.remove('hidden');
    if (postCut.postCutPreviewCta && isDesktopPostCut()) postCut.postCutPreviewCta.classList.remove('hidden');
    if (postCut.btnDownloadOpen) postCut.btnDownloadOpen.classList.remove('hidden');
    // Hide pre-cut editing controls
    if (elements.modeSwitchWrapper) elements.modeSwitchWrapper.classList.add('hidden');
    if (elements.btnCut) elements.btnCut.classList.add('hidden');
    if (elements.zoomBar) elements.zoomBar.classList.add('hidden');
    // Center the finished result vertically in the available viewport space.
    if (elements.loadedView) elements.loadedView.classList.add('is-post-cut');
    // Remove the editing chrome (rails, cut-bin, checkerboard) so the final
    // image reads as finished; updateViewportGeometry() then shrink-wraps the
    // frame to exactly the cropped result.
    if (elements.canvasFrame) elements.canvasFrame.classList.add('is-post-cut');
    // Populate download panel defaults
    if (postCut.dlFilename) {
      const base = state.fileName.replace(/\.[^.]+$/, '');
      postCut.dlFilename.value = base || 'cropped';
    }
    if (postCut.dlDimInfo) {
      postCut.dlDimInfo.textContent =
        `${state.naturalWidth} × ${state.naturalHeight} px  ·  ${calculateAspectRatio(state.naturalWidth, state.naturalHeight)}`;
    }
    // Populate and show the finished-result container (object-fit: contain).
    showPostCutResult();
  }

  function hidePostCutActions() {
    if (postCut.btnPreview)      postCut.btnPreview.classList.add('hidden');
    if (postCut.postCutPreviewCta) postCut.postCutPreviewCta.classList.add('hidden');
    if (postCut.btnDownloadOpen) postCut.btnDownloadOpen.classList.add('hidden');
    closeDownloadPanel();
    closePreviewModal();
    // Show pre-cut editing controls
    if (elements.modeSwitchWrapper) elements.modeSwitchWrapper.classList.remove('hidden');
    if (elements.btnCut) elements.btnCut.classList.remove('hidden');
    if (elements.zoomBar) elements.zoomBar.classList.remove('hidden');
    // Restore top-aligned editing flow.
    if (elements.loadedView) {
      elements.loadedView.classList.remove('is-post-cut');
      elements.loadedView.classList.remove('is-square');
    }
    // Restore the editing chrome (rails, cut-bin, checkerboard).
    if (elements.canvasFrame) elements.canvasFrame.classList.remove('is-post-cut');
    // Move the shared utility buttons back into the pre-cut action dock.
    restorePostCutActionsToDock();
    // Switch back from the finished-result container to the live editor stage.
    hidePostCutResult();
  }

  function showPostCutResult() {
    if (!elements.postCutResult || !elements.postCutResultImg || !state.image) return;
    // The cropped bitmap is state.image; render it into the result <img>.
    let src = state.image.src;
    if (!src && (state.image instanceof HTMLCanvasElement)) {
      src = state.image.toDataURL();
    }
    if (!src) {
      const c = document.createElement('canvas');
      c.width = state.naturalWidth;
      c.height = state.naturalHeight;
      c.getContext('2d').drawImage(state.image, 0, 0);
      src = c.toDataURL();
    }
    elements.postCutResultImg.src = src;
    // On-screen sizing is entirely CSS-owned (see .post-cut-result / .post-cut-
    // result-img): width:auto / max-width:100% / max-height:100% with
    // object-fit:contain preserves the exact aspect ratio, so the result
    // dynamically expand to fill the viewport-scaled container (tall vertical
    // cuts grow vertically, wide landscape cuts grow horizontally) without any
    // fixed pixel cap and without distortion or clipping.
    elements.postCutResultImg.style.maxHeight = '';
    if (elements.canvasFrame) elements.canvasFrame.classList.add('hidden');
    elements.postCutResult.classList.remove('hidden');
    // Tag square results so CSS can size them dynamically — the card hugs the
    // image (flex:0) and the stage centers the card+controls group vertically.
    function applySquareClass() {
      var img = elements.postCutResultImg;
      if (!img || !img.naturalWidth) return;
      var nw = img.naturalWidth, nh = img.naturalHeight;
      var sq = nw > 0 && nh > 0 && Math.abs(nw - nh) / Math.max(nw, nh) < 0.05;
      if (elements.loadedView) elements.loadedView.classList.toggle('is-square', sq);
    }
    elements.postCutResultImg.onload = applySquareClass;
    if (elements.postCutResultImg.complete) applySquareClass();
  }

  function hidePostCutResult() {
    if (!elements.postCutResult) return;
    if (elements.canvasFrame) elements.canvasFrame.classList.remove('hidden');
    elements.postCutResult.classList.add('hidden');
    if (elements.postCutResultImg) elements.postCutResultImg.removeAttribute('src');
  }

  // ---------------------------------------------------------------------------
  // Download Panel
  // ---------------------------------------------------------------------------

  function openDownloadPanel() {
    if (!postCut.downloadPanel) return;
    // Insert panel right after the workspace-bar in the loaded-view
    const workspaceBar = document.querySelector('.workspace-bar');
    if (workspaceBar && workspaceBar.nextSibling !== postCut.downloadPanel) {
      workspaceBar.parentNode.insertBefore(postCut.downloadPanel, workspaceBar.nextSibling);
    }
    postCut.downloadPanel.classList.remove('hidden');
    if (postCut.dlFilename) postCut.dlFilename.focus();
  }

  function closeDownloadPanel() {
    if (postCut.downloadPanel) postCut.downloadPanel.classList.add('hidden');
  }

  function syncDownloadFormat() {
    const fmt = getSelectedFormat();
    const isPng = fmt === 'png';
    if (postCut.dlExtBadge) postCut.dlExtBadge.textContent = '.' + fmt;
    if (postCut.dlQualitySlider) postCut.dlQualitySlider.disabled = isPng;
    if (postCut.dlQualityVal)    postCut.dlQualityVal.classList.toggle('hidden', isPng);
    if (postCut.dlLosslessBadge) postCut.dlLosslessBadge.classList.toggle('hidden', !isPng);
  }

  function getSelectedFormat() {
    const radios = document.querySelectorAll('input[name="dl-format"]');
    for (const r of radios) { if (r.checked) return r.value; }
    return 'png';
  }

  function executeDownload() {
    if (!state.image || !state.isCropped) return;
    const fmt = getSelectedFormat();
    const quality = fmt === 'png' ? 1 : (parseInt(postCut.dlQualitySlider?.value || 92, 10) / 100);
    const mimeType = fmt === 'jpeg' ? 'image/jpeg' : (fmt === 'webp' ? 'image/webp' : 'image/png');
    const filename = (postCut.dlFilename?.value.trim() || 'cropped') + '.' + fmt;

    // Draw at full resolution
    const c = document.createElement('canvas');
    c.width  = state.naturalWidth;
    c.height = state.naturalHeight;
    const cx = c.getContext('2d');
    cx.drawImage(state.image, 0, 0);

    c.toBlob((blob) => {
      if (!blob) { showToast('Export failed. Please try again.'); return; }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 200);
    }, mimeType, quality);
  }

  // ---------------------------------------------------------------------------
  // Native Back-Gesture Router (pushState / popstate)
  // ---------------------------------------------------------------------------
  // Models the app as a short stack of named screens so the browser's back
  // gesture (swipe on mobile, Alt+Left / mouse back on desktop) walks backward
  // through the app instead of closing the tab or leaving the site:
  //   'home'     -> initial upload screen
  //   'cropper'  -> image loaded, editing/cropping view active
  //   'preview'  -> interactive platform mockup overlay open
  //   'result'   -> post-cut / completion screen
  const router = {
    view: 'home',    // resolved current screen
    syncing: false   // true while replaying popstate (suppress re-push)
  };

  function routerPush(view, hash) {
    if (router.syncing) return;
    router.view = view;
    try {
      history.pushState({ view }, '', hash);
    } catch (e) {
      // Restrictive URLs (file://, data:, sandboxed frames) may reject pushState.
    }
  }

  // Derive the currently rendered screen straight from the live DOM.
  function routerCurrentView() {
    if (postCut.previewModal && !postCut.previewModal.classList.contains('hidden')) return 'preview';
    if (state.isCropped && elements.postCutResult && !elements.postCutResult.classList.contains('hidden')) return 'result';
    if (state.image && elements.loadedView && !elements.loadedView.classList.contains('hidden')) return 'cropper';
    return 'home';
  }

  // Alias so the popstate handler reads the same way as the spec.
  function closePreviewOverlay(opts) {
    closePreviewModal();
  }

  // 'home': the initial upload screen. Arriving here (e.g. brand reset or the
  // back gesture leaving the editor) discards the loaded image.
  function showHomeScreenUI(opts) {
    opts = opts || {};
    if (!opts.skipHistory && router.view !== 'home') routerPush('home', '#home');
    closePreviewModal();
    closeDownloadPanel();
    resetApplication();
    router.view = 'home';
  }

  // 'cropper': image loaded, editing view active. Returning here from the
  // finished result undoes the cut; returning from the preview closes it.
  function showCropperScreenUI(opts) {
    opts = opts || {};
    if (!opts.skipHistory && router.view !== 'cropper') routerPush('cropper', '#crop');
    closePreviewModal();
    closeDownloadPanel();
    if (state.isCropped) executeUndo();
    if (state.image) {
      router.view = 'cropper';
    } else {
      showHomeScreenUI({ skipHistory: true });
    }
  }

  // 'result': the post-cut / completion screen (finished result + actions).
  function showResultScreenUI(opts) {
    opts = opts || {};
    if (!opts.skipHistory && router.view !== 'result') routerPush('result', '#cut');
    closePreviewModal();
    if (state.image && state.isCropped) {
      showPostCutActions();
      router.view = 'result';
    } else if (state.image) {
      showCropperScreenUI({ skipHistory: true });
    } else {
      showHomeScreenUI({ skipHistory: true });
    }
  }

  // 'preview': the interactive platform mockup overlay (always on a result).
  function showPreviewOverlay(opts) {
    opts = opts || {};
    if (!state.image) { showHomeScreenUI({ skipHistory: true }); return; }
    if (!state.isCropped) { showCropperScreenUI({ skipHistory: true }); return; }
    openPreviewModal();
  }

  // ---------------------------------------------------------------------------
  // Preview Modal
  // ---------------------------------------------------------------------------

  // Full-screen vertical presets that offer a Mobile / Desktop device view
  const VERTICAL_FULLSCREEN_PRESETS = [
    'youtube-short',
    'ig-story',
    'ig-reel',
    'tiktok',
    'snapchat'
  ];
  function isVerticalFullscreenPreset(id) {
    return VERTICAL_FULLSCREEN_PRESETS.indexOf(id) !== -1;
  }

  // Map preset IDs to available context options
  const PREVIEW_CONTEXTS = {
    'youtube':           [{ key: 'grid',   label: 'Video Grid' }],
    'youtube-banner':    [{ key: 'channel',label: 'Channel' }],
    'youtube-avatar':    [{ key: 'feed',   label: 'Profile' }],
    'youtube-short':     [{ key: 'phone',  label: 'Shorts' }],
    'ig-square':         [{ key: 'feed',   label: 'Feed' }, { key: 'reels', label: 'Reels' }],
    'ig-portrait':       [{ key: 'feed',   label: 'Feed' }, { key: 'reels', label: 'Reels' }],
    'ig-story':          [{ key: 'story',  label: 'Story' }],
    'ig-reel':           [{ key: 'reels',  label: 'Reel' }],
    'ig-landscape':      [{ key: 'feed',   label: 'Feed' }],
    'tiktok':            [{ key: 'phone',  label: 'For You' }],
    'tiktok-avatar':     [{ key: 'feed',   label: 'Profile' }],
    'snapchat':          [{ key: 'phone',  label: 'Snap' }],
    'linkedin':          [{ key: 'feed',   label: 'Feed' }],
    'linkedin-banner':   [{ key: 'profile',label: 'Profile' }],
    'linkedin-company':  [{ key: 'company',label: 'Company' }],
    'fb-cover':          [{ key: 'cover',  label: 'Profile' }],
    'facebook-post':     [{ key: 'feed',   label: 'Feed' }],
    'facebook-square':   [{ key: 'feed',   label: 'Feed' }],
    'fb-event':          [{ key: 'grid',   label: 'Event' }],
    'pinterest-pin':     [{ key: 'board',  label: 'Board' }],
    'twitch-banner':     [{ key: 'channel',label: 'Channel' }],
    'twitch-avatar':     [{ key: 'feed',   label: 'Profile' }],
    'twitter-header':    [{ key: 'profile',label: 'Profile' }],
    'twitter-post':      [{ key: 'grid',   label: 'Feed' }],
    'twitter-avatar':    [{ key: 'feed',   label: 'Profile' }],
    'spotify-header':    [{ key: 'artist', label: 'Artist' }],
    'spotify-cover':     [{ key: 'player', label: 'Now Playing' }, { key: 'card', label: 'Card' }],
    'spotify-canvas':    [{ key: 'canvas', label: 'Canvas' }],
    'apple-banner':      [{ key: 'artist', label: 'Artist' }],
    'apple-cover':       [{ key: 'player', label: 'Now Playing' }],
    'apple-playlist':    [{ key: 'player', label: 'Now Playing' }],
    'discord-banner':    [{ key: 'channel',label: 'Server' }],
    'soundcloud-banner': [{ key: 'channel',label: 'Profile' }],
    'custom':            [{ key: 'plain',  label: 'Plain' }]
  };

  function openPreviewModal() {
    if (!postCut.previewModal || !state.isCropped) return;
    if (!postCut.previewModal.classList.contains('hidden')) return;
    const presetId = state.activePreset;
    const contexts = PREVIEW_CONTEXTS[presetId] || PREVIEW_CONTEXTS['custom'];
    previewState.context = contexts[0].key;
    previewState.ba = 'after';

    // Build context selector
    buildContextBar(contexts);

    // Show/hide device dropdown (YouTube) and the Mobile/Desktop switch for the
    // vertical full-screen presets (default: Mobile view).
    const showDevice = presetId === 'youtube';
    if (postCut.previewDeviceWrap) {
      postCut.previewDeviceWrap.classList.toggle('hidden', !showDevice);
    }
    if (showDevice && postCut.previewDeviceSelect) {
      previewState.device = postCut.previewDeviceSelect.value || 'desktop';
    }
    const showDeviceSwitch = isVerticalFullscreenPreset(presetId);
    if (postCut.previewDeviceSwitch) {
      postCut.previewDeviceSwitch.classList.toggle('hidden', !showDeviceSwitch);
      if (showDeviceSwitch) {
        if (previewState.device !== 'mobile' && previewState.device !== 'desktop') {
          previewState.device = 'mobile';
        }
        postCut.previewDeviceSwitch.querySelectorAll('.preview-device-btn').forEach(b => {
          b.classList.toggle('active', b.dataset.device === previewState.device);
        });
      }
    }

    // Sync BA buttons
    syncBaButtons();

    // Render mockup
    renderMockup();

    postCut.previewModal.classList.remove('hidden');
    postCut.previewModal.focus();

    routerPush('preview', '#preview');
    router.view = 'preview';
  }

  function closePreviewModal() {
    if (postCut.previewModal) postCut.previewModal.classList.add('hidden');
    if (postCut.previewStage) postCut.previewStage.innerHTML = '';

    // Keep the URL/history aligned with the screen: closing the freshly opened
    // overlay pops the preview entry the browser added (via push above), so the
    // next back gesture targets the underlying result screen rather than
    // reopening the preview. Guarded with router.syncing to avoid re-navigating
    // while replaying a back gesture that already landed here.
    const current = history.state;
    if (current && current.view === 'preview' && !router.syncing) {
      try {
        history.back();
      } catch (e) {
        // Sandboxed/restricted documents may not allow history traversal.
      }
    }
  }

  function buildContextBar(contexts) {
    if (!postCut.previewContextBar) return;
    postCut.previewContextBar.innerHTML = '';
    contexts.forEach(({ key, label }) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'preview-ctx-btn' + (key === previewState.context ? ' active' : '');
      btn.textContent = label;
      btn.dataset.ctx = key;
      btn.addEventListener('click', () => {
        previewState.context = key;
        postCut.previewContextBar.querySelectorAll('.preview-ctx-btn').forEach(b => {
          b.classList.toggle('active', b.dataset.ctx === key);
        });
        renderMockup();
      });
      postCut.previewContextBar.appendChild(btn);
    });
  }

  function syncBaButtons() {
    if (postCut.btnBaAfter)  postCut.btnBaAfter.classList.toggle('active',  previewState.ba === 'after');
    if (postCut.btnBaBefore) postCut.btnBaBefore.classList.toggle('active', previewState.ba === 'before');
  }

  /** Returns an <img> element showing either the cropped image or the original */
  function makePreviewImg(extraStyle) {
    const img = document.createElement('img');
    img.alt = 'Preview';
    if (extraStyle) img.style.cssText = extraStyle;
    if (previewState.ba === 'after') {
      // state.image is already the cropped image after CUT
      const c = document.createElement('canvas');
      c.width  = state.naturalWidth;
      c.height = state.naturalHeight;
      c.getContext('2d').drawImage(state.image, 0, 0);
      img.src = c.toDataURL();
    } else {
      // Before: use the original object URL
      img.src = state.objectUrl || '';
    }
    return img;
  }

  function makePlaceholderDiv(aspectRatio, extraClass) {
    const d = document.createElement('div');
    d.className = extraClass || 'yt-thumb-placeholder';
    d.style.aspectRatio = String(aspectRatio);
    return d;
  }

  // Compact inline SVG icon set for the native-app preview mockups.
  const MOCK_ICONS = {
    back15: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14L4 9l5-5"/><path d="M4 9h10.5A5.5 5.5 0 0 1 20 14.5V20"/></svg>',
    fwd15: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14l5-5-5-5"/><path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5V20"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86a1 1 0 0 0-1.5.86z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>',
    skipBack: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6z"/><path d="M20.5 6.14a1 1 0 0 0-1.52-.85l-8.5 5.85a1 1 0 0 0 0 1.72l8.5 5.85a1 1 0 0 0 1.52-.85z"/></svg>',
    skipFwd: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 6h2v12h-2z"/><path d="M3.5 6.14a1 1 0 0 1 1.52-.85l8.5 5.85a1 1 0 0 1 0 1.72l-8.5 5.85a1 1 0 0 1-1.52-.85z"/></svg>',
    shuffle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3h5v5"/><path d="M4 20L21 3"/><path d="M21 16v5h-5"/><path d="M15 15l6 6"/><path d="M4 4l5 5"/></svg>',
    repeat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M17 2l4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
    comment: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    bookmark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>',
    share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>',
    note: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
    airplay: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"/><polygon points="12 15 17 21 7 21 12 15"/></svg>',
    lyrics: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h10"/></svg>',
    volume: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>',
    volume2: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><circle cx="16" cy="12" r="2" fill="currentColor" stroke="none"/></svg>',
    view: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
    repost: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>',
    more: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>',
    verified: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1l2.6 2.2 3.4-.4 1 3.2 3 1.6-1.2 3.1 1.2 3.2-3 1.6-1 3.2-3.4-.4L12 23l-2.6-2.2-3.4.4-1-3.2-3-1.6 1.2-3.1L2 11l3-1.6 1-3.2 3.4.4z"/><path d="M10.5 12.7l2-2 3.4 3.4" fill="none" stroke="#0a0a0a" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    dots: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="6" r="1.5"/><circle cx="12" cy="6" r="1.5"/><circle cx="19" cy="6" r="1.5"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    location: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    devices: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="13" height="11" rx="2"/><rect x="15" y="8" width="7" height="12" rx="2"/><line x1="9" y1="18" x2="9" y2="20"/></svg>',
    camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><path d="M22 2l-7 20-4-9-9-4z"/></svg>',
    down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 7V6a6 6 0 0 1 12 0v1"/><rect x="3" y="7" width="18" height="14" rx="2"/></svg>',
    building: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 7h6"/><path d="M9 11h6"/><path d="M9 15h4"/></svg>',
    thumb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9A2 2 0 0 0 19.66 9H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>',
    thumbDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"/><path d="M7 2h3"/></svg>',
    remix: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 15l9-5"/><path d="M21 9l-9 5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/></svg>',
    flame: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-.9-1.8-.9-4.4-.9-4.4S5 8.5 5 12a4.5 4.5 0 0 0 3.5 4.4z"/><path d="M12 21c-3.4 0-6-2.3-6-5.5 0-1.2.3-2.3 1-3.6.5-.9 1-1.7 1.4-2.7.4-.9.5-1.9.5-2.9 0-1.6 1.9-3 3.5-4.1C11.2 4 10 6 10 8c0 1.5.6 2.7 1.6 3.8.3.3.5.3.8 0C14 10.2 15 8.5 15 6c0 3 .5 5.4 1.7 7.2 1.1 1.7 1.8 2.8 1.8 4.5C18.5 18.7 16.4 21 12 21z"/></svg>'
  };

  /** Returns the raw SVG markup for a known mockup icon (empty string otherwise). */
  function mockIcon(name) {
    return MOCK_ICONS[name] || '';
  }

  /** Tiny DOM builder for the mockups. */
  function mh(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function mappend(parent, ...children) {
    for (const c of children) if (c) parent.appendChild(c);
    return parent;
  }

  /** Icon <span> with an svg inside, sized by the mock-icon CSS. */
  function mic(cls, name) {
    const s = mh('span', cls);
    s.innerHTML = mockIcon(name);
    return s;
  }

  function renderMockup() {
    if (!postCut.previewStage) return;
    postCut.previewStage.innerHTML = '';
    const preset = state.activePreset;
    const ctx2   = previewState.context;
    const device = previewState.device;

    let node;

    if (preset === 'youtube' || preset === 'fb-event') {
      node = buildYoutubeMockup(device);
    } else if (preset === 'twitter-post') {
      node = buildXPostMockup();
    } else if (preset === 'twitter-header') {
      node = buildXProfileMockup();
    } else if (preset === 'twitter-avatar' || preset === 'tiktok-avatar' || preset === 'youtube-avatar' || preset === 'twitch-avatar') {
      node = buildAvatarMockup();
    } else if (preset === 'ig-square' || preset === 'ig-portrait' || preset === 'ig-landscape') {
      node = ctx2 === 'reels' ? buildReelsMockup() : buildIgFeedMockup();
    } else if (preset === 'ig-story') {
      node = device === 'desktop' ? buildIgStoryDesktopMockup() : buildIgStoryMockup();
    } else if (preset === 'ig-reel') {
      node = device === 'desktop' ? buildReelsDesktopMockup() : buildReelsMockup();
    } else if (preset === 'youtube-short') {
      node = device === 'desktop' ? buildShortsDesktopMockup() : buildShortsMockup();
    } else if (preset === 'tiktok') {
      node = device === 'desktop' ? buildTikTokDesktopMockup() : buildTikTokMockup();
    } else if (preset === 'snapchat') {
      node = device === 'desktop' ? buildSnapchatDesktopMockup() : buildSnapchatMockup();
    } else if (preset === 'linkedin') {
      node = buildLinkedinMockup();
    } else if (preset === 'linkedin-banner') {
      node = buildLinkedinProfileMockup();
    } else if (preset === 'linkedin-company') {
      node = buildLinkedinCompanyMockup();
    } else if (preset === 'fb-cover') {
      node = buildFbCoverMockup();
    } else if (preset === 'facebook-post' || preset === 'facebook-square') {
      node = buildFbPostMockup();
    } else if (preset === 'pinterest-pin') {
      node = buildPinterestMockup();
    } else if (preset === 'apple-cover' || preset === 'apple-playlist') {
      node = buildAppleMusicMockup();
    } else if (preset === 'apple-banner') {
      node = buildAppleArtistMockup();
    } else if (preset === 'spotify-cover') {
      node = ctx2 === 'card' ? buildSpotifyCardMockup() : buildSpotifyMockup();
    } else if (preset === 'spotify-canvas') {
      node = buildSpotifyCanvasMockup();
    } else if (preset === 'spotify-header') {
      node = buildSpotifyArtistMockup();
    } else if (preset === 'twitch-banner' || preset === 'youtube-banner' || preset === 'discord-banner' || preset === 'soundcloud-banner') {
      node = buildTwitchMockup();
    } else {
      node = buildPlainMockup();
    }

    postCut.previewStage.appendChild(node);
  }

  // ---- Mockup builders ----

  function chromebar() {
    const bar = document.createElement('div');
    bar.className = 'mockup-chrome-bar';
    for (let i = 0; i < 3; i++) {
      const d = document.createElement('div');
      d.className = 'mockup-dot';
      bar.appendChild(d);
    }
    const url = document.createElement('div');
    url.className = 'mockup-url-bar';
    bar.appendChild(url);
    return bar;
  }

  function buildYoutubeMockup(device) {
    const shell = document.createElement('div');
    shell.className = 'mockup-shell yt-mockup';
    shell.appendChild(chromebar());
    const grid = document.createElement('div');
    grid.className = `yt-grid ${device}`;
    // Mobile: show 4 cards vertically stacked; Desktop: 3 columns; TV: 4 columns
    const cardCount = device === 'mobile' ? 4 : (device === 'tv' ? 4 : 3);
    for (let i = 0; i < cardCount; i++) {
      const card = document.createElement('div');
      card.className = 'yt-card';
      const thumb = document.createElement('div');
      thumb.className = 'yt-thumb';
      if (i === 0) {
        thumb.appendChild(makePreviewImg('width:100%;height:100%;object-fit:cover;display:block;'));
      } else {
        thumb.appendChild(makePlaceholderDiv('16/9', 'yt-thumb-placeholder'));
      }
      const meta = document.createElement('div');
      meta.className = 'yt-card-meta';
      const av = document.createElement('div'); av.className = 'yt-avatar';
      const lines = document.createElement('div'); lines.className = 'yt-text-lines';
      const l1 = document.createElement('div'); l1.className = 'yt-line title';
      const l2 = document.createElement('div'); l2.className = 'yt-line sub';
      lines.appendChild(l1); lines.appendChild(l2);
      meta.appendChild(av); meta.appendChild(lines);
      card.appendChild(thumb); card.appendChild(meta);
      grid.appendChild(card);
    }
    shell.appendChild(grid);
    return shell;
  }

  function buildIgFeedMockup() {
    const shell = document.createElement('div');
    shell.className = 'mockup-shell ig-mockup';
    const post = document.createElement('div');
    post.className = 'ig-feed-post';
    // header
    const hdr = document.createElement('div'); hdr.className = 'ig-post-header';
    const av = document.createElement('div'); av.className = 'ig-avatar';
    const ub = document.createElement('div'); ub.className = 'ig-username-block';
    const l1 = document.createElement('div'); l1.className = 'ig-line name';
    const l2 = document.createElement('div'); l2.className = 'ig-line loc';
    ub.appendChild(l1); ub.appendChild(l2);
    hdr.appendChild(av); hdr.appendChild(ub);
    // image
    const wrap = document.createElement('div'); wrap.className = 'ig-image-wrap';
    wrap.appendChild(makePreviewImg());
    // actions
    const acts = document.createElement('div'); acts.className = 'ig-actions';
    for (let i = 0; i < 3; i++) {
      const d = document.createElement('div'); d.className = 'ig-action-dot'; acts.appendChild(d);
    }
    // caption
    const cap = document.createElement('div'); cap.className = 'ig-caption-lines';
    for (const w of ['90%','70%','50%']) {
      const d = document.createElement('div');
      d.className = 'ig-line'; d.style.width = w; cap.appendChild(d);
    }
    post.appendChild(hdr); post.appendChild(wrap); post.appendChild(acts); post.appendChild(cap);
    shell.appendChild(post);
    return shell;
  }

  /** Wraps a 9:16 screen element inside the high-fidelity .phone-frame bezel
   *  (dynamic island + dark backdrop shadow). Every full-screen vertical
   *  preview returns this so it reads as a real handset, never a floating
   *  mini-card. */
  function wrapPhoneFrame(screen, platformCls) {
    const frame = mh('div', 'phone-frame' + (platformCls ? ' ' + platformCls : ''));
    frame.appendChild(screen);
    return frame;
  }

  /** Native status bar (time left, signal/battery right) that clears the bezel
   *  notch and keeps the top-chrome from clipping on the tall 9:19.5 screen. */
  function sfStatusBar() {
    const bar = mh('div', 'sf-statusbar');
    bar.appendChild(mh('span', 'sb-time', '9:41'));
    const icons = mh('span', 'sb-icons');
    icons.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="16" height="10" rx="2"/><line x1="22" y1="11" x2="22" y2="13"/><path d="M6 10v4"/><path d="M9 10v4"/></svg>';
    bar.appendChild(icons);
    return bar;
  }

  /** Generic TikTok "For You" phone (right rail + bottom overlay). */
  function buildTikTokMockup() {
    const screen = mh('div', 'sf-screen');
    screen.appendChild(makePreviewImg('width:100%;height:100%;object-fit:cover;display:block;'));
    screen.appendChild(sfStatusBar());
    screen.appendChild(mh('div', 'sf-scrim'));

    const rail = mh('div', 'sf-right-rail');
    const action = (iconName, count) => {
      const a = mh('div', 'sf-action');
      a.appendChild(mic('sf-action-icon', iconName));
      a.appendChild(mh('span', 'sf-action-count', count));
      return a;
    };
    rail.appendChild(action('heart', '12.4K'));
    rail.appendChild(action('comment', '1,205'));
    rail.appendChild(action('bookmark', '9,872'));
    const share = mh('div', 'sf-action sf-action-share');
    share.appendChild(mic('sf-action-icon', 'share'));
    share.appendChild(mh('span', 'sf-action-count', 'Share'));
    rail.appendChild(share);
    const disc = mh('div', 'sf-disc');
    disc.appendChild(mic('sf-disc-img', ''));
    rail.appendChild(disc);

    const bottom = mh('div', 'sf-bottom');
    bottom.appendChild(mh('span', 'sf-username', '@realresizer'));
    bottom.appendChild(mh('p', 'sf-caption', 'Fresh crop preset, perfect every time.'));
    bottom.appendChild(mh('span', 'sf-hashtag', '#dailydesign #crops'));
    const audio = mh('div', 'sf-audio');
    audio.appendChild(mic('sf-audio-note', 'note'));
    audio.appendChild(mh('span', 'sf-audio-text', 'Original sound - realresizer'));
    bottom.appendChild(audio);

    screen.appendChild(rail);
    screen.appendChild(bottom);
    return wrapPhoneFrame(screen, 'pf-tiktok');
  }

  /** YouTube Shorts phone: left channel avatar/@user/Subscribe + title + tags,
   *  right rail (Like, Dislike, Comments, Share, Remix, spinning audio). */
  function buildShortsMockup() {
    const screen = mh('div', 'sf-screen');
    screen.appendChild(makePreviewImg('width:100%;height:100%;object-fit:cover;display:block;'));
    screen.appendChild(sfStatusBar());

    const slot = mh('div', 'st-slot');

    const left = mh('div', 'st-left');
    const channel = mh('div', 'st-channel');
    channel.appendChild(mh('div', 'st-avatar', 'R'));
    const userCol = mh('div', 'st-user-col');
    userCol.appendChild(mh('div', 'st-user', '@realresizer'));
    userCol.appendChild(mh('span', 'st-subscribe', 'Subscribe'));
    channel.appendChild(userCol);
    left.appendChild(channel);
    left.appendChild(mh('div', 'st-title', '10 seconds ago'));
    left.appendChild(mh('div', 'st-tags', '#shorts #crops #design'));
    slot.appendChild(left);

    const rail = mh('div', 'st-rail');
    const stBtn = (iconName, count) => {
      const b = mh('div', 'st-btn');
      b.appendChild(mic('st-btn-icon', iconName));
      b.appendChild(mh('span', 'st-btn-count', count));
      return b;
    };
    rail.appendChild(stBtn('thumb', '12.4K'));
    rail.appendChild(stBtn('thumbDown', 'Dislike'));
    rail.appendChild(stBtn('comment', '1,205'));
    rail.appendChild(stBtn('share', 'Share'));
    rail.appendChild(stBtn('remix', 'Remix'));
    const disc = mh('div', 'st-disc');
    disc.appendChild(mh('span', 'st-disc-img', ''));
    rail.appendChild(disc);
    slot.appendChild(rail);

    screen.appendChild(slot);
    return wrapPhoneFrame(screen, 'pf-shorts');
  }

  /** Instagram Reels phone: bottom audio marquee + @username + Follow +
   *  caption, right column (Heart, Comment, Send, ⋯, audio-album icon). */
  function buildReelsMockup() {
    const screen = mh('div', 'sf-screen');
    screen.appendChild(makePreviewImg('width:100%;height:100%;object-fit:cover;display:block;'));
    screen.appendChild(sfStatusBar());

    const right = mh('div', 'rl-right');
    const rlBtn = (iconName, count) => {
      const b = mh('div', 'rl-btn');
      b.appendChild(mic('rl-btn-icon', iconName));
      b.appendChild(mh('span', 'rl-btn-count', count));
      return b;
    };
    right.appendChild(rlBtn('heart', '12.4K'));
    right.appendChild(rlBtn('comment', '1,205'));
    right.appendChild(rlBtn('send', 'Share'));
    right.appendChild(rlBtn('more', ''));
    const album = mh('div', 'rl-audio-album');
    album.appendChild(mic('rl-album-icon', 'note'));
    right.appendChild(album);
    screen.appendChild(right);

    const bottom = mh('div', 'rl-bottom');
    const marquee = mh('div', 'rl-marquee');
    const note = mic('rl-audio-note', 'note');
    const track = mh('div', 'rl-marquee-track');
    track.appendChild(mh('span', 'rl-audio-text', 'Original audio — realresizer  ✦  Reels tones'));
    track.appendChild(mh('span', 'rl-audio-text', 'Original audio — realresizer  ✦  Reels tones'));
    marquee.appendChild(note);
    marquee.appendChild(track);
    bottom.appendChild(marquee);

    const userrow = mh('div', 'rl-userrow');
    userrow.appendChild(mh('div', 'rl-avatar', ''));
    userrow.appendChild(mh('span', 'rl-username', 'realresizer'));
    userrow.appendChild(mh('span', 'rl-follow', 'Follow'));
    bottom.appendChild(userrow);
    bottom.appendChild(mh('p', 'rl-caption', 'Fresh crop presets, perfect every time.'));
    screen.appendChild(bottom);

    return wrapPhoneFrame(screen, 'pf-reels');
  }

  /** Instagram Story phone: progress bar + brand + full-screen content + bottom send bar. */
  function buildIgStoryMockup() {
    const screen = mh('div', 'sf-screen');
    screen.appendChild(makePreviewImg('width:100%;height:100%;object-fit:cover;display:block;'));
    screen.appendChild(sfStatusBar());

    // Progress bar at top (story segments)
    const progress = mh('div', 'ig-story-progress');
    for (let i = 0; i < 4; i++) {
      const seg = mh('div', 'ig-story-seg' + (i === 0 ? ' ig-story-seg-active' : ''));
      seg.appendChild(mh('div', 'ig-story-seg-fill'));
      progress.appendChild(seg);
    }
    screen.appendChild(progress);

    // Brand/logo at top
    const brand = mh('div', 'ig-story-brand');
    brand.appendChild(mh('span', 'ig-story-brand-name', 'realresizer'));
    screen.appendChild(brand);

    // Bottom: username + send message bar
    const bottom = mh('div', 'ig-story-bottom');
    const userrow = mh('div', 'ig-story-userrow');
    userrow.appendChild(mh('div', 'ig-story-avatar', ''));
    userrow.appendChild(mh('span', 'ig-story-username', 'realresizer'));
    bottom.appendChild(userrow);

    const sendBar = mh('div', 'ig-story-sendbar');
    sendBar.appendChild(mh('span', 'ig-story-sendtext', 'Send message'));
    sendBar.appendChild(mic('ig-story-sendicon', 'send'));
    bottom.appendChild(sendBar);

    screen.appendChild(bottom);

    return wrapPhoneFrame(screen, 'pf-ig-story');
  }

/** Snapchat Snap Ad phone: sponsored story with brand, creative, and swipe-up CTA.
 *  This is a Snap Ad (paid placement), NOT a user Story. */
  function buildSnapchatMockup() {
    const screen = mh('div', 'sf-screen');
    screen.appendChild(makePreviewImg('width:100%;height:100%;object-fit:cover;display:block;'));
    screen.appendChild(sfStatusBar());

    // Sponsored label at top
    const sponsored = mh('div', 'sc-sponsored');
    sponsored.appendChild(mh('span', 'sc-sponsored-label', 'Sponsored'));
    screen.appendChild(sponsored);

    // Brand header
    const brandHeader = mh('div', 'sc-brand-header');
    brandHeader.appendChild(mh('div', 'sc-brand-avatar', ''));
    const brandInfo = mh('div', 'sc-brand-info');
    brandInfo.appendChild(mh('span', 'sc-brand-name', 'RealResizer'));
    brandInfo.appendChild(mh('span', 'sc-brand-sub', 'Sponsored'));
    brandHeader.appendChild(brandInfo);
    screen.appendChild(brandHeader);

    // The ad creative fills the screen (already added as background image)

    // Right rail: minimal for ads (just more options)
    const right = mh('div', 'sc-right');
    const scBtn = (iconName, label) => {
      const b = mh('div', 'sc-btn');
      b.appendChild(mic('sc-btn-icon', iconName));
      b.appendChild(mh('span', 'sc-btn-label', label));
      return b;
    };
    right.appendChild(scBtn('more', '·'));
    screen.appendChild(right);

    // Bottom CTA: Swipe up action
    const cta = mh('div', 'sc-cta');
    cta.appendChild(mh('span', 'sc-swipeup', 'Swipe up'));
    const actionBtn = mh('button', 'sc-action-btn', 'Install');
    actionBtn.type = 'button';
    cta.appendChild(actionBtn);
    screen.appendChild(cta);

    return wrapPhoneFrame(screen, 'pf-snap');
  }

  /* =====================================================================
     Desktop view mockups for the vertical full-screen presets — the
     platform's actual web interface rendered in a browser shell.
     ===================================================================== */

  /** YouTube Shorts desktop web: top nav, left video player, right related. */
  function buildShortsDesktopMockup() {
    const shell = mh('div', 'mockup-shell web-shell shorts-desktop');
    shell.appendChild(chromebar());
    const nav = mh('div', 'wd-nav');
    const logo = mh('div', 'wd-nav-logo yt');
    logo.innerHTML = mockIcon('play');
    logo.appendChild(mh('span', 'wd-nav-logo-txt', 'YouTube'));
    const search = mh('div', 'wd-search');
    search.appendChild(mh('span', 'wd-search-ico'));
    nav.appendChild(logo); nav.appendChild(search); nav.appendChild(mockAvatar('wd-nav-av', ''));
    shell.appendChild(nav);

    const body = mh('div', 'wd-body');
    const main = mh('div', 'wd-main');
    const player = mh('div', 'sd-player');
    player.appendChild(makePreviewImg('width:100%;height:100%;object-fit:cover;display:block;'));
    const meta = mh('div', 'sd-meta');
    const title = mh('div', 'sd-title', 'Short crop ideas for every platform');
    const row = mh('div', 'sd-chrow');
    row.appendChild(mockAvatar('wd-chan-av', 'R'));
    const info = mh('div', 'sd-chinfo');
    info.appendChild(mh('span', 'sd-chname', 'RealResizer'));
    info.appendChild(mh('span', 'sd-chsubs', '128K subscribers'));
    row.appendChild(info);
    row.appendChild(mh('span', 'sd-subscribe', 'Subscribe'));
    meta.appendChild(title); meta.appendChild(row);
    const likes = mh('div', 'sd-likes');
    const likeBtn = mh('div', 'sd-like');
    likeBtn.innerHTML = mockIcon('thumb');
    likeBtn.appendChild(mh('span', '', '12K'));
    const dislikeBtn = mh('div', 'sd-like');
    dislikeBtn.innerHTML = mockIcon('thumbDown');
    dislikeBtn.appendChild(mh('span', '', 'Dislike'));
    likes.appendChild(likeBtn); likes.appendChild(dislikeBtn);
    meta.appendChild(likes);
    main.appendChild(player); main.appendChild(meta);
    body.appendChild(main);

    const side = mh('div', 'wd-side');
    side.appendChild(mh('div', 'wd-side-head', 'Related Shorts'));
    for (let i = 0; i < 4; i++) {
      const rel = mh('div', 'wd-related');
      const th = mh('div', 'wd-related-th', '');
      if (i === 0) th.appendChild(makePreviewImg('width:100%;height:100%;object-fit:cover;display:block;'));
      const tx = mh('div', 'wd-related-tx');
      tx.appendChild(mh('div', 'wd-rel-title' + (i === 0 ? ' active' : ''), i === 0 ? 'Short crop ideas for every platform' : 'Crop like a pro in 60 seconds'));
      tx.appendChild(mh('div', 'wd-rel-sub', 'RealResizer · ' + (2 + i * 3) + 'K views'));
      rel.appendChild(th); rel.appendChild(tx);
      side.appendChild(rel);
    }
    body.appendChild(side);
    shell.appendChild(body);
    return shell;
  }

  /** Instagram Web Reels player mid-feed + right comments panel. */
  function buildReelsDesktopMockup() {
    const shell = mh('div', 'mockup-shell web-shell reels-desktop');
    shell.appendChild(chromebar());
    const nav = mh('div', 'wd-nav ig');
    const logo = mh('div', 'wd-nav-logo');
    logo.innerHTML = mockIcon('camera');
    logo.appendChild(mh('span', 'wd-nav-logo-txt ig', 'Instagram'));
    const search = mh('div', 'wd-search');
    search.appendChild(mh('span', 'wd-search-ico'));
    nav.appendChild(logo); nav.appendChild(search); nav.appendChild(mockAvatar('wd-nav-av', ''));
    shell.appendChild(nav);

    const body = mh('div', 'wd-body reels');
    const main = mh('div', 'wd-main reels');
    const reel = mh('div', 'rd-reelplayer');
    reel.appendChild(makePreviewImg('width:100%;height:100%;object-fit:cover;display:block;'));
    const rail = mh('div', 'rd-rail');
    const rdBtn = (iconName, label) => {
      const b = mh('div', 'rd-btn');
      b.appendChild(mic('rd-btn-icon', iconName));
      b.appendChild(mh('span', '', label));
      return b;
    };
    rail.appendChild(rdBtn('heart', '12.4K'));
    rail.appendChild(rdBtn('comment', '1,205'));
    rail.appendChild(rdBtn('send', 'Share'));
    rail.appendChild(rdBtn('more', ''));
    reel.appendChild(rail);
    const rFoot = mh('div', 'rd-reelfoot');
    rFoot.appendChild(mh('span', 'rd-ruser', 'realresizer'));
    rFoot.appendChild(mh('span', 'rd-rcap', 'Fresh crop presets, perfect every time.'));
    reel.appendChild(rFoot);
    main.appendChild(reel);
    body.appendChild(main);

    const panel = mh('div', 'rd-comments');
    const phead = mh('div', 'rd-comments-head');
    phead.appendChild(mockAvatar('rd-cav', ''));
    const pmeta = mh('div', 'rd-cmeta');
    pmeta.appendChild(mh('span', 'rd-cname', 'realresizer'));
    pmeta.appendChild(mh('span', 'rd-csub', 'Original audio — Reels tones'));
    phead.appendChild(pmeta);
    const list = mh('div', 'rd-clist');
    ['This is exactly what I needed!', 'The 9:16 crop looks perfect', 'How do I get these presets?'].forEach((c, i) => {
      const cr = mh('div', 'rd-cr');
      cr.appendChild(mockAvatar('rd-cav sm', ''));
      const ct = mh('div', 'rd-ctext', c);
      cr.appendChild(ct);
      list.appendChild(cr);
    });
    const input = mh('div', 'rd-input', 'Add a comment...');
    panel.appendChild(phead); panel.appendChild(list); panel.appendChild(input);
    body.appendChild(panel);
    shell.appendChild(body);
    return shell;
  }

  /** Instagram Web Story viewer — top progress bar, centered story content, bottom send bar. */
  function buildIgStoryDesktopMockup() {
    const shell = mh('div', 'mockup-shell web-shell ig-story-desktop');
    shell.appendChild(chromebar());
    const nav = mh('div', 'wd-nav ig');
    const logo = mh('div', 'wd-nav-logo');
    logo.innerHTML = mockIcon('camera');
    logo.appendChild(mh('span', 'wd-nav-logo-txt ig', 'Instagram'));
    const search = mh('div', 'wd-search');
    search.appendChild(mh('span', 'wd-search-ico'));
    nav.appendChild(logo); nav.appendChild(search); nav.appendChild(mockAvatar('wd-nav-av', ''));
    shell.appendChild(nav);

    const body = mh('div', 'wd-body ig-story');
    const main = mh('div', 'wd-main ig-story');

    // Progress bar
    const progress = mh('div', 'ig-story-progress');
    for (let i = 0; i < 4; i++) {
      const seg = mh('div', 'ig-story-seg' + (i === 0 ? ' ig-story-seg-active' : ''));
      seg.appendChild(mh('div', 'ig-story-seg-fill'));
      progress.appendChild(seg);
    }
    main.appendChild(progress);

    // Story content
    const story = mh('div', 'ig-story-player');
    story.appendChild(makePreviewImg('width:100%;height:100%;object-fit:cover;display:block;'));
    main.appendChild(story);

    // Brand header
    const brandHeader = mh('div', 'ig-story-brand-header');
    brandHeader.appendChild(mh('div', 'ig-story-brand-avatar', ''));
    const brandInfo = mh('div', 'ig-story-brand-info');
    brandInfo.appendChild(mh('span', 'ig-story-brand-name', 'realresizer'));
    brandInfo.appendChild(mh('span', 'ig-story-brand-sub', 'Story'));
    brandHeader.appendChild(brandInfo);
    main.appendChild(brandHeader);

    // Bottom send bar
    const sendBar = mh('div', 'ig-story-sendbar');
    sendBar.appendChild(mh('span', 'ig-story-sendtext', 'Send message'));
    sendBar.appendChild(mic('ig-story-sendicon', 'send'));
    main.appendChild(sendBar);

    body.appendChild(main);
    shell.appendChild(body);
    return shell;
  }

  /** TikTok Web video modal: centered player + right rail, info, comments. */
  function buildTikTokDesktopMockup() {
    const shell = mh('div', 'mockup-shell web-shell tiktok-desktop');
    shell.appendChild(chromebar());
    const nav = mh('div', 'wd-nav tt');
    const logo = mh('div', 'wd-nav-logo');
    logo.textContent = 'TikTok';
    const search = mh('div', 'wd-search');
    search.appendChild(mh('span', 'wd-search-ico'));
    nav.appendChild(logo); nav.appendChild(search); nav.appendChild(mockAvatar('wd-nav-av', ''));
    shell.appendChild(nav);

    const body = mh('div', 'wd-body tiktok');
    const player = mh('div', 'td-video');
    player.appendChild(makePreviewImg('width:100%;height:100%;object-fit:cover;display:block;'));
    const vrail = mh('div', 'td-vrail');
    const tdBtn = (iconName, label) => {
      const b = mh('div', 'td-btn');
      b.appendChild(mic('td-btn-icon', iconName));
      b.appendChild(mh('span', '', label));
      return b;
    };
    vrail.appendChild(tdBtn('heart', '12.4K'));
    vrail.appendChild(tdBtn('comment', '1,205'));
    vrail.appendChild(tdBtn('bookmark', 'Share'));
    vrail.appendChild(tdBtn('note', ''));
    player.appendChild(vrail);
    const vcap = mh('div', 'td-vcap');
    vcap.appendChild(mh('span', 'td-vuser', '@realresizer'));
    vcap.appendChild(mh('span', 'td-vtext', 'Fresh crop preset, perfect every time.'));
    vcap.appendChild(mh('span', 'td-vtags', '#dailydesign #crops'));
    player.appendChild(vcap);
    body.appendChild(player);

    const side = mh('div', 'td-info');
    const infoHead = mh('div', 'td-info-head');
    infoHead.appendChild(mockAvatar('td-av', ''));
    const bio = mh('div', 'td-bio');
    bio.appendChild(mh('span', 'td-bio-name', 'realresizer'));
    bio.appendChild(mh('span', 'td-bio-sub', 'Design tips daily'));
    infoHead.appendChild(bio);
    const commentsHead = mh('div', 'td-info-caption', 'Comments (1,205)');
    const commentList = mh('div', 'td-cclist');
    ['So good! 🔥', 'Perfect for reels', 'Saved this for later'].forEach((t) => {
      const cr = mh('div', 'td-ccr');
      cr.appendChild(mockAvatar('td-cav', ''));
      const tx = mh('div', 'td-cctext', t);
      cr.appendChild(tx);
      commentList.appendChild(cr);
    });
    side.appendChild(infoHead); side.appendChild(commentsHead); side.appendChild(commentList);
    body.appendChild(side);
    shell.appendChild(body);
    return shell;
  }

  /** Snap Ad desktop view — the Snap Ad creative presented in a web preview
   *  pane (brand, placement, CTA and the mobile-ready creative) so the tallest
   *  mobile-only canvas still reads as the platform's web interface. */
  function buildSnapchatDesktopMockup() {
    const shell = mh('div', 'mockup-shell web-shell snap-desktop');
    shell.appendChild(chromebar());
    const head = mh('div', 'scd-head');
    head.appendChild(mh('span', 'scd-brand', 'Snapchat Ads'));
    head.appendChild(mh('span', 'scd-status', 'Sponsored Story Preview'));
    shell.appendChild(head);

    const body = mh('div', 'scd-body');
    const art = mh('div', 'scd-art');
    art.appendChild(makePreviewImg('width:100%;height:100%;object-fit:cover;display:block;'));
    const artAuthor = mh('div', 'scd-art-author');
    artAuthor.appendChild(mockAvatar('scd-art-av', ''));
    artAuthor.appendChild(mh('span', 'scd-art-name', 'realresizer'));
    art.appendChild(artAuthor);
    body.appendChild(art);

    const info = mh('div', 'scd-info');
    info.appendChild(mh('div', 'scd-meta', 'Sponsored'));
    info.appendChild(mh('div', 'scd-title', 'Crop once, publish everywhere.'));
    info.appendChild(mh('div', 'scd-desc', 'Snap a format-locked crop with the RealResizer preset library and drop it straight into your next story.'));
    const cta = mh('button', 'scd-cta', 'Learn More');
    cta.type = 'button';
    info.appendChild(cta);
    const spec = mh('div', 'scd-spec');
    spec.appendChild(mh('div', 'scd-spec-row', '<span>Format</span><b>Story (9:16 · 1080×1920)</b>'));
    spec.appendChild(mh('div', 'scd-spec-row', '<span>Placement</span><b>Snap Ad</b>'));
    spec.appendChild(mh('div', 'scd-spec-row', '<span>Creative</span><b>Image Ad</b>'));
    info.appendChild(spec);
    body.appendChild(info);
    shell.appendChild(body);
    return shell;
  }

  function buildLinkedinMockup() {
    const shell = document.createElement('div');
    shell.className = 'mockup-shell li-mockup';
    shell.appendChild(chromebar());
    const card = document.createElement('div'); card.className = 'li-feed-card';
    // Header: avatar + identity + connection level
    const hdr = document.createElement('div'); hdr.className = 'li-card-header';
    const av = document.createElement('div'); av.className = 'li-avatar';
    const tb = document.createElement('div'); tb.className = 'li-text-block';
    const l1 = document.createElement('div'); l1.className = 'li-line name';
    const l2 = document.createElement('div'); l2.className = 'li-line sub';
    tb.appendChild(l1); tb.appendChild(l2);
    const lvl = mh('span', 'li-conn', '1st');
    const dots = mic('li-header-more', 'more');
    hdr.appendChild(av); hdr.appendChild(tb); hdr.appendChild(lvl); hdr.appendChild(dots);
    // Post text
    const body = mh('div', 'li-post-body', 'Just shipped a fresh set of platform crop presets. The new covers lock to the exact pixel ratio - check it out!');
    // Image
    const wrap = document.createElement('div'); wrap.className = 'li-image-wrap';
    wrap.appendChild(makePreviewImg());
    // Reactions + comments summary
    const react = mh('div', 'li-reactions');
    react.appendChild(mh('span', 'li-react-summary', 'Like · 128 · Comment · 12'));
    react.appendChild(mh('span', 'li-react-time', '2d'));
    // Action row
    const footer = mh('div', 'li-actionrow');
    const aLike = mh('div', 'li-act'); aLike.innerHTML = mockIcon('heart'); aLike.appendChild(mh('span', 'li-act-label', 'Like'));
    const aCom = mh('div', 'li-act'); aCom.innerHTML = mockIcon('comment'); aCom.appendChild(mh('span', 'li-act-label', 'Comment'));
    const aRep = mh('div', 'li-act'); aRep.innerHTML = mockIcon('repost'); aRep.appendChild(mh('span', 'li-act-label', 'Repost'));
    const aSend = mh('div', 'li-act'); aSend.innerHTML = mockIcon('send'); aSend.appendChild(mh('span', 'li-act-label', 'Send'));
    footer.appendChild(aLike); footer.appendChild(aCom); footer.appendChild(aRep); footer.appendChild(aSend);
    card.appendChild(hdr); card.appendChild(body); card.appendChild(wrap); card.appendChild(react); card.appendChild(footer);
    shell.appendChild(card);
    return shell;
  }

  function buildFbCoverMockup() {
    const shell = document.createElement('div');
    shell.className = 'mockup-shell fb-mockup';
    shell.appendChild(chromebar());
    const coverWrap = document.createElement('div'); coverWrap.className = 'fb-cover-wrap';
    coverWrap.appendChild(makePreviewImg());
    const row = document.createElement('div'); row.className = 'fb-profile-row';
    const av = document.createElement('div'); av.className = 'fb-avatar';
    const nb = document.createElement('div'); nb.className = 'fb-name-block';
    const l1 = document.createElement('div'); l1.className = 'fb-line name';
    const l2 = document.createElement('div'); l2.className = 'fb-line sub';
    nb.appendChild(l1); nb.appendChild(l2);
    row.appendChild(av); row.appendChild(nb);
    shell.appendChild(coverWrap); shell.appendChild(row);
    return shell;
  }

  function buildFbPostMockup() {
    const shell = mh('div', 'mockup-shell fb-mockup fb-post-mock');
    shell.appendChild(chromebar());
    const post = mh('article', 'fb-post');
    const head = mh('div', 'fb-post-head');
    head.appendChild(mockAvatar('fb-avatar', ''));
    const nb = mh('div', 'fb-name-block');
    nb.appendChild(mh('span', 'fb-post-name', 'RealResizer'));
    nb.appendChild(mh('span', 'fb-post-sub', 'Just now · 🌍'));
    head.appendChild(nb);
    head.appendChild(mic('fb-post-more', 'dots'));
    const imgWrap = mh('div', 'fb-post-img');
    imgWrap.appendChild(makePreviewImg());
    const actions = mh('div', 'fb-post-actions');
    actions.appendChild(mic('fb-post-act', 'heart'));
    actions.appendChild(mic('fb-post-act', 'comment'));
    actions.appendChild(mic('fb-post-act', 'share'));
    const meta = mh('div', 'fb-post-meta');
    meta.appendChild(mh('span', 'fb-post-caption', 'Crisp crops, ready for every platform.'));
    post.appendChild(head); post.appendChild(imgWrap); post.appendChild(actions); post.appendChild(meta);
    shell.appendChild(post);
    return shell;
  }

  function buildPinterestMockup() {
    const shell = document.createElement('div');
    shell.className = 'mockup-shell pin-mockup';
    shell.appendChild(chromebar());
    const card = mh('div', 'pin-detail');
    // Media with floating Save button
    const media = mh('div', 'pin-detail-media');
    media.appendChild(makePreviewImg());
    const save = mh('button', 'pin-save-btn', 'Save');
    save.type = 'button';
    save.appendChild(mic('pin-save-arrow', 'down'));
    media.appendChild(save);
    // Spacer action row (share / more)
    const spacer = mh('div', 'pin-detail-spacer');
    const sShare = mic('pin-spacer-icon', 'share');
    const sMore = mic('pin-spacer-icon', 'more');
    spacer.appendChild(mh('div', 'pin-spacer-place', ''));
    spacer.appendChild(sShare); spacer.appendChild(sMore);
    // Title + meta
    const title = mh('h3', 'pin-detail-title', '10 Crisp Crop Ideas You Will Love');
    const meta = mh('div', 'pin-detail-meta');
    const authorAv = mh('div', 'pin-author-avatar', '');
    const authorTxt = mh('div', 'pin-author-text');
    authorTxt.appendChild(mh('span', 'pin-author-name', 'prathamsehgal'));
    authorTxt.appendChild(mh('span', 'pin-author-sub', '28 followers'));
    meta.appendChild(authorAv); meta.appendChild(authorTxt);
    const board = mh('div', 'pin-board-tag', 'Saved to Design board');
    // Comment section
    const comments = mh('div', 'pin-comments');
    const commentsHead = mh('div', 'pin-comments-head', '3 comments');
    const commentRow = mh('div', 'pin-comment-row');
    const cAv = mh('div', 'pin-comment-avatar', '');
    const cField = mh('div', 'pin-comment-field', 'Add a comment...');
    commentRow.appendChild(cAv); commentRow.appendChild(cField);
    comments.appendChild(commentsHead); comments.appendChild(commentRow);
    card.appendChild(media); card.appendChild(spacer); card.appendChild(title); card.appendChild(meta); card.appendChild(board); card.appendChild(comments);
    shell.appendChild(card);
    return shell;
  }

  function buildTwitchMockup() {
    const shell = document.createElement('div');
    shell.className = 'mockup-shell twitch-mockup';
    shell.appendChild(chromebar());
    const bw = document.createElement('div'); bw.className = 'twitch-banner-wrap';
    bw.appendChild(makePreviewImg());
    const row = document.createElement('div'); row.className = 'twitch-channel-row';
    const av = document.createElement('div'); av.className = 'twitch-avatar';
    const tb = document.createElement('div'); tb.className = 'twitch-text';
    const l1 = document.createElement('div'); l1.className = 'twitch-line name';
    const l2 = document.createElement('div'); l2.className = 'twitch-line sub';
    tb.appendChild(l1); tb.appendChild(l2);
    row.appendChild(av); row.appendChild(tb);
    shell.appendChild(bw); shell.appendChild(row);
    return shell;
  }

  function buildPlainMockup() {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'max-width:min(700px,90vw);border-radius:8px;overflow:hidden;box-shadow:0 16px 48px rgba(0,0,0,.6);';
    wrap.appendChild(makePreviewImg('width:100%;display:block;'));
    return wrap;
  }

  // ---------------------------------------------------------------------------
  // Native-app preview mockups:
  //   X / Twitter (post + profile header), avatar cards, Apple Music (Now
  //   Playing + artist), Spotify (Now Playing / card / canvas / artist header),
  //   LinkedIn (profile banner + company banner), TikTok/Shorts/Reels.
  // ---------------------------------------------------------------------------

  function mockAvatar(cls, label) {
    const av = mh('div', cls);
    if (label) av.textContent = label;
    return av;
  }

  function buildXPostMockup() {
    const shell = mh('div', 'mockup-shell x-mockup');
    const topbar = mh('div', 'x-topbar');
    topbar.appendChild(mh('span', 'x-tab active', 'For you'));
    topbar.appendChild(mh('span', 'x-tab', 'Following'));
    const post = mh('article', 'x-post');
    const head = mh('div', 'x-post-head');
    head.appendChild(mockAvatar('x-avatar', ''));
    const nameB = mh('div', 'x-name-block');
    const nameRow = mh('div', 'x-name-row');
    nameRow.appendChild(mh('span', 'x-name', 'RealResizer'));
    nameRow.appendChild(mic('x-verified', 'verified'));
    nameRow.appendChild(mh('span', 'x-verified-note', ''));
    nameB.appendChild(nameRow);
    nameB.appendChild(mh('span', 'x-handle', '@realresizer · 3h'));
    head.appendChild(nameB);
    head.appendChild(mic('x-more', 'more'));
    const body = mh('p', 'x-post-body', 'Check out this design! Crop it, scale it, ship it everywhere.');
    const media = mh('div', 'x-media');
    media.appendChild(makePreviewImg());
    const actions = mh('div', 'x-actions');
    const act = (iconName, count) => {
      const a = mh('div', 'x-act');
      a.appendChild(mic('x-act-icon', iconName));
      a.appendChild(mh('span', 'x-act-count', count));
      return a;
    };
    actions.appendChild(act('view', '1,241'));
    actions.appendChild(act('repost', '482'));
    actions.appendChild(act('heart', '3.4K'));
    actions.appendChild(act('bookmark', '1,109'));
    actions.appendChild(mic('x-act-icon', 'share'));
    post.appendChild(head); post.appendChild(body); post.appendChild(media); post.appendChild(actions);
    shell.appendChild(topbar); shell.appendChild(post);
    return shell;
  }

  function buildXProfileMockup() {
    const shell = mh('div', 'mockup-shell x-profile');
    const banner = mh('div', 'x-profile-banner');
    banner.appendChild(makePreviewImg('width:100%;height:100%;object-fit:cover;display:block;'));
    const card = mh('div', 'x-profile-card');
    const avatarRow = mh('div', 'x-profile-avatar-row');
    avatarRow.appendChild(mockAvatar('x-profile-avatar', ''));
    const editBtn = mh('div', 'x-edit-btn', 'Edit profile');
    avatarRow.appendChild(editBtn);
    card.appendChild(avatarRow);
    const nameRow = mh('div', 'x-profile-name-row');
    nameRow.appendChild(mh('span', 'x-profile-name', 'RealResizer'));
    nameRow.appendChild(mic('x-verified', 'verified'));
    card.appendChild(nameRow);
    card.appendChild(mh('span', 'x-profile-handle', '@realresizer'));
    card.appendChild(mh('p', 'x-profile-bio', 'Crisp crop tools for the browser. No uploads, all local.'));
    card.appendChild(mh('p', 'x-profile-links', 'realresizer.com'));
    const stats = mh('div', 'x-profile-stats');
    stats.appendChild(mh('span', 'x-stat', '128 Following'));
    stats.appendChild(mh('span', 'x-stat', '24.7K Followers'));
    card.appendChild(stats);
    shell.appendChild(banner); shell.appendChild(card);
    return shell;
  }

  function buildAvatarMockup() {
    const shell = mh('div', 'mockup-shell avatar-mockup');
    const head = mh('div', 'avatar-head', 'Profile photo');
    const imgWrap = mh('div', 'avatar-img');
    imgWrap.appendChild(makePreviewImg('width:100%;height:100%;object-fit:cover;display:block;'));
    const foot = mh('div', 'avatar-foot');
    foot.appendChild(mockAvatar('avatar-foot-avatar', ''));
    const nameB = mh('div', 'avatar-name-block');
    nameB.appendChild(mh('span', 'avatar-name', 'RealResizer'));
    nameB.appendChild(mh('span', 'avatar-handle', '@realresizer'));
    foot.appendChild(nameB);
    shell.appendChild(head); shell.appendChild(imgWrap); shell.appendChild(foot);
    return shell;
  }

  function buildAppleMusicMockup() {
    const device = mh('div', 'apple-device');
    const status = mh('div', 'apple-statusbar');
    status.innerHTML = '<span class="as-time">9:41</span><span class="as-title">Apple Music</span><span class="as-batt svg"></span><span class="as-signal"></span>';
    const player = mh('div', 'apple-player');
    const artwork = mh('div', 'apple-artwork');
    artwork.appendChild(makePreviewImg('width:100%;height:100%;object-fit:cover;display:block;'));
    const track = mh('div', 'apple-track-info');
    track.appendChild(mh('div', 'apple-track-name', 'Neon Skyline'));
    track.appendChild(mh('div', 'apple-track-artist', 'RealResizer Studio'));
    const scrub = mh('div', 'apple-scrub');
    const times = mh('div', 'apple-times');
    times.appendChild(mh('span', 'apple-time', '1:42'));
    times.appendChild(mh('span', 'apple-time', '3:15'));
    const bar = mh('div', 'apple-scrub-bar');
    bar.appendChild(mh('div', 'apple-scrub-fill'));
    bar.appendChild(mh('div', 'apple-scrub-thumb'));
    scrub.appendChild(times); scrub.appendChild(bar);
    const ctrls = mh('div', 'apple-controls');
    const cBtn = (n, big) => {
      const b = mh('button', 'apple-btn' + (big ? ' apple-btn-big' : ''));
      b.type = 'button';
      b.innerHTML = mockIcon(n);
      return b;
    };
    ctrls.appendChild(cBtn('back15'));
    ctrls.appendChild(cBtn('play', true));
    ctrls.appendChild(cBtn('fwd15'));
    const ctrls2 = mh('div', 'apple-controls');
    const skip = (n) => {
      const b = mh('button', 'apple-btn');
      b.type = 'button';
      b.innerHTML = mockIcon(n);
      return b;
    };
    ctrls2.appendChild(skip('skipBack'));
    ctrls2.appendChild(skip('skipFwd'));
    const vol = mh('div', 'apple-volrow');
    vol.appendChild(mic('apple-vol-icon', 'volume'));
    vol.appendChild(mh('div', 'apple-vol-bar'));
    vol.appendChild(mic('apple-vol-icon', 'volume2'));
    const bottom = mh('div', 'apple-bottomrow');
    const airplay = mh('button', 'apple-aux-btn');
    airplay.type = 'button';
    airplay.innerHTML = mockIcon('airplay');
    const lyrics = mh('button', 'apple-aux-btn');
    lyrics.type = 'button';
    lyrics.innerHTML = mockIcon('lyrics');
    bottom.appendChild(airplay); bottom.appendChild(lyrics);
    player.appendChild(artwork); player.appendChild(track); player.appendChild(scrub);
    player.appendChild(ctrls); player.appendChild(ctrls2); player.appendChild(vol); player.appendChild(bottom);
    device.appendChild(status); device.appendChild(player);
    return device;
  }

  function buildAppleArtistMockup() {
    const shell = mh('div', 'mockup-shell apple-artist');
    const topbar = mh('div', 'apple-art-topbar');
    topbar.appendChild(mh('span', 'apple-art-brand', 'Apple Music'));
    topbar.appendChild(mic('apple-art-search', 'search'));
    const hero = mh('div', 'apple-art-hero');
    hero.appendChild(makePreviewImg('width:100%;height:100%;object-fit:cover;display:block;'));
    const grad = mh('div', 'apple-art-grad');
    const playBtn = mh('div', 'apple-art-play');
    playBtn.innerHTML = mockIcon('play');
    hero.appendChild(grad); hero.appendChild(playBtn);
    const body = mh('div', 'apple-art-body');
    body.appendChild(mh('span', 'apple-art-label', 'Artist'));
    body.appendChild(mh('h2', 'apple-art-name', 'RealResizer'));
    body.appendChild(mh('span', 'apple-art-listeners', '1.2M monthly listeners'));
    const rows = mh('div', 'apple-art-rows');
    for (let i = 0; i < 4; i++) {
      const r = mh('div', 'apple-art-row');
      const t = mh('div', 'apple-art-row-thumb', '');
      t.innerHTML = mockIcon('note');
      r.appendChild(t);
      const txt = mh('div', 'apple-art-row-txt');
      txt.appendChild(mh('span', 'apple-art-row-title', i === 0 ? 'Neon Skyline' : 'Crop It Like It is Hot'));
      txt.appendChild(mh('span', 'apple-art-row-sub', 'RealResizer Studio'));
      r.appendChild(txt);
      rows.appendChild(r);
    }
    body.appendChild(rows);
    shell.appendChild(topbar); shell.appendChild(hero); shell.appendChild(body);
    return shell;
  }

  function buildSpotifyMockup() {
    const device = mh('div', 'spotify-phone');
    const status = mh('div', 'spotify-statusbar');
    status.innerHTML = '<span class="ss-time">9:41</span><span class="ss-batt"></span>';
    const now = mh('div', 'spotify-now');
    const artwork = mh('div', 'spotify-artwork');
    artwork.appendChild(makePreviewImg('width:100%;height:100%;object-fit:cover;display:block;'));
    const song = mh('div', 'spotify-song');
    song.appendChild(mh('div', 'spotify-song-title', 'Velvet Hours'));
    song.appendChild(mh('div', 'spotify-song-artist', 'The Cropping Crew'));
    const nav = mh('div', 'spotify-ctrls');
    const navBtn = (n) => {
      const b = mh('button', 'spotify-btn');
      b.type = 'button';
      b.innerHTML = mockIcon(n);
      return b;
    };
    const navBtnBig = () => {
      const b = mh('button', 'spotify-btn play');
      b.type = 'button';
      b.innerHTML = mockIcon('play');
      return b;
    };
    nav.appendChild(navBtn('shuffle'));
    nav.appendChild(navBtn('skipBack'));
    nav.appendChild(navBtnBig());
    nav.appendChild(navBtn('skipFwd'));
    nav.appendChild(navBtn('repeat'));
    const prog = mh('div', 'spotify-progress');
    const ptimes = mh('div', 'spotify-ptimes');
    ptimes.appendChild(mh('span', 'spotify-ptime', '0:42'));
    ptimes.appendChild(mh('span', 'spotify-ptime', '3:12'));
    const pbar = mh('div', 'spotify-pbar');
    pbar.appendChild(mh('div', 'spotify-pfill'));
    prog.appendChild(ptimes); prog.appendChild(pbar);
    const foot = mh('div', 'spotify-foot');
    foot.appendChild(mic('spotify-foot-icon', 'devices'));
    foot.appendChild(mic('spotify-foot-icon', 'shuffle'));
    now.appendChild(artwork); now.appendChild(song); now.appendChild(nav); now.appendChild(prog); now.appendChild(foot);
    device.appendChild(status); device.appendChild(now);
    return device;
  }

  function buildSpotifyCardMockup() {
    const shell = mh('div', 'mockup-shell spotify-card-mock');
    const head = mh('div', 'spotify-card-head', 'Made For You');
    const grid = mh('div', 'spotify-card-grid');
    for (let i = 0; i < 3; i++) {
      const card = mh('div', 'spotify-album-card');
      const wrap = mh('div', 'spotify-album-art');
      if (i === 1) {
        wrap.appendChild(makePreviewImg('width:100%;height:100%;object-fit:cover;display:block;'));
      } else {
        wrap.appendChild(mh('div', 'spotify-album-ph', ''));
      }
      const badge = mh('div', 'spotify-album-badge');
      badge.innerHTML = mockIcon('play');
      wrap.appendChild(badge);
      card.appendChild(wrap);
      card.appendChild(mh('span', 'spotify-album-title', 'Fresh Crops Vol. 2'));
      card.appendChild(mh('span', 'spotify-album-sub', 'The Cropping Crew'));
      grid.appendChild(card);
    }
    shell.appendChild(head); shell.appendChild(grid);
    return shell;
  }

  function buildSpotifyCanvasMockup() {
    const phone = mh('div', 'spotify-canvas-phone');
    const screen = mh('div', 'spotify-canvas-screen');
    screen.appendChild(makePreviewImg('width:100%;height:100%;object-fit:cover;display:block;'));
    const grad = mh('div', 'spotify-canvas-grad');
    const top = mh('div', 'spotify-canvas-top');
    top.appendChild(mh('div', 'spotify-canvas-title', 'Velvet Hours'));
    top.appendChild(mh('div', 'spotify-canvas-artist', 'The Cropping Crew'));
    const ctrls = mh('div', 'spotify-canvas-ctrls');
    const c = (n, big) => {
      const b = mh('button', 'spotify-canvas-btn' + (big ? ' big' : ''));
      b.type = 'button';
      b.innerHTML = mockIcon(n);
      return b;
    };
    ctrls.appendChild(c('shuffle'));
    ctrls.appendChild(c('skipBack'));
    ctrls.appendChild(c('play', true));
    ctrls.appendChild(c('skipFwd'));
    ctrls.appendChild(c('repeat'));
    screen.appendChild(grad); screen.appendChild(top); screen.appendChild(ctrls);
    phone.appendChild(screen);
    return phone;
  }

  function buildSpotifyArtistMockup() {
    const shell = mh('div', 'mockup-shell spotify-artist-mock');
    const topbar = mh('div', 'spotify-art-topbar');
    topbar.appendChild(mh('span', 'spotify-art-back', '<'));
    topbar.appendChild(mh('span', 'spotify-art-brand', 'Spotify'));
    topbar.appendChild(mic('spotify-art-search', 'search'));
    const hero = mh('div', 'spotify-art-hero');
    hero.appendChild(makePreviewImg('width:100%;height:100%;object-fit:cover;display:block;'));
    hero.appendChild(mh('div', 'spotify-art-grad'));
    const heroPlay = mh('div', 'spotify-art-play');
    heroPlay.innerHTML = mockIcon('play');
    hero.appendChild(heroPlay);
    const body = mh('div', 'spotify-art-body');
    body.appendChild(mh('span', 'spotify-art-label', 'Artist'));
    body.appendChild(mh('h2', 'spotify-art-name', 'RealResizer'));
    body.appendChild(mh('span', 'spotify-art-listeners', '2.4M monthly listeners'));
    const btnRow = mh('div', 'spotify-art-btns');
    btnRow.appendChild(mh('span', 'spotify-art-btn', 'Play'));
    btnRow.appendChild(mh('span', 'spotify-art-btn ghost', 'Follow'));
    body.appendChild(btnRow);
    const tracks = mh('div', 'spotify-art-tracks');
    for (let i = 0; i < 4; i++) {
      const r = mh('div', 'spotify-art-track');
      r.appendChild(mh('span', 'spotify-art-track-idx', String(i + 1)));
      const txt = mh('div', 'spotify-art-track-txt');
      txt.appendChild(mh('span', 'spotify-art-track-name', i === 0 ? 'Velvet Hours' : 'Crop It Like It Is Hot'));
      txt.appendChild(mh('span', 'spotify-art-track-sub', (i * 172 + 36) + ' plays'));
      r.appendChild(txt);
      r.appendChild(mh('span', 'spotify-art-track-time', '3:0' + i));
      tracks.appendChild(r);
    }
    body.appendChild(tracks);
    shell.appendChild(topbar); shell.appendChild(hero); shell.appendChild(body);
    return shell;
  }

  function buildLinkedinProfileMockup() {
    const shell = mh('div', 'mockup-shell li-profile-mock');
    const topbar = mh('div', 'li-prof-topbar');
    topbar.appendChild(mh('span', 'li-prof-brand', 'in'));
    topbar.appendChild(mh('div', 'li-prof-search', 'Search'));
    const hero = mh('div', 'li-prof-hero');
    const banner = mh('div', 'li-prof-banner');
    banner.appendChild(makePreviewImg('width:100%;height:100%;object-fit:cover;display:block;'));
    const heroBody = mh('div', 'li-prof-hero-body');
    heroBody.appendChild(mockAvatar('li-prof-avatar', ''));
    const heroTxt = mh('div', 'li-prof-hero-txt');
    heroTxt.appendChild(mh('h2', 'li-prof-name', 'Jordan Blake'));
    heroTxt.appendChild(mh('span', 'li-prof-headline', 'Graphic Designer & Design Lead'));
    heroTxt.appendChild(mh('span', 'li-prof-meta', '1,482 followers · 500+ connections'));
    const btns = mh('div', 'li-prof-btns');
    btns.appendChild(mh('span', 'li-prof-btn primary', 'Connect'));
    btns.appendChild(mh('span', 'li-prof-btn', 'Message'));
    heroBody.appendChild(heroTxt); heroBody.appendChild(btns);
    hero.appendChild(banner); hero.appendChild(heroBody);
    const nav = mh('div', 'li-prof-nav');
    ['Posts', 'Activity', 'About', 'Experience'].forEach((t, i) => {
      nav.appendChild(mh('span', 'li-prof-nav-item' + (i === 0 ? ' active' : ''), t));
    });
    shell.appendChild(topbar); shell.appendChild(hero); shell.appendChild(nav);
    return shell;
  }

  function buildLinkedinCompanyMockup() {
    const shell = mh('div', 'mockup-shell li-profile-mock');
    const topbar = mh('div', 'li-prof-topbar');
    topbar.appendChild(mh('span', 'li-prof-brand', 'in'));
    topbar.appendChild(mh('div', 'li-prof-search', 'Search'));
    const hero = mh('div', 'li-prof-hero');
    const banner = mh('div', 'li-company-banner');
    banner.appendChild(makePreviewImg('width:100%;height:100%;object-fit:cover;display:block;'));
    const heroBody = mh('div', 'li-prof-hero-body');
    heroBody.appendChild(mockAvatar('li-prof-avatar company', ''));
    const heroTxt = mh('div', 'li-prof-hero-txt');
    heroTxt.appendChild(mh('h2', 'li-prof-name', 'RealResizer'));
    heroTxt.appendChild(mh('span', 'li-prof-headline', 'Computer Software · 51-200 employees'));
    heroTxt.appendChild(mh('span', 'li-prof-meta', 'Realresizer.com'));
    const btns = mh('div', 'li-prof-btns');
    btns.appendChild(mh('span', 'li-prof-btn primary', 'Follow'));
    btns.appendChild(mh('span', 'li-prof-btn', 'Website'));
    heroBody.appendChild(heroTxt); heroBody.appendChild(btns);
    hero.appendChild(banner); hero.appendChild(heroBody);
    shell.appendChild(topbar); shell.appendChild(hero);
    return shell;
  }

  // ---------------------------------------------------------------------------
  // Two-Mode Switch & Presets Drawer Management
  // ---------------------------------------------------------------------------

  /**
   * Build a small SVG that visually represents the aspect ratio of a preset.
   * The swatch is always 36 × 36 px outer; the inner rect scales to the ratio.
   */
  function buildRatioSwatch(ratio) {
    const OUTER = 36;
    const INNER_MAX = 28;
    let w, h;
    if (ratio >= 1) {
      w = INNER_MAX;
      h = Math.max(4, Math.round(INNER_MAX / ratio));
    } else {
      h = INNER_MAX;
      w = Math.max(4, Math.round(INNER_MAX * ratio));
    }
    const x = Math.round((OUTER - w) / 2);
    const y = Math.round((OUTER - h) / 2);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', OUTER);
    svg.setAttribute('height', OUTER);
    svg.setAttribute('viewBox', `0 0 ${OUTER} ${OUTER}`);
    svg.setAttribute('aria-hidden', 'true');
    svg.classList.add('preset-ratio-swatch');

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('width', w);
    rect.setAttribute('height', h);
    rect.setAttribute('rx', '2');
    svg.appendChild(rect);
    return svg;
  }

  function renderPresetsDrawer() {
    if (!elements.presetsGrid) return;
    elements.presetsGrid.innerHTML = '';
    presetCards = [];

    PRESET_REGISTRY.forEach(preset => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = `preset-card ${state.activePreset === preset.id ? 'selected' : ''}`;
      card.dataset.preset = preset.id;
      card.title = `${preset.name} — ${preset.desc}`;

      // Ratio swatch (visual thumbnail)
      const swatchWrap = document.createElement('div');
      swatchWrap.className = 'preset-swatch-wrap';
      swatchWrap.appendChild(buildRatioSwatch(preset.ratio));

      // Left info
      const infoDiv = document.createElement('div');
      infoDiv.className = 'preset-card-info';

      const nameSpan = document.createElement('span');
      nameSpan.className = 'preset-card-name';
      nameSpan.textContent = preset.name;

      const descSpan = document.createElement('span');
      descSpan.className = 'preset-card-desc';
      descSpan.textContent = preset.desc;

      // Explicit pixel dimensions line
      const dimsSpan = document.createElement('span');
      dimsSpan.className = 'preset-card-dims';
      dimsSpan.textContent = `${preset.targetW} × ${preset.targetH}px`;

      infoDiv.appendChild(nameSpan);
      infoDiv.appendChild(descSpan);
      infoDiv.appendChild(dimsSpan);

      // Right meta
      const metaDiv = document.createElement('div');
      metaDiv.className = 'preset-card-meta';

      const ratioBadge = document.createElement('span');
      ratioBadge.className = 'preset-ratio-badge';
      ratioBadge.textContent = preset.ratioLabel;

      const checkIcon = document.createElement('div');
      checkIcon.className = 'preset-check-icon';
      checkIcon.innerHTML = `
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;

      metaDiv.appendChild(ratioBadge);
      metaDiv.appendChild(checkIcon);

      card.appendChild(swatchWrap);
      card.appendChild(infoDiv);
      card.appendChild(metaDiv);

      card.addEventListener('click', () => {
        if (state.isCropped || state.isAnimating) return;
        soundEngine.init();
        applyPreset(preset.id, true);
        closePresetsDrawer();
      });

      elements.presetsGrid.appendChild(card);
      presetCards.push({ card, preset });
    });
  }

  function filterPresets(query) {
    const q = (query || '').trim().toLowerCase();
    presetCards.forEach(({ card, preset }) => {
      const haystack =
        `${preset.name} ${preset.desc} ${preset.ratioLabel} ${preset.targetW}x${preset.targetH}`
          .toLowerCase();
      card.classList.toggle('hidden', !!q && !haystack.includes(q));
    });
  }

  function resetPresetSearch() {
    if (elements.presetsSearch) elements.presetsSearch.value = '';
    filterPresets('');
  }

  function openPresetsDrawer() {
    if (!elements.presetsDrawer || !elements.btnModePresets) return;
    resetPresetSearch();
    elements.presetsDrawer.classList.remove('hidden');
    if (elements.presetsBackdrop) elements.presetsBackdrop.classList.remove('hidden');
    elements.btnModePresets.classList.add('drawer-open');
    elements.btnModePresets.setAttribute('aria-expanded', 'true');
    // Hide canvas handles/puck/grid behind the modal and lock page scroll while
    // the modal is open so only the inner preset list scrolls.
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
  }

  function closePresetsDrawer() {
    if (!elements.presetsDrawer || !elements.btnModePresets) return;
    resetPresetSearch();
    elements.presetsDrawer.classList.add('hidden');
    if (elements.presetsBackdrop) elements.presetsBackdrop.classList.add('hidden');
    elements.btnModePresets.classList.remove('drawer-open');
    elements.btnModePresets.setAttribute('aria-expanded', 'false');
    // Restore canvas handles/puck/grid and page scrolling.
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
  }

  function togglePresetsDrawer() {
    if (!elements.presetsDrawer) return;
    if (elements.presetsDrawer.classList.contains('hidden')) {
      openPresetsDrawer();
    } else {
      closePresetsDrawer();
    }
  }

  function updateModeAndPresetUI() {
    const isCustom = state.activePreset === 'custom';

    if (elements.btnModeCustom) {
      elements.btnModeCustom.classList.toggle('active', isCustom);
      elements.btnModeCustom.setAttribute('aria-selected', isCustom ? 'true' : 'false');
    }

    if (elements.btnModePresets) {
      elements.btnModePresets.classList.toggle('active', !isCustom);
      elements.btnModePresets.setAttribute('aria-selected', !isCustom ? 'true' : 'false');
    }

    // Preset mode: hide the 4 corner/ruler resize handles and activate the
    // preset-active state (proportional puck scaling + free box panning).
    if (elements.canvasFrame) {
      elements.canvasFrame.classList.toggle('preset-active', !isCustom);
    }

    // Update checkmark state in drawer cards
    const cards = elements.presetsGrid?.querySelectorAll('.preset-card');
    if (cards) {
      cards.forEach(card => {
        const isSelected = !isCustom && card.dataset.preset === state.activePreset;
        card.classList.toggle('selected', isSelected);
      });
    }
  }

  // ---------------------------------------------------------------------------
  // Canvas Geometry & Rendering Engine
  // ---------------------------------------------------------------------------

  function updateViewportGeometry() {
    if (!elements.editorViewport || !elements.canvas || !state.image) return;

    const imgW = state.naturalWidth;
    const imgH = state.naturalHeight;
    if (!imgW || !imgH) return;

    // Rail track sizes as laid out (34px desktop, 28px narrow).
    const isPostCut = !!(elements.canvasFrame && elements.canvasFrame.classList.contains('is-post-cut'));
    const railV = elements.rulerRight ? elements.rulerRight.offsetWidth : 34;
    const railH = elements.rulerBottom ? elements.rulerBottom.offsetHeight : 34;
    // Grid gap (canvas → floating pill rails) + the corner-cell float breathing
    // room around the standalone circular cut-bin. The frame shrink-wrap adds
    // this to the rendered image exactly like the CSS grid tracks do; both are
    // collapsed to zero in the post-cut presentation (rails hidden).
    const railGap = 10;
    const railPad = 10;
    const frameX = isPostCut ? 0 : (railGap + railPad);

    // Available width: the loaded-view width minus the right rail column and
    // the loaded-view's own horizontal padding (the container is
    // box-sizing:border-box, so clientWidth already includes the padding box).
    const lvPadX =
      parseFloat(getComputedStyle(elements.loadedView).paddingLeft || '0') +
      parseFloat(getComputedStyle(elements.loadedView).paddingRight || '0');
    const maxCellW = Math.max(80, elements.loadedView.clientWidth - railV - frameX - lvPadX);

    // Available height is MEASURED from real layout, not a magic constant.
    // The stage must fit between the top of the loaded-view (below header) and
    // the app footer, minus the workspace bar, zoom bar, status pill and the
    // small column gaps. This adapts automatically to the taller wrapped
    // toolbar on small screens and to safe-area padding handled by CSS.
    const vh = window.innerHeight || document.documentElement.clientHeight || 600;
    const loadedTop = elements.loadedView.getBoundingClientRect().top;
    let usableBottom = vh;
    if (elements.appFooter && elements.appFooter.getBoundingClientRect().height > 0) {
      usableBottom = elements.appFooter.getBoundingClientRect().top;
    }
    const wsH = elements.workspaceBar ? elements.workspaceBar.getBoundingClientRect().height : 0;
    let zoomH = 0;
    if (elements.zoomBar && !elements.zoomBar.classList.contains('hidden')) {
      zoomH = elements.zoomBar.getBoundingClientRect().height;
    }
    const pillH = elements.stageStatusPill ? elements.stageStatusPill.offsetHeight : 0;
    const actionsH = elements.workspaceActions ? elements.workspaceActions.getBoundingClientRect().height : 0;
    const stageGap = 16; // .stage-container column gap (~2x --space-xs)
    const availableForStage = Math.max(0, (usableBottom - loadedTop) - wsH - zoomH - pillH - actionsH - stageGap);
    // Single-screen hard clamp: the whole frame must fit within calc(100vh - 200px)
    // (mirrors .stage-canvas-frame { max-height }). Using min() keeps the JS size
    // consistent with the CSS clamp so the ruler handles never misalign.
    const frameCapH = Math.max(120, (vh - 200) - railH - frameX);
    const maxCellH = Math.max(80, Math.min(availableForStage, frameCapH) - railH - frameX);

    // Favour fitting height when a tall image, width when wide — preserve AR.
    const scale = Math.min(maxCellW / imgW, maxCellH / imgH);
    const renderedW = Math.round(imgW * scale);
    const renderedH = Math.round(imgH * scale);

    // Shrink-wrap the whole frame so the image cell matches the rendered image
    // exactly; the pill rails and cut-bin occupy the outer grid cells beyond
    // the gap + float padding (both collapsed to zero in post-cut view).
    const frameW = renderedW + railV + frameX;
    const frameH = renderedH + railH + frameX;
    elements.canvasFrame.style.width = `${frameW}px`;
    elements.canvasFrame.style.height = `${frameH}px`;

    // Ruler-handle pin distance: keep handles fully inside the pill rails even
    // when a crop edge sits exactly on the image boundary (0 or 1), so the
    // rails' overflow:hidden never clips them. Re-measured per geometry pass so
    // the mobile (touch-friendly) handle sizes are respected.
    const handleVLen = elements.handleRightTop ? elements.handleRightTop.offsetHeight : 22;
    const handleHLen = elements.handleBottomLeft ? elements.handleBottomLeft.offsetWidth : 22;
    state.rulerPad = {
      v: Math.ceil(handleVLen / 2) + 2,
      h: Math.ceil(handleHLen / 2) + 2
    };

    const dpr = window.devicePixelRatio || 1;

    state.viewport.width = renderedW;
    state.viewport.height = renderedH;
    state.viewport.imageWidth = renderedW;
    state.viewport.imageHeight = renderedH;
    state.viewport.imageX = 0;
    state.viewport.imageY = 0;
    state.viewport.scale = scale;

    elements.canvas.width = Math.round(renderedW * dpr);
    elements.canvas.height = Math.round(renderedH * dpr);
    elements.canvas.style.width = `${renderedW}px`;
    elements.canvas.style.height = `${renderedH}px`;

    ctx = elements.canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /**
   * Visible region of the source image (normalized 0..1) shown inside the crop
   * window, given the current zoom scale and pan offsets.
   * - zoom.scale == 1  -> the visible region equals the crop box (no zoom).
   * - zoom.offsetX/Y   -> 0..1 position of the visible window across the
   *                       available pan range (0 = top/left edge, 1 = bottom/right).
   */
  function renderCanvas() {
    if (!ctx || !state.image) return;

    const { width, height, imageX, imageY, imageWidth, imageHeight } = state.viewport;
    if (width === 0 || height === 0) return;

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(state.image, imageX, imageY, imageWidth, imageHeight);

    if (state.isCropped) {
      updateRulersAndGuides(false);
      return;
    }

    const cropX = imageX + state.crop.x * imageWidth;
    const cropY = imageY + state.crop.y * imageHeight;
    const cropW = state.crop.width * imageWidth;
    const cropH = state.crop.height * imageHeight;

    // Darkened Overlay
    ctx.save();
    ctx.fillStyle = 'rgba(9, 9, 11, 0.72)';
    if (cropY > imageY) {
      ctx.fillRect(imageX, imageY, imageWidth, cropY - imageY);
    }
    const bottomCropY = cropY + cropH;
    if (bottomCropY < imageY + imageHeight) {
      ctx.fillRect(imageX, bottomCropY, imageWidth, imageY + imageHeight - bottomCropY);
    }
    if (cropX > imageX) {
      ctx.fillRect(imageX, cropY, cropX - imageX, cropH);
    }
    const rightCropX = cropX + cropW;
    if (rightCropX < imageX + imageWidth) {
      ctx.fillRect(rightCropX, cropY, imageX + imageWidth - rightCropX, cropH);
    }

    // NOTE: the source image is shown at fixed 1.0x — the base drawImage above
    // is the full, unzoomed image. The crop window simply reveals part of it;
    // there is no magnification redraw, so the image NEVER zooms under the crop.

    // Crop Frame & Grid
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    // Thirds
    ctx.beginPath();
    ctx.moveTo(cropX, cropY + cropH / 3);
    ctx.lineTo(cropX + cropW, cropY + cropH / 3);
    ctx.moveTo(cropX, cropY + (cropH * 2) / 3);
    ctx.lineTo(cropX + cropW, cropY + (cropH * 2) / 3);
    ctx.moveTo(cropX + cropW / 3, cropY);
    ctx.lineTo(cropX + cropW / 3, cropY + cropH);
    ctx.moveTo(cropX + (cropW * 2) / 3, cropY);
    ctx.lineTo(cropX + (cropW * 2) / 3, cropY + cropH);
    ctx.stroke();

    // Frame
    ctx.setLineDash([]);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(cropX, cropY, cropW, cropH);

    // Corner Brackets
    const bracketLen = Math.min(16, Math.min(cropW, cropH) / 4);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#ffffff';

    ctx.beginPath();
    ctx.moveTo(cropX, cropY + bracketLen);
    ctx.lineTo(cropX, cropY);
    ctx.lineTo(cropX + bracketLen, cropY);

    ctx.moveTo(cropX + cropW - bracketLen, cropY);
    ctx.lineTo(cropX + cropW, cropY);
    ctx.lineTo(cropX + cropW, cropY + bracketLen);

    ctx.moveTo(cropX, cropY + cropH - bracketLen);
    ctx.lineTo(cropX, cropY + cropH);
    ctx.lineTo(cropX + bracketLen, cropY + cropH);

    ctx.moveTo(cropX + cropW - bracketLen, cropY + cropH);
    ctx.lineTo(cropX + cropW, cropY + cropH);
    ctx.lineTo(cropX + cropW, cropY + cropH - bracketLen);
    ctx.stroke();

    ctx.restore();

    updateRulersAndGuides(true, cropX, cropY, cropW, cropH);
  }

  function updateRulersAndGuides(visible, cropX, cropY, cropW, cropH) {
    if (!visible || state.isCropped) {
      [elements.guideLineTop, elements.guideLineBottom, elements.guideLineLeft, elements.guideLineRight].forEach(g => {
        if (g) g.style.display = 'none';
      });
      [elements.handleRightTop, elements.handleRightBottom, elements.handleBottomLeft, elements.handleBottomRight].forEach(h => {
        if (h) h.style.display = 'none';
      });
      if (elements.scaleHandle) elements.scaleHandle.classList.add('hidden');
      return;
    }

    // Show + pin the dedicated Nothing-style top-left (＋) CROP RESIZE puck. It
    // anchors to the crop rectangle's top-left vertex (cropX, cropY) in viewport
    // pixels and rides along as the crop is moved or resized. Dragging it resizes
    // the crop frame (expands outward / shrinks inward), never the source image.
    if (elements.scaleHandle) {
      elements.scaleHandle.classList.remove('hidden');
      positionScaleHandle(cropX, cropY);
    }

    const currentCropW = Math.round(state.crop.width * state.naturalWidth);
    const currentCropH = Math.round(state.crop.height * state.naturalHeight);

    const topGuideY = cropY;
    const bottomGuideY = cropY + cropH;
    const leftGuideX = cropX;
    const rightGuideX = cropX + cropW;

    // Whether freeform corner/ruler handles are available. The 4 corner handles
    // are STRICTLY reserved for "Custom" mode; any platform preset hides them and
    // relies on the top-left (＋) puck for proportional scaling + box panning.
    const freeform = state.activePreset === 'custom';

    // Right Rail Handles (corner handles — Custom mode only). Pinned a half
    // handle-length inside the pill rail ends so the rails' overflow:hidden
    // never clips them at image-edge crops; the guide lines still mark the
    // exact boundary in those cases.
    const padV = (state.rulerPad && state.rulerPad.v) ||
      Math.ceil((elements.handleRightTop ? elements.handleRightTop.offsetHeight : 22) / 2) + 2;
    const padH = (state.rulerPad && state.rulerPad.h) ||
      Math.ceil((elements.handleBottomLeft ? elements.handleBottomLeft.offsetWidth : 22) / 2) + 2;
    const vpH = state.viewport.height;
    const vpW = state.viewport.width;
    const pinV = (v) => Math.min(Math.max(v, padV), Math.max(padV, vpH - padV));
    const pinH = (v) => Math.min(Math.max(v, padH), Math.max(padH, vpW - padH));

    if (elements.handleRightTop) {
      elements.handleRightTop.style.display = freeform ? 'flex' : 'none';
      elements.handleRightTop.style.top = `${pinV(topGuideY)}px`;
    }
    if (elements.handleRightBottom) {
      elements.handleRightBottom.style.display = freeform ? 'flex' : 'none';
      elements.handleRightBottom.style.top = `${pinV(bottomGuideY)}px`;
    }

    // Bottom Rail Handles (corner handles — Custom mode only)
    if (elements.handleBottomLeft) {
      elements.handleBottomLeft.style.display = freeform ? 'flex' : 'none';
      elements.handleBottomLeft.style.left = `${pinH(leftGuideX)}px`;
    }
    if (elements.handleBottomRight) {
      elements.handleBottomRight.style.display = freeform ? 'flex' : 'none';
      elements.handleBottomRight.style.left = `${pinH(rightGuideX)}px`;
    }

    // Guide Lines
    if (elements.guideLineTop) {
      elements.guideLineTop.style.display = 'block';
      elements.guideLineTop.style.top = `${topGuideY}px`;
    }
    if (elements.guideLineBottom) {
      elements.guideLineBottom.style.display = 'block';
      elements.guideLineBottom.style.top = `${bottomGuideY}px`;
    }
    if (elements.guideLineLeft) {
      elements.guideLineLeft.style.display = 'block';
      elements.guideLineLeft.style.left = `${leftGuideX}px`;
    }
    if (elements.guideLineRight) {
      elements.guideLineRight.style.display = 'block';
      elements.guideLineRight.style.left = `${rightGuideX}px`;
    }

    // Update Header Specs
    if (elements.metaDimensions) {
      elements.metaDimensions.innerHTML = `${currentCropW} &times; ${currentCropH} px`;
    }
    if (elements.metaAspect) {
      elements.metaAspect.textContent = calculateAspectRatio(currentCropW, currentCropH);
    }

    // Live selection percentage = (crop area / total image area) * 100
    updateSelectionPill();
  }

  // ---------------------------------------------------------------------------
  // Elastic Ruler Stretch
  // ---------------------------------------------------------------------------

  // Drain / stretch class names. Each direction lists the rail it animates and
  // the pull direction; paired with the CSS transform-origin rules they make
  // the rail extend ONLY on the pulled side while the opposite end stays locked.
  const RULER_STRETCH_CLASSES = ['ruler-stretch-top', 'ruler-stretch-bottom', 'ruler-stretch-left', 'ruler-stretch-right'];

  function clearRulerStretch(rail) {
    if (!rail) return;
    RULER_STRETCH_CLASSES.forEach(c => rail.classList.remove(c));
    rail.style.setProperty('--ruler-stretch', '0');
  }

  /** Elastic ruler stretch physics. While a ruler handle is pulled PAST the
   * image boundary (0 or 1) the matching floating pill rail stretches along
   * its axis, anchored at the OPPOSITE end so only the pulled side extends:
   *   top    handle -> right rail scaleY from bottom center (grows upward)
   *   bottom handle -> right rail scaleY from top center    (grows downward)
   *   left   handle -> bottom rail scaleX from right center (grows leftward)
   *   right  handle -> bottom rail scaleX from left center  (grows rightward)
   * `amount` is the live normalized overshoot delta (scale factor = 1+delta),
   * passed on as --ruler-stretch. Moving back in-bounds or releasing (endDrag)
   * clears the classes and the springy transition snaps the rail to scale(1).
   */
  function applyRulerStretch(dir, amount) {
    if (dir === 'top' || dir === 'bottom') {
      clearRulerStretch(elements.rulerRight);
      clearRulerStretch(elements.rulerBottom);
      const rail = elements.rulerRight;
      if (rail && dir) {
        rail.style.setProperty('--ruler-stretch', String(Math.max(0, amount)));
        rail.classList.add(dir === 'top' ? 'ruler-stretch-top' : 'ruler-stretch-bottom');
      }
    } else if (dir === 'left' || dir === 'right') {
      clearRulerStretch(elements.rulerRight);
      clearRulerStretch(elements.rulerBottom);
      const rail = elements.rulerBottom;
      if (rail && dir) {
        rail.style.setProperty('--ruler-stretch', String(Math.max(0, amount)));
        rail.classList.add(dir === 'left' ? 'ruler-stretch-left' : 'ruler-stretch-right');
      }
    } else {
      clearRulerStretch(elements.rulerRight);
      clearRulerStretch(elements.rulerBottom);
    }
  }

  // ---------------------------------------------------------------------------
  // Presets Application & Smooth Transitions
  // ---------------------------------------------------------------------------

  function applyPreset(presetId, animate = true) {
    const preset = PRESET_REGISTRY.find(p => p.id === presetId);
    if (!preset) return;

    state.activePreset = presetId;
    updateModeAndPresetUI();

    const targetRatio = preset.ratio;
    const srcRatio = state.naturalWidth / state.naturalHeight;

    let targetW = 1.0;
    let targetH = 1.0;
    let targetX = 0;
    let targetY = 0;

    if (srcRatio > targetRatio) {
      targetH = 1.0;
      targetW = targetRatio / srcRatio;
      targetX = (1.0 - targetW) / 2;
      targetY = 0;
    } else {
      targetW = 1.0;
      targetH = srcRatio / targetRatio;
      targetX = 0;
      targetY = (1.0 - targetH) / 2;
    }

    const targetCrop = {
      x: Math.max(0, Math.min(1, targetX)),
      y: Math.max(0, Math.min(1, targetY)),
      width: Math.max(0.05, Math.min(1, targetW)),
      height: Math.max(0.05, Math.min(1, targetH))
    };

    if (!animate) {
      state.crop = targetCrop;
      renderCanvas();
      return;
    }

    animateCropTransition(targetCrop);
  }

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function animateCropTransition(targetCrop) {
    if (state.isAnimating) return;

    // Honour reduced-motion preference: skip animation entirely
    if (prefersReducedMotion()) {
      state.crop = { ...targetCrop };
      renderCanvas();
      soundEngine.playTick();
      triggerHaptic(8);
      return;
    }

    state.isAnimating = true;

    const startCrop = { ...state.crop };
    const startTime = performance.now();
    const duration = 280;

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(progress);

      state.crop.x = startCrop.x + (targetCrop.x - startCrop.x) * eased;
      state.crop.y = startCrop.y + (targetCrop.y - startCrop.y) * eased;
      state.crop.width = startCrop.width + (targetCrop.width - startCrop.width) * eased;
      state.crop.height = startCrop.height + (targetCrop.height - startCrop.height) * eased;

      renderCanvas();

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        state.crop = { ...targetCrop };
        state.isAnimating = false;
        renderCanvas();
        soundEngine.playTick();
        triggerHaptic(8);
      }
    }

    requestAnimationFrame(step);
  }

  // ---------------------------------------------------------------------------
  // Two-Rail Four-Handle Drag & Manipulation Engine
  // ---------------------------------------------------------------------------

  function setupTwoRailInteractions() {
    const handleBindings = [
      { el: elements.handleRightTop, id: 'handle-right-top', guide: elements.guideLineTop },
      { el: elements.handleRightBottom, id: 'handle-right-bottom', guide: elements.guideLineBottom },
      { el: elements.handleBottomLeft, id: 'handle-bottom-left', guide: elements.guideLineLeft },
      { el: elements.handleBottomRight, id: 'handle-bottom-right', guide: elements.guideLineRight }
    ];

    // Map each handle to its parent ruler track for the active-drag highlight
    const handleToRail = {
      'handle-right-top': elements.rulerRight,
      'handle-right-bottom': elements.rulerRight,
      'handle-bottom-left': elements.rulerBottom,
      'handle-bottom-right': elements.rulerBottom
    };

handleBindings.forEach(({ el, id, guide }) => {
        if (!el) return;
        el.addEventListener('pointerdown', (e) => {
          if (state.isCropped || state.isAnimating) return;
          e.preventDefault();
          soundEngine.init();
          el.setPointerCapture(e.pointerId);
          el.classList.add('dragging');
          if (guide) guide.classList.add('active');

          // Highlight the corresponding ruler track
          const rail = handleToRail[id];
          if (rail) rail.classList.add('dragging-active');

          state.dragging = id;
          state.dragStart = {
            clientX: e.clientX,
            clientY: e.clientY,
            crop: { ...state.crop }
          };
          state.lastDragClientPos = { x: e.clientX, y: e.clientY };

          soundEngine.playTick();
          triggerHaptic(6);
        });
      });

    // Canvas direct pan
    if (elements.canvas) {
      elements.canvas.addEventListener('pointerdown', (e) => {
        if (state.isCropped || state.isAnimating) return;

        const rect = elements.editorViewport.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const { imageX, imageY, imageWidth, imageHeight } = state.viewport;
        const cropX = imageX + state.crop.x * imageWidth;
        const cropY = imageY + state.crop.y * imageHeight;
        const cropW = state.crop.width * imageWidth;
        const cropH = state.crop.height * imageHeight;

        if (mouseX >= cropX && mouseX <= cropX + cropW && mouseY >= cropY && mouseY <= cropY + cropH) {
          e.preventDefault();
          soundEngine.init();
          state.dragging = 'crop-box';
          state.dragStart = {
            clientX: e.clientX,
            clientY: e.clientY,
            crop: { ...state.crop }
          };
          state.lastDragClientPos = { x: e.clientX, y: e.clientY };
          elements.canvas.style.cursor = 'grabbing';
          soundEngine.playTick();
          triggerHaptic(6);
        }
      });
    }

    // Global Pointer Move
    window.addEventListener('pointermove', (e) => {
      if (!state.dragging || !state.dragStart.crop) return;

      e.preventDefault();

      const { imageWidth, imageHeight } = state.viewport;
      if (imageWidth === 0 || imageHeight === 0) return;

      const deltaX = (e.clientX - state.dragStart.clientX) / imageWidth;
      const deltaY = (e.clientY - state.dragStart.clientY) / imageHeight;
      const initCrop = state.dragStart.crop;
      const minDimension = 0.05;

      const initialTop = initCrop.y;
      const initialBottom = initCrop.y + initCrop.height;
      const initialLeft = initCrop.x;
      const initialRight = initCrop.x + initCrop.width;

      // Compute the target value for each interaction, clamped to the image bounds.
      // "moved" is true only when the clamped result actually differs from the
      // current crop — i.e. the pointer really moved the boundary. When the drag is
      // pinned at 0 or 1 (boundary), clamped === current, so we suppress the tick.
      let moved = false;

      // When a platform preset is active the crop is RATIO-LOCKED: the puck and
      // ruler handles can only scale the crop box PROPORTIONALLY (a pure
      // zoom/framing box that never distorts the source pixels). Freeform
      // single-edge resizing is allowed only in "Custom" mode.
      const locked = state.activePreset !== 'custom';
      const initW = initCrop.width;
      const initH = initCrop.height;
      const aspectRatio = initW / initH; // lock this ratio in preset mode

      // Dragging inside the crop rectangle pans the whole box in EVERY mode
      // (freeform Custom and ratio-locked Presets alike). x/y slide freely
      // across the image bounds while width/height stay untouched, so the
      // preset's aspect ratio is always preserved and the mode never flips.
      if (state.dragging === 'crop-box') {
        const newX = Math.max(0, Math.min(1 - initCrop.width, initialLeft + deltaX));
        const newY = Math.max(0, Math.min(1 - initCrop.height, initialTop + deltaY));
        moved = newX !== state.crop.x || newY !== state.crop.y;
        state.crop.x = newX;
        state.crop.y = newY;
      } else if (locked) {
        // Derive a uniform scale factor from the pointer delta along the
        // handle's primary axis, then scale the box preserving aspect ratio.
        // For the + puck (corners), anchor at bottom-right corner (natural for top-left handle).
        // For ruler handles, scale from their respective fixed edges.
        let newW = initW;
        let newH = initH;
        let newLeft = initialLeft;
        let newTop = initialTop;

        if (state.dragging === 'handle-right-top') {
          // Top edge moves, bottom edge fixed
          newTop = Math.max(0, Math.min(initialBottom - minDimension, initialTop + deltaY));
          newH = initialBottom - newTop;
          newW = newH * aspectRatio;
          newLeft = Math.max(0, Math.min(1 - newW, initialRight - newW));
        } else if (state.dragging === 'handle-right-bottom') {
          // Bottom edge moves, top edge fixed
          const newBottom = Math.max(initialTop + minDimension, Math.min(1.0, initialBottom + deltaY));
          newH = newBottom - initialTop;
          newW = newH * aspectRatio;
          newLeft = Math.max(0, Math.min(1 - newW, initialRight - newW));
        } else if (state.dragging === 'handle-bottom-left') {
          // Left edge moves, right edge fixed
          newLeft = Math.max(0, Math.min(initialRight - minDimension, initialLeft + deltaX));
          newW = initialRight - newLeft;
          newH = newW / aspectRatio;
          newTop = Math.max(0, Math.min(1 - newH, initialBottom - newH));
        } else if (state.dragging === 'handle-bottom-right') {
          // Right edge moves, left edge fixed
          const newRight = Math.max(initialLeft + minDimension, Math.min(1.0, initialRight + deltaX));
          newW = newRight - initialLeft;
          newH = newW / aspectRatio;
          newTop = Math.max(0, Math.min(1 - newH, initialBottom - newH));
        } else if (state.dragging === 'corners') {
          // + puck: anchor at bottom-right, scale proportionally from there
          newTop = Math.max(0, Math.min(initialBottom - minDimension, initialTop + deltaY));
          newH = initialBottom - newTop;
          newW = newH * aspectRatio;
          newLeft = Math.max(0, Math.min(1 - newW, initialRight - newW));
          // If clamping pushed left to 0, recalculate from left anchor
          if (newLeft === 0) {
            newW = Math.min(initialRight, 1.0);
            newH = newW / aspectRatio;
            newTop = Math.max(0, Math.min(1 - newH, initialBottom - newH));
          }
        }

        moved = newLeft !== state.crop.x || newTop !== state.crop.y ||
                newW !== state.crop.width || newH !== state.crop.height;
        state.crop.x = newLeft;
        state.crop.y = newTop;
        state.crop.width = newW;
        state.crop.height = newH;
      } else if (state.dragging === 'handle-right-top') {
        const newTop = Math.max(0, Math.min(initialBottom - minDimension, initialTop + deltaY));
        moved = newTop !== state.crop.y;
        state.crop.y = newTop;
        state.crop.height = initialBottom - newTop;
      } else if (state.dragging === 'handle-right-bottom') {
        const newBottom = Math.max(initialTop + minDimension, Math.min(1.0, initialBottom + deltaY));
        moved = newBottom !== (state.crop.y + state.crop.height);
        state.crop.height = newBottom - initialTop;
      } else if (state.dragging === 'handle-bottom-left') {
        const newLeft = Math.max(0, Math.min(initialRight - minDimension, initialLeft + deltaX));
        moved = newLeft !== state.crop.x;
        state.crop.x = newLeft;
        state.crop.width = initialRight - newLeft;
      } else if (state.dragging === 'handle-bottom-right') {
        const newRight = Math.max(initialLeft + minDimension, Math.min(1.0, initialRight + deltaX));
        moved = newRight !== (state.crop.x + state.crop.width);
        state.crop.width = newRight - initialLeft;
      } else if (state.dragging === 'corners') {
        // Top-left crop-corner puck: the bottom-right edge stays fixed while the
        // top-left vertex follows the pointer. Pulling outward (up/left) expands
        // the frame to capture more content (background edges); pulling inward
        // (down/right) shrinks it. Both x and y move together, clamped to keep
        // the frame inside the image with a minimum dimension.
        const newLeft = Math.max(0, Math.min(initialRight - minDimension, initialLeft + deltaX));
        const newTop = Math.max(0, Math.min(initialBottom - minDimension, initialTop + deltaY));
        moved = newLeft !== state.crop.x || newTop !== state.crop.y;
        state.crop.width = initialRight - newLeft;
        state.crop.height = initialBottom - newTop;
        state.crop.x = newLeft;
        state.crop.y = newTop;
      }

      // Elastic ruler stretch: while a ruler handle is pulled PAST the image
      // boundary (0 or 1) the matching pill rail stretches along its axis in
      // the pulled direction (transform-origin anchors the opposite end). The
      // stretch amount tracks the normalized overshoot delta live, capped at
      // 0.03 so the resistance stays restrained.
      // Covers Custom-mode freeform handle drags; rule handles are hidden in
      // preset mode so the stretch only ever triggers from Custom handles.
      let stretchDir = null;
      let stretchAmount = 0;
      if (state.dragging === 'handle-right-top') {
        const over = -(initialTop + deltaY);
        if (over > 0) { stretchDir = 'top'; stretchAmount = Math.min(0.03, over); }
      } else if (state.dragging === 'handle-right-bottom') {
        const over = (initialBottom + deltaY) - 1;
        if (over > 0) { stretchDir = 'bottom'; stretchAmount = Math.min(0.03, over); }
      } else if (state.dragging === 'handle-bottom-left') {
        const over = -(initialLeft + deltaX);
        if (over > 0) { stretchDir = 'left'; stretchAmount = Math.min(0.03, over); }
      } else if (state.dragging === 'handle-bottom-right') {
        const over = (initialRight + deltaX) - 1;
        if (over > 0) { stretchDir = 'right'; stretchAmount = Math.min(0.03, over); }
      }
      applyRulerStretch(stretchDir, stretchAmount);

      // Only play the movement tick when the crop actually updated (not blocked).
      if (moved) {
        const dist = Math.hypot(e.clientX - state.lastDragClientPos.x, e.clientY - state.lastDragClientPos.y);
        if (dist >= 8) {
          soundEngine.playTick();
          if (!prefersReducedMotion()) triggerHaptic(12);
          state.lastDragClientPos = { x: e.clientX, y: e.clientY };
        }

        // A ratio-locked preset drag must never flip to Custom mid-drag; it is a
        // pure proportional zoom that keeps the preset active. Only a freeform
        // (Custom) drag can break the ratio.
        if (!locked) {
          const dimsChanged = state.crop.width !== initCrop.width || state.crop.height !== initCrop.height;
          if (dimsChanged && state.activePreset !== 'custom') {
            state.activePreset = 'custom';
            updateModeAndPresetUI();
          }
        }
        renderCanvas();
      }
    });

    // Shared cleanup for drag end (pointerup and pointercancel)
    function endDrag(e) {
      if (e) e.preventDefault();
      if (!state.dragging) return;

      // Release pointer capture on ruler handles and the crop-corner puck
      if (e && e.pointerId !== undefined) {
        [elements.handleRightTop, elements.handleRightBottom, elements.handleBottomLeft, elements.handleBottomRight, elements.scaleHandle].forEach(h => {
          try { h?.releasePointerCapture(e.pointerId); } catch (_) {}
        });
      }

      [elements.handleRightTop, elements.handleRightBottom, elements.handleBottomLeft, elements.handleBottomRight, elements.scaleHandle].forEach(h => {
        if (h) h.classList.remove('dragging');
      });
      [elements.guideLineTop, elements.guideLineBottom, elements.guideLineLeft, elements.guideLineRight].forEach(g => {
        if (g) g.classList.remove('active');
      });
      // Remove ruler track active-drag highlight + elastic stretch from both rails
      if (elements.rulerRight) {
        elements.rulerRight.classList.remove('dragging-active');
        clearRulerStretch(elements.rulerRight);
      }
      if (elements.rulerBottom) {
        elements.rulerBottom.classList.remove('dragging-active');
        clearRulerStretch(elements.rulerBottom);
      }

      if (elements.canvas) elements.canvas.style.cursor = 'crosshair';
      state.scaleDragging = false;
      state.dragging = null;
      triggerHaptic(4);
    }

    cancelActiveDrag = (pointerId) => {
      endDrag({ preventDefault() {}, pointerId });
    };

    // Global Pointer Up
    window.addEventListener('pointerup', endDrag);

    // Global Pointer Cancel (e.g. touch interrupted, window loses focus)
    window.addEventListener('pointercancel', endDrag);

    // Touch fallback for crop-box dragging on Android Chrome.
    // Chrome may fire pointercancel during touch drags even with
    // touch-action: none, cancelling the pointer event stream.
    // Touch events fire independently and provide a reliable fallback.
    document.addEventListener('touchmove', (e) => {
      if (state.dragging !== 'crop-box' || !state.dragStart.crop) return;
      e.preventDefault();

      const touch = e.touches[0];
      if (!touch) return;

      const { imageWidth, imageHeight } = state.viewport;
      if (imageWidth === 0 || imageHeight === 0) return;

      const deltaX = (touch.clientX - state.dragStart.clientX) / imageWidth;
      const deltaY = (touch.clientY - state.dragStart.clientY) / imageHeight;
      const initCrop = state.dragStart.crop;

      let newX = initCrop.x + deltaX;
      let newY = initCrop.y + deltaY;
      newX = Math.max(0, Math.min(1 - initCrop.width, newX));
      newY = Math.max(0, Math.min(1 - initCrop.height, newY));

      // Only act (and tick) when the crop box actually moved; when pinned at the
      // image boundary newX/newY equal the current values, so we stay silent.
      if (state.crop.x !== newX || state.crop.y !== newY) {
        state.crop.x = newX;
        state.crop.y = newY;

        const dist = Math.hypot(touch.clientX - state.lastDragClientPos.x, touch.clientY - state.lastDragClientPos.y);
        if (dist >= 8) {
          soundEngine.playTick();
          if (!prefersReducedMotion()) triggerHaptic(12);
          state.lastDragClientPos = { x: touch.clientX, y: touch.clientY };
        }

        // Only switch to Custom if crop dimensions (width/height) changed.
        // Panning the crop box (changing x/y only) should preserve the active preset.
        // Note: touch pan only changes x/y, so dims won't change here.
        renderCanvas();
      }
    }, { passive: false });

    document.addEventListener('touchend', (e) => {
      if (state.dragging !== 'crop-box') return;
      endDrag();
    });
  }

  // ---------------------------------------------------------------------------
  // Luxurious Liquid Cut & Undo Engine
  // ---------------------------------------------------------------------------

  function executeCut() {
    if (state.isCropped || !state.image || state.isAnimating) return;

    triggerHaptic(30);
    soundEngine.init();

    state.undoState = {
      image: state.image,
      naturalWidth: state.naturalWidth,
      naturalHeight: state.naturalHeight,
      crop: { ...state.crop },
      activePreset: state.activePreset,
      isCropped: false
    };

    // The source is shown at fixed 1.0x, so the region to keep equals the crop
    // box itself (in native pixel coordinates). Cutting exports this exact region
    // at full resolution — no magnification, no distortion.
    const srcX = Math.round(state.crop.x * state.naturalWidth);
    const srcY = Math.round(state.crop.y * state.naturalHeight);
    const srcW = Math.round(state.crop.width * state.naturalWidth);
    const srcH = Math.round(state.crop.height * state.naturalHeight);
    const srcCropW = srcW;
    const srcCropH = srcH;

    state.isAnimating = true;

    animateLiquidCutToBin(srcX, srcY, srcW, srcH, () => {
      const cropCanvas = document.createElement('canvas');
      cropCanvas.width = srcCropW;
      cropCanvas.height = srcCropH;
      const cropCtx = cropCanvas.getContext('2d');
      cropCtx.drawImage(state.image, srcX, srcY, srcW, srcH, 0, 0, srcCropW, srcCropH);

      const croppedImg = new Image();
      croppedImg.onload = function () {
        state.image = croppedImg;
        state.naturalWidth = srcCropW;
        state.naturalHeight = srcCropH;
        state.crop = { x: 0, y: 0, width: 1, height: 1 };
        state.isCropped = true;
        state.isAnimating = false;

        if (elements.btnUndo) elements.btnUndo.disabled = false;

        if (elements.cutBin) {
          elements.cutBin.classList.add('has-scraps');
          elements.cutBin.classList.remove('open', 'absorbing');
        }
        if (elements.binCounter) elements.binCounter.textContent = '1';

        if (elements.stageStatusText) {
          elements.stageStatusText.textContent = `Cut complete (${srcCropW} × ${srcCropH} px). Press Undo to restore.`;
        }
        if (elements.statusDot) elements.statusDot.classList.add('active');

        if (elements.thumbnailImg) elements.thumbnailImg.src = cropCanvas.toDataURL();

        updateViewportGeometry();
        renderCanvas();

        // Show Preview + Download buttons and switch the workspace into the
        // finished post-CUT presentation (hides rails/cut-bin so geometry
        // recomputes the frame to exactly the cropped result).
        showPostCutActions();
        updateViewportGeometry();
        renderCanvas();

        // The cut finished: the cropper -> result transition earns its own
        // history entry so back gestures can return to the editor (undo).
        routerPush('result', '#cut');
        router.view = 'result';
      };
      croppedImg.src = cropCanvas.toDataURL();
    });
  }

  function animateLiquidCutToBin(cropX, cropY, cropW, cropH, callback) {
    // Skip animation for users who prefer reduced motion; still give a short
    // glitch sound so the cut never feels silent, then finish immediately.
    if (prefersReducedMotion()) {
      soundEngine.playGlitch();
      if (callback) callback();
      return;
    }

    if (!elements.editorViewport || !elements.cutBin) {
      soundEngine.playGlitch();
      if (callback) callback();
      return;
    }

    const { imageX, imageY, imageWidth, imageHeight } = state.viewport;

    const bands = [];
    const clientCropX = imageX + state.crop.x * imageWidth;
    const clientCropY = imageY + state.crop.y * imageHeight;
    const clientCropW = state.crop.width * imageWidth;
    const clientCropH = state.crop.height * imageHeight;

    function getSliceDataUrl(sx, sy, sw, sh) {
      if (sw <= 0 || sh <= 0) return null;
      const c = document.createElement('canvas');
      c.width = Math.max(1, Math.round(sw * (state.naturalWidth / imageWidth)));
      c.height = Math.max(1, Math.round(sh * (state.naturalHeight / imageHeight)));
      const ctx2 = c.getContext('2d');
      const srcX = Math.round((sx - imageX) * (state.naturalWidth / imageWidth));
      const srcY = Math.round((sy - imageY) * (state.naturalHeight / imageHeight));
      ctx2.drawImage(state.image, srcX, srcY, c.width, c.height, 0, 0, c.width, c.height);
      return c.toDataURL();
    }

    if (clientCropY > imageY) {
      bands.push({ x: imageX, y: imageY, w: imageWidth, h: clientCropY - imageY });
    }
    if (clientCropY + clientCropH < imageY + imageHeight) {
      bands.push({ x: imageX, y: clientCropY + clientCropH, w: imageWidth, h: imageY + imageHeight - (clientCropY + clientCropH) });
    }
    if (clientCropX > imageX) {
      bands.push({ x: imageX, y: clientCropY, w: clientCropX - imageX, h: clientCropH });
    }
    if (clientCropX + clientCropW < imageX + imageWidth) {
      bands.push({ x: clientCropX + clientCropW, y: clientCropY, w: imageX + imageWidth - (clientCropX + clientCropW), h: clientCropH });
    }

    if (bands.length === 0) {
      if (callback) callback();
      return;
    }

    elements.cutBin.classList.add('open', 'absorbing');

    const viewportRect = elements.editorViewport.getBoundingClientRect();

    // Create animation overlay (fixed position, full viewport, no clipping)
    let overlay = null;
    function createOverlay() {
      overlay = document.createElement('div');
      overlay.id = 'cut-animation-overlay';
      overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;pointer-events:none;overflow:visible;';
      document.body.appendChild(overlay);
      return overlay;
    }
    function removeOverlay() {
      if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
        overlay = null;
      }
    }

try {
      createOverlay();

      // ---------------------------------------------------------------
      // Glitch + Dissolve animation — 750ms pure CSS.
      // Each discarded piece gets the .cut-glitch class with staggered delay.
      // No JS rAF loop, no manual transform math, no coordinate confusion.
      // ---------------------------------------------------------------

      const pieces = [];
      for (let idx = 0; idx < bands.length; idx++) {
        const band = bands[idx];
        const el = document.createElement('div');
        el.className = 'scrap-piece elevated';
        const startX = band.x + viewportRect.left;
        const startY = band.y + viewportRect.top;
        el.style.left = `${startX}px`;
        el.style.top = `${startY}px`;
        el.style.width = `${band.w}px`;
        el.style.height = `${band.h}px`;
        const sliceUrl = getSliceDataUrl(band.x, band.y, band.w, band.h);
        if (sliceUrl) {
          el.style.backgroundImage = `url(${sliceUrl})`;
        }
        overlay.appendChild(el);
        pieces.push({ el, delay: 80 + idx * 60 });
      }

      // Play premium whoosh sound (non-blocking)
      try { setTimeout(() => soundEngine.playCutWhoosh(), 80); } catch (_) {}

      let finished = 0;
      let callbackFired = false;
      const totalPieces = pieces.length;

      function fireCallback() {
        if (!callbackFired) {
          callbackFired = true;
          if (callback) callback();
        }
      }

      function cleanup() {
        if (overlay && overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
          overlay = null;
        }
      }

      // Start each piece's CSS animation with staggered delay
      pieces.forEach((pc) => {
        setTimeout(() => {
          pc.el.classList.add('cut-glitch');

          // Listen for animation end on this piece
          pc.el.addEventListener('animationend', function onAnimEnd() {
            pc.el.removeEventListener('animationend', onAnimEnd);
            finished++;
            if (finished === totalPieces) {
              fireCallback();
            }
          }, { once: true });
        }, pc.delay);
      });

      // Safety timeout: guarantee callback fires even if animation events don't fire
      const safetyTimeout = setTimeout(() => {
        fireCallback();
      }, 2000);

      // Override fireCallback to also clean up
      const originalFireCallback = fireCallback;
      fireCallback = function() {
        originalFireCallback();
        clearTimeout(safetyTimeout);
        cleanup();
      };
    } catch (e) {
      console.error('Cut animation error:', e);
      // On error, still fire callback to not block the UI
      if (!callbackFired) {
        callbackFired = true;
        if (callback) callback();
      }
      if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
        overlay = null;
      }
    }
    // NOTE: No finally block - callback and cleanup are handled by animationend/safety timeout
  }

  function executeUndo() {
    if (!state.undoState || state.isAnimating) return;

    triggerHaptic(18);
    soundEngine.init();
    soundEngine.playUndo();

    const undo = state.undoState;
    state.isAnimating = true;

    if (elements.cutBin) {
      elements.cutBin.classList.add('open');
    }

    setTimeout(() => {
      state.image = undo.image;
      state.naturalWidth = undo.naturalWidth;
      state.naturalHeight = undo.naturalHeight;
      state.crop = { ...undo.crop };
      state.activePreset = undo.activePreset;
      state.isCropped = false;
      state.undoState = null;

      if (elements.btnUndo) elements.btnUndo.disabled = true;
      if (elements.cutBin) {
        elements.cutBin.classList.remove('has-scraps', 'open', 'absorbing');
      }
      if (elements.binCounter) elements.binCounter.textContent = '0';
      if (elements.statusDot) elements.statusDot.classList.remove('active');

      if (elements.stageStatusText) {
        elements.stageStatusText.textContent = 'Restored original image. Adjust rulers and press CUT.';
      }

      if (elements.thumbnailImg) elements.thumbnailImg.src = state.objectUrl;

      // Hide post-cut actions on Undo
      hidePostCutActions();

      updateModeAndPresetUI();
      updateViewportGeometry();
      renderCanvas();
      updateSelectionPill();
      state.isAnimating = false;
    }, 400);
  }

  // ---------------------------------------------------------------------------
  // Core Image Ingestion Flow
  // ---------------------------------------------------------------------------

  function processImageFile(file) {
    if (!file) return;

    if (!isValidImageFile(file)) {
      showToast('Unsupported file type. Please upload a JPG, PNG, or WebP image.');
      return;
    }

    // Capture before state is overwritten — true only when replacing an existing image
    const wasReplacing = !!state.image;

    if (state.objectUrl) {
      URL.revokeObjectURL(state.objectUrl);
      state.objectUrl = null;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = function () {
      state.file = file;
      state.image = img;
      state.originalImage = img;
      state.fileName = file.name;
      state.fileSize = file.size;
      state.fileType = file.type ? file.type.replace('image/', '').toUpperCase() : 'IMAGE';
      state.naturalWidth = img.naturalWidth;
      state.naturalHeight = img.naturalHeight;
      state.objectUrl = objectUrl;
      state.isCropped = false;
      state.undoState = null;

      state.crop = { x: 0, y: 0, width: 1, height: 1 };
      state.activePreset = 'custom';

      // Haptic only on Replace (not on initial upload)
      if (wasReplacing) triggerHaptic(18);

      renderLoadedState();

      // Apply the locale-specific default preset (set via
      // window.REALRESIZER_DEFAULT_PRESET before app.js loads) so the crop
      // opens pre-selected to the platform ratio on a landing page. Preset is
      // applied without animation so it appears as the initial crop state.
      if ((!wasReplacing || state.activePreset === 'custom') && defaultPreset) {
        applyPreset(defaultPreset, false);
      }

      // Only an initial upload transitions home -> cropper in history;
      // replacing an in-editor image must not grow the history stack.
      if (!wasReplacing) routerPush('cropper', '#crop');
    };

    img.onerror = function () {
      URL.revokeObjectURL(objectUrl);
      showToast('Failed to load image. The file may be damaged or invalid.');
    };

    img.src = objectUrl;
  }

  function renderLoadedState() {
    if (!state.image) return;

    if (elements.metaFilename) elements.metaFilename.textContent = state.fileName;
    if (elements.metaFilesize) elements.metaFilesize.textContent = formatBytes(state.fileSize);
    if (elements.metaFormat) elements.metaFormat.textContent = state.fileType;
    if (elements.thumbnailImg) elements.thumbnailImg.src = state.objectUrl;

    // Tag non-portrait source images so mobile CSS can vertically center the
    // short (landscape / square) cropping workflow in the available content
    // area; portrait stays top-packed exactly as before.
    if (elements.loadedView && state.naturalWidth && state.naturalHeight) {
      elements.loadedView.classList.toggle('crop-wide', state.naturalWidth >= state.naturalHeight);
    }

    if (elements.btnUndo) elements.btnUndo.disabled = true;
    if (elements.cutBin) elements.cutBin.classList.remove('has-scraps', 'open', 'absorbing');
    if (elements.binCounter) elements.binCounter.textContent = '0';

    renderPresetsDrawer();
    updateModeAndPresetUI();
    closePresetsDrawer();

    // Ensure correct initial UI state: pre-cut controls visible, post-cut hidden
    hidePostCutActions();

    elements.landingView.classList.add('hidden');
    elements.loadedView.classList.remove('hidden');

    updateSelectionPill();

    requestAnimationFrame(() => {
      updateViewportGeometry();
      renderCanvas();
    });

    router.view = 'cropper';
  }

  function resetApplication() {
    // Haptic only when there is actually something loaded to clear
    const hadImage = !!state.image;

    if (state.objectUrl) {
      URL.revokeObjectURL(state.objectUrl);
    }

    state.file = null;
    state.image = null;
    state.originalImage = null;
    state.fileName = '';
    state.fileSize = 0;
    state.fileType = '';
    state.naturalWidth = 0;
    state.naturalHeight = 0;
    state.objectUrl = null;
    state.isCropped = false;
    state.undoState = null;
    state.crop = { x: 0, y: 0, width: 1, height: 1 };
    state.activePreset = 'custom';

    if (elements.fileInput) elements.fileInput.value = '';
    if (elements.thumbnailImg) elements.thumbnailImg.src = '';
    if (elements.btnUndo) elements.btnUndo.disabled = true;

    // Hide post-cut actions on Clear
    hidePostCutActions();

    closePresetsDrawer();
    elements.loadedView.classList.add('hidden');
    elements.loadedView.classList.remove('crop-wide');
    elements.landingView.classList.remove('hidden');

    if (hadImage) triggerHaptic(18);
  }

  // ---------------------------------------------------------------------------
  // Selection Percentage Pill
  // ---------------------------------------------------------------------------
  // The crop frame is a true sub-rectangle of the fixed (1.0x) source. This
  // pill reports what fraction of the total image area is currently selected:
  //   (crop.width * crop.height) / (1 * 1) * 100  ->  "Selected: 24%"
  function updateSelectionPill() {
    if (!elements.selectionValue) return;
    const pct = Math.round(state.crop.width * state.crop.height * 100);
    elements.selectionValue.textContent = `Selected: ${pct}%`;
  }

  // ---------------------------------------------------------------------------
  // Dedicated Top-Left Crop-Resize Puck
  // ---------------------------------------------------------------------------
  // A Nothing-style circular (＋) puck anchored to the CROP rectangle's top-left
  // corner. Dragging it resizes the CROP FRAME: pulling outward expands the
  // boundaries to capture more content (e.g. background edges), pulling inward
  // shrinks them. It never touches or magnifies the source-image pixels (which
  // stay fixed at 1.0x). The puck rides along in sync with crop x/y changes from
  // ruler handles, crop-box panning, or preset transitions.
  //
  // Interaction state machine:
  //   - DRAG   : state.scaleDragging = true; the crop box resizes synchronously
  //              via the shared global drag engine (state.dragging === 'corners').
  //   - RELEASE: clear scaleDragging; the frame is left exactly where the pointer
  //              last placed it (no transform, no pop, no state swap).
  // ------

  function positionScaleHandle(cropX, cropY) {
    if (!elements.scaleHandle || !state.image) return;
    // The puck is a direct child of the frame; the frame's content origin matches
    // the canvas/viewport origin (image fills the viewport cell), so cropX/cropY
    // in canvas pixels are also frame-content pixels. Pin the puck there — it
    // tracks the crop's top-left corner as the crop is moved or resized.
    const { imageWidth, imageHeight } = state.viewport;
    const cx = cropX !== undefined ? cropX : state.crop.x * imageWidth;
    const cy = cropY !== undefined ? cropY : state.crop.y * imageHeight;
    elements.scaleHandle.style.left = `${cx}px`;
    elements.scaleHandle.style.top = `${cy}px`;
  }

  function setupScaleHandle() {
    const handle = elements.scaleHandle;
    if (!handle) return;

    // Pointer down on the puck begins a top-left CROP RESIZE. The bottom-right
    // edge stays fixed while the top-left corner follows the pointer (expanding
    // outward or shrinking inward). Actual movement + release are handled by the
    // shared global drag engine in setupTwoRailInteractions (state.dragging ===
    // 'corners'), so ruler/puck will share the same clamp, snap-back, tick and
    // overrustly-expansion logic.
handle.addEventListener('pointerdown', (e) => {
        if (state.isCropped || state.isAnimating || !state.image) return;
        e.preventDefault();
        soundEngine.init();

        state.scaleDragging = true;
        state.dragging = 'corners';
        state.dragStart = {
          clientX: e.clientX,
          clientY: e.clientY,
          crop: { ...state.crop }
        };
        state.lastDragClientPos = { x: e.clientX, y: e.clientY };
        handle.classList.add('dragging');
        try { handle.setPointerCapture(e.pointerId); } catch (_) {}
        e.stopPropagation();
        soundEngine.playTick();
        triggerHaptic(6);
      });
  }

  // ---------------------------------------------------------------------------
  // Event Listeners Setup
  // ---------------------------------------------------------------------------

  function openFilePicker() {
    if (!elements.fileInput) return;
    elements.fileInput.click();
  }

  function setupEventListeners() {
    // 1. File Input
    if (elements.fileInput) {
      elements.fileInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) processImageFile(file);
      });
    }

    // 2. Dropzone
    if (elements.dropzone) {
      elements.dropzone.addEventListener('click', () => {
        soundEngine.init();
        openFilePicker();
      });

      elements.dropzone.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          soundEngine.init();
          openFilePicker();
        }
      });

      ['dragenter', 'dragover'].forEach(eventType => {
        elements.dropzone.addEventListener(eventType, (e) => {
          e.preventDefault();
          e.stopPropagation();
          elements.dropzone.classList.add('drag-active');
        });
      });

      ['dragleave', 'dragend'].forEach(eventType => {
        elements.dropzone.addEventListener(eventType, (e) => {
          e.preventDefault();
          e.stopPropagation();
          elements.dropzone.classList.remove('drag-active');
        });
      });

      elements.dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        elements.dropzone.classList.remove('drag-active');
        const droppedFiles = e.dataTransfer && e.dataTransfer.files;
        if (droppedFiles && droppedFiles.length > 0) {
          soundEngine.init();
          processImageFile(droppedFiles[0]);
        }
      });
    }

    // 3. Window Drag/Drop prevention
    window.addEventListener('dragover', (e) => e.preventDefault());
    window.addEventListener('drop', (e) => e.preventDefault());

    // 4. Clipboard Paste
    window.addEventListener('paste', (e) => {
      const items = (e.clipboardData || window.clipboardData)?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            soundEngine.init();
            processImageFile(file);
            break;
          }
        }
      }
    });

    // 5. Sound Toggle Button
    if (elements.btnSoundToggle) {
      // Sync initial UI state with session preference
      if (!soundEngine.enabled) {
        elements.btnSoundToggle.classList.remove('active');
        elements.btnSoundToggle.setAttribute('aria-pressed', 'false');
        if (elements.soundOnIcon)  elements.soundOnIcon.classList.add('hidden');
        if (elements.soundOffIcon) elements.soundOffIcon.classList.remove('hidden');
      }
      elements.btnSoundToggle.addEventListener('click', () => {
        const isSoundOn = soundEngine.toggle();
        sessionStorage.setItem('rr_sound', isSoundOn ? 'on' : 'off');
        elements.btnSoundToggle.setAttribute('aria-pressed', isSoundOn ? 'true' : 'false');
        if (isSoundOn) {
          elements.btnSoundToggle.classList.add('active');
          if (elements.soundOnIcon)  elements.soundOnIcon.classList.remove('hidden');
          if (elements.soundOffIcon) elements.soundOffIcon.classList.add('hidden');
          soundEngine.playTick();
        } else {
          elements.btnSoundToggle.classList.remove('active');
          if (elements.soundOnIcon)  elements.soundOnIcon.classList.add('hidden');
          if (elements.soundOffIcon) elements.soundOffIcon.classList.remove('hidden');
        }
      });
    }

    // 6. Two-Mode Switch & Drawer Controls
    if (elements.btnModeCustom) {
      elements.btnModeCustom.addEventListener('click', () => {
        soundEngine.init();
        state.activePreset = 'custom';
        updateModeAndPresetUI();
        closePresetsDrawer();
        renderCanvas();
        soundEngine.playTick();
      });
    }

    if (elements.btnModePresets) {
      elements.btnModePresets.addEventListener('click', (e) => {
        e.stopPropagation();
        soundEngine.init();
        togglePresetsDrawer();
        soundEngine.playTick();
      });
    }

    if (elements.btnCloseDrawer) {
      elements.btnCloseDrawer.addEventListener('click', (e) => {
        e.stopPropagation();
        closePresetsDrawer();
      });
    }

    if (elements.presetsSearch) {
      elements.presetsSearch.addEventListener('input', (e) => {
        filterPresets(e.target.value);
      });
    }

    if (elements.presetsBackdrop) {
      elements.presetsBackdrop.addEventListener('click', () => {
        closePresetsDrawer();
      });
    }

    // Dismiss drawer on outside click
    document.addEventListener('pointerdown', (e) => {
      if (elements.presetsDrawer && !elements.presetsDrawer.classList.contains('hidden')) {
        if (!elements.modeSwitchWrapper?.contains(e.target)) {
          closePresetsDrawer();
        }
      }
    });

    // Dismiss drawer / preview on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (postCut.previewModal && !postCut.previewModal.classList.contains('hidden')) {
          closePreviewModal();
        } else {
          closePresetsDrawer();
        }
      }
    });

    // 6b. Native back-gesture routing: walk screens via popstate instead of
    // leaving the site. Each branch re-renders the target screen without
    // touching history (skipHistory) — the entry being replayed IS the
    // navigation.
    window.addEventListener('popstate', (event) => {
      const navState = event.state;
      router.syncing = true;
      try {
        if (!navState || navState.view === 'home') {
          showHomeScreenUI({ skipHistory: true });
        } else if (navState.view === 'cropper') {
          closePreviewOverlay({ skipHistory: true });
          showCropperScreenUI({ skipHistory: true });
        } else if (navState.view === 'preview') {
          showPreviewOverlay({ skipHistory: true });
        } else if (navState.view === 'result') {
          showResultScreenUI({ skipHistory: true });
        }
      } finally {
        router.syncing = false;
      }
    });

    // 7. Action Buttons
    if (elements.btnCut) {
      elements.btnCut.addEventListener('click', executeCut);
    }

    if (elements.btnUndo) {
      elements.btnUndo.addEventListener('click', executeUndo);
    }

    if (elements.btnReplace) {
      elements.btnReplace.addEventListener('click', () => {
        openFilePicker();
      });
    }

    if (elements.btnClear) {
      elements.btnClear.addEventListener('click', resetApplication);
    }

    if (elements.brandLogo) {
      elements.brandLogo.addEventListener('click', (e) => {
        e.preventDefault();
        resetApplication();
      });
    }

    // 8. Toast Dismiss
    if (elements.toastClose) {
      elements.toastClose.addEventListener('click', hideToast);
    }

    // 9. Two-Rail Interactions
    setupTwoRailInteractions();

    // 10b. Post-cut panel wiring
    resolvePostCutElements();

    // Reconcile desktop post-cut utilities when the viewport crosses the desktop
    // breakpoint while a result is showing (keeps mobile/tablet dock intact).
    const postCutMql = window.matchMedia && window.matchMedia('(min-width: 901px)');
    if (postCutMql && postCutMql.addEventListener) {
      postCutMql.addEventListener('change', (e) => {
        const inPostCut = !!(elements.loadedView && elements.loadedView.classList.contains('is-post-cut'));
        if (!inPostCut) return;
        if (e.matches) {
          relocatePostCutActionsToCard();
        } else {
          restorePostCutActionsToDock();
        }
      });
    }

    if (postCut.btnPreview) {
      postCut.btnPreview.addEventListener('click', openPreviewModal);
    }

    // Prominent primary "Preview" CTA rendered directly beneath the cropped image.
    if (postCut.postCutPreviewCta) {
      postCut.postCutPreviewCta.addEventListener('click', openPreviewModal);
    }

    if (postCut.btnDownloadOpen) {
      postCut.btnDownloadOpen.addEventListener('click', () => {
        if (postCut.downloadPanel && !postCut.downloadPanel.classList.contains('hidden')) {
          closeDownloadPanel();
        } else {
          openDownloadPanel();
        }
      });
    }

    if (postCut.dlQualitySlider) {
      postCut.dlQualitySlider.addEventListener('input', () => {
        if (postCut.dlQualityVal) postCut.dlQualityVal.textContent = postCut.dlQualitySlider.value + '%';
      });
    }

    document.querySelectorAll('input[name="dl-format"]').forEach(r => {
      r.addEventListener('change', syncDownloadFormat);
    });
    syncDownloadFormat(); // set initial state

    const btnExec = document.getElementById('btn-execute-download');
    if (btnExec) btnExec.addEventListener('click', executeDownload);

    const btnDlClose = document.getElementById('btn-download-close');
    if (btnDlClose) btnDlClose.addEventListener('click', closeDownloadPanel);

    const btnPreviewClose = document.getElementById('btn-preview-close');
    if (btnPreviewClose) btnPreviewClose.addEventListener('click', closePreviewModal);

    // Backdrop click closes preview
    if (postCut.previewModal) {
      postCut.previewModal.addEventListener('pointerdown', (e) => {
        if (e.target === postCut.previewModal) closePreviewModal();
      });
    }

    // Device dropdown
    if (postCut.previewDeviceSelect) {
      postCut.previewDeviceSelect.addEventListener('change', () => {
        previewState.device = postCut.previewDeviceSelect.value;
        renderMockup();
      });
    }

    // Mobile / Desktop device switch (vertical full-screen presets)
    if (postCut.previewDeviceSwitch) {
      postCut.previewDeviceSwitch.querySelectorAll('.preview-device-btn').forEach((b) => {
        b.addEventListener('click', () => {
          previewState.device = b.dataset.device || 'mobile';
          postCut.previewDeviceSwitch.querySelectorAll('.preview-device-btn').forEach((x) => {
            x.classList.toggle('active', x === b);
          });
          renderMockup();
        });
      });
    }

    // Before/After buttons
    if (postCut.btnBaAfter) {
      postCut.btnBaAfter.addEventListener('click', () => {
        previewState.ba = 'after';
        syncBaButtons();
        renderMockup();
      });
    }
    if (postCut.btnBaBefore) {
      postCut.btnBaBefore.addEventListener('click', () => {
        previewState.ba = 'before';
        syncBaButtons();
        renderMockup();
      });
    }

    // 10. Resize Observer
    const onViewportResize = () => {
      if (state.image && !elements.loadedView.classList.contains('hidden')) {
        if (state.isCropped && elements.postCutResult && !elements.postCutResult.classList.contains('hidden')) {
          // Re-fit the finished result to the new viewport (never the raw pixels).
          showPostCutResult();
          return;
        }
        updateViewportGeometry();
        renderCanvas();
      }
    };

    if (window.ResizeObserver && elements.editorViewport) {
      const resizeObserver = new ResizeObserver(onViewportResize);
      resizeObserver.observe(elements.editorViewport);
    } else {
      window.addEventListener('resize', onViewportResize);
    }
  }

  // ---------------------------------------------------------------------------
  // Theme System
  // ---------------------------------------------------------------------------

  const THEME_KEY = 'rr_theme';

  function initTheme() {
    const btn       = document.getElementById('btn-theme-toggle');
    const darkIcon  = btn && btn.querySelector('.theme-dark-icon');
    const lightIcon = btn && btn.querySelector('.theme-light-icon');

    let saved = 'dark';
    try { saved = localStorage.getItem(THEME_KEY) || 'dark'; } catch (_) {}

    function applyTheme(theme) {
      const isLight = theme === 'light';
      if (isLight) {
        document.documentElement.setAttribute('data-theme', 'light');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      if (btn) {
        btn.setAttribute('aria-pressed', String(isLight));
        const label = isLight ? 'Switch to dark theme' : 'Switch to light theme';
        btn.title = label;
        btn.setAttribute('aria-label', label);
        btn.classList.toggle('active', isLight);
        if (darkIcon)  darkIcon.classList.toggle('hidden', isLight);
        if (lightIcon) lightIcon.classList.toggle('hidden', !isLight);
      }
    }

    applyTheme(saved);

    if (!btn) return;

    function persistTheme(theme) {
      try { localStorage.setItem(THEME_KEY, theme); } catch (_) {}
    }

    // Authoritative requested theme. Tracked independently of the committed
    // <html> data-theme so a rapid second click toggles the target back
    // immediately, even while the previous transition is still in flight.
    let currentTheme = saved;

    btn.addEventListener('click', () => {
      // Toggle the REQUESTED target (not the committed DOM theme), so rapid
      // clicks flip dark <-> light without waiting for the prior transition.
      const next = currentTheme === 'light' ? 'dark' : 'light';
      currentTheme = next;

      // Exact CENTER of the theme toggle button — the mask's origin.
      const rect = btn.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      // Oversized end radius: distance to the furthest viewport corner via
      // Pythagorean theorem, scaled 2.5x. The clip-path circle therefore
      // always expands well past all four screen edges in a single continuous
      // reveal — no mid-screen 30% fill or corner clipping, on mobile
      // viewports and hi-DPI desktop corners alike.
      const endRadius =
        Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y)) * 2.5;

      const commit = () => {
        applyTheme(next);
        persistTheme(next);
      };

      // Honour reduced-motion: instant swap, no animated wipe.
      if (prefersReducedMotion()) {
        commit();
        return;
      }

      // Fallback for browsers without the View Transitions API.
      if (!document.startViewTransition) {
        commit();
        return;
      }

      // Live masked theme reveal. startViewTransition() swaps the DOM theme
      // and captures both states with NO overlay divs. The new root snapshot
      // is a pure mask: a clip-path circle grown from the button center (see
      // style.css ::view-transition overrides), so the updated theme reveals
      // live underneath while everything outside the circle keeps the
      // previous theme. Rapid re-clicks skip the running transition and start
      // the reverse flip immediately.
      const transition = document.startViewTransition(commit);

      transition.ready
        .then(() => {
          try {
            // Animate the mask on the live new-state layer. The origin and
            // radius map 1:1 to viewport pixels; curve is fast-out ease-in-out.
            document.documentElement.animate(
              {
                clipPath: [
                  `circle(0px at ${x}px ${y}px)`,
                  `circle(${endRadius}px at ${x}px ${y}px)`
                ]
              },
              {
                duration: 450,
                easing: 'ease-in-out',
                pseudoElement: '::view-transition-new(root)'
              }
            );
          } catch (e) {
            // A rapid re-click can skip the transition before the pseudo
            // element materialises — the theme has already swapped, so there
            // is nothing left to mask.
          }
        })
        .catch(() => {});

      // A rapid second toggle skips this transition; swallow its rejection so
      // nothing funnels up as an unhandled promise error.
      transition.finished.catch(() => {});
    });
  }

  function initFullscreen() {
    const btn = elements.btnFullscreen;
    if (!btn) return;

    const enterIcon = btn.querySelector('.fullscreen-enter-icon');
    const exitIcon = btn.querySelector('.fullscreen-exit-icon');

    function syncFullscreenUI() {
      const isFullscreen = !!document.fullscreenElement;
      btn.setAttribute('aria-pressed', String(isFullscreen));
      btn.title = isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen';
      btn.setAttribute('aria-label', btn.title);
      if (enterIcon) enterIcon.classList.toggle('hidden', isFullscreen);
      if (exitIcon) exitIcon.classList.toggle('hidden', !isFullscreen);
      if (state.image && !elements.loadedView.classList.contains('hidden')) {
        requestAnimationFrame(() => {
          updateViewportGeometry();
          renderCanvas();
        });
      }
    }

    btn.addEventListener('click', async () => {
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        } else {
          await document.documentElement.requestFullscreen();
        }
      } catch (_) {
        showToast('Fullscreen is not available in this browser.');
      }
    });

    document.addEventListener('fullscreenchange', syncFullscreenUI);
    syncFullscreenUI();
  }

  // ---------------------------------------------------------------------------
  // Initialization
  // ---------------------------------------------------------------------------
  function init() {
    initTheme();
    initFullscreen();
    // Honour a per-page default preset, if one was declared before app.js.
    if (typeof window.REALRESIZER_DEFAULT_PRESET === 'string') {
      const presetId = window.REALRESIZER_DEFAULT_PRESET;
      if (PRESET_REGISTRY.some(p => p.id === presetId)) {
        defaultPreset = presetId;
      }
    }
    renderPresetsDrawer();
    setupEventListeners();
    setupScaleHandle();
    // Note: resolvePostCutElements() is called inside setupEventListeners (step 10b)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose state, presets registry and router for debugging/testing
  window.__REALRESIZER_STATE__ = state;
  window.__REALRESIZER_PRESETS__ = PRESET_REGISTRY;
  window.__REALRESIZER_ROUTER__ = router;
})();
