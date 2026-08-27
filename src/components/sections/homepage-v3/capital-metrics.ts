"use client";

import { useEffect, useState } from "react";

export type CapitalWindow = "24h" | "7d" | "30d" | "allTime";

export type CapitalMetric = {
  id: "allocated" | "earned" | "generated" | "hollar";
  title: string;
  value: number | null;
  delta: number | null;
  prefix: "" | "$";
};

type CachedMetric = Pick<CapitalMetric, "value" | "delta"> & {
  cachedAt: number;
};

type FeeSummary = {
  total24h?: number;
  total7d?: number;
  total30d?: number;
  totalAllTime?: number;
};

type ProtocolHistory = {
  tvl?: Array<{ date: number; totalLiquidityUSD: number }>;
};

type StablecoinResponse = {
  currentChainBalances?: Record<string, { peggedUSD?: number }>;
  tokens?: Array<{
    date: number;
    circulating?: { peggedUSD?: number };
  }>;
};

const CACHE_TTL = 30 * 60 * 1000;
const CACHE_PREFIX = "hydration:defillama-capital:";
const protocols = ["hydration-dex", "hydration-lending"] as const;

const metricDefinitions: Array<Pick<CapitalMetric, "id" | "title" | "prefix">> = [
  {
    id: "allocated",
    title: "Total Capital Allocated",
    prefix: "$",
  },
  {
    id: "earned",
    title: "Total Yield Earned",
    prefix: "$",
  },
  {
    id: "generated",
    title: "Total Protocol Revenue Generated",
    prefix: "$",
  },
  {
    id: "hollar",
    title: "Total HOLLAR Issued",
    prefix: "",
  },
];

const emptyMetrics = metricDefinitions.map((metric) => ({
  ...metric,
  value: null,
  delta: null,
}));

function cacheKey(id: CapitalMetric["id"], window: CapitalWindow) {
  return `${CACHE_PREFIX}${id}:${window}`;
}

function readCache(id: CapitalMetric["id"], window: CapitalWindow) {
  try {
    const raw = localStorage.getItem(cacheKey(id, window));
    return raw ? (JSON.parse(raw) as CachedMetric) : null;
  } catch {
    return null;
  }
}

function writeCache(
  id: CapitalMetric["id"],
  window: CapitalWindow,
  metric: Pick<CapitalMetric, "value" | "delta">,
) {
  try {
    localStorage.setItem(
      cacheKey(id, window),
      JSON.stringify({
        ...metric,
        cachedAt: Date.now(),
      } satisfies CachedMetric),
    );
  } catch {
    // Private browsing and storage policies can disable localStorage. The live
    // value still remains available for the current page session.
  }
}

async function fetchJson<T>(url: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`DefiLlama returned ${response.status}`);
  return response.json() as Promise<T>;
}

function assertNumber(value: unknown, label: string) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`Missing ${label}`);
  }
  return value;
}

async function fetchFeeTotal(
  dataType: "dailySupplySideRevenue" | "dailyRevenue",
  window: CapitalWindow,
  signal: AbortSignal,
) {
  const fields: Record<CapitalWindow, keyof FeeSummary> = {
    "24h": "total24h",
    "7d": "total7d",
    "30d": "total30d",
    allTime: "totalAllTime",
  };
  const field = fields[window];
  const summaries = await Promise.all(
    protocols.map((protocol) =>
      fetchJson<FeeSummary>(
        `https://api.llama.fi/summary/fees/${protocol}?dataType=${dataType}`,
        signal,
      ),
    ),
  );

  return summaries.reduce(
    (sum, summary) => sum + assertNumber(summary[field], field),
    0,
  );
}

function nearestPoint(
  points: NonNullable<ProtocolHistory["tvl"]>,
  targetDate: number,
) {
  return points.reduce((nearest, point) =>
    Math.abs(point.date - targetDate) < Math.abs(nearest.date - targetDate)
      ? point
      : nearest,
  );
}

