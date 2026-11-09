import Image from "next/image";
import { EthereumIcon } from "./v2/components/icons/Hugeicons";
import styles from "./risk-section.module.css";

const riskLimits = "These protections depend on correct configuration, reliable prices and timely execution. They do not guarantee recovery or immediate withdrawal. Yield can be negative.";

export default function RiskSection({ featured = false }: { featured?: boolean }) {
  const docsLink = (
    <a className={styles.link} href="https://docs.hydration.net/products/juicer/#principal-preservation-and-risks">
      Understand protection and risks <span aria-hidden="true">↗</span>
    </a>
  );

  return (
    <section className={`wrap ${styles.section}${featured ? ` ${styles.panel}` : ""}`} id="risk" aria-labelledby="juicer-risk-title">
      <div>
        <p className={styles.eyebrow}>HOW RISK IS MANAGED</p>
        <h2 className={styles.title} id="juicer-risk-title">
          Separate positions.<br />
          <em>Active risk controls.</em>
        </h2>
      </div>
      {featured ? (
        <>
          <dl className={styles.positions}>
            <div className={styles.position}>
              <dt>
                <span className={styles.positionIcon}><EthereumIcon size={26} /></span>
                Your ETH collateral
              </dt>
              <dd>Synthetic backing supports your ETH outside the PRIME loop’s liquidation path.</dd>
            </div>
            <div className={styles.position}>
              <dt>
                <span className={styles.positionIcon}>
                  <Image src="/assets/strategies/prime.png" alt="" width={28} height={28} />
                </span>
                The PRIME strategy
              </dt>
              <dd>Keepers reduce PRIME exposure and repay debt when the strategy hits safety limits.</dd>
            </div>
          </dl>
          <div className={styles.notice}>
            <div>
              <strong>Risk still applies</strong>
              <p>Strategy losses, contract failures and limited liquidity can affect your returns or delay withdrawals.</p>
            </div>
            {docsLink}
          </div>
        </>
      ) : (
        <div className={styles.copy}>
          <p>Your collateral sits outside the PRIME loop’s liquidation path. Synthetic backing supports its position, while keepers adjust strategy debt under onchain limits.</p>
          <p>{riskLimits}</p>
          {docsLink}
        </div>
      )}
    </section>
  );
}
