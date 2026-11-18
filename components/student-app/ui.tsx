"use client";

/* Student app UI kit — ported from the new design (ui.jsx + screens helpers).
   Same tokens, sizes, radii and shadows as the prototype. */

import React, { useState } from "react";

export const THEME = {
  primary: "#00355f",
  kashmirBlue: "#0f4c81",
  blueTint: "#2d6197",
  saffron: "#f59e0b",
  saffronDeep: "#b45309",
  saffronSoft: "#fff4e0",
  green: "#10b981",
  greenSoft: "#e7f7f0",
  bg: "#f3f6fd",
  surface: "#ffffff",
  surfaceAlt: "#eef3fc",
  ink: "#111c2d",
  inkSoft: "#42474f",
  outline: "#d8e0ee",
  blueSoft: "#e7eeff",
  indiaSaffron: "#ff9933",
  indiaGreen: "#138808",
  navy: "#0b2f6b",
  head: "var(--font-jakarta), 'Plus Jakarta Sans', system-ui, sans-serif",
  body: "var(--font-inter), 'Inter', system-ui, sans-serif",
};
const T = THEME;

/* Material Symbols icon (font loaded in the student layout) */
export function Icon({
  name, size = 24, fill = 0, weight = 400, color, style,
}: { name: string; size?: number; fill?: 0 | 1; weight?: number; color?: string; style?: React.CSSProperties }) {
  return (
    <span
      className="material-symbols-outlined"
      aria-hidden
      style={{
        fontSize: size, color, lineHeight: 1, width: size, height: size, flexShrink: 0,
        fontVariationSettings: `'FILL' ${fill}, 'wght' ${weight}, 'GRAD' 0, 'opsz' 24`,
        ...style,
      }}
    >
      {name}
    </span>
  );
}

export function Chip({ children, tone = "blue", style }: { children: React.ReactNode; tone?: "blue" | "saffron" | "green" | "ghost"; style?: React.CSSProperties }) {
  const tones = {
    blue: { bg: T.blueSoft, fg: T.kashmirBlue },
    saffron: { bg: T.saffronSoft, fg: T.saffronDeep },
    green: { bg: T.greenSoft, fg: "#067a55" },
    ghost: { bg: "rgba(255,255,255,0.16)", fg: "#fff" },
  };
  const t = tones[tone] || tones.blue;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      background: t.bg, color: t.fg, fontFamily: T.body, fontWeight: 600,
      fontSize: 11.5, letterSpacing: 0.2, padding: "4px 10px", borderRadius: 999,
      whiteSpace: "nowrap", ...style,
    }}>{children}</span>
  );
}

export function Card({
  children, onClick, style, pad = 16, accent = false,
}: { children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties; pad?: number; accent?: boolean }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } } : undefined}
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(12px)",
        border: `1px solid ${accent ? "rgba(245,158,11,0.45)" : "rgba(255,255,255,0.7)"}`,
        borderRadius: 22,
        boxShadow: hover ? "0 12px 30px rgba(15,76,129,0.16)" : "0 5px 18px rgba(15,76,129,0.08)",
        transform: hover && onClick ? "translateY(-3px)" : "none",
        transition: "transform .25s ease, box-shadow .25s ease",
        cursor: onClick ? "pointer" : "default",
        padding: pad,
        ...style,
      }}
    >{children}</div>
  );
}

export function SectionHead({ title, sub, action, onAction }: { title: string; sub?: string; action?: string; onAction?: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
      <div style={{ minWidth: 0 }}>
        <h2 style={{ font: `700 21px ${T.head}`, color: T.ink, margin: 0, letterSpacing: "-0.01em" }}>{title}</h2>
        {sub && <p style={{ font: `400 13.5px ${T.body}`, color: T.inkSoft, margin: "3px 0 0" }}>{sub}</p>}
      </div>
      {action && (
        <button onClick={onAction} style={{
          font: `600 13px ${T.body}`, color: T.kashmirBlue, background: "none",
          border: "none", cursor: "pointer", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 2, padding: 0,
        }}>{action}<Icon name="chevron_right" size={16} /></button>
      )}
    </div>
  );
}

export function Btn({
  children, onClick, variant = "primary", icon, size = "md", full, style, disabled, type = "button",
}: {
  children: React.ReactNode; onClick?: () => void; variant?: "primary" | "saffron" | "ghost" | "light";
  icon?: string; size?: "sm" | "md"; full?: boolean; style?: React.CSSProperties; disabled?: boolean; type?: "button" | "submit";
}) {
  const [hover, setHover] = useState(false);
  const pads = size === "sm" ? "9px 14px" : "13px 18px";
  const fs = size === "sm" ? 13 : 15;
  const variants = {
    primary: { background: T.kashmirBlue, color: "#fff", border: "none" },
    saffron: { background: T.saffron, color: "#3a2400", border: "none" },
    ghost: { background: "transparent", color: T.kashmirBlue, border: `1.5px solid ${T.outline}` },
    light: { background: T.blueSoft, color: T.kashmirBlue, border: "none" },
  };
  const v = variants[variant] || variants.primary;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...v, font: `600 ${fs}px ${T.body}`, padding: pads, borderRadius: 12,
        cursor: disabled ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
        gap: 7, width: full ? "100%" : "auto", transition: "filter .2s, transform .1s",
        filter: hover && !disabled ? "brightness(0.95)" : "none", opacity: disabled ? 0.5 : 1, ...style,
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {icon && <Icon name={icon} size={fs + 4} />}
      {children}
    </button>
  );
}

