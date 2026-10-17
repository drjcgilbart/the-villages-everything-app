"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "./cart";
import { BadgePreview } from "./badge-preview";
import {
  BADGE_SIZES,
  BADGE_THEMES,
  NAME_MAX,
  VILLAGE_MAX,
  badgeTotalCents,
  cleanBadgeText,
  cleanVillage,
  customBadgeSku,
  getBadgeTheme,
  validateBadgeText,
  type BadgeFieldErrors,
  type BadgeThemeId,
} from "@/lib/shop/badges";
import { formatPrice, type Product } from "@/lib/shop/catalog";

const QTYS = Array.from({ length: 10 }, (_, i) => i + 1);

export function BadgeBuilder() {
  const [themeId, setThemeId] = useState<BadgeThemeId>("brand");
  const theme = getBadgeTheme(themeId)!;
  const [name, setName] = useState("");
  const [village, setVillage] = useState("");
  const [qty, setQty] = useState(1);
  const [touched, setTouched] = useState({ name: false, village: false });
  const [serverErrors, setServerErrors] = useState<BadgeFieldErrors>({});
  const [busy, setBusy] = useState(false);
  const [added, setAdded] = useState<string | null>(null);
  const { add } = useCart();

  const check = useMemo(() => validateBadgeText(theme, { name, village }), [theme, name, village]);
  const nameErr = serverErrors.name || (touched.name ? check.errors.name : undefined);
  const villageErr = serverErrors.village || (touched.village ? check.errors.village : undefined);
  const previewText = { name: cleanBadgeText(name), village: cleanVillage(village) };

  async function addToCart() {
    setTouched({ name: true, village: true });
    setAdded(null);
    if (!check.ok) return;
    setBusy(true);
    setServerErrors({});
    try {
      const res = await fetch("/api/shop/badge/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: themeId, ...check.text }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; fields?: BadgeFieldErrors; text?: { name: string; village?: string } };
      if (!res.ok || !data.ok || !data.text) {
        setServerErrors(data.fields && (data.fields.name || data.fields.village) ? data.fields : { name: data.error || "Please check the badge text." });
        return;
      }
      add(customBadgeSku(themeId), qty, data.text);
      setAdded(`${qty} ${theme.label} badge${qty > 1 ? "s" : ""} for ${data.text.name}`);
    } catch {
      setServerErrors({ name: "Could not reach the shop. Please try again." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="shop-product">
      <div>
        <div className="badge-stage">
          <div className="badge-stage-tags">
            <span>Live preview</span>
            <span>Prints at {BADGE_SIZES.custom.label}</span>
          </div>
          <BadgePreview theme={theme} text={previewText.name || previewText.village ? previewText : theme.sample} />
        </div>
        <p className="badge-fine">Preview updates as you type. Long names shrink to fit. What you see is what we print.</p>
      </div>

      <div className="shop-buy">
        <p className="shop-mono">Custom name badge &middot; {BADGE_SIZES.custom.long}</p>
        <div className="badge-deal">
          <p className="shop-price shop-price-lg" data-testid="badge-price">$16 each</p>
          <span className="badge-deal-pill" data-testid="badge-deal">2 for $28</span>
        </div>
        <p className="shop-tag">Every pair is $28, mixed any way you like: custom and ready-made badges count together.</p>

        <p className="badge-step">1 &middot; Pick a theme <span>{theme.label}</span></p>
        <div className="badge-themes" role="group" aria-label="Badge theme">
          {BADGE_THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              className="badge-theme"
              aria-pressed={t.id === themeId}
              data-theme={t.id}
              onClick={() => {
                setThemeId(t.id);
                setServerErrors({});
                setAdded(null);
              }}
            >
              <BadgePreview theme={t} text={t.sample} label="" />
              {t.label}
            </button>
          ))}
        </div>
        <p className="badge-hint">{theme.blurb}</p>

        <label className="badge-step" htmlFor="badge-name">
          2 &middot; Your name <span>{cleanBadgeText(name).length} / {NAME_MAX}</span>
        </label>
        <input
          id="badge-name"
          className="badge-field"
          value={name}
          maxLength={NAME_MAX + 4}
          autoComplete="given-name"
          placeholder={theme.sample.name}
          aria-invalid={nameErr ? true : undefined}
          aria-describedby={nameErr ? "badge-name-err" : undefined}
          onChange={(e) => {
            setName(e.target.value);
            setServerErrors({});
            setAdded(null);
          }}
          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
        />
        {nameErr ? <p id="badge-name-err" className="badge-err" role="alert">{nameErr}</p> : null}

        {theme.usesVillage ? (
          <>
            <label className="badge-step" htmlFor="badge-village">
              3 &middot; The Village of&hellip; <span>{cleanVillage(village).length} / {VILLAGE_MAX}</span>
            </label>
            <input
              id="badge-village"
              className="badge-field"
              value={village}
              maxLength={VILLAGE_MAX + 15}
              placeholder={theme.sample.village}
              aria-invalid={villageErr ? true : undefined}
              aria-describedby={villageErr ? "badge-village-err" : "badge-village-hint"}
              onChange={(e) => {
                setVillage(e.target.value);
                setServerErrors({});
                setAdded(null);
              }}
              onBlur={() => setTouched((t) => ({ ...t, village: true }))}
            />
            {villageErr ? (
              <p id="badge-village-err" className="badge-err" role="alert">{villageErr}</p>
            ) : (
              <p id="badge-village-hint" className="badge-hint">
                This theme prints &ldquo;{themeId === "edenfield" ? "The Village of" : "Village of"}&rdquo; for you. Just type your village, for example Fenney.
              </p>
            )}
          </>
        ) : (
          <p className="badge-hint">This theme prints your name only.</p>
        )}

        <div className="badge-buyrow">
          <label>
            <span className="sr-only">Quantity</span>
            <select className="badge-qty" value={qty} onChange={(e) => setQty(Number(e.target.value))} aria-label="Quantity">
              {QTYS.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>
          <button type="button" className="btn btn-primary" onClick={addToCart} disabled={busy} data-testid="badge-add">
            {busy ? "Checking\u2026" : `Add to cart \u00b7 ${formatPrice(badgeTotalCents(qty))}`}
          </button>
        </div>
        {added ? (
          <p className="shop-ok" role="status">
            Added {added}. <Link href="/shop/cart">View cart</Link>
          </p>
        ) : null}
        <p className="badge-fine">
          Letters, spaces, hyphens, apostrophes and periods. Made to order in about 5&ndash;7 business days, plus shipping. Personalized
          items can&rsquo;t be returned unless we got it wrong. We read every badge before it prints.
        </p>
      </div>
    </div>
  );
}

export function ReadyBadges({ products }: { products: Product[] }) {
  const { add } = useCart();
  const [added, setAdded] = useState<string | null>(null);
  return (
    <div className="badge-ready-grid">
      {products.map((p) => (
        <div className="badge-ready-card" key={p.slug} id={p.slug}>
          <Image src={p.image} alt={p.badge?.kind === "ready" ? p.badge.alt : p.name} width={1050} height={675} sizes="(max-width: 760px) 100vw, 50vw" />
          <div className="badge-ready-body">
            <span className="badge-size">{BADGE_SIZES.ready.label} &middot; larger size</span>
            <h3>{p.name}</h3>
            <div className="shop-row">
              <span className="shop-tag">{BADGE_SIZES.ready.long}</span>
              <span className="shop-price">$16 &middot; 2 for $28</span>
            </div>
            <div className="shop-actions" style={{ marginTop: 12 }}>
              <button type="button" className="btn btn-primary" data-testid={`add-${p.slug}`} onClick={() => { add(p.variants[0].sku, 1); setAdded(p.slug); }}>
                Add to cart
              </button>
              {added === p.slug ? <Link className="btn btn-ghost" href="/shop/cart">View cart</Link> : null}
            </div>
            {added === p.slug ? <p className="shop-ok" role="status">Added {p.name}.</p> : null}
          </div>
        </div>
      ))}
    </div>
  );
}
