"use client";

/* Adapted from the supplied Juicer V2 source. */
/* eslint-disable @next/next/no-img-element -- Preserve the supplied artwork and intrinsic sizing. */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowDownLeft02Icon,
  ArrowDown01Icon,
  EthereumIcon,
} from "./components/icons/Hugeicons";
import PreviewDialog from "./components/PreviewDialog";
import { yieldFlow } from "../yield-flow";
import { modeledNetApr, modelSource, readEthVaultCapacity } from "./ethVault";

const juicerApp = "https://app.hydration.net/strategies/juicer";
const expandedStrategyAnchor = "how-it-works-expanded";
const belowHeroAnchors = new Set(["how-it-works", expandedStrategyAnchor, "vaults", "questions"]);
const strategyArt = {
  deposit: "/juicer-supplied/art/juicer-step-deposit.webp",
  earn: "/juicer-supplied/art/juicer-step-earn.webp",
  withdraw: "/juicer-supplied/art/juicer-step-withdraw-side-pour.webp",
};
const flowArt = [strategyArt.deposit, strategyArt.withdraw, strategyArt.earn];
const [supplyCollateral, borrowHollar, generateYield] = yieldFlow;
const strategyFlow = [
  supplyCollateral,
  borrowHollar,
  {
    ...generateYield,
    description: "Juicer puts borrowed HOLLAR to work in a yield strategy. Today, it uses a PRIME loop that repeats within onchain safety limits.",
  },
];

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

