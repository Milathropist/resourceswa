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
      impact: true,
      washAlpha: 0.58,
      waveAlpha: 0.32,
      shineAlpha: 0.76,
      sparkleAlpha: 0.82,
      tintAlpha: 0.82,
      screenAlpha: 0.36,
      saturation: 1.1,
      contrast: 1.03
    }
  ]);

  let allCategories = [];
  let searchTerm = "";
  let generationId = 0;
  let isEditorMode = false;

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

  const createRarityCard = (overlay) => {
    const card = document.createElement("div");
    card.className = overlay.impact ? "rarity-card rarity-card-impact" : "rarity-card";
    card.dataset.rarityCard = overlay.key;

    const preview = document.createElement("div");
    preview.className = "rarity-preview";
    preview.innerHTML = '<div class="rarity-placeholder">Upload an image to generate this version.</div>';

    const meta = document.createElement("div");
    meta.className = "rarity-meta";

    const dot = document.createElement("span");
    dot.className = `rarity-dot rarity-dot-${overlay.baseKey}`;
    dot.setAttribute("aria-hidden", "true");

    const name = document.createElement("span");
    name.className = "rarity-name";
    name.textContent = overlay.label;

    const download = document.createElement("a");
    download.className = "rarity-download";
    download.href = "#";
    download.setAttribute("aria-disabled", "true");
    download.textContent = "Download";

    meta.append(dot, name, download);
    card.append(preview, meta);

    return card;
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

    const section = document.createElement("div");
    section.className = "gallery-section";

    const button = document.createElement("button");
    button.className = "collapsible-trigger active";
    button.type = "button";
    button.innerHTML = "<span>Rarity Overlays</span>";

    const content = document.createElement("div");
    content.className = "collapsible-content open";

    const grid = document.createElement("div");
    grid.className = "rarity-grid";
    rarityRenderOptions.forEach((overlay) => grid.appendChild(createRarityCard(overlay)));
    content.appendChild(grid);

    button.onclick = () => {
      button.classList.toggle("active");
      content.classList.toggle("open");
    };

    section.append(button, content);
    wrapper.append(toolbar, section);
    mainContainer.appendChild(wrapper);

    document.getElementById("rarityImageInput")?.addEventListener("change", handleImageUpload);
  };

  const buildPalette = () => {
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

    palette[254 * 3] = 255;
    palette[254 * 3 + 1] = 255;
    palette[254 * 3 + 2] = 255;
    palette[255 * 3] = 0;
    palette[255 * 3 + 1] = 0;
    palette[255 * 3 + 2] = 0;
    return palette;
  };

  const gifPalette = buildPalette();
  const nearestPaletteCache = new Int16Array(32768);
  nearestPaletteCache.fill(-1);

  const findNearestPaletteIndex = (palette, red, green, blue) => {
    const redInt = Math.round(red);
    const greenInt = Math.round(green);
    const blueInt = Math.round(blue);
    const cacheKey = ((redInt >> 3) << 10) | ((greenInt >> 3) << 5) | (blueInt >> 3);
    const cachedIndex = nearestPaletteCache[cacheKey];
    if (cachedIndex !== -1) return cachedIndex;

    let bestIndex = 0;
    let bestDistance = Infinity;
    for (let index = 0; index < 255; index++) {
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
    nearestPaletteCache[cacheKey] = bestIndex;
    return bestIndex;
  };

  const clampColor = (value) => Math.max(0, Math.min(255, value));

  const quantizeFrame = (imageData) => {
    const pixels = imageData.data;
    const palette = gifPalette;
    const colors = new Float32Array(imageData.width * imageData.height * 3);
    const indexed = new Uint8Array(imageData.width * imageData.height);

    for (let source = 0, target = 0; source < pixels.length; source += 4, target += 3) {
      colors[target] = pixels[source];
      colors[target + 1] = pixels[source + 1];
      colors[target + 2] = pixels[source + 2];
    }

    const pushError = (x, y, redError, greenError, blueError, factor) => {
      if (x < 0 || x >= imageData.width || y < 0 || y >= imageData.height) return;

      const pixelIndex = y * imageData.width + x;
      if (pixels[pixelIndex * 4 + 3] < 40) return;

      const colorIndex = pixelIndex * 3;
      colors[colorIndex] = clampColor(colors[colorIndex] + redError * factor);
      colors[colorIndex + 1] = clampColor(colors[colorIndex + 1] + greenError * factor);
      colors[colorIndex + 2] = clampColor(colors[colorIndex + 2] + blueError * factor);
    };

    for (let y = 0; y < imageData.height; y++) {
      for (let x = 0; x < imageData.width; x++) {
        const pixelIndex = y * imageData.width + x;
        const source = pixelIndex * 4;
        if (pixels[source + 3] < 40) {
          indexed[pixelIndex] = 255;
          continue;
        }

        const colorIndex = pixelIndex * 3;
        const red = clampColor(colors[colorIndex]);
        const green = clampColor(colors[colorIndex + 1]);
        const blue = clampColor(colors[colorIndex + 2]);
        const paletteIndex = findNearestPaletteIndex(palette, red, green, blue);
        indexed[pixelIndex] = paletteIndex;

        const paletteOffset = paletteIndex * 3;
        const redError = red - palette[paletteOffset];
        const greenError = green - palette[paletteOffset + 1];
        const blueError = blue - palette[paletteOffset + 2];
        pushError(x + 1, y, redError, greenError, blueError, 7 / 16);
        pushError(x - 1, y + 1, redError, greenError, blueError, 3 / 16);
        pushError(x, y + 1, redError, greenError, blueError, 5 / 16);
        pushError(x + 1, y + 1, redError, greenError, blueError, 1 / 16);
      }
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

  const encodeGif = (frames, width, height, delay = 8) => {
    const bytes = [];
    pushString(bytes, "GIF89a");
    pushShort(bytes, width);
    pushShort(bytes, height);
    bytes.push(0xf7, 0, 0);
    bytes.push(...gifPalette);

    bytes.push(0x21, 0xff, 0x0b);
    pushString(bytes, "NETSCAPE2.0");
    bytes.push(0x03, 0x01);
    pushShort(bytes, 0);
    bytes.push(0);

    frames.forEach((indexedPixels) => {
      bytes.push(0x21, 0xf9, 0x04, 0x09);
      pushShort(bytes, delay);
      bytes.push(255, 0);

      bytes.push(0x2c);
      pushShort(bytes, 0);
      pushShort(bytes, 0);
      pushShort(bytes, width);
      pushShort(bytes, height);
      bytes.push(0);
      bytes.push(8);
      pushBlocks(bytes, lzwEncode(indexedPixels));
    });

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

  const getGifSize = (image) => {
    const maxSide = Math.max(image.naturalWidth, image.naturalHeight);
    const maxOutputSide = 420;
    const minOutputSide = 160;
    let scale = Math.min(1, maxOutputSide / maxSide);

    if (maxSide < minOutputSide) {
      scale = minOutputSide / maxSide;
    }

    return {
      width: Math.max(1, Math.round(image.naturalWidth * scale)),
      height: Math.max(1, Math.round(image.naturalHeight * scale))
    };
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

  const drawOverlayFrame = (image, overlay, frameIndex, frameCount) => {
    const { width, height } = getGifSize(image);
    const longestSide = Math.max(width, height);
    const progress = frameIndex / frameCount;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    ctx.save();
    ctx.filter = `saturate(${overlay.saturation}) contrast(${overlay.contrast})`;
    ctx.drawImage(image, 0, 0, width, height);
    ctx.restore();

    const overlayCanvas = document.createElement("canvas");
    overlayCanvas.width = width;
    overlayCanvas.height = height;
    const overlayCtx = overlayCanvas.getContext("2d");
    if (!overlayCtx) return "";

    const wash = overlayCtx.createLinearGradient(0, 0, width, height);
    wash.addColorStop(0, overlay.colors[0]);
    wash.addColorStop(0.5, overlay.colors[1]);
    wash.addColorStop(1, overlay.colors[2]);
    overlayCtx.globalAlpha = overlay.washAlpha;
    overlayCtx.fillStyle = wash;
    overlayCtx.fillRect(0, 0, width, height);

    if (overlay.impact) {
      const centerTint = overlayCtx.createRadialGradient(
        width * 0.42,
        height * 0.36,
        longestSide * 0.04,
        width * 0.5,
        height * 0.5,
        longestSide * 0.78
      );
      centerTint.addColorStop(0, colorWithAlpha(overlay.colors[1], 0.82));
      centerTint.addColorStop(0.52, colorWithAlpha(overlay.colors[1], 0.38));
      centerTint.addColorStop(1, colorWithAlpha(overlay.colors[0], 0.22));
      overlayCtx.globalAlpha = 0.9;
      overlayCtx.fillStyle = centerTint;
      overlayCtx.fillRect(0, 0, width, height);
    }

    overlayCtx.globalAlpha = overlay.waveAlpha;
    overlayCtx.lineWidth = Math.max(1.2, longestSide * 0.006);
    for (let wave = 0; wave < 8; wave++) {
      const yBase = (wave / 7) * height;
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

    for (let sparkle = 0; sparkle < (overlay.impact ? 7 : 5); sparkle++) {
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

    const vignette = vignetteCtx.createRadialGradient(
      width * 0.5,
      height * 0.45,
      longestSide * 0.1,
      width * 0.5,
      height * 0.5,
      longestSide * 0.72
    );
    vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
    vignette.addColorStop(1, overlay.impact ? "rgba(0, 0, 0, 0.12)" : "rgba(0, 0, 0, 0.2)");
    vignetteCtx.fillStyle = vignette;
    vignetteCtx.fillRect(0, 0, width, height);
    vignetteCtx.globalCompositeOperation = "destination-in";
    vignetteCtx.drawImage(image, 0, 0, width, height);
    ctx.drawImage(vignetteCanvas, 0, 0);

    return {
      imageData: ctx.getImageData(0, 0, width, height),
      width,
      height
    };
  };

  const makeOverlayGif = (image, overlay) => {
    const frameCount = 14;
    const frames = [];
    let width = 0;
    let height = 0;
    for (let frameIndex = 0; frameIndex < frameCount; frameIndex++) {
      const frame = drawOverlayFrame(image, overlay, frameIndex, frameCount);
      if (!frame) return "";
      width = frame.width;
      height = frame.height;
      frames.push(quantizeFrame(frame.imageData));
    }
    return encodeGif(frames, width, height, 7);
  };

  const waitForPaint = () => {
    return new Promise((resolve) => {
      window.requestAnimationFrame(() => resolve());
    });
  };

  const releaseCardUrl = (card) => {
    const previousUrl = card.dataset.gifUrl;
    if (previousUrl) {
      URL.revokeObjectURL(previousUrl);
      delete card.dataset.gifUrl;
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const currentGeneration = ++generationId;

    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = async () => {
        for (const overlay of rarityRenderOptions) {
          if (currentGeneration !== generationId) return;

          const card = document.querySelector(`[data-rarity-card="${overlay.key}"]`);
          if (!card) continue;

          const preview = card.querySelector(".rarity-preview");
          const download = card.querySelector(".rarity-download");
          if (!preview || !download) continue;

          releaseCardUrl(card);
          preview.innerHTML = `<div class="rarity-placeholder">Generating ${overlay.label} GIF...</div>`;
          download.setAttribute("aria-disabled", "true");
          download.removeAttribute("download");
          download.href = "#";
          await waitForPaint();

          const gifUrl = makeOverlayGif(image, overlay);
          if (!gifUrl || currentGeneration !== generationId) {
            if (gifUrl) URL.revokeObjectURL(gifUrl);
            return;
          }

          card.dataset.gifUrl = gifUrl;
          preview.innerHTML = "";
          const result = document.createElement("img");
          result.src = gifUrl;
          result.alt = `${overlay.label} animated rarity version`;
          preview.appendChild(result);

          download.href = gifUrl;
          download.download = `${file.name.replace(/\.[^.]+$/, "") || "image"}-${overlay.key}.gif`;
          download.textContent = "Download GIF";
          download.removeAttribute("aria-disabled");
          await waitForPaint();
        }
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
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
