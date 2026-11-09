/** A failed asset load must be visible: a banner naming every URL that failed. */
const failed = new Set<string>();

export const reportAssetError = (url: string) => {
  if (failed.has(url)) return;
  failed.add(url);
  console.error(`[apxgp] asset failed to load: ${url}`);
  let banner = document.querySelector<HTMLElement>("[data-asset-errors]");
  if (!banner) {
    banner = document.createElement("div");
    banner.dataset.assetErrors = "";
    banner.setAttribute("role", "alert");
    banner.style.cssText =
      "position:fixed;left:0;right:0;top:0;z-index:100;padding:8px 16px;background:#ff6b00;color:#090a0b;font:500 12px/1.4 var(--font-sans);text-transform:uppercase;";
    document.body.appendChild(banner);
  }
  const line = document.createElement("div");
  line.textContent = `Failed to load: ${url}`;
  banner.appendChild(line);
};

/** Watches every <img> on the page and reports the ones that fail. */
export const watchImages = (root: ParentNode) => {
  const check = (img: HTMLImageElement) => {
    if (img.complete && img.naturalWidth === 0 && img.src) reportAssetError(img.currentSrc || img.src);
  };
  const onError = (event: Event) => {
    const target = event.target;
    if (target instanceof HTMLImageElement) reportAssetError(target.currentSrc || target.src);
  };
  root.addEventListener("error", onError, true);
  root.querySelectorAll("img").forEach((img) => {
    if (img.loading !== "lazy") check(img);
  });
  return () => root.removeEventListener("error", onError, true);
};
