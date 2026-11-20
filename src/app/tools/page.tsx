"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ToolPlan = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  billingInterval: "ONE_TIME" | "MONTHLY" | "ANNUAL" | "USAGE_BASED";
  termDays: number | null;
  currency: string;
  price: string;
};

type Tool = {
  id: string;
  slug: string;
  name: string;
  vendorName: string;
  category: string;
  shortDescription: string;
  description: string;
  officialProductUrl: string | null;
  supportUrl: string | null;
  supportedCountries: string[];
  plans: ToolPlan[];
};

const formatPrice = (price: string, currency: string) => {
  const value = Number(price);
  if (!Number.isFinite(value)) return `${currency} ${price}`;
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency,
      maximumFractionDigits: currency === "MWK" ? 0 : 2,
    }).format(value);
  } catch {
    return `${currency} ${value.toLocaleString()}`;
  }
};

const intervalLabel = (plan: ToolPlan) => {
  if (plan.termDays) return `${plan.termDays} days`;
  switch (plan.billingInterval) {
    case "ONE_TIME": return "One-time";
    case "MONTHLY": return "Monthly";
    case "ANNUAL": return "Annual";
    default: return "Usage-based";
  }
};

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/catalog/tools", { signal: controller.signal, headers: { Accept: "application/json" } })
      .then((response) => {
        if (!response.ok) throw new Error("Catalogue unavailable");
        return response.json();
      })
      .then((payload: { data?: Tool[] }) => {
        const malawiTools = (payload.data ?? []).filter((tool) => tool.supportedCountries?.includes("MW"));
        setTools(malawiTools);
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === "AbortError") return;
        setFailed(true);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(tools.map((tool) => tool.category))).sort()],
    [tools]
  );

  const visibleTools = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tools.filter((tool) => {
      const matchesCategory = category === "All" || tool.category === category;
      const haystack = `${tool.name} ${tool.vendorName} ${tool.category} ${tool.shortDescription}`.toLowerCase();
      return matchesCategory && (!query || haystack.includes(query));
    });
  }, [tools, search, category]);

  return (
    <main className="tools-page">
      <header className="tools-topbar">
        <Link className="wordmark" href="/">NJIRA<span>®</span></Link>
        <span className="tools-topbar-note">CREATIVE INFRASTRUCTURE / 02</span>
        <Link className="tools-back-link" href="/">Back to NJIRA <span aria-hidden="true">↗</span></Link>
      </header>

      <section className="tools-hero">
        <div className="tools-hero-copy">
          <p className="eyebrow"><span className="pulse" /> THE CREATOR TOOLKIT</p>
          <h1>Tools for<br /><em>the work.</em></h1>
          <p className="tools-intro">Find the software and digital services that keep your creative practice moving. One clearer place to explore what is available in Malawi.</p>
          <div className="tools-hero-meta"><span>01 / SOFTWARE & DIGITAL SERVICES</span><span>BUILT FOR THE CREATIVE PROCESS</span></div>
        </div>
        <div className="tools-orbit-art" aria-hidden="true">
          <div className="tools-orbit tools-orbit-a" /><div className="tools-orbit tools-orbit-b" /><div className="tools-orbit tools-orbit-c" />
          <div className="tools-orbit-core"><span>↗</span></div>
          <p>ACCESS<br />WITHOUT<br />THE FRICTION.</p>
          <small>13°59′S / 33°47′E</small>
        </div>
      </section>

      <section className="tools-catalogue">
        <div className="tools-catalogue-heading">
          <div><p className="eyebrow">EXPLORE THE CATALOGUE</p><h2>Equip your<br /><em>next move.</em></h2></div>
          <p>Browse verified catalogue entries intended for Malawi. Regional access and delivery conditions can differ by product and plan.</p>
        </div>

        <div className="tools-controls">
          <label className="tools-search">
            <span aria-hidden="true">⌕</span>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tools, services, providers…" aria-label="Search tools" />
          </label>
          <div className="tools-category-row" aria-label="Filter by category">
            {categories.map((item) => (
              <button key={item} type="button" className={category === item ? "category-chip active" : "category-chip"} onClick={() => setCategory(item)}>{item}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="tools-state"><span className="state-mark">…</span><h3>Finding the right tools.</h3><p>Loading the current catalogue.</p></div>
        ) : failed ? (
          <div className="tools-state"><span className="state-mark">!</span><h3>Catalogue temporarily unavailable.</h3><p>Please try again shortly. No purchase has been made.</p><button className="tools-retry" type="button" onClick={() => window.location.reload()}>Try again ↗</button></div>
        ) : visibleTools.length === 0 ? (
          <div className="tools-state">
            <span className="state-mark">↗</span>
            <h3>{tools.length === 0 ? "The catalogue is being prepared." : "No matching tools yet."}</h3>
            <p>{tools.length === 0 ? "We are onboarding suppliers and checking regional availability before opening orders. We will only list products with a confirmed fulfilment route." : "Try another search or category. New verified tools will appear here as they become available."}</p>
            {tools.length > 0 && <button className="tools-retry" type="button" onClick={() => { setSearch(""); setCategory("All"); }}>Clear filters ↗</button>}
          </div>
        ) : (
          <div className="tools-grid">
            {visibleTools.map((tool, index) => (
              <article className="tool-card" key={tool.id}>
                <div className="tool-card-top"><span>{String(index + 1).padStart(2, "0")} / {tool.category}</span><span className="tool-region">MALAWI</span></div>
                <div className="tool-card-symbol" aria-hidden="true">{tool.name.trim().charAt(0).toUpperCase()}</div>
                <p className="tool-vendor">{tool.vendorName}</p>
                <h3>{tool.name}</h3>
                <p className="tool-description">{tool.shortDescription}</p>
                <button className="tool-expand" type="button" aria-expanded={expanded === tool.id} onClick={() => setExpanded(expanded === tool.id ? null : tool.id)}>
                  {expanded === tool.id ? "Hide plans" : "Explore plans"} <span>{expanded === tool.id ? "−" : "↗"}</span>
                </button>
                {expanded === tool.id && (
                  <div className="tool-plans">
                    {tool.plans.map((plan) => (
                      <div className="tool-plan" key={plan.id}>
                        <div><strong>{plan.name}</strong><small>{intervalLabel(plan)}</small></div>
                        <b>{formatPrice(plan.price, plan.currency)}</b>
                      </div>
                    ))}
                    <p className="tool-plan-note">Displayed pricing is subject to regional eligibility and fulfilment confirmation. Ordering is not open yet.</p>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
        <p className="tools-disclaimer">NJIRA does not sell or activate a product merely because it appears in a catalogue. Orders will open only after supplier authorisation, regional eligibility, payment and fulfilment checks are complete.</p>
      </section>

      <footer className="tools-footer"><Link className="wordmark" href="/">NJIRA<span>®</span></Link><p>THE RIGHT TOOLS. A CLEARER WAY FORWARD.</p><span>© {new Date().getFullYear()} NJIRA</span></footer>
    </main>
  );
}
