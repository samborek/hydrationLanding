"use client";

import { useEffect, useRef, useState } from "react";
import { useLenis } from "@studio-freight/react-lenis";
import RiskSection from "./RiskSection";

const base = "/assets/juicer/v3/";
const app = "https://app.hydration.net/strategies/juicer";
const docs = "https://docs.hydration.net/products/juicer/";
const questions = [
  ["What happens when I deposit?", "Your asset is supplied as collateral to Hydration’s lending market, and you receive vault shares. The deposit itself does not immediately borrow or trade into PRIME. Automated operators, called keepers, deploy capacity gradually within price and borrowing limits."],
  ["Where does the yield come from?", "Juicer borrows HOLLAR against the vault’s collateral, exchanges it for PRIME, and supplies PRIME to borrow again within safety limits. Eligible PRIME earnings are harvested and converted back into your deposited asset. Fees, borrowing interest and execution costs reduce what can compound."],
  ["What does my balance include?", "Funded earnings join your vault balance automatically and stay invested. Pending yield is an estimate of earnings that have not yet been converted and funded; it is shown separately and is not available collateral."],
  ["How is my deposited asset protected?", "The collateral position and PRIME loop are separate. Synthetic backing supports the collateral position, while keepers reduce borrowing when safety thresholds are reached. Ordinary rebalancing uses strategy proceeds rather than selling your deposited ETH or tBTC. These protections are not an unconditional guarantee against loss."],
  ["What are the risks?", "Yield varies and can be negative. The PRIME loop can lose value or be liquidated. Operation depends on smart contracts, reliable prices, liquidity, governance and keeper execution. A shortfall can delay withdrawals while recovery funding is arranged, with no fixed recovery deadline."],
  ["Where do I check current vault terms?", "Open Juicer in the Hydration app to review supported vaults, fees, estimated yield, capacity and withdrawal terms. Rates and settings can change; check them before confirming a deposit."],
];

