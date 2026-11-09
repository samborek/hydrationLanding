import { useEffect, useRef, useState } from "react";
import { Cancel01Icon } from "./icons/Hugeicons";
import { modeledNetApr, modelSource } from "../ethVault";

const modeledNetApy = Math.expm1(modeledNetApr);

export default function PreviewDialog({
  onClose,
}: {
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [amount, setAmount] = useState("1");
  const [months, setMonths] = useState(12);
  const principal = Number(amount);
  const valid =
    amount.trim() !== "" &&
    Number.isFinite(principal) &&
    principal >= 0.00000001 &&
    principal <= 1000000;
  const gain = valid ? principal * Math.expm1(modeledNetApr * months / 12) : 0;
  const end = principal + gain;
  const number = (value: number) =>
    value.toLocaleString("en-US", {
      maximumFractionDigits: value >= 0.0001 ? 4 : 8,
    });

  useEffect(() => {
    const element = dialog.current!;
    const previousFocus = document.activeElement as HTMLElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    element.showModal();
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, []);

  return (
    <dialog
      ref={dialog}
      className="preview-dialog"
      aria-labelledby="preview-title"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === dialog.current) onClose();
      }}
    >
      <div className="dialog-inner">
        <div className="dialog-top">
          <h2 id="preview-title">ETH yield estimate</h2>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close estimate"
          >
            <Cancel01Icon size={21} />
          </button>
        </div>
        <p className="dialog-intro">More assets coming soon.</p>
        <div className="amount-field">
          <label htmlFor="deposit-amount">Starting amount</label>
          <div>
            <input
              id="deposit-amount"
              type="number"
              inputMode="decimal"
              min="0.00000001"
              max="1000000"
              step="any"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              aria-invalid={!valid}
              aria-describedby={!valid ? "amount-error" : undefined}
            />
            <span>ETH</span>
          </div>
        </div>
        {!valid && (
          <p id="amount-error" className="input-error">
            Enter 0.00000001 to 1,000,000 ETH.
          </p>
        )}
        <div className="estimate-rate">
          <span>Modeled net APY</span>
          <strong>{(modeledNetApy * 100).toFixed(2)}%</strong>
        </div>
        <div className="duration-row">
          <span>Time in the vault</span>
          <div role="group" aria-label="Illustration duration">
            {[3, 6, 12].map((value) => (
              <button
                key={value}
                aria-pressed={months === value}
                className={months === value ? "selected" : ""}
                onClick={() => setMonths(value)}
              >
                {value} mo
              </button>
            ))}
          </div>
        </div>
        <div className="preview-result" aria-live="polite">
          <span>Estimated balance after {months} months</span>
          <strong>
            {valid ? number(end) : "—"} <small>ETH</small>
          </strong>
          {valid && <div>{gain < 0.00000001 ? "<0.00000001" : `+${number(gain)}`} ETH in modeled yield</div>}
        </div>
        <p className="fine-print">
          <a href={modelSource}>Juicenomics model</a>, not a live rate. Excludes entry and exit costs.
        </p>
      </div>
    </dialog>
  );
}