export function Photo({ src, label, style, rounded = 18, overlay }: { src?: string | null; label?: string; style?: React.CSSProperties; rounded?: number; overlay?: React.ReactNode }) {
  const [err, setErr] = useState(false);
  if (!src || err) {
    return (
      <div style={{
        position: "relative", overflow: "hidden", borderRadius: rounded,
        background: `repeating-linear-gradient(135deg, ${T.surfaceAlt}, ${T.surfaceAlt} 10px, #e3eaf8 10px, #e3eaf8 20px)`,
        display: "flex", alignItems: "center", justifyContent: "center", ...style,
      }}>
        <span style={{ font: `500 11px ui-monospace, monospace`, color: T.inkSoft, opacity: 0.8, textAlign: "center", padding: 8 }}>
          {label || "image"}
        </span>
      </div>
    );
  }
  return (
    <div style={{ position: "relative", overflow: "hidden", borderRadius: rounded, ...style }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={label || ""} onError={() => setErr(true)}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      {overlay}
    </div>
  );
}

export function Avatar({ init, size = 44, tone = "blue" }: { init: string; size?: number; tone?: "blue" | "saffron" }) {
  const bg = tone === "saffron" ? T.saffron : T.kashmirBlue;
  const fg = tone === "saffron" ? "#3a2400" : "#fff";
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: bg, color: fg,
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      font: `700 ${size * 0.36}px ${T.head}`,
    }}>{init}</div>
  );
}

/* Bottom sheet modal (positioned inside the app container) */
export function Sheet({ open, onClose, children, title }: { open: boolean; onClose: () => void; children: React.ReactNode; title?: string }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: "absolute", inset: 0, zIndex: 100, display: "flex", flexDirection: "column",
      justifyContent: "flex-end", background: "rgba(17,28,45,0.45)", backdropFilter: "blur(2px)",
      animation: "sa-fadeIn .2s ease",
    }}>
      <div onClick={(e) => e.stopPropagation()} role="dialog" aria-label={title} style={{
        background: T.surface, borderRadius: "26px 26px 0 0", padding: "10px 18px 22px",
        maxHeight: "86%", overflowY: "auto", animation: "sa-slideUp .3s cubic-bezier(.2,.8,.2,1)",
      }}>
        <div style={{ width: 38, height: 4, borderRadius: 99, background: T.outline, margin: "4px auto 14px" }} />
        {title !== undefined && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, gap: 10 }}>
            <h3 style={{ font: `700 19px ${T.head}`, color: T.ink, margin: 0 }}>{title}</h3>
            <button onClick={onClose} aria-label="Close" style={{ background: T.surfaceAlt, border: "none", borderRadius: 99, width: 32, height: 32, cursor: "pointer", display: "grid", placeItems: "center", flexShrink: 0 }}>
              <Icon name="close" size={18} color={T.inkSoft} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block", marginBottom: 14 }}>
      <span style={{ font: `600 13px ${T.body}`, color: T.ink, display: "block", marginBottom: 6 }}>{label}</span>
      {children}
    </label>
  );
}

export const inputStyle: React.CSSProperties = {
  width: "100%", height: 48, borderRadius: 12, border: `1px solid ${T.outline}`,
  background: "#fff", padding: "0 14px", font: `400 15px ${T.body}`, color: T.ink,
  boxSizing: "border-box", outline: "none",
};

export const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: "none",
  backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%2342474f' stroke-width='2'><path d='M6 9l6 6 6-6'/></svg>\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  paddingRight: 38,
  cursor: "pointer",
};

/* ---------- layout helpers (screens-home.jsx / screens-sections.jsx) ---------- */
export function Page({ children, pb = 96 }: { children: React.ReactNode; pb?: number }) {
  return <div style={{ padding: `18px 16px ${pb}px` }}>{children}</div>;
}

export function HScroll({ children }: { children: React.ReactNode }) {
  return (
    <div className="sa-noscroll" style={{
      display: "flex", gap: 12, overflowX: "auto", margin: "0 -16px",
      padding: "2px 16px 6px", scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch",
    }}>{children}</div>
  );
}

export function SecIntro({ title, sub }: { title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h1 style={{ font: `700 26px ${T.head}`, color: T.ink, margin: 0, letterSpacing: "-0.02em" }}>{title}</h1>
      {sub && <p style={{ font: `400 14px ${T.body}`, color: T.inkSoft, margin: "4px 0 0" }}>{sub}</p>}
    </div>
  );
}

export function FilterRow({ items, value, onChange, lang }: { items: any[]; value: string; onChange: (v: string) => void; lang: string }) {
  return (
    <div className="sa-noscroll" style={{ display: "flex", gap: 8, overflowX: "auto", margin: "0 -16px 16px", padding: "2px 16px 8px" }}>
      {items.map((it) => {
        const on = value === it.id;
        return (
          <button key={it.id} onClick={() => onChange(it.id)} aria-pressed={on} style={{
            font: `600 13px ${T.body}`, padding: "8px 15px", borderRadius: 999, cursor: "pointer", whiteSpace: "nowrap",
            border: on ? "none" : `1px solid ${T.outline}`, background: on ? T.kashmirBlue : "#fff", color: on ? "#fff" : T.inkSoft,
          }}>{lang === "ur" ? it.ur : it.en}</button>
        );
      })}
    </div>
  );
}

export const blkH: React.CSSProperties = { font: `700 15px ${T.head}`, color: T.ink, margin: "0 0 9px" };

export function chipBtn(): React.CSSProperties {
  return { font: `600 12.5px ${T.body}`, color: T.kashmirBlue, background: T.blueSoft, border: "none", borderRadius: 999, padding: "8px 14px", cursor: "pointer" };
}

export function BackLink({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", color: T.inkSoft, font: `600 13px ${T.body}`, cursor: "pointer", margin: "16px auto 0", padding: 8 }}>
      <Icon name="arrow_back" size={16} /> Back
    </button>
  );
}
