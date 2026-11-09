import Link from "next/link";
import "./versions.css";

export default function VersionNav({ active }: { active: 1 | 2 | 3 }) {
  return (
    <nav className="juicer-version-nav" aria-label="Juicer versions">
      <span>Juicer</span>
      {([1, 2, 3] as const).map((version) => {
        const label = `V${version}`;
        const name = { 1: "Original", 2: "Current", 3: "Merged" }[version];
        const content = <>{label}<span> · {name}</span></>;
        const href = `/juicer/v${version}`;
        // V2's capacity RPC is allowed by its document's Content Security Policy.
        return active === 2 || version === 2 ? (
          <a key={version} href={href} aria-current={active === version ? "page" : undefined}>{content}</a>
        ) : (
          <Link key={version} href={href} prefetch aria-current={active === version ? "page" : undefined}>{content}</Link>
        );
      })}
    </nav>
  );
}