async function fetchAllocated(window: CapitalWindow, signal: AbortSignal) {
  const currentValues = await Promise.all(
    protocols.map((protocol) =>
      fetchJson<number>(`https://api.llama.fi/tvl/${protocol}`, signal),
    ),
  );
  const value = currentValues.reduce(
    (sum, current) => sum + assertNumber(current, "current TVL"),
    0,
  );

  // The homepage displays the all-time totals without a comparison period.
  // Avoid downloading the full multi-year protocol histories in that case.
  if (window === "allTime") return { value, delta: null };

  try {
    const histories = await Promise.all(
      protocols.map((protocol) =>
        fetchJson<ProtocolHistory>(
          `https://api.llama.fi/protocol/${protocol}`,
          signal,
        ),
      ),
    );
    const days = { "24h": 1, "7d": 7, "30d": 30 }[window];
    const comparableLevel = histories.reduce((sum, history) => {
      const points = history.tvl?.filter((point) =>
        Number.isFinite(point.totalLiquidityUSD),
      );
      if (!points?.length) throw new Error("Missing protocol TVL history");
      const point = nearestPoint(
        points,
        Math.floor(Date.now() / 1000) - days * 86400,
      );
      return sum + point.totalLiquidityUSD;
    }, 0);

    return { value, delta: value - comparableLevel };
  } catch (error) {
    if (signal.aborted) throw error;
    console.warn(
      "Allocated history unavailable; showing live level only",
      error,
    );
    return { value, delta: null };
  }
}

async function fetchHollar(window: CapitalWindow, signal: AbortSignal) {
  const response = await fetchJson<StablecoinResponse>(
    "https://stablecoins.llama.fi/stablecoin/312",
    signal,
  );
  const value = assertNumber(
    response.currentChainBalances?.Hydration?.peggedUSD,
    "HOLLAR circulation",
  );

  if (window === "allTime") return { value, delta: null };

  const days = { "24h": 1, "7d": 7, "30d": 30 }[window];
  const points = response.tokens?.filter(
    (point) =>
      Number.isFinite(point.date) &&
      Number.isFinite(point.circulating?.peggedUSD),
  );
  if (!points?.length) return { value, delta: null };

  const previousPoint = points.reduce((nearest, point) =>
    Math.abs(
      point.date - (Math.floor(Date.now() / 1000) - days * 86400),
    ) <
    Math.abs(
      nearest.date - (Math.floor(Date.now() / 1000) - days * 86400),
    )
      ? point
      : nearest,
  );
  const previous = previousPoint.circulating?.peggedUSD;

  return {
    value,
    delta: typeof previous === "number" ? value - previous : null,
  };
}

async function fetchMetric(
  id: CapitalMetric["id"],
  window: CapitalWindow,
  signal: AbortSignal,
) {
  if (id === "allocated") return fetchAllocated(window, signal);
  if (id === "hollar") return fetchHollar(window, signal);
  return {
    value: await fetchFeeTotal(
      id === "earned" ? "dailySupplySideRevenue" : "dailyRevenue",
      window,
      signal,
    ),
    delta: null,
  };
}

export function useCapitalMetrics(window: CapitalWindow) {
  const [metrics, setMetrics] = useState<CapitalMetric[]>(emptyMetrics);

  useEffect(() => {
    const controller = new AbortController();

    metricDefinitions.forEach((definition) => {
      const cached = readCache(definition.id, window);
      if (cached) {
        setMetrics((current) =>
          current.map((metric) =>
            metric.id === definition.id ? { ...metric, ...cached } : metric,
          ),
        );
      }
      if (cached && Date.now() - cached.cachedAt < CACHE_TTL) return;

      void fetchMetric(definition.id, window, controller.signal)
        .then((value) => {
          writeCache(definition.id, window, value);
          setMetrics((current) =>
            current.map((metric) =>
              metric.id === definition.id ? { ...metric, ...value } : metric,
            ),
          );
        })
        .catch((error: unknown) => {
          if (!controller.signal.aborted) {
            console.warn(
              `Failed to load ${definition.title} from DefiLlama`,
              error,
            );
          }
        });
    });

    return () => controller.abort();
  }, [window]);

  return metrics;
}

export function formatCompactMetric(value: number | null, prefix: "" | "$") {
  if (value === null || !Number.isFinite(value)) return "—";
  const formatted = new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
    minimumFractionDigits: value >= 1_000_000 ? 1 : 0,
  }).format(value);
  return `${prefix}${formatted}`;
}
