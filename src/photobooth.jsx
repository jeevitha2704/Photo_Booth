import { useState, useRef, useEffect } from "react";

// ─── FILTERS ──────────────────────────────────────────────────────────────────
const FILTERS = [
  { id: "none",   label: "Original", css: "none" },
  { id: "bw",     label: "B&W",      css: "grayscale(100%)" },
  { id: "sepia",  label: "Sepia",    css: "sepia(90%)" },
  { id: "vivid",  label: "Vivid",    css: "saturate(200%) contrast(110%)" },
  { id: "cool",   label: "Cool",     css: "hue-rotate(40deg) saturate(120%)" },
  { id: "warm",   label: "Warm",     css: "sepia(40%) saturate(150%) brightness(105%)" },
  { id: "dreamy", label: "Dreamy",   css: "contrast(80%) brightness(110%) saturate(130%)" },
  { id: "noir",   label: "Noir",     css: "grayscale(100%) contrast(150%) brightness(80%)" },
];

const STICKERS = ["🌟","💖","🦋","🌈","✨","🎀","🌸","🔥","😎","👑","🎉","💫","🌙","⚡","🍒","🎸","🐱","🌺","🍓","🎊"];

// ─── STRIP LAYOUTS ────────────────────────────────────────────────────────────
const STRIP_LAYOUTS = [
  { id: "classic", label: "Classic",  icon: "▪▪▪▪", shots: 4, arrangement: "vertical",   description: "4 vertical" },
  { id: "duo",     label: "Duo",      icon: "◼◼",   shots: 2, arrangement: "vertical",   description: "2 large" },
  { id: "grid",    label: "Grid 2x2", icon: "⊞",    shots: 4, arrangement: "grid2x2",    description: "2x2 grid" },
  { id: "triple",  label: "Triple",   icon: "▪▪▪",  shots: 3, arrangement: "vertical",   description: "3 vertical" },
  { id: "wide",    label: "Wide",     icon: "━━━",  shots: 3, arrangement: "horizontal", description: "3 horizontal" },
];

