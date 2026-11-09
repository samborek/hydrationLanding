import { readFile } from "node:fs/promises";
import path from "node:path";
import postcss from "postcss";
export async function getCurrentStyles({ preserveV2Top = false }: { preserveV2Top?: boolean } = {}) {
  const [supplied, overrides, current] = await Promise.all([
    readFile(path.join(process.cwd(), "public/juicer-supplied/assets/photo-Fg4yQ5jB.css"), "utf8"),
    readFile(path.join(process.cwd(), "src/app/juicer/v2/layout.css"), "utf8"),
    readFile(path.join(process.cwd(), "src/app/juicer/current.css"), "utf8"),
  ]);
  const currentCss = postcss.parse(current);
  if (preserveV2Top) {
    currentCss.walkRules((rule) => {
      const kept = rule.selectors.filter((selector) =>
        !/(^|[\s>+~])\.(?:hero|hero-[\w-]+|benefit-[\w-]+|juicer-v2-wordmark)(?=$|[\s.:>+~#\[])/.test(selector)
        && selector !== "h1,h2" && selector !== "h1" && selector !== "h2",
      );
      if (kept.length) rule.selectors = kept;
      else rule.remove();
    });
  }
  const css = postcss.parse(supplied + "\n" + overrides + "\n" + currentCss.toString());
  const animations = new Map<string, string>();
  css.walkAtRules("keyframes", (rule) => {
    const name = rule.params;
    rule.params = `juicer-current-${name}`;
    animations.set(name, rule.params);
  });
  css.walkRules((rule) => {
    if (rule.parent?.type === "atrule" && rule.parent.name === "keyframes") return;
    const selectors = rule.selectors
      .filter((selector) => selector !== "html" && selector !== "body")
      .map((selector) => selector === ":root" ? ".juicer-current" : selector.startsWith(".juicer-preview-header") ? selector : `:where(.juicer-current) ${selector}`);
    if (selectors.length) rule.selectors = selectors;
    else rule.remove();
  });
  css.walkDecls(/^(font(-family)?|animation(-name)?)$/, (declaration) => {
    if (declaration.prop.startsWith("font")) {
      declaration.value = declaration.value.replace(/\b(Geist Mono|Geist|Gazpacho)\b/g, "JuicerCurrent$1");
    } else {
      declaration.value = declaration.value.replace(/[\w-]+/g, (name) => animations.get(name) ?? name);
    }
  });
  return css.toString();
}
