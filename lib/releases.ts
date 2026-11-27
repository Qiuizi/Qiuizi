export const releaseRepos = ["Qisland", "DeepUnpack", "LightSkip", "XiangqiStudio", "info-station"] as const;

export type ReleaseRepo = (typeof releaseRepos)[number];

export type ReleaseInfo = {
  repo: ReleaseRepo;
  tag: string | null;
  title: string | null;
  url: string;
  downloadUrl: string | null;
  assetName: string | null;
};

export type ReleaseMap = Record<ReleaseRepo, ReleaseInfo>;

type GhAsset = {
  name?: string;
  browser_download_url?: string;
  size?: number;
};

type GhRelease = {
  tag_name?: string;
  name?: string;
  html_url?: string;
  assets?: GhAsset[];
};

const SKIP = /\.(sha256|sha512|blockmap|sig|yml|yaml)$/i;

function rank(name: string) {
  const lower = name.toLowerCase();
  if (lower.endsWith(".exe") || lower.endsWith(".msi")) return 0;
  if (lower.endsWith(".apk")) return 1;
  if (lower.endsWith(".dmg") || lower.endsWith(".pkg")) return 2;
  if (lower.endsWith(".zip") || lower.endsWith(".7z")) return 3;
  if (lower.endsWith(".appimage") || lower.endsWith(".deb") || lower.endsWith(".rpm")) return 4;
  return 5;
}

export function pickAsset(assets: GhAsset[]) {
  const usable = assets.filter(
    (asset): asset is Required<Pick<GhAsset, "name" | "browser_download_url">> & GhAsset =>
      Boolean(asset.name && asset.browser_download_url && !SKIP.test(asset.name) && (asset.size ?? 1) > 0),
  );
  usable.sort((a, b) => rank(a.name) - rank(b.name) || (b.size ?? 0) - (a.size ?? 0));
  return usable[0] ?? null;
}

export function releaseFallback(repo: ReleaseRepo): ReleaseInfo {
  return {
    repo,
    tag: null,
    title: null,
    url: `https://github.com/Qiuizi/${repo}/releases`,
    downloadUrl: null,
    assetName: null,
  };
}

async function fetchLatest(repo: ReleaseRepo): Promise<ReleaseInfo> {
  const fallback = releaseFallback(repo);
  try {
    const response = await fetch(`https://api.github.com/repos/Qiuizi/${repo}/releases/latest`, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "Qiuizi-OS",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      next: { revalidate: 3600 },
    });
    if (!response.ok) return fallback;
    const data = (await response.json()) as GhRelease;
    const asset = pickAsset(data.assets ?? []);
    return {
      repo,
      tag: data.tag_name?.trim() || null,
      title: data.name?.trim() || null,
      url: data.html_url || fallback.url,
      downloadUrl: asset?.browser_download_url ?? null,
      assetName: asset?.name ?? null,
    };
  } catch {
    return fallback;
  }
}

export async function getReleases(): Promise<ReleaseMap> {
  const pairs = await Promise.all(releaseRepos.map(async (repo) => [repo, await fetchLatest(repo)] as const));
  return Object.fromEntries(pairs) as ReleaseMap;
}
