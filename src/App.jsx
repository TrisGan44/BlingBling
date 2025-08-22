// src/App.jsx
import React, { useMemo } from "react";
import "./App.css";

function genFragments() {
  const N = 40;                 // jumlah fragmen
  const frags = [];
  let cy = 80;                  // start Y
  const hTotal = 440;           // tinggi area kristal aktif

  for (let i = 0; i < N; i++) {
    // tinggi & lebar setiap fragmen bervariasi
    const h = 8 + Math.random() * 24;            // 8–32
    const w = 35 + Math.random() * 60;           // 35–95

    // posisi X mengikuti sedikit 'twist' + noise
    const twist = Math.sin((i / N) * Math.PI * 2) * 18;
    const cx = 100 + twist + (Math.random() * 14 - 7); // pusat X

    // sudut rotasi acak (diamond miring)
    const deg = -48 + Math.random() * 96;        // -48°..48°
    const rad = (deg * Math.PI) / 180;

    // titik diamond sebelum rotasi
    const hw = w / 2, hh = h / 2;
    const pts = [
      [0, -hh],  // top
      [hw, 0],   // right
      [0, hh],   // bottom
      [-hw, 0],  // left
    ].map(([x, y]) => {
      const xr = x * Math.cos(rad) - y * Math.sin(rad);
      const yr = x * Math.sin(rad) + y * Math.cos(rad);
      return [Math.round(cx + xr), Math.round(cy + yr)];
    });

    // warna dalam spektrum biru–cyan, tiap frag beda
    const hue = 185 + Math.random() * 30;        // 185..215
    const sat = 85 + Math.random() * 10;         // 85..95
    const light = 55 + Math.random() * 20;       // 55..75
    const color = `hsl(${hue} ${sat}% ${light}%)`;

    // delay animasi biar kelihatan naik dari bawah
    const delay = (i * 0.04).toFixed(2) + "s";

    frags.push({
      points: pts.map(p => p.join(",")).join(" "),
      fill: color,
      delay,
    });

    cy += hTotal / N; // geser ke atas
  }

  return frags;
}

export default function App() {
  const frags = useMemo(genFragments, []);

  return (
    <div className="app">
      <div className="crystal-wrapper">
        {/* Core glow supaya fragmen terlihat menyatu */}
        <div className="core-light" />

        <svg className="crystal" viewBox="0 0 200 600" width="220" height="660">
          <defs>
            {/* glow kuat untuk setiap fragmen */}
            <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* outer aura halus (dipakai di group) */}
            <filter id="softAura" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="20" />
            </filter>
          </defs>

          {/* aura global tipis */}
          <g filter="url(#softAura)" opacity="0.25" style={{ mixBlendMode: "screen" }}>
            <rect x="40" y="60" width="120" height="480" rx="60" fill="#30d6ff" />
          </g>

          {/* fragmen – ukuran, rotasi, warna berbeda-beda */}
          {frags.map((f, i) => (
            <polygon
              key={i}
              className="frag"
              points={f.points}
              fill={f.fill}
              style={{ animationDelay: f.delay }}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
