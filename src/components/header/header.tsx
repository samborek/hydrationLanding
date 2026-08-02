"use client";

import Link from "next/link";
import Button from "../ui/buttons/button";
import Logo from "../icons/logo";
import { twMerge } from "tailwind-merge";
import { useLenis } from "@studio-freight/react-lenis";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";

type MenuItem = {
  label: string;
  href: string;
  target?: "_blank";
};

const currentMenuItems: MenuItem[] = [
  {
    label: "Productive yield",
    href: "#productive-yield",
  },
  {
    label: "Strategies",
    href: "#strategies",
  },
  {
    label: "Why Hydration",
    href: "#why-hydration",
  },
  {
    label: "Security",
    href: "#security",
  },
  {
    label: "HDX",
    href: "#hdx",
  },
  {
    label: "Community",
    href: "#community",
  },
  {
    label: "Docs",
    href: "https://docs.hydration.net",
    target: "_blank",
  },
];

const previousMenuItems: MenuItem[] = [
  { label: "Blog", href: "#blog" },
  { label: "Security", href: "#security" },
  { label: "Strategy", href: "#hydrated-strategy" },
  { label: "Trade", href: "#trade" },
  { label: "Lend & Borrow", href: "#lend-borrow" },
  { label: "HOLLAR", href: "#hollar" },
  { label: "Governance", href: "#governance" },
  { label: "Devs", href: "#devs" },
  {
    label: "Docs",
    href: "https://docs.hydration.net",
    target: "_blank",
  },
];

const sectionScrollOffset = -88;

function HamburgerIcon({ open }: { open: boolean }) {
  const bar =
    "h-0.5 w-[1.375rem] origin-center rounded-full bg-purple transition duration-200 ease-out";
  return (
    <span className="flex h-5 w-5 flex-col items-center justify-center gap-[5px]">
      <span
        aria-hidden
        className={twMerge(bar, open && "translate-y-[7px] rotate-45")}
      />
      <span
        aria-hidden
        className={twMerge(bar, open && "scale-x-0 opacity-0")}
      />
      <span
        aria-hidden
        className={twMerge(bar, open && "-translate-y-[7px] -rotate-45")}
      />
    </span>
  );
}

export type HeaderProps = {
  className?: string;
  version?: "current" | "previous";
};

export default function Header({
  className,
  version = "current",
}: HeaderProps) {
  const lenis = useLenis();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuTopPx, setMenuTopPx] = useState(96);
  const [pastHero, setPastHero] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const menuItems =
    version === "previous" ? previousMenuItems : currentMenuItems;
  const scrollOffset = version === "previous" ? 0 : sectionScrollOffset;

  useEffect(() => {
    if (version !== "current") {
      setPastHero(false);
      return;
    }

    const hero = document.querySelector<HTMLElement>("[data-homepage-hero]");
    if (!hero) return;

    let frameId = 0;
    const updateHeaderSurface = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        setPastHero(hero.getBoundingClientRect().bottom <= 0);
      });
    };

    updateHeaderSurface();
    window.addEventListener("scroll", updateHeaderSurface, { passive: true });
    window.addEventListener("resize", updateHeaderSurface);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", updateHeaderSurface);
      window.removeEventListener("resize", updateHeaderSurface);
    };
  }, [version]);

  useLayoutEffect(() => {
    if (!menuOpen) return;

    function updatePanelTop() {
      const banner = shellRef.current;
      if (!banner) return;
      const bottom = banner.getBoundingClientRect().bottom;
      setMenuTopPx(Math.round(bottom + 10));
    }

    updatePanelTop();
    window.addEventListener("resize", updatePanelTop);
    return () => window.removeEventListener("resize", updatePanelTop);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function navigateTo(item: MenuItem) {
    setMenuOpen(false);
    if (item.target === "_blank") return;
    lenis?.scrollTo(item.href, { offset: scrollOffset });
  }

  return (
    <header
      className={twMerge("z-40 mx-auto w-full flex justify-center", className)}
    >
      <div
        ref={shellRef}
        className={twMerge(
          "relative w-full bg-beige px-3 pb-0 pt-0 transition-colors duration-300 sm:px-4 xl:mx-10 xl:max-w-[1352px] xl:rounded-xl xl:py-1 xl:pr-1",
          pastHero && "bg-white"
        )}
      >
        <div className="relative z-[60] flex items-center justify-between py-2.5 sm:py-3 xl:max-w-[none] xl:py-0">
          <button
            type="button"
            onClick={() => {
              lenis?.scrollTo(0);
              setMenuOpen(false);
            }}
            aria-label="Scroll to top"
          >
            <Logo size="small" />
          </button>
          <nav className="group hidden xl:flex gap-6 justify-center pointer-events-none">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                target={item.target}
                className="transition group-hover:opacity-50 hover:!opacity-100 text-sm font-medium font-geist leading-5 text-purple pointer-events-auto"
                onClick={(e) => {
                  if (item.target === "_blank") return;
                  e.preventDefault();
                  lenis?.scrollTo(item.href, { offset: scrollOffset });
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              className="xl:hidden flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-purple/15 bg-white/80 text-purple shadow-sm backdrop-blur-sm transition hover:border-purple/25 hover:bg-white"
              aria-expanded={menuOpen}
              aria-controls={panelId}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <HamburgerIcon open={menuOpen} />
            </button>
            <Button
              role="primary"
              action={{ href: "https://app.hydration.net", target: "_blank" }}
              className="!px-3 !py-2.5 text-sm sm:!px-5 sm:!py-3 sm:text-base"
            >
              Launch App
            </Button>
          </div>
        </div>

        {menuOpen ? (
          <>
            <button
              type="button"
              aria-label="Close menu"
              className="fixed inset-0 z-[45] xl:hidden bg-purple/35 backdrop-blur-[2px]"
              onClick={() => setMenuOpen(false)}
            />
            <nav
              id={panelId}
              aria-label="Site navigation"
              style={{ top: menuTopPx }}
              className="fixed inset-x-4 z-50 flex max-h-[calc(100vh-6rem-env(safe-area-inset-bottom,0px)-env(safe-area-inset-top,0px))] flex-col gap-1 overflow-y-auto rounded-[1.35rem] border border-purple/10 bg-white/95 px-6 py-5 shadow-[0_20px_60px_rgba(36,14,50,0.14)] xl:hidden backdrop-blur-md"
            >
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  target={item.target}
                  className="rounded-xl px-2 py-2.5 text-base font-medium font-geist text-purple transition hover:bg-beige hover:text-pink"
                  onClick={(e) => {
                    if (item.target !== "_blank") {
                      e.preventDefault();
                      navigateTo(item);
                    } else {
                      setMenuOpen(false);
                    }
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </>
        ) : null}
      </div>
    </header>
  );
}
