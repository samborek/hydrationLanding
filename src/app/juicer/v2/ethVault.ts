// Juicenomics evaluate(MAINNET).vaults.eth.net, snapshot block 16,714,477.
export const modeledNetApr = 0.05490153216323518;
export const modelSource = "https://github.com/galacticcouncil/juicenomics/tree/0d8cf270dd848be9245b621818eb79cbc70f7627";

const rpc = "https://hdx.tarn.hydration.cloud";
const vaultAddress = "0x98db179d65b8abc53946bd89b3433a4fd3bfb60c";

export async function readEthVaultCapacity(signal: AbortSignal): Promise<number | null> {
  // totalAssets() and tvlCap() are denominated in the same collateral units.
  const response = await fetch(rpc, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal,
    body: JSON.stringify(["0x01e1d114", "0x3f23fa1a"].map((data, id) => ({
      jsonrpc: "2.0",
      id,
      method: "eth_call",
      params: [{ to: vaultAddress, data }, "latest"],
    }))),
  });
  if (!response.ok) return null;

  const values: { id: number; result?: string }[] = await response.json();
  if (!Array.isArray(values)) return null;
  const read = (id: number) => {
    const result = values.find((value) => value?.id === id)?.result;
    return typeof result === "string" && /^0x[\da-f]{64}$/i.test(result) ? BigInt(result) : null;
  };
  const assets = read(0);
  const cap = read(1);
  if (assets === null || cap === null || cap === BigInt(0)) return null;
  return Math.min(100, Number(assets) / Number(cap) * 100);
}
