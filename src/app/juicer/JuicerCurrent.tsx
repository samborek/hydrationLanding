"use client";

/* Adapted from the supplied Juicer V2 source. */
/* eslint-disable @next/next/no-img-element -- Preserve the supplied artwork and intrinsic sizing. */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowDownLeft02Icon,
  ArrowDown01Icon,
  EthereumIcon,
} from "./v2/components/icons/Hugeicons";
import PreviewDialog from "./v2/components/PreviewDialog";
import { modeledNetApr, readEthVaultCapacity } from "./v2/ethVault";

const juicerApp = "https://app.hydration.net/strategies/juicer";
const expandedStrategyAnchor = "how-it-works-expanded";
const belowHeroAnchors = new Set(["how-it-works", expandedStrategyAnchor, "vaults", "questions"]);
const strategyArt = {
  deposit: "/assets/juicer/current/process-icon-deposit-figma.png",
  earn: "/assets/juicer/current/process-icon-earn-figma.png",
  withdraw: "/assets/juicer/current/process-icon-withdraw-figma.png",
};

function revealWords(text: string) {
  return text.split(" ").map((word, index) => (
    <span key={`${index}-${word}`}>
      {index > 0 && " "}
      <span className="yield-reveal-word" data-word={word}>{word}</span>
    </span>
  ));
}

const questions = [
  {
    title: "What is Juicer?",
    text: "Juicer offers automated yield vaults on Hydration. Choose a vault for an asset you hold and deposit it to receive vault shares. Juicer converts eligible harvested yield back into that asset and adds it to your position.",
  },
  {
    title: "Where does the yield come from?",
    text: "In the current strategy, Juicer uses your collateral to borrow HOLLAR and puts it to work in a separate PRIME loop. PRIME earns yield from real-world credit. Borrowing costs, the protocol’s share of harvested yield, and execution costs reduce what can be reinvested.",
  },
  {
    title: "What happens to the asset I deposit?",
    text: "You stay exposed to your deposited asset’s price. Synthetic backing helps keep the collateral separate from the PRIME loop’s liquidation path. During normal rebalancing, Juicer repays debt with strategy proceeds rather than selling your deposited asset.",
  },
  {
    id: "withdrawals",
    title: "How do withdrawals work?",
    text: "Request part or all of your position. Confirmed requests are final. Settlement can begin after the current seven-day delay, in queue order. Your position stays invested until settlement starts. You can claim available ETH or receive it in your wallet, and payouts may arrive in parts.",
    guide: "https://docs.hydration.net/quick_start/juicer/#withdraw-your-funds",
  },
  {
    title: "What are the risks?",
    text: "Yield varies and can be negative. The PRIME loop has its own liquidation risk, and protection depends on the contracts, reliable prices and timely strategy management. A shortfall can delay withdrawals while governance arranges recovery funding.",
  },
  {
    title: "Where can I see the current rate and fees?",
    text: "Open Juicer in the Hydration app to see available vaults and their current yield estimates, fees, capacity and withdrawal terms. Estimated yield can change with market conditions.",
  },
];

