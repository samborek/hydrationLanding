const url = "https://api.hydradx.io/hydration-web/v1/stats";

export type StatsData = {
  tvl: number;
  vol_30d: number;
  xcm_vol_30d: number;
  assets_count: number;
  accounts_count: number;
};

const fallbackStats: StatsData = {
  tvl: 0,
  vol_30d: 0,
  xcm_vol_30d: 0,
  assets_count: 0,
  accounts_count: 0,
};

export async function fetchStats() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(url, {
      next: { revalidate: 60 },
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = (await response.json()) as StatsData;
    return data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return fallbackStats;
  } finally {
    clearTimeout(timeout);
  }
}
