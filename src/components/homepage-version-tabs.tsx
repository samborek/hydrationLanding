import Link from "next/link";

export default function HomepageVersionTabs({
  active,
}: {
  active: "current" | "previous";
}) {
  return (
    <nav
      aria-label="Homepage version"
      className="fixed bottom-4 left-1/2 z-[80] flex -translate-x-1/2 rounded-full border border-purple/15 bg-beige/95 p-1 shadow-[0_12px_40px_rgba(36,14,50,0.2)] backdrop-blur-md md:bottom-6"
    >
      <VersionLink href="/" active={active === "current"}>
        New homepage
      </VersionLink>
      <VersionLink href="/previous" active={active === "previous"}>
        Previous homepage
      </VersionLink>
    </nav>
  );
}

function VersionLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`whitespace-nowrap rounded-full px-4 py-2.5 font-geist text-sm font-medium transition md:px-5 ${
        active
          ? "bg-purple text-white"
          : "text-purple/55 hover:bg-white hover:text-purple"
      }`}
    >
      {children}
    </Link>
  );
}