// ─── 10 STRIP DESIGNS ─────────────────────────────────────────────────────────
const STRIP_DESIGNS = [
  {
    id: "classic_film", label: "Film Strip", preview: "🎞️",
    bg: "#1a1a1a", textColor: "#f0e6d3", borderColor: "#f0e6d3", borderWidth: 0,
    photoBorder: 0, photoBorderColor: "none", rounded: 0, padding: 14,
    headerText: "INSTABOOTH", footerStyle: "date", filmHoles: true,
    gradient: null, photoGap: 10, shadow: false, polaroidBottom: 0, holoBorder: false,
  },
  {
    id: "vintage_cream", label: "Vintage", preview: "🤎",
    bg: "#fdf6e3", textColor: "#5c4033", borderColor: "#c8a87a", borderWidth: 8,
    photoBorder: 3, photoBorderColor: "#c8a87a", rounded: 4, padding: 20,
    headerText: "memories", footerStyle: "date", filmHoles: false,
    gradient: null, photoGap: 14, shadow: true, polaroidBottom: 0, holoBorder: false,
  },
  {
    id: "neon_night", label: "Neon Night", preview: "💜",
    bg: "#0d0d1a", textColor: "#e040fb", borderColor: "#e040fb", borderWidth: 3,
    photoBorder: 2, photoBorderColor: "#00e5ff", rounded: 8, padding: 16,
    headerText: "NEON BOOTH", footerStyle: "date", filmHoles: false,
    gradient: "#0d0d1a,#1a0d2e", photoGap: 12, shadow: true, polaroidBottom: 0, holoBorder: false,
  },
  {
    id: "pastel_dream", label: "Pastel", preview: "🌸",
    bg: "#fff0f6", textColor: "#c2185b", borderColor: "#f48fb1", borderWidth: 6,
    photoBorder: 4, photoBorderColor: "#fff", rounded: 16, padding: 18,
    headerText: "photo booth", footerStyle: "hearts", filmHoles: false,
    gradient: "#fff0f6,#fce4ec", photoGap: 16, shadow: true, polaroidBottom: 0, holoBorder: false,
  },
  {
    id: "bold_red", label: "Bold Red", preview: "❤️",
    bg: "#c62828", textColor: "#ffffff", borderColor: "#ffcdd2", borderWidth: 0,
    photoBorder: 4, photoBorderColor: "#ffffff", rounded: 0, padding: 16,
    headerText: "PHOTO STRIP", footerStyle: "date", filmHoles: false,
    gradient: null, photoGap: 8, shadow: false, polaroidBottom: 0, holoBorder: false,
  },
  {
    id: "forest_green", label: "Forest", preview: "🌿",
    bg: "#1b5e20", textColor: "#c8e6c9", borderColor: "#4caf50", borderWidth: 5,
    photoBorder: 3, photoBorderColor: "#a5d6a7", rounded: 6, padding: 18,
    headerText: "booth", footerStyle: "date", filmHoles: false,
    gradient: "#1b5e20,#2e7d32", photoGap: 12, shadow: true, polaroidBottom: 0, holoBorder: false,
  },
  {
    id: "monochrome", label: "Mono", preview: "⬜",
    bg: "#ffffff", textColor: "#111111", borderColor: "#111111", borderWidth: 4,
    photoBorder: 2, photoBorderColor: "#111", rounded: 0, padding: 20,
    headerText: "PHOTO", footerStyle: "minimal", filmHoles: false,
    gradient: null, photoGap: 8, shadow: false, polaroidBottom: 0, holoBorder: false,
  },
  {
    id: "golden_hour", label: "Golden", preview: "✨",
    bg: "#1a1200", textColor: "#ffd54f", borderColor: "#ffd54f", borderWidth: 4,
    photoBorder: 3, photoBorderColor: "#ffd54f", rounded: 4, padding: 18,
    headerText: "GOLDEN HOUR", footerStyle: "date", filmHoles: false,
    gradient: "#1a1200,#2c1f00", photoGap: 12, shadow: true, polaroidBottom: 0, holoBorder: false,
  },
  {
    id: "polaroid", label: "Polaroid", preview: "🟦",
    bg: "#f5f5f0", textColor: "#333", borderColor: "#ddd", borderWidth: 0,
    photoBorder: 0, photoBorderColor: "none", rounded: 2, padding: 12,
    headerText: "", footerStyle: "polaroid", filmHoles: false,
    gradient: null, photoGap: 24, shadow: true, polaroidBottom: 44, holoBorder: false,
  },
  {
    id: "holographic", label: "Holo", preview: "🌈",
    bg: "#0a0a0a", textColor: "#fff", borderColor: "transparent", borderWidth: 3,
    photoBorder: 3, photoBorderColor: "#ff6ec7", rounded: 10, padding: 16,
    headerText: "HOLO BOOTH", footerStyle: "date", filmHoles: false,
    gradient: "#0a0a0a,#0d0d20", photoGap: 12, shadow: true, polaroidBottom: 0, holoBorder: true,
  },
];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Photobooth() {
  const videoRef  = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [phase, setPhase]                   = useState("idle");
  const [filter, setFilter]                 = useState("none");
  const [countdown, setCountdown]           = useState(null);
  const [photos, setPhotos]                 = useState([]);
  const [currentShot, setCurrentShot]       = useState(0);
  const [stripLayout, setStripLayout]       = useState(STRIP_LAYOUTS[0]);
  const [stripDesign, setStripDesign]       = useState(STRIP_DESIGNS[0]);
  const [stripDataUrl, setStripDataUrl]     = useState(null);
  const [activeStickers, setActiveStickers] = useState([]);
  const [selectedStickerId, setSelectedStickerId] = useState(null);
  const [dragging, setDragging]             = useState(null);
  const [dragOffset, setDragOffset]         = useState({ x: 0, y: 0 });
  const [cameraError, setCameraError]       = useState(null);
  const [isMirrored, setIsMirrored]         = useState(true);
  const [stripOverlayText, setStripOverlayText] = useState("");
  const [showTextInput, setShowTextInput]   = useState(false);
  const [shareUrl, setShareUrl]             = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [flash, setFlash]                   = useState(false);
  const [isBuilding, setIsBuilding]         = useState(false);

  // ── Camera ────────────────────────────────────────────────────────────────────
  useEffect(() => { startCamera(); return () => stopCamera(); }, []);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(() => {});
        };
      }
      setCameraError(null);
    } catch {
      setCameraError("Camera access denied. Please allow camera permissions and refresh.");
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach(t => t.stop());
  }

  // ── Session / Capture ─────────────────────────────────────────────────────────
  function startSession() {
    setPhotos([]); setCurrentShot(0); setStripDataUrl(null);
    setShareUrl(null); setActiveStickers([]); setStripOverlayText("");
    setSelectedStickerId(null); setPhase("countdown"); beginCountdown(0, []);
  }

  function beginCountdown(shotIndex, existing) {
    let c = 3; setCountdown(c);
    const iv = setInterval(() => {
      c--;
      if (c > 0) { setCountdown(c); }
      else { clearInterval(iv); setCountdown(null); capturePhoto(shotIndex, existing); }
    }, 1000);
  }

  function capturePhoto(shotIndex, existing) {
    const video = videoRef.current, canvas = canvasRef.current;
    if (!video || !canvas) return;
    const W = video.videoWidth || 640, H = video.videoHeight || 480;
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (isMirrored) { ctx.translate(W, 0); ctx.scale(-1, 1); }
    ctx.filter = FILTERS.find(f => f.id === filter)?.css || "none";
    ctx.drawImage(video, 0, 0, W, H);
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.filter = "none";
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    const newPhotos = [...existing, dataUrl];
    setFlash(true); setTimeout(() => setFlash(false), 180);
    if (newPhotos.length < stripLayout.shots) {
      setPhotos(newPhotos); setCurrentShot(shotIndex + 1);
      setTimeout(() => beginCountdown(shotIndex + 1, newPhotos), 800);
    } else {
      setPhotos(newPhotos); setCurrentShot(stripLayout.shots); setPhase("captured");
    }
  }

  // ── Build Strip ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase === "strip" && photos.length > 0) buildStrip();
  }, [phase, photos, stripDesign, stripLayout, activeStickers, stripOverlayText]);

  async function buildStrip() {
    setIsBuilding(true);
    const d = stripDesign;
    const layout = stripLayout;
    const PAD = d.padding;
    const GAP = d.photoGap;
    const PB  = d.photoBorder;
    const PHOTO_W = 340;
    const PHOTO_H = Math.round(PHOTO_W * 9 / 16);
    const FILM_H  = d.filmHoles ? 20 : 0;
    const HEAD_H  = d.headerText ? 44 : 12;
    const FOOT_H  = 50;
    const POLBOT  = d.polaroidBottom || 0;

    const c = document.createElement("canvas");
    const ctx = c.getContext("2d");
    const shots = photos.slice(0, layout.shots);

    const photoSlotH = PHOTO_H + PB * 2 + POLBOT;
    const photoSlotW = PHOTO_W + PB * 2;

    if (layout.arrangement === "vertical") {
      c.width  = photoSlotW + PAD * 2;
      c.height = FILM_H + HEAD_H + shots.length * photoSlotH + (shots.length - 1) * GAP + PAD * 2 + FOOT_H;
    } else if (layout.arrangement === "horizontal") {
      c.width  = shots.length * photoSlotW + (shots.length - 1) * GAP + PAD * 2;
      c.height = FILM_H + HEAD_H + photoSlotH + PAD * 2 + FOOT_H;
    } else {
      const cols = 2, rows = Math.ceil(shots.length / cols);
      c.width  = cols * photoSlotW + (cols - 1) * GAP + PAD * 2;
      c.height = FILM_H + HEAD_H + rows * photoSlotH + (rows - 1) * GAP + PAD * 2 + FOOT_H;
    }

    // Background
    if (d.gradient) {
      const parts = d.gradient.split(",");
      const grd = ctx.createLinearGradient(0, 0, 0, c.height);
      grd.addColorStop(0, parts[0]); grd.addColorStop(1, parts[1]);
      ctx.fillStyle = grd;
    } else {
      ctx.fillStyle = d.bg;
    }
    ctx.fillRect(0, 0, c.width, c.height);

    // Outer border
    if (d.holoBorder) {
      const holoGrd = ctx.createLinearGradient(0, 0, c.width, c.height);
      ["#ff6ec7","#00e5ff","#69ff47","#ffd54f","#ff6ec7"].forEach((col, i) =>
        holoGrd.addColorStop(i / 4, col)
      );
      ctx.strokeStyle = holoGrd; ctx.lineWidth = d.borderWidth;
      ctx.strokeRect(d.borderWidth / 2, d.borderWidth / 2, c.width - d.borderWidth, c.height - d.borderWidth);
    } else if (d.borderWidth > 0) {
      ctx.strokeStyle = d.borderColor; ctx.lineWidth = d.borderWidth;
      ctx.strokeRect(d.borderWidth / 2, d.borderWidth / 2, c.width - d.borderWidth, c.height - d.borderWidth);
    }

    // Film holes
    if (d.filmHoles) {
      ctx.fillStyle = "#222";
      ctx.fillRect(0, 0, c.width, FILM_H);
      for (let x = 10; x < c.width - 10; x += 28) {
        ctx.fillStyle = "#0a0a0a";
        ctx.beginPath();
        ctx.roundRect(x, 4, 14, 12, 3);
        ctx.fill();
      }
    }

    // Header
    if (d.headerText) {
      ctx.fillStyle = d.textColor;
      ctx.textAlign = "center";
      ctx.font = `bold 17px 'Special Elite', 'Courier New', monospace`;
      ctx.fillText(d.headerText, c.width / 2, FILM_H + HEAD_H - 10);
    }

    const topOff = FILM_H + HEAD_H;

    const drawPhoto = async (img, x, y) => {
      if (d.shadow) {
        ctx.shadowColor = "rgba(0,0,0,0.4)"; ctx.shadowBlur = 14; ctx.shadowOffsetY = 5;
      }
      if (PB > 0) {
        if (d.holoBorder) {
          const g2 = ctx.createLinearGradient(x - PB, y - PB, x + PHOTO_W + PB, y + PHOTO_H + PB);
          ["#ff6ec7","#00e5ff","#69ff47","#ffd54f"].forEach((col, i) => g2.addColorStop(i / 3, col));
          ctx.strokeStyle = g2;
        } else {
          ctx.strokeStyle = d.photoBorderColor;
        }
        ctx.lineWidth = PB;
        ctx.strokeRect(x - PB / 2, y - PB / 2, PHOTO_W + PB, PHOTO_H + PB);
      }
      if (d.rounded > 0) {
        ctx.save(); ctx.beginPath(); ctx.roundRect(x, y, PHOTO_W, PHOTO_H, d.rounded); ctx.clip();
      }
      ctx.drawImage(img, x, y, PHOTO_W, PHOTO_H);
      ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
      if (d.rounded > 0) ctx.restore();
      if (POLBOT > 0) {
        ctx.fillStyle = "#f5f5f0";
        ctx.fillRect(x, y + PHOTO_H, PHOTO_W, POLBOT);
      }
    };

    if (layout.arrangement === "vertical") {
      for (let i = 0; i < shots.length; i++) {
        const img = await loadImage(shots[i]);
        await drawPhoto(img, PAD, topOff + PAD + i * (photoSlotH + GAP));
      }
    } else if (layout.arrangement === "horizontal") {
      for (let i = 0; i < shots.length; i++) {
        const img = await loadImage(shots[i]);
        await drawPhoto(img, PAD + i * (photoSlotW + GAP), topOff + PAD);
      }
    } else {
      const cols = 2;
      for (let i = 0; i < shots.length; i++) {
        const img = await loadImage(shots[i]);
        const col = i % cols, row = Math.floor(i / cols);
        await drawPhoto(img, PAD + col * (photoSlotW + GAP), topOff + PAD + row * (photoSlotH + GAP));
      }
    }

    // Footer
    const footerY = c.height - FOOT_H / 2 + 8;
    ctx.textAlign = "center";
    const dateStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const caption = stripOverlayText || dateStr;
    if (d.footerStyle === "hearts") {
      ctx.fillStyle = d.textColor; ctx.font = "15px serif";
      ctx.fillText(`♥  ${caption}  ♥`, c.width / 2, footerY);
    } else if (d.footerStyle === "polaroid") {
      ctx.fillStyle = "#999"; ctx.font = "italic 13px Georgia,serif";
      ctx.fillText(caption, c.width / 2, footerY);
    } else if (d.footerStyle === "minimal") {
      ctx.fillStyle = d.textColor + "77"; ctx.font = "11px monospace";
      ctx.fillText(caption, c.width / 2, footerY);
    } else {
      ctx.fillStyle = d.textColor + "cc";
      ctx.font = `bold 13px 'Special Elite','Courier New',monospace`;
      ctx.fillText(`\uD83D\uDCF8 ${caption}`, c.width / 2, footerY);
    }

    // Stickers on canvas
    for (const s of activeStickers) {
      ctx.font = `${s.size}px serif`;
      ctx.fillText(s.emoji, s.x, s.y);
    }

    setStripDataUrl(c.toDataURL("image/png"));
    setIsBuilding(false);
  }

  function loadImage(src) {
    return new Promise((res, rej) => {
      const img = new Image();
      img.onload = () => res(img); img.onerror = rej; img.src = src;
    });
  }

  // ── Sticker management ────────────────────────────────────────────────────────
  function addSticker(emoji) {
    const id = Date.now();
    setActiveStickers(prev => [...prev, {
      id, emoji,
      x: 60 + Math.random() * 220,
      y: 80 + Math.random() * 200,
      size: 48,
    }]);
    setSelectedStickerId(id);
  }

  function removeSticker(id) {
    setActiveStickers(prev => prev.filter(s => s.id !== id));
    if (selectedStickerId === id) setSelectedStickerId(null);
  }

  function resizeSticker(id, delta) {
    setActiveStickers(prev =>
      prev.map(s => s.id === id ? { ...s, size: Math.max(20, Math.min(120, s.size + delta)) } : s)
    );
  }

  function handleStickerMouseDown(e, id) {
    e.preventDefault(); e.stopPropagation();
    setSelectedStickerId(id); setDragging(id);
    const strip = document.getElementById("strip-preview");
    if (!strip) return;
    const rect = strip.getBoundingClientRect();
    const s = activeStickers.find(st => st.id === id);
    if (s) setDragOffset({ x: e.clientX - rect.left - s.x, y: e.clientY - rect.top - s.y + s.size });
  }

  useEffect(() => {
    function onMove(e) {
      if (!dragging) return;
      const strip = document.getElementById("strip-preview");
      if (!strip) return;
      const rect = strip.getBoundingClientRect();
      const sSize = activeStickers.find(s => s.id === dragging)?.size || 48;
      setActiveStickers(prev => prev.map(s =>
        s.id === dragging
          ? { ...s, x: e.clientX - rect.left - dragOffset.x, y: e.clientY - rect.top - dragOffset.y + sSize }
          : s
      ));
    }
    function onUp() { setDragging(null); }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [dragging, dragOffset, activeStickers]);

  // ── Download / Share ──────────────────────────────────────────────────────────
  function downloadStrip() {
    if (!stripDataUrl) return;
    const a = document.createElement("a");
    a.href = stripDataUrl; a.download = `photobooth-${Date.now()}.png`; a.click();
  }

  function handleShare() {
    setShareUrl(`https://photobooth.app/strip/${Math.random().toString(36).slice(2, 10)}`);
    setShowShareModal(true);
  }

  // ── Render ────────────────────────────────────────────────────────────────────
  const currentFilterCss = FILTERS.find(f => f.id === filter)?.css || "none";

  return (
    <div style={S.root}>
      <div style={S.bgGrain} />

      {/* HEADER */}
      <header style={S.header}>
        <div style={S.filmHoles}>{[...Array(9)].map((_,i)=><div key={i} style={S.filmHole}/>)}</div>
        <h1 style={S.title}>INSTABOOTH</h1>
        <p style={S.subtitle}>✦ classic photobooth experience ✦</p>
        <div style={S.filmHoles}>{[...Array(9)].map((_,i)=><div key={i} style={S.filmHole}/>)}</div>
      </header>

      <main style={S.main}>

        {/* ── LEFT PANEL ── */}
        <div style={S.leftPanel}>

          {/* Camera viewport */}
          <div style={S.viewport}>
            <div style={S.corner("tl")}/><div style={S.corner("tr")}/>
            <div style={S.corner("bl")}/><div style={S.corner("br")}/>
            {flash && <div style={S.flash}/>}
            {cameraError
              ? <div style={S.camErr}><span style={{fontSize:48}}>📷</span><p style={{color:"#e74c3c",marginTop:12,textAlign:"center"}}>{cameraError}</p></div>
              : <video ref={videoRef} autoPlay playsInline muted style={{...S.video, transform: isMirrored?"scaleX(-1)":"none", filter: currentFilterCss}}/>
            }
            {countdown !== null && (
              <div style={S.cdOverlay}><div style={S.cdNum}>{countdown}</div></div>
            )}
            {phase === "countdown" && (
              <div style={S.shotDots}>
                {[...Array(stripLayout.shots)].map((_,i)=>(
                  <div key={i} style={{...S.dot, background: i<currentShot?"#e74c3c": i===currentShot?"#f39c12":"#ffffff44"}}/>
                ))}
              </div>
            )}
            <button style={S.mirrorBtn} onClick={() => setIsMirrored(m=>!m)} title="Mirror">⇄</button>
          </div>

          {/* Filters */}
          <div style={S.card}>
            <p style={S.label}>FILTER</p>
            <div style={S.filterRow}>
              {FILTERS.map(f => (
                <button key={f.id} style={{...S.filterBtn, outline: filter===f.id?"2px solid #e74c3c":"2px solid transparent"}} onClick={() => setFilter(f.id)}>
                  <div style={S.filterThumb}>
                    <video autoPlay playsInline muted
                      ref={el => { if (el && streamRef.current) el.srcObject = streamRef.current; }}
                      style={{width:44,height:44,objectFit:"cover",transform:isMirrored?"scaleX(-1)":"none",filter:f.css}}
                    />
                  </div>
                  <span style={S.filterLabel}>{f.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Layout picker */}
          <div style={S.card}>
            <p style={S.label}>LAYOUT</p>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {STRIP_LAYOUTS.map(l => (
                <button key={l.id} style={{
                  ...S.layoutBtn,
                  background: stripLayout.id===l.id?"#e74c3c":"#1a1a1a",
                  color: stripLayout.id===l.id?"#fff":"#aaa",
                }} onClick={() => setStripLayout(l)} title={l.description}>
                  <span style={{fontSize:10,letterSpacing:1}}>{l.icon}</span>
                  <span style={{fontSize:9,marginTop:2}}>{l.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Strip Design picker — 10 options */}
          <div style={S.card}>
            <p style={S.label}>STRIP DESIGN  <span style={{color:"#444",fontSize:9}}>({STRIP_DESIGNS.length} STYLES)</span></p>
            <div style={S.designGrid}>
              {STRIP_DESIGNS.map(d => (
                <button key={d.id} onClick={() => setStripDesign(d)} title={d.label} style={{
                  ...S.designBtn,
                  background: d.bg,
                  border: stripDesign.id===d.id ? "2px solid #e74c3c" : "2px solid #2a2a2a",
                  boxShadow: stripDesign.id===d.id ? "0 0 0 2px #e74c3c55" : "none",
                }}>
                  <span style={{fontSize:20}}>{d.preview}</span>
                  <span style={{fontSize:8, color: d.textColor, marginTop:3, fontFamily:"monospace", textAlign:"center", lineHeight:1.2, wordBreak:"break-word", maxWidth:52}}>{d.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{display:"flex",gap:10}}>
            {phase !== "countdown" && (
              <button style={S.shootBtn} onClick={startSession} disabled={!!cameraError}>
                {phase === "idle" ? "📸  START BOOTH" : "🔄  NEW SESSION"}
              </button>
            )}
            {phase === "captured" && (
              <button style={{...S.shootBtn, background:"#27ae60", boxShadow:"0 4px 0 #145a2e"}} onClick={() => setPhase("strip")}>
                🎞️  BUILD STRIP
              </button>
            )}
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={S.rightPanel}>

          {/* Idle / Countdown state */}
          {(phase === "idle" || phase === "countdown") && (
            <div style={S.placeholder}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,marginBottom:16}}>
                {["🎞","📸","✨","🎀","🌟"].map((e,i)=><span key={i} style={{fontSize:28,opacity:0.4+i*0.1}}>{e}</span>)}
              </div>
              <p style={S.placeholderText}>
                {phase==="idle" ? "Choose layout & design, then click 'START BOOTH'" : `Shot ${currentShot+1} of ${stripLayout.shots}…`}
              </p>
              {phase === "countdown" && (
                <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center",marginTop:16}}>
                  {[...Array(stripLayout.shots)].map((_,i)=>(
                    <div key={i} style={{...S.thumbSlot, background: photos[i]?"transparent":"#1a1a1a"}}>
                      {photos[i] ? <img src={photos[i]} style={S.thumbImg} alt=""/> : <span style={{color:"#333",fontSize:20}}>📷</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Captured state */}
          {phase === "captured" && (
            <div style={S.card}>
              <p style={S.panelTitle}>All {stripLayout.shots} shots taken!</p>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center",marginTop:10}}>
                {photos.map((p,i)=>(
                  <div key={i} style={S.thumbSlot}>
                    <img src={p} style={S.thumbImg} alt={`Shot ${i+1}`}/>
                    <span style={S.thumbLabel}>#{i+1}</span>
                  </div>
                ))}
              </div>
              <p style={{color:"#555",fontSize:12,marginTop:12,textAlign:"center"}}>Click BUILD STRIP to continue, or NEW SESSION to retake.</p>
            </div>
          )}

          {/* Strip editor */}
          {phase === "strip" && (
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <p style={S.panelTitle}>🎞️ Your Photo Strip</p>

              {/* Sticker picker */}
              <div style={S.card}>
                <p style={S.label}>ADD STICKERS</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                  {STICKERS.map(e => (
                    <button key={e} style={S.stickerPickBtn} onClick={() => addSticker(e)}>{e}</button>
                  ))}
                </div>
              </div>

              {/* Active sticker controls */}
              {activeStickers.length > 0 && (
                <div style={S.card}>
                  <p style={S.label}>STICKER CONTROLS  <span style={{color:"#444",fontSize:9}}>CLICK TO SELECT · DRAG TO MOVE</span></p>
                  <div style={{display:"flex",flexDirection:"column",gap:6}}>
                    {activeStickers.map(s => (
                      <div key={s.id}
                        onClick={() => setSelectedStickerId(s.id)}
                        style={{
                          ...S.stickerRow,
                          background: selectedStickerId===s.id ? "#1e0a0a" : "#181818",
                          border: selectedStickerId===s.id ? "1px solid #e74c3c" : "1px solid #252525",
                        }}>
                        <span style={{fontSize:22, minWidth:30}}>{s.emoji}</span>
                        <span style={{color:"#666",fontSize:11,flex:1}}>size: {s.size}px</span>
                        {/* Size controls */}
                        <button style={S.sizeBtn} onClick={e => { e.stopPropagation(); resizeSticker(s.id, -8); }} title="Shrink">−</button>
                        <div style={S.sizeBadge}>{s.size}</div>
                        <button style={S.sizeBtn} onClick={e => { e.stopPropagation(); resizeSticker(s.id, +8); }} title="Grow">+</button>
                        {/* Remove */}
                        <button style={S.removeBtn} onClick={e => { e.stopPropagation(); removeSticker(s.id); }} title="Remove sticker">🗑</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Caption */}
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <button style={S.smallBtn} onClick={() => setShowTextInput(v=>!v)}>
                  ✏️ {showTextInput ? "Hide Caption" : "Add Caption"}
                </button>
                {showTextInput && (
                  <input style={S.captionInput} placeholder="Add a caption…"
                    value={stripOverlayText} onChange={e => setStripOverlayText(e.target.value)} maxLength={40}/>
                )}
              </div>

              {/* Strip preview area */}
              <div id="strip-preview" style={S.previewBox} onClick={() => setSelectedStickerId(null)}>
                {isBuilding
                  ? <div style={S.buildMsg}>✦ Building your strip…</div>
                  : stripDataUrl
                    ? (
                      <div style={{position:"relative",display:"inline-block"}}>
                        <img src={stripDataUrl} style={S.stripImg} alt="Photo strip"/>
                        {/* Draggable sticker overlays */}
                        {activeStickers.map(s => (
                          <span key={s.id}
                            onMouseDown={e => handleStickerMouseDown(e, s.id)}
                            style={{
                              position:"absolute",
                              left: s.x, top: s.y - s.size,
                              fontSize: s.size,
                              cursor: dragging===s.id ? "grabbing" : "grab",
                              userSelect:"none",
                              transform:"translate(-50%,0)",
                              filter: selectedStickerId===s.id
                                ? "drop-shadow(0 0 8px #e74c3c) drop-shadow(0 0 4px #fff)"
                                : "none",
                              transition: "filter 0.15s",
                            }}>{s.emoji}</span>
                        ))}
                      </div>
                    )
                    : <div style={S.buildMsg}>Your strip will appear here</div>
                }
              </div>

              {/* Action buttons */}
              <div style={{display:"flex",gap:8}}>
                <button style={{...S.actionBtn, background:"#c0392b"}}
                  onClick={() => { setPhase("idle"); setPhotos([]); setStripDataUrl(null); setActiveStickers([]); }}>
                  🔄 Retake
                </button>
                <button style={{...S.actionBtn, background:"#2471a3"}} onClick={downloadStrip} disabled={!stripDataUrl}>
                  ⬇️ Download
                </button>
                <button style={{...S.actionBtn, background:"#7d3c98"}} onClick={handleShare} disabled={!stripDataUrl}>
                  🔗 Share
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Share modal */}
      {showShareModal && (
        <div style={S.overlay} onClick={() => setShowShareModal(false)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>
            <h3 style={{color:"#e74c3c",marginBottom:12,fontFamily:"Georgia,serif"}}>Share Your Strip 🔗</h3>
            <p style={{color:"#666",fontSize:12,marginBottom:8}}>Your strip link (demo):</p>
            <div style={S.shareBox}><span style={{color:"#fff",fontSize:13,wordBreak:"break-all"}}>{shareUrl}</span></div>
            <button style={{...S.actionBtn, background:"#27ae60", marginTop:12, width:"100%"}}
              onClick={() => navigator.clipboard?.writeText(shareUrl)}>📋 Copy Link</button>
            <button style={{...S.actionBtn, background:"#333", marginTop:8, width:"100%"}}
              onClick={() => setShowShareModal(false)}>Close</button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} style={{display:"none"}}/>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Special+Elite&family=Cardo:ital,wght@0,400;0,700;1,400&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#111}
        @keyframes popIn{0%{transform:scale(0.4);opacity:0}70%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}
        @keyframes grain{0%,100%{transform:translate(0,0)}25%{transform:translate(-2%,-1%)}50%{transform:translate(1%,2%)}75%{transform:translate(2%,-1%)}}
        ::-webkit-scrollbar{width:6px;background:#111}
        ::-webkit-scrollbar-thumb{background:#2a2a2a;border-radius:3px}
      `}</style>
    </div>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const S = {
  root:       { minHeight:"100vh", background:"#111", color:"#f0e6d3", fontFamily:"'Cardo',Georgia,serif", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" },
  bgGrain:    { position:"fixed", inset:0, zIndex:0, pointerEvents:"none", backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`, backgroundSize:"180px", animation:"grain 4s steps(6) infinite", opacity:0.35 },
  header:     { position:"relative", zIndex:1, textAlign:"center", paddingTop:20, borderBottom:"1px solid #1a1a1a", background:"#111" },
  filmHoles:  { display:"flex", justifyContent:"space-around", padding:"6px 16px" },
  filmHole:   { width:14, height:14, borderRadius:3, border:"2px solid #1e1e1e", background:"#0a0a0a" },
  title:      { fontFamily:"'Special Elite','Courier New',monospace", fontSize:44, letterSpacing:12, color:"#f0e6d3", textShadow:"0 0 30px #e74c3c55, 2px 2px 0 #8b0000", padding:"6px 0 2px" },
  subtitle:   { fontFamily:"'Cardo',serif", fontStyle:"italic", color:"#555", fontSize:13, letterSpacing:3, paddingBottom:8 },
  main:       { position:"relative", zIndex:1, display:"flex", gap:20, padding:"20px", flex:1, flexWrap:"wrap", alignItems:"flex-start" },
  leftPanel:  { flex:"1 1 460px", maxWidth:540, display:"flex", flexDirection:"column", gap:12 },
  rightPanel: { flex:"1 1 300px", display:"flex", flexDirection:"column", gap:12 },
  card:       { background:"#141414", border:"1px solid #1e1e1e", borderRadius:8, padding:"12px 14px" },
  label:      { fontFamily:"'Special Elite',monospace", fontSize:10, letterSpacing:3, color:"#484848", marginBottom:8 },
  panelTitle: { fontFamily:"'Special Elite',monospace", fontSize:15, letterSpacing:1, color:"#f0e6d3", marginBottom:4 },

  // Viewport
  viewport:  { position:"relative", background:"#000", borderRadius:4, overflow:"hidden", aspectRatio:"16/9", border:"1px solid #1a1a1a" },
  corner:    (p) => ({ position:"absolute", zIndex:3, width:16, height:16, top:p.includes("t")?4:undefined, bottom:p.includes("b")?4:undefined, left:p.includes("l")?4:undefined, right:p.includes("r")?4:undefined, borderTop:p.includes("t")?"2px solid #e74c3c":"none", borderBottom:p.includes("b")?"2px solid #e74c3c":"none", borderLeft:p.includes("l")?"2px solid #e74c3c":"none", borderRight:p.includes("r")?"2px solid #e74c3c":"none" }),
  flash:     { position:"absolute", inset:0, zIndex:10, background:"#fff" },
  video:     { width:"100%", height:"100%", objectFit:"cover", display:"block" },
  cdOverlay: { position:"absolute", inset:0, zIndex:5, display:"flex", alignItems:"center", justifyContent:"center", background:"#00000066" },
  cdNum:     { fontFamily:"'Special Elite',monospace", fontSize:110, color:"#e74c3c", textShadow:"0 0 40px #e74c3c, 0 4px 0 #8b0000", animation:"popIn 0.3s ease" },
  shotDots:  { position:"absolute", bottom:10, left:0, right:0, display:"flex", justifyContent:"center", gap:8, zIndex:4 },
  dot:       { width:10, height:10, borderRadius:"50%", transition:"background 0.3s" },
  mirrorBtn: { position:"absolute", top:8, right:8, zIndex:4, background:"#00000088", border:"1px solid #333", color:"#fff", borderRadius:4, width:30, height:28, cursor:"pointer", fontSize:16 },
  camErr:    { position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"#111", padding:20 },

  // Filters
  filterRow:   { display:"flex", gap:8, overflowX:"auto", paddingBottom:4 },
  filterBtn:   { background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", borderRadius:8, padding:4, flexShrink:0 },
  filterThumb: { width:44, height:44, borderRadius:6, overflow:"hidden", background:"#222", marginBottom:4 },
  filterLabel: { color:"#888", fontSize:9, letterSpacing:0.5, fontFamily:"'Special Elite',monospace" },

  // Layout
  layoutBtn: { border:"1px solid #222", borderRadius:6, cursor:"pointer", padding:"6px 10px", display:"flex", flexDirection:"column", alignItems:"center", fontSize:11, fontFamily:"'Special Elite',monospace", minWidth:56, transition:"all 0.2s" },

  // Design grid
  designGrid: { display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:6 },
  designBtn:  { borderRadius:8, cursor:"pointer", padding:"8px 4px", display:"flex", flexDirection:"column", alignItems:"center", transition:"all 0.15s", minHeight:60 },

  // Shoot
  shootBtn: { flex:1, background:"#e74c3c", color:"#fff", border:"none", borderRadius:6, padding:"13px 20px", fontSize:13, fontFamily:"'Special Elite',monospace", letterSpacing:2, cursor:"pointer", boxShadow:"0 4px 0 #8b0000", transition:"all 0.15s" },

  // Placeholder
  placeholder:     { flex:1, border:"2px dashed #1e1e1e", borderRadius:8, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:32, minHeight:260 },
  placeholderText: { color:"#444", fontSize:13, fontStyle:"italic", textAlign:"center", maxWidth:240, lineHeight:1.6 },

  // Thumbnails
  thumbSlot:  { width:76, height:52, background:"#181818", border:"1px solid #222", borderRadius:4, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", flexShrink:0 },
  thumbImg:   { width:"100%", height:"100%", objectFit:"cover" },
  thumbLabel: { position:"absolute", bottom:2, right:4, color:"#fff", fontSize:9, fontFamily:"'Special Elite',monospace", textShadow:"0 1px 2px #000" },

  // Stickers
  stickerPickBtn: { background:"none", border:"1px solid #222", borderRadius:6, padding:"4px 7px", cursor:"pointer", fontSize:19, transition:"transform 0.1s" },
  stickerRow:     { display:"flex", alignItems:"center", gap:8, padding:"6px 10px", borderRadius:6, cursor:"pointer", transition:"border 0.15s, background 0.15s" },
  sizeBtn:        { background:"#1e1e1e", border:"1px solid #333", color:"#ccc", borderRadius:4, width:26, height:26, cursor:"pointer", fontSize:16, fontWeight:"bold", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, lineHeight:1 },
  sizeBadge:      { background:"#111", border:"1px solid #2a2a2a", color:"#888", borderRadius:4, minWidth:32, height:26, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontFamily:"monospace", flexShrink:0 },
  removeBtn:      { background:"#1a0808", border:"1px solid #3a1010", borderRadius:4, width:28, height:26, cursor:"pointer", fontSize:13, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 },

  // Caption
  smallBtn:     { background:"#181818", border:"1px solid #2a2a2a", color:"#aaa", borderRadius:6, padding:"6px 12px", cursor:"pointer", fontSize:12, fontFamily:"'Special Elite',monospace", letterSpacing:1, whiteSpace:"nowrap" },
  captionInput: { flex:1, background:"#111", border:"1px solid #2a2a2a", borderRadius:6, color:"#f0e6d3", padding:"6px 10px", fontSize:13, fontFamily:"'Cardo',serif", outline:"none" },

  // Preview
  previewBox: { background:"#0a0a0a", border:"1px solid #1a1a1a", borderRadius:8, padding:16, display:"flex", alignItems:"center", justifyContent:"center", minHeight:180, position:"relative", overflow:"auto", maxHeight:560, cursor:"default" },
  stripImg:   { maxWidth:"100%", maxHeight:520, borderRadius:4, boxShadow:"0 8px 40px #000000bb", display:"block" },
  buildMsg:   { color:"#383838", fontStyle:"italic", fontSize:13 },

  // Actions
  actionBtn: { flex:1, border:"none", borderRadius:6, color:"#fff", padding:"10px 0", cursor:"pointer", fontSize:12, fontFamily:"'Special Elite',monospace", letterSpacing:1, transition:"opacity 0.2s" },

  // Modal
  overlay:  { position:"fixed", inset:0, zIndex:100, background:"#000000cc", display:"flex", alignItems:"center", justifyContent:"center" },
  modal:    { background:"#161616", border:"1px solid #2a2a2a", borderRadius:12, padding:28, maxWidth:340, width:"90%", boxShadow:"0 20px 60px #000" },
  shareBox: { background:"#0d0d0d", border:"1px solid #2a2a2a", borderRadius:6, padding:"10px 12px" },
};