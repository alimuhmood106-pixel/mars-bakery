import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { isOpenNow } from "@/lib/hours";
import { LANGS, t as makeT, type Lang } from "@/lib/i18n";
import logoT from "@/assets/logo-terracotta.png.asset.json";
import logoC from "@/assets/logo-cream.png.asset.json";
import hero6 from "@/assets/hero-matcha-640.webp.asset.json";
import hero12 from "@/assets/hero-matcha-1200.webp.asset.json";
import cro6 from "@/assets/croissants-640.webp.asset.json";
import cro12 from "@/assets/croissants-1200.webp.asset.json";
import cin6 from "@/assets/cinnamon-rolls-640.webp.asset.json";
import cin12 from "@/assets/cinnamon-rolls-1200.webp.asset.json";
import coo6 from "@/assets/cookies-640.webp.asset.json";
import coo12 from "@/assets/cookies-1200.webp.asset.json";
import ben6 from "@/assets/bench-640.webp.asset.json";
import ben12 from "@/assets/bench-1200.webp.asset.json";
import cup6 from "@/assets/cups-640.webp.asset.json";
import cup12 from "@/assets/cups-1200.webp.asset.json";
import piz6 from "@/assets/pizza-640.webp.asset.json";
import piz12 from "@/assets/pizza-1200.webp.asset.json";

const PHONE = "+9647702224441";
const PHONE_LABEL = "+964 770 222 4441";
const MAPS = "https://www.google.com/maps/search/?api=1&query=HC64%2B457%20Sulaymaniyah";
const IG = "https://www.instagram.com/mars.bakerycafe";
const FB = "https://www.facebook.com/marsbakerycafe/";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Bakery",
  name: "Mars Bakery & Café",
  telephone: PHONE,
  address: { "@type": "PostalAddress", streetAddress: "HC64+457", addressLocality: "Sulaymaniyah", addressCountry: "IQ" },
  openingHoursSpecification: [{
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "14:00", closes: "00:00",
  }],
  sameAs: [IG, FB],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mars Bakery & Café — Sulaymaniyah | Open 2 PM – 12 AM" },
      { name: "description", content: "Dipped croissants, cinnamon rolls, stuffed cookies, iced matcha and pizza by the slice. Mars Bakery & Café in Sulaymaniyah, open every day 2 PM – midnight." },
      { property: "og:title", content: "Mars Bakery & Café — Life is too short. Stay awake for it!" },
      { property: "og:description", content: "A neighborhood bakery & café in Sulaymaniyah, open 2 PM – 12 AM every day." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }],
  }),
  component: Index,
});

type Img = { url: string };
const src = (a: Img, b: Img) => ({ src: b.url, srcSet: `${a.url} 640w, ${b.url} 1200w` });

/* ---------- motion hooks (transform/opacity only) ---------- */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal, .wheat");
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("is-in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -10% 0px" });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
}

function useParallax() {
  useEffect(() => {
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    let raf = 0;
    const tick = () => {
      raf = 0;
      const vh = innerHeight;
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const p = (r.top + r.height / 2 - vh / 2) / vh;
        el.style.setProperty("--py", `${(p * -24).toFixed(1)}px`);
      });
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(tick); };
    addEventListener("scroll", on, { passive: true }); tick();
    return () => { removeEventListener("scroll", on); cancelAnimationFrame(raf); };
  }, []);
}

function useHideHeader() {
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    let last = scrollY;
    const on = () => {
      const y = scrollY;
      setHidden(y > last && y > 120);
      setSolid(y > 40);
      last = y;
    };
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  return { hidden, solid };
}