export default function JuicerCurrent({ enableYieldReveal = false }: { enableYieldReveal?: boolean }) {
  const footerReleaseDistance = 240;
  const [parity, setParity] = useState(false);
  useEffect(() => { setParity(new URLSearchParams(location.search).get("figma") === "1"); }, []);
  const [showYieldExample, setShowYieldExample] = useState(false);
  const [vaultDetailsOpen, setVaultDetailsOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [footerDripping, setFooterDripping] = useState(false);
  const [ethCapacity, setEthCapacity] = useState<number | null | undefined>(undefined);
  const footerFunnelRef = useRef<HTMLDivElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const yieldSectionRef = useRef<HTMLElement>(null);
  const processPhotoRef = useRef<HTMLDivElement>(null);
  const closingInnerRef = useRef<HTMLDivElement>(null);

  // Like the homepage, keep section content in the HTML and reveal it once
  // it enters view. Only sections below the initial viewport start concealed.
  useEffect(() => {
    const main = document.getElementById("juicer-main");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!main || reducedMotion.matches) return;
    const mobile = window.matchMedia("(max-width: 760px)");
    const sections = Array.from(main.querySelectorAll<HTMLElement>("[data-juicer-reveal], [data-juicer-mobile-reveal]"))
      .filter((section) => mobile.matches || !section.hasAttribute("data-juicer-mobile-reveal"));
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove("juicer-reveal-pending");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -8% 0px" });
    sections.forEach((section) => {
      if (mobile.matches || section.getBoundingClientRect().top < window.innerHeight * 0.92) return;
      section.classList.add("juicer-reveal-pending");
      observer.observe(section);
    });
    const revealAll = () => {
      if (!reducedMotion.matches) return;
      observer.disconnect();
      sections.forEach((section) => section.classList.remove("juicer-reveal-pending"));
    };
    reducedMotion.addEventListener("change", revealAll);
    const clearMobileReveals = () => {
      if (mobile.matches) {
        sections.forEach((section) => section.classList.remove("juicer-reveal-pending"));
        return;
      }
      sections.filter((section) => section.hasAttribute("data-juicer-mobile-reveal"))
        .forEach((section) => section.classList.remove("juicer-reveal-pending"));
    };
    mobile.addEventListener("change", clearMobileReveals);
    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener("change", revealAll);
      mobile.removeEventListener("change", clearMobileReveals);
      sections.forEach((section) => section.classList.remove("juicer-reveal-pending"));
    };
  }, []);

  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;
    const motion = window.matchMedia("(min-width: 761px) and (prefers-reduced-motion: no-preference)");
    const updateVideo = () => {
      video.pause();
      video.load();
      if (motion.matches) void video.play().catch(() => {});
    };
    motion.addEventListener("change", updateVideo);
    return () => motion.removeEventListener("change", updateVideo);
  }, []);

  useEffect(() => {
    const photo = processPhotoRef.current;
    if (!photo) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        photo.classList.add('is-visible');
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(photo);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const photo = processPhotoRef.current;
    if (!photo) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      if (reducedMotion.matches) {
        photo.style.setProperty("--process-parallax-scale", "1");
        return;
      }
      const rect = photo.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const progress = Math.max(-1, Math.min(1,
        (window.innerHeight / 2 - rect.top - rect.height / 2) / ((window.innerHeight + rect.height) / 2),
      ));
      const drift = window.innerWidth <= 760 ? 0.02 : 0.03;
      photo.style.setProperty("--process-parallax-scale", (1 + drift + progress * drift).toFixed(4));
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reducedMotion.addEventListener("change", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reducedMotion.removeEventListener("change", schedule);
    };
  }, []);

  useEffect(() => {
    const section = closingInnerRef.current;
    if (!section) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      if (reducedMotion.matches) {
        section.style.setProperty("--cta-parallax-y", "0px");
        return;
      }
      const rect = section.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const distance = (window.innerHeight - rect.height) / 2 - rect.top;
      const progress = Math.max(-1, Math.min(1, distance / ((window.innerHeight + rect.height) / 2)));
      const travel = window.innerWidth <= 760 ? 10 : 40;
      section.style.setProperty("--cta-parallax-y", `${(progress * travel).toFixed(1)}px`);
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reducedMotion.addEventListener("change", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reducedMotion.removeEventListener("change", schedule);
    };
  }, []);

  useEffect(() => {
    if (!enableYieldReveal) return;
    const section = yieldSectionRef.current;
    if (!section) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const words = Array.from(section.querySelectorAll<HTMLElement>(".yield-reveal-word"));
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const start = window.innerHeight * 0.8;
      const end = window.innerHeight * 0.2;
      // Finish the reveal by the midpoint of the section's scroll window.
      const progress = Math.max(0, Math.min(1, 2.15 * (start - rect.top) / (rect.height + start - end)));
      words.forEach((word, index) => {
        const fraction = Math.max(0, Math.min(1, progress * words.length - index));
        word.style.setProperty("--concealed", `${(100 - fraction * 100).toFixed(2)}%`);
      });
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    const syncMotion = () => {
      section.classList.toggle("yield-reveal-active", !motion.matches && window.innerWidth > 760);
      schedule();
    };
    syncMotion();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", syncMotion);
    motion.addEventListener("change", syncMotion);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", syncMotion);
      motion.removeEventListener("change", syncMotion);
      section.classList.remove("yield-reveal-active");
    };
  }, [enableYieldReveal]);

  useEffect(() => {
    if (new URLSearchParams(location.search).get("figma") === "1") return;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      controller.abort();
      setEthCapacity(null);
    }, 6000);
    readEthVaultCapacity(controller.signal)
      .then((capacity) => {
        if (!controller.signal.aborted) setEthCapacity(capacity);
      })
      .catch(() => {
        if (!controller.signal.aborted) setEthCapacity(null);
      })
      .finally(() => window.clearTimeout(timeout));
    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  useLayoutEffect(() => {
    const anchor = window.location.hash.slice(1);
    const questionIndex = questions.findIndex((question) => question.id === anchor);
    if (questionIndex >= 0) setOpenFaq(questionIndex);
    if (belowHeroAnchors.has(anchor) || questionIndex >= 0) {
      document.getElementById(anchor)?.scrollIntoView();
    }
  }, []);

  useEffect(() => {
    let overscrollDistance = 0;
    let lastTouchY: number | null = null;
    let animationTimer: number | undefined;
    let cooldownTimer: number | undefined;
    let gestureEndTimer: number | undefined;
    let coolingDown = false;

    const isAtPageEnd = () => {
      const bottom = footerFunnelRef.current?.getBoundingClientRect().bottom;
      return bottom !== undefined && bottom > 0 && bottom <= window.innerHeight + 3;
    };

    const renderPull = (progress: number) => {
      footerFunnelRef.current?.style.setProperty(
        "--footer-pull-scale",
        String(1 + Math.min(Math.max(progress, 0), 1) * 0.3),
      );
    };

    const releaseDrop = () => {
      if (coolingDown) return;
      coolingDown = true;
      if (gestureEndTimer) window.clearTimeout(gestureEndTimer);
      overscrollDistance = 0;
      renderPull(0);
      setFooterDripping(true);
      animationTimer = window.setTimeout(() => setFooterDripping(false), 1650);
      cooldownTimer = window.setTimeout(() => {
        coolingDown = false;
      }, 1900);
    };

    const resetPull = () => {
      overscrollDistance = 0;
      renderPull(0);
    };

    const finishPull = () => {
      if (overscrollDistance >= footerReleaseDistance) {
        releaseDrop();
      } else {
        resetPull();
      }
    };

    const collectOverscroll = (distance: number) => {
      if (coolingDown) return;
      if (!isAtPageEnd() || distance <= 0) {
        resetPull();
        return;
      }
      overscrollDistance += distance;
      renderPull(overscrollDistance / footerReleaseDistance);
    };

    const onWheel = (event: WheelEvent) => {
      collectOverscroll(event.deltaY);
      if (gestureEndTimer) window.clearTimeout(gestureEndTimer);
      if (!coolingDown && event.deltaY > 0 && isAtPageEnd()) {
        gestureEndTimer = window.setTimeout(finishPull, 32);
      }
    };
    const onTouchStart = (event: TouchEvent) => {
      lastTouchY = event.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (event: TouchEvent) => {
      const currentY = event.touches[0]?.clientY;
      if (currentY == null || lastTouchY == null) return;
      collectOverscroll(lastTouchY - currentY);
      lastTouchY = currentY;
    };
    const onTouchEnd = () => {
      lastTouchY = null;
      if (!coolingDown) finishPull();
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      if (animationTimer) window.clearTimeout(animationTimer);
      if (cooldownTimer) window.clearTimeout(cooldownTimer);
      if (gestureEndTimer) window.clearTimeout(gestureEndTimer);
    };
  }, []);

  return (
    <>
      <a className="skip-link" href="#juicer-main">Skip to content</a>
      <main id="juicer-main">
        <section className="hero" aria-labelledby="hero-title">
          <video
            ref={heroVideoRef}
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/juicer-supplied/video/orange-juice-fluid-loop-v4-poster.webp"
            aria-hidden="true"
          >
            <source src="/juicer-supplied/video/orange-juice-fluid-loop-v4.mp4" type="video/mp4" media="(min-width: 761px) and (prefers-reduced-motion: no-preference)" />
          </video>
          <div className="hero-inner wrap">
            <div className="hero-content">
              <img className="juicer-v2-wordmark" src="/juicer-supplied/brand/juicer-script.svg" alt="Juicer" width={150} height={60} />
              <h1 id="hero-title" className="hero-description">
                Earn more from what
                <br />
                <em>you already hold.</em>
              </h1>
              <p className="hero-summary">Juicer compounds eligible yield into the asset you deposit.</p>
              <div className="hero-actions">
                <a href="#vaults" className="button button-primary">
                  Explore the vaults
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="benefit-band selected-benefits" aria-label="Juicer benefits">
          <div className="benefit-strip wrap">
            <div className="benefit-item selected-benefit">
              <span className="selected-icon" aria-hidden="true"><img src="/assets/juicer/current/benefit-same-asset-citrus.webp" alt="" width={99} height={99} decoding="async" /></span>
              <p>
                One asset in.
                <br />
                <span>Earn in that asset.</span>
              </p>
            </div>
            <div className="benefit-item selected-benefit">
              <span className="selected-icon" aria-hidden="true"><img src="/assets/juicer/current/benefit-compounding-citrus.webp" alt="" width={99} height={99} decoding="async" /></span>
              <p>
                Harvested yield
                <br />
                <span>compounds.</span>
              </p>
            </div>
            <div className="benefit-item selected-benefit">
              <span className="selected-icon" aria-hidden="true"><img src="/assets/juicer/current/benefit-managed-citrus.webp" alt="" width={99} height={99} decoding="async" /></span>
              <p>
                Juicer handles
                <br />
                <span>the strategy.</span>
              </p>
            </div>
            <a href="#how-it-works" aria-label="Discover how Juicer works">
              <ArrowDownLeft02Icon size={24} />
            </a>
          </div>
        </section>

        <section className="current-process" id="how-it-works" aria-labelledby="process-title">
          <div className="current-process-photo" ref={processPhotoRef}><img src="/assets/juicer/current/process-pool.webp" alt="A citrus juicer beside a blue mosaic pool" loading="lazy" decoding="async" /></div>
          <div className="current-process-copy" data-juicer-reveal>
            <h2 id="process-title">How Juicer<br /><em>puts your assets to work.</em></h2>
            <p className="current-process-intro">Deposit once. Juicer manages the strategy and compounds eligible yield into the asset you hold. Track your position and request an exit in the app.</p>
            <ol className="current-steps">
              {[
                [strategyArt.deposit, "Deposit into a vault", "Your asset supplies collateral to Hydration’s lending market. Vault shares represent your position."],
                [strategyArt.earn, "Earn in your deposited asset", "Juicer puts the strategy to work and converts eligible earnings back into your deposited asset, after fees and interest."],
                [strategyArt.withdraw, "Claim your yield", "After the 7-day waiting period, Juicer repays the exit’s debt and releases collateral as funds become available."],
              ].map(([art,title,description],i)=><li key={title} data-juicer-mobile-reveal><div className="current-step-icon"><img src={art} alt="" width={100} height={100}/><span className="current-step-badge" aria-hidden="true">0{i+1}</span></div><div><h3>{title}</h3><p>{description}</p></div></li>)}
            </ol>
          </div>
        </section>

        <section className="process-section process-forest" ref={yieldSectionRef}>
          <div className="process-inner reinvest-layout wrap">
            <div className="process-copy" data-juicer-reveal>
              <p className="reinvest-statement" aria-label="Let your yield earn, too. Juicer converts eligible harvested yield back into your deposited asset and adds it to your balance automatically.">
                <span className="reinvest-highlight" aria-hidden={enableYieldReveal}>
                  {enableYieldReveal ? revealWords("Let your yield earn, too.") : "Let your yield earn, too."}
                </span>{" "}
                <span className="current-reinvest-line" aria-hidden={enableYieldReveal}>{enableYieldReveal ? revealWords("Juicer converts eligible harvested") : "Juicer converts eligible harvested"}</span>{" "}
                <span className="current-reinvest-line" aria-hidden={enableYieldReveal}>{enableYieldReveal ? revealWords("yield back into your deposited asset") : "yield back into your deposited asset"}</span>{" "}
                <span className="current-reinvest-line" aria-hidden={enableYieldReveal}>{enableYieldReveal ? revealWords("and adds it to your balance") : "and adds it to your balance"}</span>{" "}
                <span className="current-reinvest-line" aria-hidden={enableYieldReveal}>{enableYieldReveal ? revealWords("automatically.") : "automatically."}</span>
              </p>
              <button
                className="button button-primary"
                onClick={() => setShowYieldExample(true)}
              >
                Estimate ETH yield
              </button>
            </div>
          </div>
        </section>

        <div className="fruit-marquee" aria-hidden="true">
          <div className="fruit-marquee-track">
            <img src="/juicer-supplied/art/fruit-slice-marquee.webp" alt="" loading="lazy" decoding="async" />
            <img src="/juicer-supplied/art/fruit-slice-marquee.webp" alt="" loading="lazy" decoding="async" />
            <img src="/juicer-supplied/art/fruit-slice-marquee.webp" alt="" loading="lazy" decoding="async" />
          </div>
        </div>

        <section className="process-section" id="risk" aria-labelledby="juicer-risk-title">
          <div className="process-inner withdraw-layout risk-layout wrap">
            <div className="process-copy" data-juicer-reveal>
              <h2 className="withdraw-intro" id="juicer-risk-title">
                How Juicer <em>manages risk.</em>
              </h2>
              <p className="process-note">
                Your deposited collateral and the PRIME strategy sit in separate positions.
                Automated operators called keepers monitor onchain safety thresholds and reduce strategy debt when those limits are reached.
              </p>
            </div>
            <ul className="withdraw-explanation" role="list" data-juicer-reveal>
              <li data-juicer-mobile-reveal>
                <Image className="risk-art" src="/assets/juicer/risk-collateral-jar.webp" width={112} height={112} alt="" />
                <h3>Collateral protection</h3>
                <p>Synthetic backing supports your collateral outside the PRIME loop’s liquidation path.</p>
              </li>
              <li data-juicer-mobile-reveal>
                <Image className="risk-art" src="/assets/juicer/risk-debt.webp" width={112} height={112} alt="" />
                <h3>Automatic debt reduction</h3>
                <p>Keepers repay debt when safety limits are reached. Ordinary rebalancing uses strategy proceeds.</p>
              </li>
              <li data-juicer-mobile-reveal>
                <Image className="risk-art" src="/assets/juicer/risk-warning.webp" width={112} height={112} alt="" />
                <h3>Risks that remain</h3>
                <p>Market losses, contract failures and limited liquidity can affect returns or delay withdrawals.</p>
              </li>
            </ul>
            <a className="risk-guide" href="https://docs.hydration.net/products/juicer/#principal-preservation-and-risks">
              Read about protection and risks <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>

        <section className="current-vault-section" id="vaults"><div className="vault-section wrap">
          <div className="vault-heading" data-juicer-reveal>
            <div className="vault-heading-title">
              <h2>Available vaults</h2>
              <span className="vault-status vault-coming-soon">More assets coming soon</span>
            </div>

          </div>
          <div className="vault-grid" data-juicer-reveal>
            <article className="vault-card vault-card-eth">
              <div className="vault-card-copy">
                <div className="vault-card-name"><span>Ethereum</span></div>
                <h3>ETH</h3>
                <p>Keep your ETH exposure while Juicer manages the strategy and compounds eligible yield back into ETH.</p>
              </div>
              <span className="vault-card-icon eth" aria-hidden="true">
                <img src="/juicer-supplied/art/orbit-lemon.png" alt="" />
                <span className="vault-asset-mark"><EthereumIcon size={28} /></span>
              </span>
              <dl className="vault-card-metrics">
                <div>
                  <dt>Modeled net APR</dt>
                  <dd>
                    {(modeledNetApr * 100).toFixed(2)}%
                  </dd>
                  <small className="vault-apr-caption">Juicenomics estimate</small>
                </div>
                <div>
                  <dt>Capacity used</dt>
                  {parity || typeof ethCapacity === "number" ? (
                    <>
                      <dd>
                        {parity ? ">99.9" : ethCapacity! > 99.9 && ethCapacity! < 100 ? ">99.9" : ethCapacity!.toFixed(1)}%
                        <meter aria-label="Capacity used" min={0} max={100} value={ethCapacity ?? 0} />
                      </dd>
                    </>
                  ) : (
                    <dd className="vault-metric-unavailable">
                      {ethCapacity === undefined ? "Checking…" : <a href={juicerApp}>Check in app</a>}
                    </dd>
                  )}
                </div>
                <div className="current-tvl"><dt>TVL</dt><dd>{parity ? "$101.07K" : "—"}</dd></div>
              </dl>
              <footer className="vault-card-footer">
                <a className="button button-primary" href={juicerApp} target="_blank" rel="noopener noreferrer">
                  Open ETH vault
                </a>
                <button
                  className={`button vault-details-toggle ${vaultDetailsOpen ? "vault-details-toggle-open" : "button-primary"}`}
                  type="button"
                  aria-expanded={vaultDetailsOpen}
                  aria-controls="eth-vault-details"
                  onClick={() => setVaultDetailsOpen(!vaultDetailsOpen)}
                >
                  {vaultDetailsOpen ? "Hide vault details ↑" : "How this vault works?"}
                </button>
              </footer>
              <div className="vault-details" id="eth-vault-details" hidden={!vaultDetailsOpen}>
                <h4>How this vault works?</h4>
                <ol className="vault-details-steps">
                  {([
                    ["icon-ethereum.svg", "Supply collateral", "Your ETH backs borrowing in Hydration’s lending market."],
                    ["icon-coins.svg", "Borrow HOLLAR", "Juicer borrows HOLLAR against the vault’s collateral."],
                    ["icon-trending.svg", "Generate yield", "HOLLAR is exchanged for PRIME; the strategy repeats within safety limits."],
                    ["icon-repeat.svg", "Harvest & compound", "Eligible earnings return to ETH after fees and interest."],
                  ] as const).map(([icon, title, description], index) => (
                    <li key={title}>
                      <div className="vault-step-top"><span className="vault-step-icon"><img src={`/assets/juicer/current/${icon}`} alt="" /></span><span className="vault-step-number">0{index + 1}</span></div>
                      <strong>{title}</strong><p>{description}</p>
                    </li>
                  ))}
                </ol>
                <div className="vault-details-note"><span>ETH earnings vary with strategy yield, borrowing rates and costs. Withdrawals depend on available funds.</span><span className="vault-exit-note"><img src="/assets/juicer/current/icon-exit-clock.svg" alt="" />Exit: 7-day waiting period</span></div>
                <button type="button" className="vault-close-details" onClick={() => setVaultDetailsOpen(false)}>Close details ↑</button>
              </div>
            </article>
          </div>
          <span className="sr-only">{parity ? "Design comparison: capacity and TVL are mock figures." : "TVL is unavailable. Open the app for current vault data."}</span></div>
        </section>

        <section className="closing-section">
          <div className="closing-inner" ref={closingInnerRef}><div className="wrap current-cta-copy">
            <h2>
              Put your assets<br />to work.
            </h2>
            <a className="button button-primary" href={juicerApp}>
              Open Juicer
            </a>
          </div></div>
          <section
            className="faq-section wrap"
            id="questions"
            aria-labelledby="faq-title"
          >
            <div className="faq-heading" data-juicer-reveal>
              <h2 id="faq-title">Got more questions?</h2>
              <p>How Juicer works, including the risks.</p>
            </div>
            <div className="faq-list" data-juicer-reveal>
              {questions.map((question, index) => (
                <div
                  data-juicer-mobile-reveal
                  className={`faq-item ${openFaq === index ? "expanded" : ""}`}
                  key={question.title}
                  id={question.id}
                >
                  <h3>
                    <button
                      aria-expanded={openFaq === index}
                      aria-controls={`faq-answer-${index}`}
                      id={`faq-question-${index}`}
                      onClick={() =>
                        setOpenFaq(openFaq === index ? null : index)
                      }
                    >
                      {question.title}
                      <ArrowDown01Icon size={19} />
                    </button>
                  </h3>
                  <div
                    id={`faq-answer-${index}`}
                    role="region"
                    aria-labelledby={`faq-question-${index}`}
                    className="faq-answer"
                    aria-hidden={openFaq !== index}
                    ref={(element) => { element?.toggleAttribute("inert", openFaq !== index); }}
                  >
                    <div className="faq-answer-inner">
                      <p>
                        {question.text}
                        {question.guide && (
                          <>{" "}<a className="faq-guide" href={question.guide}>Read the withdrawal guide <span aria-hidden="true">↗</span></a></>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <div
            ref={footerFunnelRef}
            className={`juice-funnel ${footerDripping ? "is-dripping" : ""}`}
            aria-hidden="true"
          >
            <svg
              className="footer-funnel-art footer-funnel-desktop"
              viewBox="0 0 1780 374.467"
              preserveAspectRatio="none"
            >
              <path
                className="footer-funnel-body"
                d="M0 0H1780C1470 3 1253 20 1088 63C1061 70 969 99 937 150C908 195 925 264 906 280C887 270 889 198 867 158C845 119 725 67 628 52C531 37 278 5 0 0Z"
              />
              <path
                className="footer-funnel-drop"
                d="M906 279C897 284 899 299 906 302C914 299 915 284 906 279Z"
              />
            </svg>
            <svg className="footer-funnel-art footer-funnel-mobile" viewBox="0 0 390 240" preserveAspectRatio="none">
              <path className="footer-mobile-body" d="M0 0H390C300 6 255 26 235 58C214 90 214 132 195 166C176 132 176 90 155 58C135 26 90 6 0 0Z" />
              <path className="footer-mobile-drop" d="M195 176C181 193 183 208 195 214C207 208 209 193 195 176Z" />
            </svg>
          </div>
        </section>
      </main>

      {showYieldExample && (
        <PreviewDialog onClose={() => setShowYieldExample(false)} />
      )}
    </>
  );
}
