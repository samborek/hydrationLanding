"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "../ui/buttons/button";
import Logo from "../icons/logo";
import { twMerge } from "tailwind-merge";
import { useLenis } from "@studio-freight/react-lenis";
import { usePrefersReducedMotion } from "@/animation/reduced-motion";
import { Fragment, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import LaunchAppButton from "./launch-app-button";

type MenuItem = {
  label: string;
  href: string;
  target?: "_blank";
  showExternalIcon?: boolean;
  isNew?: boolean;
};

const featureItems: MenuItem[] = [
  { label: "Productive yield", href: "#productive-yield" },
  { label: "Strategies", href: "#strategies" },
  { label: "Why Hydration", href: "#why-hydration" },
  { label: "Security", href: "#security" },
  { label: "HDX", href: "#hdx" },
  { label: "Community", href: "#community" },
];

const currentMenuItems: MenuItem[] = [
  { label: "Home", href: "/" },
  { label: "Juicer", href: "/juicer", isNew: true },
  { label: "Docs", href: "https://docs.hydration.net", target: "_blank" },
  {
    label: "Explorer",
    href: "https://hydration-explorer.neckwork.net",
    target: "_blank",
    showExternalIcon: true,
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
const desktopLinkClass = "relative inline-flex items-center gap-1 rounded-sm text-sm before:absolute before:-inset-x-3 before:-inset-y-2.5 font-medium font-geist leading-5 text-purple pointer-events-auto transition-colors hover:text-pink focus-visible:text-pink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink";
const mobileLinkClass = "flex min-h-11 items-center gap-2 rounded-sm font-geist text-[1.25rem] font-medium leading-tight text-purple transition-colors hover:text-pink focus-visible:text-pink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink";
const dropdownLinkClass = "block rounded-lg px-3 py-2 font-geist text-sm font-medium text-purple hover:bg-beige focus-visible:outline focus-visible:outline-2 focus-visible:outline-pink";

function NewBadge() {
  return (
    <span className="rounded-full bg-[#ffc44c] px-1.5 py-0.5 text-[10px] font-semibold leading-3 text-purple">
      New
    </span>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  const bar =
    "h-0.5 w-[1.375rem] origin-center rounded-full bg-purple transition-[transform,opacity] duration-200 ease-out";
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

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M6 3H3.75A.75.75 0 0 0 3 3.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75V10M9 3h4v4M13 3 7.5 8.5"
        stroke="currentColor"
        strokeWidth="1.75"
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export type HeaderProps = {
  className?: string;
  version?: "current" | "previous";
  fullPageNavigation?: boolean;
};

export default function Header({
  className,
  version = "current",
  fullPageNavigation = false,
}: HeaderProps) {
  const lenis = useLenis();
  const reducedMotion = usePrefersReducedMotion();
  const pathname = usePathname();
  const NavigationLink = fullPageNavigation ? "a" : Link;
  const menuHref = (href: string) => href.startsWith("#") && pathname !== "/" ? `/${href}` : href;
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuTopPx, setMenuTopPx] = useState(96);
  const [pastHero, setPastHero] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const panelId = useId();
  const featureCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuItems = version === "previous" ? previousMenuItems : currentMenuItems;
  const scrollOffset = version === "previous" ? 0 : sectionScrollOffset;

  useEffect(() => {
    if (version !== "current") {
      setPastHero(false);
      return;
    }

    const hero = document.querySelector<HTMLElement>("[data-homepage-hero]");
    if (!hero) { setPastHero(true); return; }

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

    const root = document.documentElement;
    const menuButton = menuButtonRef.current;
    const previousRootOverflow = root.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    const desktop = window.matchMedia("(min-width: 1280px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setMenuOpen(false);
    };

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        setMenuOpen(false);
      }
      if (e.key !== "Tab") return;

      const controls = Array.from(
        shellRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        ) ?? [],
      ).filter((element) => element.tabIndex >= 0 && element.getClientRects().length > 0);
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }

    lenis?.stop();
    root.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });
    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", closeOnDesktop);
      root.style.overflow = previousRootOverflow;
      document.body.style.overflow = previousBodyOverflow;
      lenis?.start();
      menuButton?.focus({ preventScroll: true });
    };
  }, [lenis, menuOpen]);

  function renderMenuLink(item: MenuItem, mobile: boolean, dropdown = false) {
    return (
      <NavigationLink
        key={item.href}
        href={menuHref(item.href)}
        target={item.target}
        rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
        className={mobile ? mobileLinkClass : dropdown ? dropdownLinkClass : desktopLinkClass}
        onClick={(event) => {
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          if (mobile) setMenuOpen(false);
          const disclosure = event.currentTarget.closest("details");
          if (disclosure) {
            disclosure.querySelector("summary")?.focus({ preventScroll: true });
            disclosure.open = false;
          }
          if (item.target === "_blank" || !item.href.startsWith("#") || pathname !== "/" || !lenis) return;
          event.preventDefault();
          lenis.start();
          lenis.scrollTo(item.href, { offset: scrollOffset, immediate: reducedMotion });
        }}
      >
        {item.label}
        {item.isNew && <NewBadge />}
        {item.showExternalIcon && (
          <ExternalLinkIcon className={mobile ? "h-4 w-4 shrink-0" : "h-3 w-3 shrink-0"} />
        )}
      </NavigationLink>
    );
  }

  function renderMenu(mobile: boolean) {
    return menuItems.map((item) => (
      <Fragment key={item.href}>
        {renderMenuLink(item, mobile)}
        {item.href === "/" && (
          <details
            className={twMerge("group relative pointer-events-auto", fullPageNavigation && "juicer-features-menu")}
            onPointerEnter={(event) => {
              if (featureCloseTimer.current) clearTimeout(featureCloseTimer.current);
              if (event.pointerType === "mouse" && window.matchMedia("(min-width: 1280px) and (hover: hover)").matches) event.currentTarget.open = true;
            }}
            onPointerLeave={(event) => {
              if (event.pointerType !== "mouse" || !window.matchMedia("(min-width: 1280px) and (hover: hover)").matches) return;
              const disclosure = event.currentTarget;
              featureCloseTimer.current = setTimeout(() => {
                if (!disclosure.contains(document.activeElement)) disclosure.open = false;
              }, 160);
            }}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false;
            }}
            onKeyDown={(event) => {
              if (event.key !== "Escape" || !event.currentTarget.open) return;
              event.preventDefault();
              event.stopPropagation();
              event.currentTarget.querySelector("summary")?.focus({ preventScroll: true });
              event.currentTarget.open = false;
            }}
          >
            <summary
              className={twMerge(mobile ? mobileLinkClass : desktopLinkClass, "cursor-pointer list-none [&::-webkit-details-marker]:hidden")}
              onClick={(event) => {
                if (mobile || !window.matchMedia("(min-width: 1280px) and (hover: hover)").matches) return;
                event.preventDefault();
                (event.currentTarget.parentElement as HTMLDetailsElement).open = true;
              }}
            >
              Features
              <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="h-3 w-3 shrink-0 group-open:rotate-180">
                <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </summary>
            <div className={twMerge(mobile ? "border-l border-purple/15 pl-4" : "absolute left-1/2 top-full z-10 mt-3 w-52 -translate-x-1/2 rounded-xl border border-purple/10 bg-white p-2 shadow-lg", fullPageNavigation && "juicer-features-panel")}>
              {featureItems.map((feature) => renderMenuLink(feature, mobile, true))}
            </div>
          </details>
        )}
      </Fragment>
    ));
  }

  return (
    <header
      className={twMerge("z-40 mx-auto w-full flex justify-center", fullPageNavigation && "juicer-preview-header", className)}
    >
      <div
        ref={shellRef}
        className={twMerge(
          "relative w-full bg-beige px-3 pb-0 pt-0 transition-colors duration-300 sm:px-4 xl:mx-10 xl:max-w-[1352px] xl:rounded-xl xl:py-1 xl:pr-1",
          pastHero && "bg-white"
        )}
      >
        <div className="relative z-[60] flex items-center justify-between py-2.5 sm:py-3 xl:max-w-[none] xl:py-0">
          <NavigationLink
            href="/"
            onClick={(e) => {
              if (pathname !== "/") return;
              e.preventDefault();
              lenis?.start();
              lenis?.scrollTo(0, { immediate: reducedMotion });
              setMenuOpen(false);
            }}
            aria-label="Hydration home"
            className="flex min-h-11 items-center"
          >
            <Logo size="small" />
          </NavigationLink>
          <nav aria-label="Site navigation" className="hidden xl:flex gap-6 justify-center pointer-events-none">
            {renderMenu(false)}
          </nav>
          <div className="flex flex-row-reverse items-center gap-2 sm:gap-2.5 xl:flex-row">
            <button
              ref={menuButtonRef}
              type="button"
              className="xl:hidden flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/80 text-purple shadow-[0_0_0_1px_rgba(36,14,50,0.12),0_1px_2px_rgba(36,14,50,0.06)] backdrop-blur-sm transition-[background-color,box-shadow] hover:bg-white hover:shadow-[0_0_0_1px_rgba(36,14,50,0.2),0_1px_2px_rgba(36,14,50,0.06)]"
              aria-expanded={menuOpen}
              aria-controls={menuOpen ? panelId : undefined}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <HamburgerIcon open={menuOpen} />
            </button>
            {version === "current" ? (
              <LaunchAppButton />
            ) : (
              <Button
                role="primary"
                action={{ href: "https://app.hydration.net", target: "_blank" }}
                className="!px-3 !py-2.5 text-sm sm:!px-5 sm:!py-3 sm:text-base"
              >
                Launch App
              </Button>
            )}
          </div>
        </div>

        {menuOpen ? (
          <>
            <button
              type="button"
              aria-label="Close menu"
              tabIndex={-1}
              className="fixed inset-0 z-[45] xl:hidden bg-purple/35 backdrop-blur-[2px] juicer-menu-backdrop"
              onClick={() => setMenuOpen(false)}
            />
            <nav
              ref={panelRef}
              id={panelId}
              aria-label="Site navigation"
              data-lenis-prevent
              style={{
                top: menuTopPx,
                maxHeight: `calc(100dvh - ${menuTopPx + 16}px - env(safe-area-inset-bottom, 0px))`,
              }}
              className="fixed inset-x-4 z-50 flex flex-col gap-6 overflow-y-auto overscroll-contain rounded-[1.35rem] bg-white/95 px-7 py-6 shadow-[0_0_0_1px_rgba(36,14,50,0.08),0_20px_60px_rgba(36,14,50,0.14)] sm:inset-x-auto sm:right-4 sm:w-[min(30rem,calc(100vw-2rem))] xl:hidden backdrop-blur-md juicer-mobile-menu-panel"
            >
              <div className="flex flex-col">
                {version === "previous" && (
                  <p className="mb-2 font-geist text-sm font-medium text-purple/55">
                    Explore
                  </p>
                )}
                {renderMenu(true)}
              </div>
            </nav>
          </>
        ) : null}
      </div>
    </header>
  );
}