export default function JuicerV2() {
  const footerReleaseDistance = 240;
  const [showYieldExample, setShowYieldExample] = useState(false);
  const [vaultDetailsOpen, setVaultDetailsOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [footerDripping, setFooterDripping] = useState(false);
  const [ethCapacity, setEthCapacity] = useState<number | null | undefined>(undefined);
  const strategyRef = useRef<HTMLElement>(null);
  const footerFunnelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

  useLayoutEffect(() => {
    const section = strategyRef.current;
    if (!section) return;

    const motion = window.matchMedia("(min-width: 1041px) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!motion.matches) {
        section.style.removeProperty("--strategy-photo-drift");
        return;
      }
      const { top, height } = section.getBoundingClientRect();
      const viewport = window.innerHeight;
      const progress = Math.min(1, Math.max(0, (viewport - top) / (viewport + height)));
      section.style.setProperty("--strategy-photo-drift", `${((progress - 0.5) * 68).toFixed(2)}px`);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    motion.addEventListener("change", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      motion.removeEventListener("change", schedule);
      section.style.removeProperty("--strategy-photo-drift");
    };
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
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/juicer-supplied/video/orange-juice-fluid-loop-v4-poster.webp"
            aria-hidden="true"
          >
            <source src="/juicer-supplied/video/orange-juice-fluid-loop-v4.mp4" type="video/mp4" />
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

        <section className="benefit-band" aria-label="Juicer benefits">
          <div className="benefit-strip wrap">
            <div className="benefit-item">
              <img
                className="benefit-art"
                src="/juicer-supplied/art/benefit-asset.png"
                alt=""
                aria-hidden="true"
              />
              <p>
                One asset in.
                <br />
                <span>Earn in that asset.</span>
              </p>
            </div>
            <div className="benefit-item">
              <img
                className="benefit-art"
                src="/juicer-supplied/art/benefit-compound.png"
                alt=""
                aria-hidden="true"
              />
              <p>
                Harvested yield
                <br />
                <span>compounds.</span>
              </p>
            </div>
            <div className="benefit-item">
              <img
                className="benefit-art"
                src="/juicer-supplied/art/benefit-managed.png"
                alt=""
                aria-hidden="true"
              />
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

        <section
          className="process-section strategy-section"
          id="how-it-works"
          data-photo="v3"
          ref={strategyRef}
        >
          <span className="strategy-detail-anchor" id={expandedStrategyAnchor} />
          <img
            className="strategy-illustration"
            id="strategy-photo"
            src="/juicer-supplied/art/juicer-yield-classic-steel-left.webp"
            width={1536}
            height={1024}
            loading="lazy"
            alt=""
          />
          <div className="strategy-layout wrap">
            <div className="strategy-panel strategy-expanded">
              <h2>Where the yield{" "}<em>comes from.</em></h2>
              <p>Juicer uses your deposit’s borrowing power to fund a yield strategy and compounds eligible earnings back into your deposit.</p>
              <ol className="strategy-flow" role="list">
                {strategyFlow.map(({ title, description }, index) => (
                  <li key={title}>
                    <img className="strategy-flow-icon" src={flowArt[index]} width={54} height={54} alt="" />
                    <h3>{index + 1}. {title}</h3>
                    <p>{description}</p>
                  </li>
                ))}
              </ol>
              <div className="strategy-harvest">
                <img src={strategyArt.earn} width={34} height={34} alt="" />
                <div>
                  <h3>4. Harvest and compound</h3>
                  <p>Juicer converts eligible strategy earnings into your deposited asset, pays fees and interest, and compounds the remainder.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="process-section process-forest">
          <div className="process-inner reinvest-layout wrap">
            <div className="process-copy">
              <p className="reinvest-statement">
                <span className="reinvest-highlight">
                  Let your yield earn, too.
                </span>{" "}
                Juicer converts eligible harvested yield back into your deposited
                asset and adds it to your balance automatically.
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
            <img src="/juicer-supplied/art/fruit-slice-marquee.png" alt="" />
            <img src="/juicer-supplied/art/fruit-slice-marquee.png" alt="" />
            <img src="/juicer-supplied/art/fruit-slice-marquee.png" alt="" />
          </div>
        </div>

        <section className="process-section" id="risk" aria-labelledby="juicer-risk-title">
          <div className="process-inner withdraw-layout risk-layout wrap">
            <div className="process-copy">
              <h2 className="withdraw-intro" id="juicer-risk-title">
                How Juicer <em>manages risk.</em>
              </h2>
              <p className="process-note">
                Your deposited collateral and the PRIME strategy sit in separate positions.
                Automated operators called keepers monitor onchain safety thresholds and reduce strategy debt when those limits are reached.
              </p>
            </div>
            <ul className="withdraw-explanation" role="list">
              <li>
                <Image className="risk-art" src="/assets/juicer/risk-collateral-jar.webp" width={112} height={112} alt="" />
                <h3>Collateral protection</h3>
                <p>Synthetic backing supports your collateral outside the PRIME loop’s liquidation path.</p>
              </li>
              <li>
                <Image className="risk-art" src="/assets/juicer/risk-debt.webp" width={112} height={112} alt="" />
                <h3>Automatic debt reduction</h3>
                <p>Keepers repay debt when safety limits are reached. Ordinary rebalancing uses strategy proceeds.</p>
              </li>
              <li>
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

        <section className="vault-section wrap" id="vaults">
          <div className="vault-heading">
            <div className="vault-heading-title">
              <h2>Available vaults</h2>
              <span className="vault-status vault-coming-soon">More assets coming soon</span>
            </div>
            <p>Start with ETH. See current vault terms in the Hydration app.</p>
          </div>
          <div className="vault-grid">
            <article className="vault-card vault-card-eth">
              <div className="vault-card-copy">
                <div className="vault-card-name"><span>Ethereum</span></div>
                <h3>ETH</h3>
                <p>Deposit ETH and stay exposed to its price. Juicer uses your ETH as collateral for a managed yield strategy, then converts eligible earnings back to ETH and compounds them into your position.</p>
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
                    <a className="vault-metric-note" href={modelSource}>Juicenomics estimate</a>
                  </dd>
                </div>
                <div>
                  <dt>Capacity used</dt>
                  {typeof ethCapacity === "number" ? (
                    <>
                      <dd>
                        {ethCapacity > 99.9 && ethCapacity < 100 ? ">99.9" : ethCapacity.toFixed(1)}%
                        <meter aria-label="Capacity used" min={0} max={100} value={ethCapacity} />
                      </dd>
                    </>
                  ) : (
                    <dd className="vault-metric-unavailable">
                      {ethCapacity === undefined ? "Checking…" : <a href={juicerApp}>Check in app</a>}
                    </dd>
                  )}
                </div>
              </dl>
              <footer className="vault-card-footer">
                <a className="button button-primary" href={juicerApp} target="_blank" rel="noopener noreferrer">
                  Open ETH vault
                </a>
                <button
                  className="button vault-details-toggle"
                  type="button"
                  aria-expanded={vaultDetailsOpen}
                  aria-controls="eth-vault-details"
                  onClick={() => setVaultDetailsOpen(!vaultDetailsOpen)}
                >
                  How this vault works
                </button>
              </footer>
              <div className="vault-details" id="eth-vault-details" hidden={!vaultDetailsOpen}>
                <ul className="vault-details-steps" role="list">
                  <li>
                    <img src="/juicer-supplied/art/juicer-step-deposit.webp" width={36} height={36} alt="" />
                    <p><strong>Deposit ETH.</strong> You receive vault shares and keep exposure to ETH’s price. Juicer uses the deposit as collateral to borrow HOLLAR for a separate PRIME strategy.</p>
                  </li>
                  <li>
                    <img src="/juicer-supplied/art/juicer-step-earn.webp" width={36} height={36} alt="" />
                    <p><strong>Earn in ETH.</strong> Juicer converts eligible strategy earnings into ETH. After fees and borrowing costs, the remainder compounds into your position. Yield varies, and losses are possible.</p>
                  </li>
                  <li>
                    <img src="/juicer-supplied/art/juicer-step-withdraw-side-pour.webp" width={36} height={36} alt="" />
                    <p><strong>Withdraw through a queue.</strong> Request part or all of your position. Settlement starts after the withdrawal delay and depends on queue progress and liquidity.</p>
                  </li>
                </ul>
                <a href="https://docs.hydration.net/products/juicer/">Read the Juicer docs for fees, withdrawals and risks</a>
              </div>
            </article>
          </div>
        </section>

        <section className="closing-section">
          <div className="closing-inner">
            <h2>
              Put your assets <em>to work.</em>
            </h2>
            <a className="button button-primary" href={juicerApp}>
              Open Juicer
            </a>
          </div>
          <section
            className="faq-section wrap"
            id="questions"
            aria-labelledby="faq-title"
          >
            <div className="faq-heading">
              <h2 id="faq-title">Questions, answered.</h2>
              <p>How Juicer works, including the risks.</p>
            </div>
            <div className="faq-list">
              {questions.map((question, index) => (
                <div
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
              className="footer-funnel-art"
              viewBox="0 0 1780 374.467"
              preserveAspectRatio="none"
            >
              <path
                className="footer-funnel-body"
                d="M0 0H1780C1470.97 3.11111 1252.59 20.2899 1088.18 62.8084C1061.06 69.7935 969.431 99.3758 936.978 150.039C908.276 194.846 925.832 256.438 906.469 257.928C887.106 259.417 889.469 197.646 867.166 158.349C844.862 119.052 724.755 67.2768 627.94 52.3822C531.125 37.4876 278.125 5.18518 0 0Z"
              />
              <path
                className="footer-funnel-drop"
                d="M908.36 374.464C875.041 373.918 906.111 288.681 906.111 288.681C906.111 288.681 941.679 375.01 908.36 374.464Z"
              />
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
