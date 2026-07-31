import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ORIGIN = "https://taskbarhero.wiki";
const OUTPUT = path.resolve("data/taskbarhero-database");
const DATASETS_DIR = path.join(OUTPUT, "datasets");
const IMAGES_DIR = path.join(OUTPUT, "images");

await Promise.all([
  mkdir(DATASETS_DIR, { recursive: true }),
  mkdir(IMAGES_DIR, { recursive: true }),
]);

async function get(url, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { "user-agent": "Taskbarhero local database archive/1.0" },
      });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return response;
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
      }
    }
  }
  throw new Error(`${url}: ${lastError.message}`);
}

async function getJson(url) {
  return get(url).then((response) => response.json());
}

async function getDataset(name) {
  const urls = [`${ORIGIN}/data/t/${name}.json`, `${ORIGIN}/data/${name}.json`];
  for (const url of urls) {
    try {
      return { rows: await getJson(url), sourceUrl: url };
    } catch (error) {
      if (!error.message.includes("404 Not Found")) throw error;
    }
  }
  throw new Error(`${name}: no dataset endpoint found`);
}

function collectImageUrls(value, urls, referencedBy) {
  if (Array.isArray(value)) {
    for (const item of value) collectImageUrls(item, urls, referencedBy);
    return;
  }
  if (value && typeof value === "object") {
    for (const item of Object.values(value)) collectImageUrls(item, urls, referencedBy);
    return;
  }
  if (typeof value !== "string") return;

  const candidates = value.match(/(?:https?:\/\/[^\s"'<>]+|\/[^\s"'<>]+)/g) ?? [];
  for (const candidate of candidates) {
    let url;
    try {
      url = new URL(candidate.replace(/[),.;]+$/, ""), ORIGIN);
    } catch {
      continue;
    }
    if (url.origin !== ORIGIN) continue;
    if (!/\.(?:avif|gif|jpe?g|png|svg|webp)$/i.test(url.pathname)) continue;
    const key = url.href;
    if (!urls.has(key)) urls.set(key, new Set());
    urls.get(key).add(referencedBy);
  }
}

function collectHtmlImageUrls(html, urls, referencedBy) {
  const matches = html.matchAll(/(?:src|srcset)=["']([^"']+)["']/gi);
  for (const match of matches) {
    for (const candidate of match[1].split(",").map((part) => part.trim().split(/\s+/)[0])) {
      collectImageUrls(candidate, urls, referencedBy);
    }
  }
}

function localImagePath(url) {
  const pathname = decodeURIComponent(new URL(url).pathname)
    .split("/")
    .filter((part) => part && part !== "." && part !== "..")
    .map((part) => part.replace(/[<>:"|?*\u0000-\u001f]/g, "_"))
    .join("/");
  return path.join("images", pathname || "image");
}

async function mapLimit(items, limit, worker) {
  const results = new Array(items.length);
  let nextIndex = 0;
  async function run() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await worker(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return results;
}

const catalogUrl = `${ORIGIN}/data/catalog.json`;
const catalog = await getJson(catalogUrl);
await writeFile(path.join(OUTPUT, "catalog.json"), `${JSON.stringify(catalog, null, 2)}\n`);

const imageUrls = new Map();
const rowMismatches = [];
const datasets = await mapLimit(catalog, 6, async (meta, index) => {
  const { rows, sourceUrl } = await getDataset(meta.name);
  const file = `datasets/${meta.name}.json`;
  await writeFile(path.join(OUTPUT, file), `${JSON.stringify(rows, null, 2)}\n`);
  collectImageUrls(rows, imageUrls, meta.name);

  if (!Array.isArray(rows) || rows.length !== meta.rows) {
    rowMismatches.push({
      dataset: meta.name,
      expected: meta.rows,
      actual: Array.isArray(rows) ? rows.length : null,
    });
  }
  console.log(`[${index + 1}/${catalog.length}] ${meta.name}: ${rows.length} rows`);
  return {
    name: meta.name,
    label: meta.label,
    group: meta.group,
    rows: rows.length,
    columns: meta.columns,
    page_url: `${ORIGIN}${meta.route ?? `/database/${meta.name}`}`,
    source_url: sourceUrl,
    file,
  };
});

const pages = [
  { name: "database", url: `${ORIGIN}/database` },
  ...datasets.map(({ name, page_url: url }) => ({ name, url })),
];
await mapLimit(pages, 6, async ({ name, url }) => {
  const html = await get(url).then((response) => response.text());
  collectHtmlImageUrls(html, imageUrls, `page:${name}`);
});

const imageEntries = await mapLimit([...imageUrls.entries()], 8, async ([url, refs], index) => {
  const localPath = localImagePath(url);
  try {
    const response = await get(url);
    const bytes = Buffer.from(await response.arrayBuffer());
    const contentType = response.headers.get("content-type");
    if (!contentType?.startsWith("image/")) {
      throw new Error(`unexpected content-type ${contentType ?? "unknown"}`);
    }
    const absolutePath = path.join(OUTPUT, localPath);
    await mkdir(path.dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, bytes);
    console.log(`[image ${index + 1}/${imageUrls.size}] ${localPath}`);
    return {
      source_url: url,
      local_path: localPath,
      referenced_by: [...refs].sort(),
      content_type: contentType,
      bytes: bytes.length,
      sha256: createHash("sha256").update(bytes).digest("hex"),
      error: null,
    };
  } catch (error) {
    return {
      source_url: url,
      local_path: localPath,
      referenced_by: [...refs].sort(),
      content_type: null,
      bytes: null,
      sha256: null,
      error: error.message,
    };
  }
});

const manifest = {
  source: `${ORIGIN}/database`,
  downloaded_at: new Date().toISOString(),
  format_version: 1,
  dataset_count: datasets.length,
  row_count: datasets.reduce((sum, dataset) => sum + dataset.rows, 0),
  datasets,
  images: imageEntries,
  validation: {
    row_mismatches: rowMismatches,
    failed_images: imageEntries.filter((image) => image.error),
  },
};

await writeFile(path.join(OUTPUT, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(
  `Done: ${manifest.dataset_count} datasets, ${manifest.row_count} rows, ` +
    `${imageEntries.length - manifest.validation.failed_images.length}/${imageEntries.length} images`,
);
