const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..");
const OUTPUT_PATH = path.join(ROOT_DIR, "assets", "data", "gallery.json");
const IMAGE_EXTENSIONS = new Set([".avif", ".gif", ".jpeg", ".jpg", ".png", ".svg", ".webp"]);
const EXCLUDED_DIRECTORIES = new Set([
  ".github",
  ".jekyll-cache",
  ".sass-cache",
  "_includes",
  "_layouts",
  "_site",
  "assets",
  "blog",
  "images",
  "node_modules",
  "scripts"
]);
const LABEL_OVERRIDES = {
  bgimg: "Background Images",
  D6: "D6 Gallery",
  Other: "Other Images",
  YuriGifs: "Yuri Gifs",
  YuriHugs: "Yuri Hugs"
};
const ORDER_OVERRIDES = {
  bgimg: 10,
  YuriGifs: 20,
  YuriHugs: 30,
  Headpats: 40,
  Other: 50,
  D6: 60
};

const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base"
});

const prettifyLabel = (name) =>
  name
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim();

const toPosixPath = (value) => value.split(path.sep).join("/");

const isImageFile = (filePath) => IMAGE_EXTENSIONS.has(path.extname(filePath).toLowerCase());

const getImageFiles = (dirPath, rootFolderName) => {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const images = [];

  entries.forEach((entry) => {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      images.push(...getImageFiles(fullPath, rootFolderName));
      return;
    }

    if (!entry.isFile() || !isImageFile(entry.name)) {
      return;
    }

    const relativePath = toPosixPath(path.relative(ROOT_DIR, fullPath));
    images.push({
      name: entry.name,
      url: relativePath,
      category: rootFolderName
    });
  });

  return images;
};

const rootEntries = fs
  .readdirSync(ROOT_DIR, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .filter((entry) => !EXCLUDED_DIRECTORIES.has(entry.name))
  .map((entry) => entry.name);

const categories = rootEntries
  .map((folderName) => {
    const folderPath = path.join(ROOT_DIR, folderName);
    const images = getImageFiles(folderPath, folderName).sort((a, b) => collator.compare(a.url, b.url));

    if (images.length === 0) {
      return null;
    }

    return {
      key: folderName,
      label: LABEL_OVERRIDES[folderName] || prettifyLabel(folderName),
      path: `${folderName}/`,
      images
    };
  })
  .filter(Boolean)
  .sort((a, b) => {
    const orderA = ORDER_OVERRIDES[a.key] ?? Number.MAX_SAFE_INTEGER;
    const orderB = ORDER_OVERRIDES[b.key] ?? Number.MAX_SAFE_INTEGER;

    if (orderA !== orderB) {
      return orderA - orderB;
    }

    return collator.compare(a.label, b.label);
  });

const payload = {
  generatedAt: new Date().toISOString(),
  categories
};

fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log(`Gallery manifest written to ${OUTPUT_PATH}`);