/* ---------- small pieces ---------- */
function Wheat({ className = "" }: { className?: string }) {
  // Hand-drawn wheat ear that draws itself in when revealed
  return (
    <svg viewBox="0 0 220 60" className={`wheat ${className}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
      <path d="M8 40 C 60 34, 120 30, 212 28" />
      {[30, 55, 80, 105, 130].map((x, i) => (
        <g key={x}>
          <path d={`M${x} ${38 - i} q 14 -16 30 -10 q -14 14 -30 10`} />
          <path d={`M${x} ${38 - i} q 14 16 30 8 q -14 -12 -30 -8`} />
        </g>
      ))}
    </svg>
  );
}

function Tile({ img, w, h, title, desc, tag, rot, className = "", sizes, delay = 0 }: {
  img: { src: string; srcSet: string }; w: number; h: number; title: string; desc: string; tag: string;
  rot: number; className?: string; sizes: string; delay?: number;
}) {
  const [tap, setTap] = useState(false);
  return (
    <figure className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      <div className={`tile ${tap ? "tapped" : ""}`} style={{ ["--rot" as string]: `${rot}deg` }} onClick={() => setTap((v) => !v)}>
        <div className="tile-img" data-parallax>
          <img {...img} sizes={sizes} width={w} height={h} loading="lazy" decoding="async" alt={desc} className="h-full w-full object-cover" style={{ aspectRatio: `${w}/${h}` }} />
        </div>
        <span className="tag">{tag}</span>
      </div>
      <figcaption className="mt-4 max-w-xs">
        <h3 className="text-2xl text-primary">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{desc}</p>
      </figcaption>
    </figure>
  );
}

/* ---------- page ---------- */
function Index() {
  const [lang, setLang] = useState<Lang>("en");
  const [open, setOpen] = useState<boolean | null>(null);
  const t = makeT(lang);
  const dir = LANGS.find((l) => l.id === lang)!.dir;
  const { hidden, solid } = useHideHeader();
  const rootRef = useRef<HTMLDivElement>(null);
  useReveal();
  useParallax();

  useEffect(() => {
    const upd = () => setOpen(isOpenNow());
    upd();
    const id = setInterval(upd, 60_000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang === "ku" ? "ckb" : lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const marquee = t("marquee");
  const wordmark = "Mars".split("");

  return (
    <div ref={rootRef} dir={dir} className="grain overflow-x-clip pb-20 md:pb-0">
      {/* Sticky header: hides on scroll down, returns on scroll up */}
      <header className={`site-header fixed inset-x-0 top-0 z-50 ${hidden ? "hidden-up" : ""} ${solid ? "bg-background" : ""}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
          <a href="#top" aria-label="Mars Bakery & Café — top">
            <img src={solid ? logoT.url : logoC.url} alt="Mars Bakery and Café" width={898} height={388} className="h-9 w-auto" />
          </a>
          <nav className={`hidden gap-8 text-sm font-medium md:flex ${solid ? "text-foreground" : "text-cream"}`}>
            <a href="#menu" className="hover:text-accent">{t("nav_menu")}</a>
            <a href="#vibe" className="hover:text-accent">{t("nav_vibe")}</a>
            <a href="#visit" className="hover:text-accent">{t("nav_visit")}</a>
          </nav>
          <div className={`flex rounded-full border p-1 text-xs ${solid ? "border-border" : "border-cream/40 text-cream"}`}>
            {LANGS.map((l) => (
              <button key={l.id} onClick={() => setLang(l.id)} aria-pressed={lang === l.id}
                className={`min-h-9 rounded-full px-3 ${lang === l.id ? "bg-primary text-primary-foreground" : ""}`}>{l.label}</button>
            ))}
          </div>
        </div>
      </header>

      {/* 1. Hero */}
      <section id="top" className="relative flex min-h-[100svh] items-end overflow-hidden bg-chocolate text-cream">
        <img {...src(hero6, hero12)} sizes="100vw" width={1536} height={1920} fetchPriority="high" decoding="async"
          alt="A hand holding an iced matcha in a Mars cup beside a slice of s'mores brownie cake on sunlit stone"
          className="hero-photo absolute inset-0 h-full w-full object-cover" />
        <div className="hero-shade absolute inset-0" />
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-32 pt-28 md:pb-14">
          <span className="mb-6 inline-flex min-h-9 items-center gap-2 rounded-full bg-cream px-4 text-sm font-medium text-chocolate">
            <span className={`h-2 w-2 rounded-full ${open ? "bg-matcha" : "bg-accent"}`} />
            {open === null ? "2 PM – 12 AM" : open ? t("open_now") : t("opens_at")}
          </span>
          <h1 className="font-display text-[34vw] leading-[0.8] md:text-[19rem]" aria-label="Mars">
            {wordmark.map((c, i) => (
              <span key={i} className="letter" style={{ animationDelay: `${120 + i * 90}ms` }} aria-hidden>{c}</span>
            ))}
          </h1>
          <p className="mt-4 max-w-xl font-display text-3xl leading-tight md:text-5xl">
            {t("tagline_a")}<br /><span className="italic">{t("tagline_b")}</span>
          </p>
          <div className="mt-8 hidden flex-wrap gap-3 md:flex">
            <a href={MAPS} target="_blank" rel="noopener" className="inline-flex min-h-12 items-center rounded-full bg-primary px-7 font-medium text-primary-foreground transition-transform duration-500 hover:-translate-y-0.5">{t("directions")}</a>
            <a href={`tel:${PHONE}`} className="inline-flex min-h-12 items-center rounded-full bg-cream px-7 font-medium text-chocolate transition-transform duration-500 hover:-translate-y-0.5">{t("call")}</a>
          </div>
        </div>
        <span className="sticker absolute end-5 top-24 w-24 bg-matcha text-sm text-chocolate md:end-16 md:top-32 md:w-32 md:text-lg" style={{ ["--rot" as string]: "12deg" }}>{t("sticker_fresh")}</span>
      </section>

      {/* 2. Marquee */}
      <div className="overflow-hidden bg-primary py-4 text-primary-foreground" aria-label={marquee.join(", ")}>
        <div className="marquee-track" aria-hidden>
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center">
              {marquee.map((m) => (
                <span key={m} className="flex items-center font-display text-2xl md:text-3xl">
                  <span className="px-6">{m}</span><span className="text-accent">✺</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 3. What we bake — editorial asymmetric grid */}
      <section id="menu" className="mx-auto max-w-7xl px-5 py-24 md:py-36">
        <div className="reveal grid gap-6 md:grid-cols-12">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent md:col-span-12">{t("menu_kicker")}</p>
          <h2 className="text-6xl leading-[0.9] text-primary md:col-span-7 md:text-8xl">{t("menu_title")}</h2>
          <p className="max-w-sm self-end text-muted-foreground md:col-span-4 md:col-start-9">{t("menu_intro")}</p>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-x-5 gap-y-14 md:grid-cols-12 md:gap-x-8">
          <Tile className="col-span-2 md:col-span-6" img={src(cro6, cro12)} w={1152} h={1440} sizes="(min-width:768px) 50vw, 100vw" rot={-1.5}
            title={t("croissant")} desc={t("croissant_d")} tag="pistachio!" />
          <div className="col-span-2 flex flex-col gap-14 md:col-span-5 md:col-start-8 md:pt-32">
            <Tile img={src(cin6, cin12)} w={1440} h={1494} sizes="(min-width:768px) 40vw, 100vw" rot={2} delay={80}
              title={t("cinnamon")} desc={t("cinnamon_d")} tag="still warm" />
            <div className="reveal relative rounded-[var(--radius)] bg-primary p-8 text-primary-foreground" style={{ transform: "rotate(-1deg)" }}>
              <Wheat className="mb-4 w-32 text-accent" />
              <h3 className="text-4xl">{t("sourdough")}</h3>
              <p className="mt-2 text-sm leading-relaxed opacity-90">{t("sourdough_d")}</p>
            </div>
          </div>

          <Tile className="col-span-2 md:col-span-7 md:-mt-10" img={src(coo6, coo12)} w={1440} h={1495} sizes="(min-width:768px) 58vw, 100vw" rot={1}
            title={t("cookies")} desc={t("cookies_d")} tag="red velvet ♥" />
          <div className="col-span-2 md:col-span-4 md:col-start-9 md:pt-40">
            <Tile img={src(hero6, hero12)} w={1536} h={1920} sizes="(min-width:768px) 33vw, 100vw" rot={-2.5} delay={80}
              title={t("smores")} desc={t("smores_d")} tag="+ iced matcha" />
            <p className="reveal mt-6 text-sm text-muted-foreground"><span className="font-display text-xl text-matcha">{t("matcha")}.</span> {t("matcha_d")}</p>
          </div>

          <div className="reveal col-span-2 self-center md:col-span-4 md:col-start-2">
            <span className="sticker mb-6 w-28 bg-accent text-accent-foreground" style={{ ["--rot" as string]: "-8deg" }}>{t("sticker_suly")}</span>
            <h3 className="text-4xl text-primary">{t("espresso")}</h3>
            <p className="mt-2 text-muted-foreground">{t("espresso_d")}</p>
          </div>
          <Tile className="col-span-2 md:col-span-6 md:col-start-7" img={src(piz6, piz12)} w={1440} h={1920} sizes="(min-width:768px) 50vw, 100vw" rot={1.5}
            title={t("pizza")} desc={t("pizza_d")} tag="hot slice" />
        </div>
      </section>

      {/* 4. The vibe — swipeable gallery on paper texture */}
      <section id="vibe" className="paper py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5">
          <p className="reveal text-sm font-medium uppercase tracking-[0.2em] text-accent">{t("vibe_kicker")}</p>
          <blockquote className="reveal mt-4 max-w-4xl font-display text-5xl leading-[0.95] text-primary md:text-7xl">“{t("vibe_quote")}”</blockquote>
          <p className="mt-4 text-sm text-muted-foreground md:hidden">{t("vibe_note")}</p>
        </div>
        <div className="snap-row mt-12 flex gap-5 overflow-x-auto px-5 pb-4 md:px-[max(1.25rem,calc((100vw-80rem)/2+1.25rem))]">
          {[
            { i: src(ben6, ben12), w: 1538, h: 1920, a: "Two friends on the red bench reading with espresso and a cinnamon roll on a Mars paper napkin" },
            { i: src(cup6, cup12), w: 1440, h: 1789, a: "A hand reaching for one of three orange Mars cups printed with 'Life is too short. Stay awake for it!'" },
            { i: src(cro6, cro12), w: 1152, h: 1440, a: "Chocolate-dipped croissants in red Mars wrapping paper on a terrazzo floor" },
            { i: src(hero6, hero12), w: 1536, h: 1920, a: "Iced matcha and a s'mores brownie cake slice in the afternoon sun" },
          ].map((g, k) => (
            <img key={k} {...g.i} sizes="(min-width:768px) 30vw, 78vw" width={g.w} height={g.h} loading="lazy" decoding="async" alt={g.a}
              className="w-[78vw] shrink-0 rounded-[var(--radius)] object-cover md:w-[30vw]" style={{ aspectRatio: "4/5", transform: `rotate(${k % 2 ? 1.2 : -1.2}deg)` }} />
          ))}
        </div>
      </section>

      {/* 5. Late night */}
      <section className="overflow-hidden bg-chocolate py-24 text-cream md:py-36">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-12">
          <div className="reveal md:col-span-7">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">{t("late_kicker")}</p>
            <h2 className="mt-4 text-5xl leading-[0.95] md:text-7xl">{t("late_title")}</h2>
          </div>
          <p className="reveal self-end text-lg leading-relaxed opacity-85 md:col-span-4 md:col-start-9" style={{ transitionDelay: "120ms" }}>{t("late_body")}</p>
        </div>
        <p className="drift mt-16 whitespace-nowrap font-display text-[22vw] leading-none text-primary" aria-hidden>{t("late_word")} · 2 PM → 12 AM</p>
      </section>

      {/* 6. Visit */}
      <section id="visit" className="mx-auto max-w-7xl px-5 py-24 md:py-36">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="reveal md:col-span-5">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">{t("visit_kicker")}</p>
            <h2 className="mt-4 text-6xl text-primary md:text-8xl">{t("visit_title")}</h2>
            <dl className="mt-10 space-y-6">
              <div><dt className="text-xs uppercase tracking-widest text-muted-foreground">{t("address")}</dt><dd className="mt-1 font-display text-2xl">HC64+457, Sulaymaniyah</dd></div>
              <div><dt className="text-xs uppercase tracking-widest text-muted-foreground">{t("hours")}</dt><dd className="mt-1 font-display text-2xl">{t("hours_v")}</dd></div>
              <div><dt className="text-xs uppercase tracking-widest text-muted-foreground">{t("phone")}</dt><dd className="mt-1"><a href={`tel:${PHONE}`} dir="ltr" className="font-display text-2xl underline decoration-accent underline-offset-4">{PHONE_LABEL}</a></dd></div>
              <div><dt className="text-xs uppercase tracking-widest text-muted-foreground">{t("follow")}</dt>
                <dd className="mt-2 flex gap-3">
                  <a href={IG} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center rounded-full border border-primary px-5 text-primary hover:bg-primary hover:text-primary-foreground">Instagram</a>
                  <a href={FB} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center rounded-full border border-primary px-5 text-primary hover:bg-primary hover:text-primary-foreground">Facebook</a>
                </dd></div>
            </dl>
          </div>
          {/* Styled "map" card instead of a heavy iframe */}
          <a href={MAPS} target="_blank" rel="noopener" className="reveal paper group relative flex min-h-[22rem] flex-col justify-between overflow-hidden rounded-[var(--radius)] border border-border p-8 md:col-span-6 md:col-start-7" style={{ transform: "rotate(1deg)" }}>
            <span className="sticker w-24 self-end bg-matcha text-sm text-chocolate" style={{ ["--rot" as string]: "10deg" }}>2 PM – 12 AM</span>
            <div>
              <span className="mb-4 block h-6 w-6 rounded-full border-4 border-cream bg-primary" />
              <p className="font-display text-5xl text-primary">HC64+457</p>
              <span className="mt-6 inline-flex min-h-12 items-center rounded-full bg-primary px-7 font-medium text-primary-foreground transition-transform duration-500 group-hover:-translate-y-0.5">{t("directions")} →</span>
            </div>
          </a>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="bg-primary px-5 pb-10 pt-20 text-primary-foreground">
        <div className="mx-auto max-w-7xl">
          <img src={logoC.url} alt="Mars Bakery and Café" width={898} height={388} loading="lazy" decoding="async" className="w-full max-w-3xl" />
          <Wheat className="mt-8 w-56 text-accent" />
          <div className="mt-10 flex flex-wrap justify-between gap-4 text-sm opacity-80">
            <span>© {new Date().getFullYear()} {t("footer")}</span>
            <span className="font-display">{t("tagline_a")} {t("tagline_b")}</span>
          </div>
        </div>
      </footer>

      {/* Mobile fixed action bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-2 bg-background p-3 md:hidden">
        <a href={`tel:${PHONE}`} className="inline-flex min-h-12 items-center justify-center rounded-full bg-secondary font-medium text-secondary-foreground">{t("call")}</a>
        <a href={MAPS} target="_blank" rel="noopener" className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary font-medium text-primary-foreground">{t("directions")}</a>
      </div>
    </div>
  );
}