function CompoundExample({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const lenis = useLenis();
  const [amount, setAmount] = useState("1");
  const [rate, setRate] = useState("5");
  const [months, setMonths] = useState(12);
  const p = Number(amount), r = Number(rate);
  const valid = amount.trim() !== "" && rate.trim() !== "" && Number.isFinite(p) && Number.isFinite(r) && p > 0 && p <= 1000000 && r >= -50 && r <= 100;
  const result = valid ? p * Math.pow(1 + r / 100 / 12, months) : null;
  useEffect(() => {
    const el = dialog.current!;
    const previous = document.activeElement as HTMLElement | null;
    el.showModal(); lenis?.stop();
    return () => { el.close(); lenis?.start(); previous?.focus(); };
  }, [lenis]);
  return <dialog ref={dialog} className="preview-dialog" aria-labelledby="example-title" onCancel={onClose} onClick={e => { if (e.target === dialog.current) onClose(); }}>
    <div className="dialog-inner"><div className="dialog-top"><h2 id="example-title">How compounding works</h2><button className="icon-button" aria-label="Close example" onClick={onClose}>×</button></div>
      <p className="dialog-intro">Hypothetical example. Choose your own assumptions. These are not Juicer’s current rates or a forecast.</p>
      <div className="v3-fields"><label>Starting amount (ETH)<input autoFocus type="number" min="0.00000001" max="1000000" step="any" value={amount} onChange={e => setAmount(e.target.value)} /></label><label>Assumed annual rate (%)<input type="number" min="-50" max="100" step="any" value={rate} onChange={e => setRate(e.target.value)} /></label><label>Time: {months} months<input type="range" min="1" max="36" value={months} onChange={e => setMonths(Number(e.target.value))} /></label></div>
      <div className="v3-example-result" aria-live="polite">{result === null ? "Enter a positive amount and an annual rate between −50% and 100%." : <><span>Illustrative ending balance</span><strong>{result.toLocaleString("en-US", { maximumFractionDigits: 6 })} ETH</strong><small>{(result - p).toLocaleString("en-US", { maximumFractionDigits: 6, signDisplay: "always" })} ETH change</small></>}</div>
      <p className="v3-note">Assumes a constant rate compounded monthly, with all earnings reinvested. Actual results depend on deployment, rates, fees, conversion and execution. Losses are possible.</p><a className="button button-primary" href={app}>Check current terms in the app</a>
    </div>
  </dialog>;
}

export default function JuicerV3() {
  const [example, setExample] = useState(false);
  const [motion, setMotion] = useState(false);
  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotion(!query.matches);
    update(); query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return <div className="juicer-v3" data-version="3">
    <section className="hero" id="juicer-top" aria-labelledby="hero-title">
      {motion ? <video className="hero-video" autoPlay muted loop playsInline preload="metadata" poster={base + "orange-juice-fluid-loop-v4-poster.webp"} aria-hidden="true"><source src={base + "orange-juice-fluid-loop-v4.mp4"} type="video/mp4" /></video> : <img className="hero-video" src={base + "orange-juice-fluid-loop-v4-poster.webp"} alt="" />}
      <div className="hero-inner wrap"><div className="hero-content"><img className="v3-wordmark" src={base + "juicer-script.svg"} alt="Juicer" width="180" height="72" /><p className="v3-eyebrow">AUTOMATED YIELD ON HYDRATION</p><h1 id="hero-title" className="hero-description">Earn more from what<br /><em>you already hold.</em></h1><p className="hero-summary">Put your asset’s borrowing power to work.<br /> Juicer converts eligible yield back into the asset you deposit.</p><div className="hero-actions"><a href="#vaults" className="button button-primary">Explore the vaults</a><a className="v3-secondary" href="#how-it-works">How Juicer works ↓</a></div><p className="v3-note">Variable yield. Strategy risk. Withdrawals take time.</p></div></div>
      <button className="v3-motion" onClick={() => setMotion(!motion)} aria-label={motion ? "Pause background motion" : "Play background motion"}>{motion ? "Pause motion" : "Play motion"}</button>
    </section>
    <section className="benefit-band" aria-label="Juicer benefits"><div className="benefit-strip wrap">{[["benefit-asset.png","One asset in.","Earn in that asset."],["benefit-compound.png","Harvested yield","compounds."],["benefit-managed.png","Juicer handles","the strategy."]].map(([img,title,sub])=><div className="benefit-item" key={img}><img className="benefit-art" src={base + img} alt="" width="104" height="82" /><p>{title}<br /><span>{sub}</span></p></div>)}</div></section>
    <section className="process-section strategy-section" id="how-it-works" data-photo="v1"><div className="strategy-layout wrap"><div className="strategy-panel"><p className="v3-eyebrow">DEPOSIT. EARN. WITHDRAW.</p><h2>Where the yield <em>comes from.</em></h2><p>Juicer borrows HOLLAR against your deposit to fund a separate PRIME strategy. Eligible earnings are converted into your deposited asset after fees and borrowing costs.</p></div></div>
      <div className="v3-process wrap">{[["deposit","Deposit","Supply an asset to a Juicer vault and receive shares in your position. Keepers deploy its borrowing capacity gradually."],["earn","Earn","Juicer manages borrowing, trades and rebalancing. Funded earnings are added to your balance automatically."],["withdraw-side-pour","Withdraw","Request part or all of your position. After the delay, the strategy settles your exit as funds become available."]].map(([img,title,text],i)=><article key={img}><img src={base + `juicer-step-${img}.webp`} width="80" height="80" alt="" loading="lazy" /><span>0{i+1}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      <details className="v3-mechanics wrap"><summary>Follow the strategy step by step <span aria-hidden>+</span></summary><ol><li><strong>Supply collateral.</strong> Your deposit enters Hydration’s lending market.</li><li><strong>Borrow HOLLAR.</strong> The vault uses its borrowing power to access Hydration’s stablecoin.</li><li><strong>Build the PRIME loop.</strong> HOLLAR is swapped for PRIME. PRIME is supplied as collateral to borrow again within safety limits.</li><li><strong>Harvest and compound.</strong> Eligible earnings are converted to your asset. Fees and interest are paid; the remainder joins your balance.</li></ol><p className="v3-note">Pending yield remains an estimate until conversion and funding. Some PRIME earnings are retained for execution costs.</p><a href={docs}>Read the full strategy documentation ↗</a></details>
    </section>
    <section className="process-section process-forest"><div className="process-inner reinvest-layout wrap"><div className="process-copy"><p className="reinvest-statement"><span className="reinvest-highlight">Let your yield earn, too.</span> Juicer converts eligible harvested yield into your deposited asset and adds it to your balance automatically.</p><button className="button button-beige" onClick={() => setExample(true)}>Explore a compounding example</button><p className="v3-note">Funded earnings stay invested. No separate claim is needed.</p></div></div></section>
    <div className="fruit-marquee" aria-hidden="true"><div className="fruit-marquee-track">{[1,2,3].map(n=><img key={n} src={base + "fruit-slice-marquee.png"} alt="" loading="lazy" />)}</div></div>
    <section className="process-section process-withdraw" id="withdrawals"><div className="process-inner withdraw-layout wrap"><div className="process-copy"><p className="withdraw-intro">Withdrawals,<br /><em>step by step.</em></p><p className="v3-withdraw-note">The current delay is seven days before an unwind can start. This is not a payment deadline.</p></div><ol className="withdraw-explanation" aria-label="Withdrawal steps">{[["request","Request","Choose part or all of your position. Confirmed requests cannot be cancelled."],["settle","Settle","Your shares stay invested during the delay. Settlement then repays the debt allocated to your exit."],["claim","Receive","Collateral is released as funds become available. Payments may arrive in parts and take longer than the delay."]].map(([img,title,text])=><li key={img}><img className="withdraw-step-art" src={base + `withdraw-${img}.png`} width="180" height="150" alt="" loading="lazy" /><span>{title}</span><p>{text}</p></li>)}</ol></div><a className="v3-withdraw-link wrap" href="https://docs.hydration.net/quick_start/juicer/">Read the withdrawal guide ↗</a></section>
    <section className="vault-section wrap" id="vaults"><div className="vault-heading"><div className="vault-heading-title"><h2>Explore the vaults</h2></div><p>Review current availability, capacity and terms in the Hydration app.</p></div><div className="vault-grid"><article className="vault-card vault-card-eth"><div className="vault-card-copy"><div className="vault-card-name"><span>Ethereum</span></div><h3>ETH</h3><p>Deposit ETH. Eligible yield compounds into ETH automatically.</p></div><span className="vault-card-icon eth" aria-hidden="true"><img src={base + "orbit-lemon.png"} alt="" width="120" height="120" /></span><dl className="vault-card-metrics"><div><dt>Yield & fees</dt><dd><a href={app}>Check current terms ↗</a></dd></div><div><dt>Deposit availability</dt><dd><a href={app}>Check capacity in app ↗</a></dd></div></dl><footer className="vault-card-footer"><a className="button button-primary" href={app}>Open Juicer</a></footer></article><aside className="v3-checklist"><p className="v3-eyebrow">BEFORE YOU DEPOSIT</p><h3>Check the details.<br /><em>Choose your position.</em></h3><ol><li>Review the vault’s current yield estimate and fee terms.</li><li>Check remaining capacity and deposit availability.</li><li>Plan for the withdrawal delay and settlement period.</li><li>Keep enough funds for transaction fees.</li></ol><a href={docs}>Read the product overview ↗</a></aside></div></section>
    <RiskSection />
    <section className="closing-section"><div className="closing-inner wrap"><h2>Put your assets <em>to work.</em></h2><a className="button button-primary" href={app}>Open Juicer</a></div><hr className="closing-divider wrap" /><section className="faq-section wrap" id="questions" aria-labelledby="faq-title"><div className="faq-heading"><h2 id="faq-title">Questions,<br />answered.</h2><p>Understand the process before you deposit.</p></div><div className="faq-list">{questions.map(([q,a])=><details className="v3-faq" key={q}><summary>{q}<span aria-hidden>+</span></summary><p>{a}</p></details>)}</div></section><img className="v3-funnel" src={base + "footer-funnel.svg"} alt="" loading="lazy" /></section>
    {example && <CompoundExample onClose={() => setExample(false)} />}
  </div>;
}
