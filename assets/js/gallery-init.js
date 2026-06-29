/**
 * Gallery Logic for Image Hosting
 * Loads gallery data from a generated manifest so GitHub uploads show up automatically.
 */
(() => {
  const GALLERY_MANIFEST_PATH = "assets/data/gallery.json";
  const rarityOverlays = [
    {
      key: "golden",
      label: "Golden",
      colors: ["#ca8a04", "#fef08a", "#ca8a04"],
      glow: "rgba(254, 240, 138, 0.62)"
    },
    {
      key: "diamond",
      label: "Diamond",
      colors: ["#1d4ed8", "#bfdbfe", "#1d4ed8"],
      glow: "rgba(191, 219, 254, 0.58)"
    },
    {
      key: "ruby",
      label: "Ruby",
      colors: ["#9f1239", "#fda4af", "#be123c"],
      glow: "rgba(253, 164, 175, 0.58)"
    },
    {
      key: "pink",
      label: "Pink",
      colors: ["#be185d", "#fbcfe8", "#db2777"],
      glow: "rgba(251, 207, 232, 0.55)"
    },
    {
      key: "emerald",
      label: "Emerald",
      colors: ["#047857", "#a7f3d0", "#059669"],
      glow: "rgba(167, 243, 208, 0.55)"
    },
    {
      key: "silver",
      label: "Silver",
      colors: ["#64748b", "#f8fafc", "#94a3b8"],
      glow: "rgba(248, 250, 252, 0.5)"
    },
    {
      key: "bronze",
      label: "Bronze",
      colors: ["#92400e", "#fdba74", "#a16207"],
      glow: "rgba(253, 186, 116, 0.56)"
    }
  ];
  const rarityRenderOptions = rarityOverlays.flatMap((overlay) => [
    {
      ...overlay,
      key: `${overlay.key}-light`,
      baseKey: overlay.key,
      label: `${overlay.label} Light`,
      strength: "light",
      impact: false,
      washAlpha: 0.44,
      waveAlpha: 0.24,
      shineAlpha: 0.68,
      sparkleAlpha: 0.6,
      tintAlpha: 0.62,
      screenAlpha: 0.3,
      saturation: 1.04,
      contrast: 1.02
    },
    {
      ...overlay,
      baseKey: overlay.key,
      label: `${overlay.label} Regular`,
      strength: "regular",
      impact: true,
      washAlpha: 0.58,
      waveAlpha: 0.32,
      shineAlpha: 0.76,
      sparkleAlpha: 0.82,
      tintAlpha: 0.82,
      screenAlpha: 0.36,
      saturation: 1.1,
      contrast: 1.03
    },
    {
      ...overlay,
      key: `${overlay.key}-strong`,
      baseKey: overlay.key,
      label: `${overlay.label} Strong`,
      strength: "strong",
      impact: true,
      washAlpha: 0.96,
      waveAlpha: 0.62,
      shineAlpha: 1,
      sparkleAlpha: 1,
      tintAlpha: 1,
      screenAlpha: 0.82,
      saturation: 1.38,
      contrast: 1.14
    }
  ]);
  const prideShineFlags = [
    {
      key: "pride",
      label: "Pride",
      colors: ["#e40303", "#ffed00", "#732982"],
      stripes: ["#e40303", "#ff8c00", "#ffed00", "#008026", "#24408e", "#732982"],
      glow: "rgba(255, 255, 255, 0.6)"
    },
    {
      key: "lesbian",
      label: "Lesbian",
      colors: ["#d52d00", "#ffffff", "#a30262"],
      stripes: ["#d52d00", "#ef7627", "#ff9a56", "#ffffff", "#d162a4", "#b55690", "#a30262"],
      glow: "rgba(255, 154, 86, 0.58)"
    },
    {
      key: "trans",
      label: "Trans",
      colors: ["#5bcefa", "#ffffff", "#f5a9b8"],
      stripes: ["#5bcefa", "#f5a9b8", "#ffffff", "#f5a9b8", "#5bcefa"],
      glow: "rgba(245, 169, 184, 0.6)"
    },
    {
      key: "bi",
      label: "Bi",
      colors: ["#d60270", "#9b4f96", "#0038a8"],
      stripes: ["#d60270", "#d60270", "#9b4f96", "#0038a8", "#0038a8"],
      glow: "rgba(155, 79, 150, 0.58)"
    },
    {
      key: "nonbinary",
      label: "Nonbinary",
      colors: ["#fff430", "#9c59d1", "#000000"],
      stripes: ["#fff430", "#ffffff", "#9c59d1", "#000000"],
      glow: "rgba(156, 89, 209, 0.58)"
    },
    {
      key: "asexual",
      label: "Asexual",
      colors: ["#000000", "#ffffff", "#800080"],
      stripes: ["#000000", "#a3a3a3", "#ffffff", "#800080"],
      glow: "rgba(128, 0, 128, 0.58)"
    },
    {
      key: "gay",
      label: "Gay",
      colors: ["#078d70", "#ffffff", "#3d1a78"],
      stripes: ["#078d70", "#26ceaa", "#98e8c1", "#ffffff", "#7bade2", "#5049cc", "#3d1a78"],
      glow: "rgba(152, 232, 193, 0.58)"
    }
  ];
  const prideShineRenderOptions = prideShineFlags.flatMap((overlay) => [
    {
      ...overlay,
      key: `pride-shine-${overlay.key}-light`,
      baseKey: `pride-shine-${overlay.key}`,
      label: `${overlay.label} Light`,
      strength: "light",
      impact: false,
      washAlpha: 0.56,
      waveAlpha: 0.22,
      shineAlpha: 0.7,
      sparkleAlpha: 0.56,
      tintAlpha: 0.68,
      screenAlpha: 0.4,
      saturation: 1.12,
      contrast: 1.02
    },
    {
      ...overlay,
      key: `pride-shine-${overlay.key}`,
      baseKey: `pride-shine-${overlay.key}`,
      label: `${overlay.label} Regular`,
      strength: "regular",
      impact: true,
      washAlpha: 0.76,
      waveAlpha: 0.32,
      shineAlpha: 0.82,
      sparkleAlpha: 0.82,
      tintAlpha: 0.88,
      screenAlpha: 0.48,
      saturation: 1.16,
      contrast: 1.04
    }
  ]);
  const editorRenderOptions = [
    ...rarityRenderOptions,
    ...prideShineRenderOptions
  ];

  let allCategories = [];
  let searchTerm = "";
  let generationId = 0;
  let isEditorMode = false;
  let editorImage = null;
  let editorFileBaseName = "image";
  let isOriginalRenderActive = false;
  let originalRenderDownloadUrl = "";

  const normalize = (value) => value.toLowerCase().trim();

  const setHeaderText = (title, subtitle) => {
    const heading = document.querySelector("#header h1");
    const copy = document.querySelector("#header p b");
    if (heading) heading.textContent = title;
    if (copy) copy.textContent = subtitle;
  };

  const closeSearchPanel = () => {
    const searchTools = document.querySelector(".gallery-corner-tools-right");
    const panel = document.querySelector("[data-gallery-search-panel]");
    const toggle = document.querySelector("[data-gallery-search-toggle]");
    const input = document.querySelector("[data-gallery-search-input]");

    panel?.setAttribute("hidden", "");
    toggle?.classList.remove("is-active");
    if (input) input.blur();
    return searchTools;
  };

  const updateModeChrome = (mode) => {
    const editorButton = document.querySelector("[data-gallery-editor-open]");
    const editorIcon = editorButton?.querySelector("i");
    const searchTools = closeSearchPanel();
    isEditorMode = mode === "editor";

    if (isEditorMode) {
      setHeaderText("Image Editor", "Mila's Resources");
      searchTools?.setAttribute("hidden", "");
      if (editorButton) {
        editorButton.setAttribute("aria-label", "Back to main page");
        editorButton.setAttribute("title", "Back to main page");
        editorButton.classList.add("is-active");
      }
      if (editorIcon) {
        editorIcon.className = "fas fa-arrow-left";
      }
      return;
    }

    setHeaderText("Media Archive", "Image hosting for Mila");
    searchTools?.removeAttribute("hidden");
    if (editorButton) {
      editorButton.setAttribute("aria-label", "Open image editor");
      editorButton.setAttribute("title", "Image editor");
      editorButton.classList.remove("is-active");
    }
    if (editorIcon) {
      editorIcon.className = "fas fa-image";
    }
  };

  const createGallerySection = (cat, shouldOpen = false) => {
    const section = document.createElement("div");
    section.className = "gallery-section";

    const button = document.createElement("button");
    button.className = "collapsible-trigger";
    button.type = "button";
    button.innerHTML = `<span>${cat.label}</span>`;

    const content = document.createElement("div");
    content.className = "collapsible-content";

    const grid = document.createElement("div");
    grid.className = "gallery-grid";

    cat.images.forEach((image) => {
      const item = document.createElement("div");
      item.className = "gallery-item";

      const link = document.createElement("a");
      link.href = image.url;
      link.target = "_blank";
      link.rel = "noopener";

      const img = document.createElement("img");
      img.src = image.url;
      img.alt = image.name;
      img.loading = "lazy";

      link.appendChild(img);
      item.appendChild(link);
      grid.appendChild(item);
    });

    content.appendChild(grid);

    if (shouldOpen) {
      content.classList.add("open");
      button.classList.add("active");
    }

    button.onclick = () => {
      const isOpen = content.classList.contains("open");
      document.querySelectorAll(".collapsible-content").forEach((node) => node.classList.remove("open"));
      document.querySelectorAll(".collapsible-trigger").forEach((node) => node.classList.remove("active"));

      if (!isOpen) {
        content.classList.add("open");
        button.classList.add("active");
      }
    };

    section.appendChild(button);
    section.appendChild(content);

    return section;
  };

  const getFilteredCategories = () => {
    const query = normalize(searchTerm);
    if (!query) return allCategories;

    return allCategories
      .map((category) => {
        const labelMatches = normalize(category.label).includes(query);
        const images = labelMatches
          ? category.images
          : category.images.filter((image) => normalize(image.name).includes(query) || normalize(image.url).includes(query));

        return {
          ...category,
          images
        };
      })
      .filter((category) => Array.isArray(category.images) && category.images.length > 0);
  };

  const updateSearchStatus = (categories) => {
    const status = document.querySelector("[data-gallery-search-status]");
    if (!status) return;

    const totalImages = categories.reduce((sum, category) => sum + category.images.length, 0);
    if (!searchTerm.trim()) {
      status.textContent = "Showing the full gallery.";
      return;
    }

    status.textContent = totalImages === 1 ? "1 image found." : `${totalImages} images found.`;
  };

  const renderGallery = ({ resetSearch = false, modeSwitch = false } = {}) => {
    const mainContainer = document.getElementById("main");
    if (!mainContainer) return;

    if (modeSwitch || isEditorMode) {
      updateModeChrome("gallery");
    }

    if (resetSearch) {
      const input = document.querySelector("[data-gallery-search-input]");
      searchTerm = "";
      if (input) input.value = "";
    }

    mainContainer.style.display = "block";
    mainContainer.style.opacity = "1";
    mainContainer.innerHTML = "";

    const wrapper = document.createElement("div");
    wrapper.className = "gallery-container gallery-view";
    wrapper.dataset.galleryView = "gallery";

    const categories = getFilteredCategories();
    categories.forEach((category) => {
      if (Array.isArray(category.images) && category.images.length > 0) {
        wrapper.appendChild(createGallerySection(category, Boolean(searchTerm.trim())));
      }
    });

    if (categories.length === 0) {
      const empty = document.createElement("p");
      empty.className = "gallery-empty";
      empty.textContent = "No images matched that search.";
      wrapper.appendChild(empty);
    }

    mainContainer.appendChild(wrapper);
    updateSearchStatus(categories);
  };

  const getStripeGradient = (stripes) => {
    if (!Array.isArray(stripes) || stripes.length === 0) return "";

    return `linear-gradient(180deg, ${stripes.map((color, index) => {
      const start = Math.round(index * 100 / stripes.length);
      const end = Math.round((index + 1) * 100 / stripes.length);
      return `${color} ${start}% ${end}%`;
    }).join(", ")})`;
  };

  const createOverlayCard = (overlay) => {
    const card = document.createElement("div");
    card.className = overlay.impact ? "rarity-card rarity-card-impact" : "rarity-card";
    if (overlay.strength === "strong") card.classList.add("rarity-card-strong");
    card.dataset.editorCard = overlay.key;

    const preview = document.createElement("div");
    preview.className = "rarity-preview";
    preview.innerHTML = '<div class="rarity-placeholder">Upload an image to generate this version.</div>';

    const meta = document.createElement("div");
    meta.className = "rarity-meta";

    const dot = document.createElement("span");
    dot.className = `rarity-dot rarity-dot-${overlay.baseKey}`;
    dot.setAttribute("aria-hidden", "true");
    const stripeGradient = getStripeGradient(overlay.stripes);
    if (stripeGradient) {
      dot.style.background = stripeGradient;
    }

    const name = document.createElement("span");
    name.className = "rarity-name";
    name.textContent = overlay.label;

    const download = document.createElement("a");
    download.className = "rarity-download rarity-preview-download";
    download.href = "#";
    download.setAttribute("aria-disabled", "true");
    download.textContent = "Download";
    download.addEventListener("click", (event) => handleOverlayDownload(event, overlay));

    const originalDownload = document.createElement("button");
    originalDownload.className = "rarity-download rarity-original-download";
    originalDownload.type = "button";
    originalDownload.disabled = true;
    originalDownload.setAttribute("aria-disabled", "true");
    originalDownload.textContent = "Download Original WebP";
    originalDownload.addEventListener("click", (event) => handleOriginalOverlayDownload(event, overlay));

    meta.append(dot, name, download, originalDownload);
    card.append(preview, meta);

    return card;
  };

  const createEditorSection = (title, overlays) => {
    const section = document.createElement("div");
    section.className = "gallery-section";

    const button = document.createElement("button");
    button.className = "collapsible-trigger";
    button.type = "button";
    button.setAttribute("aria-expanded", "false");
    button.innerHTML = `<span>${title}</span>`;

    const content = document.createElement("div");
    content.className = "collapsible-content";

    const grid = document.createElement("div");
    grid.className = "rarity-grid";
    overlays.forEach((overlay) => grid.appendChild(createOverlayCard(overlay)));
    content.appendChild(grid);

    button.onclick = () => {
      button.classList.toggle("active");
      content.classList.toggle("open");
      button.setAttribute("aria-expanded", String(content.classList.contains("open")));
    };

    section.append(button, content);
    return section;
  };

  const renderEditor = () => {
    const mainContainer = document.getElementById("main");
    if (!mainContainer) return;

    updateModeChrome("editor");

    mainContainer.style.display = "block";
    mainContainer.style.opacity = "1";
    mainContainer.innerHTML = "";

    const wrapper = document.createElement("div");
    wrapper.className = "gallery-container gallery-editor";

    const toolbar = document.createElement("div");
    toolbar.className = "gallery-editor-toolbar";
    toolbar.innerHTML = `
      <div class="gallery-editor-actions">
        <label class="gallery-file-label" for="rarityImageInput">Upload Image</label>
        <input class="gallery-file-input" id="rarityImageInput" type="file" accept="image/*" />
      </div>
    `;

    wrapper.append(
      toolbar,
      createEditorSection("Rarity Overlays — Light", rarityRenderOptions.filter((overlay) => overlay.strength === "light")),
      createEditorSection("Rarity Overlays — Regular", rarityRenderOptions.filter((overlay) => overlay.strength === "regular")),
      createEditorSection("Rarity Overlays — Strong", rarityRenderOptions.filter((overlay) => overlay.strength === "strong")),
      createEditorSection("Pride Shine — Light", prideShineRenderOptions.filter((overlay) => overlay.strength === "light")),
      createEditorSection("Pride Shine — Regular", prideShineRenderOptions.filter((overlay) => overlay.strength === "regular"))
    );
    mainContainer.appendChild(wrapper);

    document.getElementById("rarityImageInput")?.addEventListener("change", handleImageUpload);
  };

  const TRANSPARENT_ALPHA_THRESHOLD = 128;
  const TRANSPARENT_INDEX = 255;
  const MAX_OPAQUE_GIF_COLORS = 255;
  const EDITOR_GIF_MAX_SIDE = 640;
  const EDITOR_GIF_MAX_PIXELS = 320000;
  const EDITOR_GIF_MIN_SIDE = 160;
  const EDITOR_GIF_FRAME_COUNT = 14;
  const ORIGINAL_WEBP_QUALITY = 1;
  const ORIGINAL_WEBP_FRAME_DELAY_MS = 70;

  const buildFallbackPalette = () => {
    const palette = [];
    const levels = [0, 51, 102, 153, 204, 255];
    for (const red of levels) {
      for (const green of levels) {
        for (const blue of levels) {
          palette.push(red, green, blue);
        }
      }
    }

    for (let gray = 0; gray < 38; gray++) {
      const value = Math.round(gray * 255 / 37);
      palette.push(value, value, value);
    }

    while (palette.length < MAX_OPAQUE_GIF_COLORS * 3) {
      palette.push(255, 255, 255);
    }

    palette[TRANSPARENT_INDEX * 3] = 0;
    palette[TRANSPARENT_INDEX * 3 + 1] = 0;
    palette[TRANSPARENT_INDEX * 3 + 2] = 0;
    return palette;
  };

  const fallbackPalette = buildFallbackPalette();

  const buildGifPalette = (frames) => {
    const counts = new Uint32Array(32768);
    const redTotals = new Uint32Array(32768);
    const greenTotals = new Uint32Array(32768);
    const blueTotals = new Uint32Array(32768);
    const usedKeys = [];

    frames.forEach((imageData) => {
      const pixels = imageData.data;
      for (let source = 0; source < pixels.length; source += 4) {
        if (pixels[source + 3] < TRANSPARENT_ALPHA_THRESHOLD) continue;

        const key = ((pixels[source] >> 3) << 10)
          | ((pixels[source + 1] >> 3) << 5)
          | (pixels[source + 2] >> 3);
        if (counts[key] === 0) {
          usedKeys.push(key);
        }
        counts[key]++;
        redTotals[key] += pixels[source];
        greenTotals[key] += pixels[source + 1];
        blueTotals[key] += pixels[source + 2];
      }
    });

    usedKeys.sort((left, right) => counts[right] - counts[left]);

    const palette = [];
    usedKeys.slice(0, MAX_OPAQUE_GIF_COLORS).forEach((key) => {
      const count = counts[key];
      palette.push(
        Math.round(redTotals[key] / count),
        Math.round(greenTotals[key] / count),
        Math.round(blueTotals[key] / count)
      );
    });

    for (let index = palette.length; index < MAX_OPAQUE_GIF_COLORS * 3; index += 3) {
      palette.push(
        fallbackPalette[index],
        fallbackPalette[index + 1],
        fallbackPalette[index + 2]
      );
    }

    palette.push(0, 0, 0);
    return palette;
  };

  const findNearestPaletteIndex = (palette, cache, red, green, blue) => {
    const redInt = Math.round(red);
    const greenInt = Math.round(green);
    const blueInt = Math.round(blue);
    const cacheKey = ((redInt >> 3) << 10) | ((greenInt >> 3) << 5) | (blueInt >> 3);
    const cachedIndex = cache[cacheKey];
    if (cachedIndex !== -1) return cachedIndex;

    let bestIndex = 0;
    let bestDistance = Infinity;
    for (let index = 0; index < TRANSPARENT_INDEX; index++) {
      const paletteIndex = index * 3;
      const redDelta = redInt - palette[paletteIndex];
      const greenDelta = greenInt - palette[paletteIndex + 1];
      const blueDelta = blueInt - palette[paletteIndex + 2];
      const distance = redDelta * redDelta + greenDelta * greenDelta + blueDelta * blueDelta;
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = index;
      }
    }
    cache[cacheKey] = bestIndex;
    return bestIndex;
  };

  const quantizeFrame = (imageData, palette, cache) => {
    const pixels = imageData.data;
    const indexed = new Uint8Array(imageData.width * imageData.height);

    for (let source = 0, target = 0; source < pixels.length; source += 4, target++) {
      if (pixels[source + 3] < TRANSPARENT_ALPHA_THRESHOLD) {
        indexed[target] = TRANSPARENT_INDEX;
        continue;
      }

      indexed[target] = findNearestPaletteIndex(
        palette,
        cache,
        pixels[source],
        pixels[source + 1],
        pixels[source + 2]
      );
    }
    return indexed;
  };

  const lzwEncode = (indexedPixels) => {
    const minCodeSize = 8;
    const clearCode = 1 << minCodeSize;
    const endCode = clearCode + 1;
    let codeSize = minCodeSize + 1;
    let bitBuffer = 0;
    let bitCount = 0;
    const output = [];

    const writeCode = (code) => {
      bitBuffer |= code << bitCount;
      bitCount += codeSize;
      while (bitCount >= 8) {
        output.push(bitBuffer & 0xff);
        bitBuffer >>= 8;
        bitCount -= 8;
      }
    };

    writeCode(clearCode);
    let pixelsSinceClear = 0;

    indexedPixels.forEach((pixel) => {
      if (pixelsSinceClear >= 220) {
        writeCode(clearCode);
        codeSize = minCodeSize + 1;
        pixelsSinceClear = 0;
      }

      writeCode(pixel);
      pixelsSinceClear++;
    });

    writeCode(endCode);

    if (bitCount > 0) {
      output.push(bitBuffer & 0xff);
    }

    return output;
  };

  const pushShort = (bytes, value) => {
    bytes.push(value & 0xff, (value >> 8) & 0xff);
  };

  const pushString = (bytes, value) => {
    for (let index = 0; index < value.length; index++) {
      bytes.push(value.charCodeAt(index));
    }
  };

  const pushBlocks = (bytes, data) => {
    for (let index = 0; index < data.length; index += 255) {
      const block = data.slice(index, index + 255);
      bytes.push(block.length, ...block);
    }
    bytes.push(0);
  };

  const bytesToGifUrl = (bytes) => {
    return URL.createObjectURL(new Blob([new Uint8Array(bytes)], { type: "image/gif" }));
  };

  const createGifBytes = (width, height, palette = fallbackPalette) => {
    const bytes = [];
    pushString(bytes, "GIF89a");
    pushShort(bytes, width);
    pushShort(bytes, height);
    bytes.push(0xf7, 0, 0);
    bytes.push(...palette);

    bytes.push(0x21, 0xff, 0x0b);
    pushString(bytes, "NETSCAPE2.0");
    bytes.push(0x03, 0x01);
    pushShort(bytes, 0);
    bytes.push(0);
    return bytes;
  };

  const appendGifFrame = (bytes, indexedPixels, width, height, delay = 8) => {
    bytes.push(0x21, 0xf9, 0x04, 0x09);
    pushShort(bytes, delay);
    bytes.push(TRANSPARENT_INDEX, 0);

    bytes.push(0x2c);
    pushShort(bytes, 0);
    pushShort(bytes, 0);
    pushShort(bytes, width);
    pushShort(bytes, height);
    bytes.push(0);
    bytes.push(8);
    pushBlocks(bytes, lzwEncode(indexedPixels));
  };

  const finishGifBytes = (bytes) => {
    bytes.push(0x3b);
    return bytesToGifUrl(bytes);
  };

  const colorWithAlpha = (hex, alpha) => {
    const value = hex.replace("#", "");
    const red = parseInt(value.slice(0, 2), 16);
    const green = parseInt(value.slice(2, 4), 16);
    const blue = parseInt(value.slice(4, 6), 16);
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  };

  const drawOverlayWash = (ctx, width, height, overlay, progress) => {
    if (Array.isArray(overlay.stripes) && overlay.stripes.length > 0) {
      const longestSide = Math.max(width, height);
      const repetitions = 4;
      const gradientStart = { x: -longestSide, y: -longestSide };
      const gradientEnd = { x: width + longestSide, y: height + longestSide };
      const cycleOffsetX = (gradientEnd.x - gradientStart.x) / repetitions;
      const cycleOffsetY = (gradientEnd.y - gradientStart.y) / repetitions;
      const movingOffsetX = progress * cycleOffsetX;
      const movingOffsetY = progress * cycleOffsetY;
      const gradient = ctx.createLinearGradient(
        gradientStart.x + movingOffsetX,
        gradientStart.y + movingOffsetY,
        gradientEnd.x + movingOffsetX,
        gradientEnd.y + movingOffsetY
      );
      const repeatedStripes = Array.from(
        { length: repetitions },
        () => overlay.stripes
      ).flat();
      const stripeWidth = 1 / repeatedStripes.length;
      const blendWidth = stripeWidth * 0.16;

      repeatedStripes.forEach((color, index) => {
        const center = (index + 0.5) * stripeWidth;
        gradient.addColorStop(Math.max(0, center - stripeWidth * 0.5 + blendWidth), color);
        gradient.addColorStop(Math.min(1, center + stripeWidth * 0.5 - blendWidth), color);
      });
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      return;
    }

    const wash = ctx.createLinearGradient(0, 0, width, height);
    wash.addColorStop(0, overlay.colors[0]);
    wash.addColorStop(0.5, overlay.colors[1]);
    wash.addColorStop(1, overlay.colors[2]);
    ctx.fillStyle = wash;
    ctx.fillRect(0, 0, width, height);
  };

  const getPreviewGifSize = (image) => {
    const sourceWidth = Math.max(1, Math.round(image.naturalWidth || image.width || 1));
    const sourceHeight = Math.max(1, Math.round(image.naturalHeight || image.height || 1));
    const longestSide = Math.max(sourceWidth, sourceHeight);
    const totalPixels = sourceWidth * sourceHeight;
    const sideScale = EDITOR_GIF_MAX_SIDE / longestSide;
    const pixelScale = Math.sqrt(EDITOR_GIF_MAX_PIXELS / totalPixels);
    let scale = Math.min(1, sideScale, pixelScale);

    if (longestSide < EDITOR_GIF_MIN_SIDE) {
      scale = EDITOR_GIF_MIN_SIDE / longestSide;
    }

    return {
      width: Math.max(1, Math.round(sourceWidth * scale)),
      height: Math.max(1, Math.round(sourceHeight * scale))
    };
  };

  const getOriginalImageSize = (image) => {
    return {
      width: Math.max(1, Math.round(image.naturalWidth || image.width || 1)),
      height: Math.max(1, Math.round(image.naturalHeight || image.height || 1))
    };
  };

  const getErrorMessage = (error) => {
    if (!error) return "The browser could not finish this original-size WebP.";
    if (error instanceof Error && error.message) return error.message;
    return String(error);
  };

  const useHighQualitySmoothing = (ctx) => {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
  };

  const drawStar = (ctx, x, y, radius, fillStyle, alpha) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.PI / 4);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.moveTo(0, -radius);
    ctx.lineTo(radius * 0.2, -radius * 0.2);
    ctx.lineTo(radius, 0);
    ctx.lineTo(radius * 0.2, radius * 0.2);
    ctx.lineTo(0, radius);
    ctx.lineTo(-radius * 0.2, radius * 0.2);
    ctx.lineTo(-radius, 0);
    ctx.lineTo(-radius * 0.2, -radius * 0.2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  const drawOverlayCanvas = (image, overlay, frameIndex, frameCount, outputSize = getPreviewGifSize(image)) => {
    const { width, height } = outputSize;
    const longestSide = Math.max(width, height);
    const progress = frameIndex / frameCount;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return "";
    useHighQualitySmoothing(ctx);

    ctx.save();
    ctx.filter = `saturate(${overlay.saturation}) contrast(${overlay.contrast})`;
    ctx.drawImage(image, 0, 0, width, height);
    ctx.restore();

    const overlayCanvas = document.createElement("canvas");
    overlayCanvas.width = width;
    overlayCanvas.height = height;
    const overlayCtx = overlayCanvas.getContext("2d");
    if (!overlayCtx) return "";
    useHighQualitySmoothing(overlayCtx);

    overlayCtx.globalAlpha = overlay.washAlpha;
    drawOverlayWash(overlayCtx, width, height, overlay, progress);

    if (overlay.impact) {
      const isStrong = overlay.strength === "strong";
      const centerTint = overlayCtx.createRadialGradient(
        width * 0.42,
        height * 0.36,
        longestSide * 0.04,
        width * 0.5,
        height * 0.5,
        longestSide * 0.78
      );
      centerTint.addColorStop(0, colorWithAlpha(overlay.colors[1], isStrong ? 1 : 0.82));
      centerTint.addColorStop(0.52, colorWithAlpha(overlay.colors[1], isStrong ? 0.72 : 0.38));
      centerTint.addColorStop(1, colorWithAlpha(overlay.colors[0], isStrong ? 0.5 : 0.22));
      overlayCtx.globalAlpha = isStrong ? 1 : 0.9;
      overlayCtx.fillStyle = centerTint;
      overlayCtx.fillRect(0, 0, width, height);
    }

    overlayCtx.globalAlpha = overlay.waveAlpha;
    overlayCtx.lineWidth = Math.max(1.2, longestSide * 0.006);
    const waveCount = overlay.strength === "strong" ? 12 : 8;
    for (let wave = 0; wave < waveCount; wave++) {
      const yBase = (wave / (waveCount - 1)) * height;
      const offset = (progress * longestSide * 0.55 + wave * 19) % longestSide;
      overlayCtx.strokeStyle = wave % 2 === 0
        ? colorWithAlpha(overlay.colors[1], 0.5)
        : colorWithAlpha(overlay.colors[0], 0.42);
      overlayCtx.beginPath();
      for (let x = -longestSide; x <= width + longestSide; x += 18) {
        const y = yBase + Math.sin((x + offset) / 26) * longestSide * 0.018;
        if (x === -longestSide) {
          overlayCtx.moveTo(x, y);
        } else {
          overlayCtx.lineTo(x, y);
        }
      }
      overlayCtx.stroke();
    }

    const sweep = -longestSide * 0.8 + progress * longestSide * 2.4;
    const shine = overlayCtx.createLinearGradient(sweep, 0, sweep + longestSide * 0.62, height);
    shine.addColorStop(0, "rgba(255, 255, 255, 0)");
    shine.addColorStop(0.36, "rgba(255, 255, 255, 0)");
    shine.addColorStop(0.5, "rgba(255, 255, 255, 0.92)");
    shine.addColorStop(0.58, overlay.glow);
    shine.addColorStop(1, "rgba(255, 255, 255, 0)");
    overlayCtx.globalAlpha = overlay.shineAlpha;
    overlayCtx.fillStyle = shine;
    overlayCtx.fillRect(0, 0, width, height);

    const sparkleCount = overlay.strength === "strong" ? 12 : (overlay.impact ? 7 : 5);
    for (let sparkle = 0; sparkle < sparkleCount; sparkle++) {
      const sparkleProgress = (progress + sparkle * 0.21) % 1;
      const sparkleX = width * ((sparkle * 0.29 + sparkleProgress * 0.48) % 1);
      const sparkleY = height * ((sparkle * 0.41 + sparkleProgress * 0.22) % 1);
      const sparkleAlpha = Math.sin(sparkleProgress * Math.PI) * overlay.sparkleAlpha;
      drawStar(overlayCtx, sparkleX, sparkleY, longestSide * (0.018 + sparkle * 0.002), "#ffffff", sparkleAlpha);
    }

    overlayCtx.globalAlpha = 1;
    overlayCtx.globalCompositeOperation = "destination-in";
    overlayCtx.drawImage(image, 0, 0, width, height);

    ctx.save();
    ctx.globalAlpha = overlay.tintAlpha;
    ctx.globalCompositeOperation = "color";
    ctx.drawImage(overlayCanvas, 0, 0);
    ctx.globalAlpha = overlay.screenAlpha;
    ctx.globalCompositeOperation = "screen";
    ctx.drawImage(overlayCanvas, 0, 0);
    ctx.restore();

    const vignetteCanvas = document.createElement("canvas");
    vignetteCanvas.width = width;
    vignetteCanvas.height = height;
    const vignetteCtx = vignetteCanvas.getContext("2d");
    if (!vignetteCtx) return "";
    useHighQualitySmoothing(vignetteCtx);

    const vignette = vignetteCtx.createRadialGradient(
      width * 0.5,
      height * 0.45,
      longestSide * 0.1,
      width * 0.5,
      height * 0.5,
      longestSide * 0.72
    );
    vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
    vignette.addColorStop(1, overlay.strength === "strong"
      ? "rgba(0, 0, 0, 0.04)"
      : (overlay.impact ? "rgba(0, 0, 0, 0.12)" : "rgba(0, 0, 0, 0.2)"));
    vignetteCtx.fillStyle = vignette;
    vignetteCtx.fillRect(0, 0, width, height);
    vignetteCtx.globalCompositeOperation = "destination-in";
    vignetteCtx.drawImage(image, 0, 0, width, height);
    ctx.drawImage(vignetteCanvas, 0, 0);

    return {
      canvas,
      width,
      height
    };
  };

  const drawOverlayFrame = (image, overlay, frameIndex, frameCount, outputSize = getPreviewGifSize(image)) => {
    const frame = drawOverlayCanvas(image, overlay, frameIndex, frameCount, outputSize);
    if (!frame) return "";

    const ctx = frame.canvas.getContext("2d");
    if (!ctx) return "";

    return {
      imageData: ctx.getImageData(0, 0, frame.width, frame.height),
      width: frame.width,
      height: frame.height
    };
  };

  const makeOverlayGif = (image, overlay, outputSize = getPreviewGifSize(image)) => {
    try {
      const frameCount = EDITOR_GIF_FRAME_COUNT;
      const firstFrame = drawOverlayFrame(image, overlay, 0, frameCount, outputSize);
      if (!firstFrame) return "";

      const { width, height } = firstFrame;
      const palette = buildGifPalette([firstFrame.imageData]);
      const nearestCache = new Int16Array(32768);
      nearestCache.fill(-1);
      const bytes = createGifBytes(width, height, palette);

      appendGifFrame(bytes, quantizeFrame(firstFrame.imageData, palette, nearestCache), width, height, 7);
      for (let frameIndex = 1; frameIndex < frameCount; frameIndex++) {
        const frame = drawOverlayFrame(image, overlay, frameIndex, frameCount, outputSize);
        if (!frame) return "";
        appendGifFrame(bytes, quantizeFrame(frame.imageData, palette, nearestCache), width, height, 7);
      }

      return finishGifBytes(bytes);
    } catch (error) {
      console.error("Overlay GIF generation failed", error);
      return "";
    }
  };

  const writeStringAt = (bytes, offset, value) => {
    for (let index = 0; index < value.length; index++) {
      bytes[offset + index] = value.charCodeAt(index);
    }
  };

  const writeIntAt = (bytes, offset, value) => {
    bytes[offset] = value & 0xff;
    bytes[offset + 1] = (value >> 8) & 0xff;
    bytes[offset + 2] = (value >> 16) & 0xff;
    bytes[offset + 3] = (value >> 24) & 0xff;
  };

  const write24At = (bytes, offset, value) => {
    bytes[offset] = value & 0xff;
    bytes[offset + 1] = (value >> 8) & 0xff;
    bytes[offset + 2] = (value >> 16) & 0xff;
  };

  const createRiffChunk = (type, data) => {
    const paddedSize = data.length + (data.length % 2);
    const bytes = new Uint8Array(8 + paddedSize);
    writeStringAt(bytes, 0, type);
    writeIntAt(bytes, 4, data.length);
    bytes.set(data, 8);
    return bytes;
  };

  const concatByteArrays = (arrays) => {
    const totalLength = arrays.reduce((sum, value) => sum + value.length, 0);
    const output = new Uint8Array(totalLength);
    let offset = 0;

    arrays.forEach((value) => {
      output.set(value, offset);
      offset += value.length;
    });

    return output;
  };

  const getChunkType = (bytes, offset) => {
    return String.fromCharCode(bytes[offset], bytes[offset + 1], bytes[offset + 2], bytes[offset + 3]);
  };

  const getInt = (bytes, offset) => {
    return bytes[offset]
      | (bytes[offset + 1] << 8)
      | (bytes[offset + 2] << 16)
      | (bytes[offset + 3] << 24);
  };

  const getWebpFramePayload = (bytes) => {
    if (getChunkType(bytes, 0) !== "RIFF" || getChunkType(bytes, 8) !== "WEBP") {
      throw new Error("The browser returned an invalid WebP frame.");
    }

    const chunks = [];
    let offset = 12;
    while (offset + 8 <= bytes.length) {
      const type = getChunkType(bytes, offset);
      const size = getInt(bytes, offset + 4);
      const chunkEnd = offset + 8 + size + (size % 2);

      if (chunkEnd > bytes.length) {
        throw new Error("The browser returned a truncated WebP frame.");
      }

      if (type === "ALPH" || type === "VP8 " || type === "VP8L") {
        chunks.push(bytes.slice(offset, chunkEnd));
      }

      offset = chunkEnd;
    }

    if (!chunks.some((chunk) => getChunkType(chunk, 0) === "VP8 " || getChunkType(chunk, 0) === "VP8L")) {
      throw new Error("The browser returned a WebP frame without image data.");
    }

    return concatByteArrays(chunks);
  };

  const createAnimatedWebpUrl = (frames, width, height) => {
    const chunks = [];
    const vp8x = new Uint8Array(10);
    vp8x[0] = 0x12;
    write24At(vp8x, 4, width - 1);
    write24At(vp8x, 7, height - 1);
    chunks.push(createRiffChunk("VP8X", vp8x));

    const anim = new Uint8Array(6);
    chunks.push(createRiffChunk("ANIM", anim));

    frames.forEach((frame) => {
      const header = new Uint8Array(16);
      write24At(header, 0, 0);
      write24At(header, 3, 0);
      write24At(header, 6, width - 1);
      write24At(header, 9, height - 1);
      write24At(header, 12, frame.duration);
      header[15] = 0x02;
      const frameData = concatByteArrays([header, frame.payload]);
      chunks.push(createRiffChunk("ANMF", frameData));
    });

    const payload = concatByteArrays(chunks);
    const bytes = new Uint8Array(12 + payload.length);
    writeStringAt(bytes, 0, "RIFF");
    writeIntAt(bytes, 4, payload.length + 4);
    writeStringAt(bytes, 8, "WEBP");
    bytes.set(payload, 12);

    return URL.createObjectURL(new Blob([bytes], { type: "image/webp" }));
  };

  const canvasToWebpPayload = async (canvas) => {
    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, "image/webp", ORIGINAL_WEBP_QUALITY);
    });

    if (!blob || blob.type !== "image/webp") {
      throw new Error("This browser could not encode an original-size WebP frame.");
    }

    return getWebpFramePayload(new Uint8Array(await blob.arrayBuffer()));
  };

  const makeOriginalWebp = async (image, overlay, outputSize, onProgress) => {
    try {
      const frames = [];
      for (let frameIndex = 0; frameIndex < EDITOR_GIF_FRAME_COUNT; frameIndex++) {
        const frame = drawOverlayCanvas(
          image,
          overlay,
          frameIndex,
          EDITOR_GIF_FRAME_COUNT,
          outputSize
        );
        if (!frame) {
          return {
            error: "The browser could not create a canvas for this original-size image.",
            url: ""
          };
        }

        frames.push({
          duration: ORIGINAL_WEBP_FRAME_DELAY_MS,
          payload: await canvasToWebpPayload(frame.canvas)
        });
        onProgress?.(frameIndex + 1, EDITOR_GIF_FRAME_COUNT);
        await waitForPaint();
      }

      return {
        error: "",
        url: createAnimatedWebpUrl(frames, outputSize.width, outputSize.height)
      };
    } catch (error) {
      console.error("Original size animated WebP generation failed", error);
      return {
        error: getErrorMessage(error),
        url: ""
      };
    }
  };

  const waitForPaint = () => {
    return new Promise((resolve) => {
      window.requestAnimationFrame(() => {
        window.setTimeout(resolve, 0);
      });
    });
  };

  const clearOriginalRenderDownload = () => {
    if (originalRenderDownloadUrl) {
      URL.revokeObjectURL(originalRenderDownloadUrl);
      originalRenderDownloadUrl = "";
    }
  };

  const ensureOriginalRenderPopup = () => {
    let popup = document.querySelector("[data-original-render-popup]");
    if (popup) return popup;

    popup = document.createElement("div");
    popup.className = "original-render-popup";
    popup.dataset.originalRenderPopup = "";
    popup.setAttribute("hidden", "");
    popup.setAttribute("role", "dialog");
    popup.setAttribute("aria-modal", "true");
    popup.setAttribute("aria-labelledby", "originalRenderTitle");
    popup.innerHTML = `
      <div class="original-render-panel">
        <div class="original-render-spinner" data-original-render-spinner aria-hidden="true"></div>
        <h2 id="originalRenderTitle" data-original-render-title>Rendering original WebP...</h2>
        <p data-original-render-copy>Preparing your download.</p>
        <a class="original-render-download" data-original-render-download hidden>Download WebP</a>
        <button class="original-render-close" type="button" data-original-render-close hidden>Close</button>
      </div>
    `;

    popup.querySelector("[data-original-render-close]")?.addEventListener("click", () => {
      popup.setAttribute("hidden", "");
      clearOriginalRenderDownload();
    });

    document.body.appendChild(popup);
    return popup;
  };

  const updateOriginalRenderPopup = ({ state, title, copy, downloadUrl = "", filename = "" }) => {
    const popup = ensureOriginalRenderPopup();
    const spinner = popup.querySelector("[data-original-render-spinner]");
    const heading = popup.querySelector("[data-original-render-title]");
    const message = popup.querySelector("[data-original-render-copy]");
    const download = popup.querySelector("[data-original-render-download]");
    const close = popup.querySelector("[data-original-render-close]");
    const isLoading = state === "loading";
    const isReady = state === "ready" && downloadUrl;

    popup.removeAttribute("hidden");
    spinner?.toggleAttribute("hidden", !isLoading);
    close?.toggleAttribute("hidden", isLoading);
    download?.toggleAttribute("hidden", !isReady);

    if (heading) heading.textContent = title;
    if (message) message.textContent = copy;
    if (download && isReady) {
      download.href = downloadUrl;
      download.download = filename;
    }
  };

  const releaseCardUrl = (card) => {
    const previousUrl = card.dataset.gifUrl;
    if (previousUrl) {
      URL.revokeObjectURL(previousUrl);
      delete card.dataset.gifUrl;
    }

    const previousDownloadUrl = card.dataset.downloadUrl;
    if (previousDownloadUrl) {
      URL.revokeObjectURL(previousDownloadUrl);
      delete card.dataset.downloadUrl;
    }
  };

  const releaseDownloadUrl = (card) => {
    const previousDownloadUrl = card.dataset.downloadUrl;
    if (previousDownloadUrl) {
      URL.revokeObjectURL(previousDownloadUrl);
      delete card.dataset.downloadUrl;
    }
  };

  const triggerDownload = (url, filename) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const setDownloadPending = (download) => {
    download.setAttribute("aria-disabled", "true");
    download.removeAttribute("download");
    download.href = "#";
    download.textContent = "Download";
  };

  const setOriginalDownloadPending = (download) => {
    if (!download) return;
    download.disabled = true;
    download.setAttribute("aria-disabled", "true");
    download.textContent = "Download Original WebP";
  };

  const setOriginalDownloadReady = (download) => {
    if (!download) return;
    download.disabled = false;
    download.removeAttribute("aria-disabled");
    download.textContent = "Download Original WebP";
  };

  const setOriginalDownloadsBusy = (busy, activeButton = null) => {
    document.querySelectorAll(".rarity-original-download").forEach((download) => {
      if (busy) {
        download.disabled = true;
        download.setAttribute("aria-disabled", "true");
        download.textContent = download === activeButton ? "Rendering WebP..." : "Download Original WebP";
        return;
      }

      const card = download.closest("[data-editor-card]");
      if (editorImage && card?.dataset.gifUrl) {
        setOriginalDownloadReady(download);
      } else {
        setOriginalDownloadPending(download);
      }
    });
  };

  const setCardPlaceholder = (card, message) => {
    const preview = card.querySelector(".rarity-preview");
    const download = card.querySelector(".rarity-preview-download");
    const originalDownload = card.querySelector(".rarity-original-download");
    if (!preview || !download) return;

    releaseCardUrl(card);
    preview.innerHTML = `<div class="rarity-placeholder">${message}</div>`;
    setDownloadPending(download);
    setOriginalDownloadPending(originalDownload);
  };

  const setAllEditorCardsPlaceholder = (message) => {
    document.querySelectorAll("[data-editor-card]").forEach((card) => {
      setCardPlaceholder(card, message);
    });
  };

  const handleOverlayDownload = async (event, overlay) => {
    const download = event.currentTarget;
    const card = download.closest("[data-editor-card]");
    if (!card) return;

    const readyUrl = card.dataset.downloadUrl || card.dataset.gifUrl;
    const filename = `${editorFileBaseName}-${overlay.key}.gif`;
    if (readyUrl) {
      download.href = readyUrl;
      download.download = filename;
      return;
    }

    event.preventDefault();
    if (download.getAttribute("aria-disabled") === "true" || !editorImage) return;

    const currentGeneration = generationId;
    releaseDownloadUrl(card);
    download.setAttribute("aria-disabled", "true");
    download.removeAttribute("download");
    download.href = "#";
    download.textContent = "Rendering...";

    const gifUrl = makeOverlayGif(editorImage, overlay, getPreviewGifSize(editorImage));
    if (currentGeneration !== generationId) {
      if (gifUrl) URL.revokeObjectURL(gifUrl);
      return;
    }

    if (!gifUrl) {
      download.textContent = "Try Again";
      download.removeAttribute("aria-disabled");
      return;
    }

    card.dataset.downloadUrl = gifUrl;
    download.href = gifUrl;
    download.download = filename;
    download.textContent = "Download GIF";
    download.removeAttribute("aria-disabled");
    triggerDownload(gifUrl, filename);
  };

  const handleOriginalOverlayDownload = async (event, overlay) => {
    event.preventDefault();
    const download = event.currentTarget;
    if (download.getAttribute("aria-disabled") === "true" || !editorImage || isOriginalRenderActive) return;

    const currentGeneration = generationId;
    const filename = `${editorFileBaseName}-${overlay.key}-original.webp`;
    const { width, height } = getOriginalImageSize(editorImage);

    isOriginalRenderActive = true;
    clearOriginalRenderDownload();
    setOriginalDownloadsBusy(true, download);
    updateOriginalRenderPopup({
      state: "loading",
      title: "Rendering original WebP...",
      copy: `Applying ${overlay.label} at ${width}x${height}.`
    });
    await waitForPaint();

    const result = await makeOriginalWebp(
      editorImage,
      overlay,
      { width, height },
      (complete, total) => {
        updateOriginalRenderPopup({
          state: "loading",
          title: "Rendering original WebP...",
          copy: `Applying ${overlay.label} at ${width}x${height}. Frame ${complete} of ${total}.`
        });
      }
    );
    const webpUrl = result.url;

    if (currentGeneration !== generationId) {
      if (webpUrl) URL.revokeObjectURL(webpUrl);
      isOriginalRenderActive = false;
      setOriginalDownloadsBusy(false);
      document.querySelector("[data-original-render-popup]")?.setAttribute("hidden", "");
      return;
    }

    isOriginalRenderActive = false;
    setOriginalDownloadsBusy(false);

    if (!webpUrl) {
      updateOriginalRenderPopup({
        state: "error",
        title: "Original WebP failed",
        copy: result.error || "The browser could not finish this original-size WebP."
      });
      return;
    }

    originalRenderDownloadUrl = webpUrl;
    updateOriginalRenderPopup({
      state: "ready",
      title: "Download ready",
      copy: "Your original-size WebP is ready.",
      downloadUrl: webpUrl,
      filename
    });
    triggerDownload(webpUrl, filename);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const currentGeneration = ++generationId;
    const objectUrl = URL.createObjectURL(file);
    editorImage = null;
    editorFileBaseName = file.name.replace(/\.[^.]+$/, "") || "image";
    clearOriginalRenderDownload();
    document.querySelector("[data-original-render-popup]")?.setAttribute("hidden", "");

    setAllEditorCardsPlaceholder("Preparing image...");

    const image = new Image();
    image.decoding = "async";
    image.onload = async () => {
      URL.revokeObjectURL(objectUrl);
      if (currentGeneration !== generationId) return;
      editorImage = image;

      try {
        for (const overlay of editorRenderOptions) {
          if (currentGeneration !== generationId) return;

          const card = document.querySelector(`[data-editor-card="${overlay.key}"]`);
          if (!card) continue;

          const preview = card.querySelector(".rarity-preview");
          const download = card.querySelector(".rarity-preview-download");
          const originalDownload = card.querySelector(".rarity-original-download");
          if (!preview || !download) continue;

          releaseCardUrl(card);
          preview.innerHTML = `<div class="rarity-placeholder">Generating ${overlay.label} GIF...</div>`;
          setDownloadPending(download);
          await waitForPaint();

          const gifUrl = makeOverlayGif(image, overlay, getPreviewGifSize(image));
          if (currentGeneration !== generationId) {
            if (gifUrl) URL.revokeObjectURL(gifUrl);
            return;
          }
          if (!gifUrl) {
            preview.innerHTML = '<div class="rarity-placeholder">Could not generate this GIF.</div>';
            continue;
          }

          card.dataset.gifUrl = gifUrl;
          preview.innerHTML = "";
          const result = document.createElement("img");
          result.src = gifUrl;
          result.alt = `${overlay.label} animated overlay version`;
          preview.appendChild(result);

          download.href = gifUrl;
          download.download = `${editorFileBaseName}-${overlay.key}.gif`;
          download.textContent = "Download GIF";
          download.removeAttribute("aria-disabled");
          setOriginalDownloadReady(originalDownload);
          await waitForPaint();
        }
      } catch (error) {
        console.error("Image editor generation failed", error);
        if (currentGeneration === generationId) {
          setAllEditorCardsPlaceholder("Could not generate overlays for this image.");
        }
      }
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      editorImage = null;
      if (currentGeneration === generationId) {
        setAllEditorCardsPlaceholder("Could not load this image.");
      }
    };
    image.src = objectUrl;
  };

  const setupSearch = () => {
    const toggle = document.querySelector("[data-gallery-search-toggle]");
    const panel = document.querySelector("[data-gallery-search-panel]");
    const input = document.querySelector("[data-gallery-search-input]");
    if (!toggle || !panel || !input) return;

    toggle.addEventListener("click", () => {
      const shouldOpen = panel.hasAttribute("hidden");
      panel.toggleAttribute("hidden", !shouldOpen);
      toggle.classList.toggle("is-active", shouldOpen);

      if (shouldOpen) {
        input.focus();
      }
    });

    input.addEventListener("input", () => {
      if (isEditorMode) return;
      searchTerm = input.value;
      renderGallery();
    });
  };

  const setupEditorButton = () => {
    const trigger = document.querySelector("[data-gallery-editor-open]");
    if (!trigger) return;

    trigger.addEventListener("click", () => {
      if (isEditorMode) {
        renderGallery({ resetSearch: true, modeSwitch: true });
        return;
      }

      renderEditor();
    });
  };

  const renderError = () => {
    const mainContainer = document.getElementById("main");
    if (!mainContainer) return;

    mainContainer.style.display = "block";
    mainContainer.style.opacity = "1";
    mainContainer.innerHTML = "<p>Gallery data could not be loaded.</p>";
  };

  const init = async () => {
    setupSearch();
    setupEditorButton();

    try {
      const response = await fetch(`${GALLERY_MANIFEST_PATH}?v=${Date.now()}`, {
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error(`Failed to load gallery manifest: ${response.status}`);
      }

      const payload = await response.json();
      allCategories = Array.isArray(payload.categories) ? payload.categories : [];
      renderGallery();
    } catch (error) {
      console.error(error);
      renderError();
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      void init();
    });
  } else {
    void init();
  }
})();
