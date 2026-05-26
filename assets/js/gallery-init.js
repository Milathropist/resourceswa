/**
 * Gallery Logic for Image Hosting
 * Loads gallery data from a generated manifest so GitHub uploads show up automatically.
 */
(() => {
  const GALLERY_MANIFEST_PATH = "assets/data/gallery.json";

  const createGallerySection = (cat) => {
    const section = document.createElement("div");
    section.className = "gallery-section";

    const button = document.createElement("button");
    button.className = "collapsible-trigger";
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

  const renderGallery = (categories) => {
    const mainContainer = document.getElementById("main");
    if (!mainContainer) return;

    mainContainer.style.display = "block";
    mainContainer.style.opacity = "1";
    mainContainer.innerHTML = "";

    const wrapper = document.createElement("div");
    wrapper.className = "gallery-container";

    categories.forEach((category) => {
      if (Array.isArray(category.images) && category.images.length > 0) {
        wrapper.appendChild(createGallerySection(category));
      }
    });

    mainContainer.appendChild(wrapper);
  };

  const renderError = () => {
    const mainContainer = document.getElementById("main");
    if (!mainContainer) return;

    mainContainer.style.display = "block";
    mainContainer.style.opacity = "1";
    mainContainer.innerHTML = "<p>Gallery data could not be loaded.</p>";
  };

  const init = async () => {
    try {
      const response = await fetch(`${GALLERY_MANIFEST_PATH}?v=${Date.now()}`, {
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error(`Failed to load gallery manifest: ${response.status}`);
      }

      const payload = await response.json();
      const categories = Array.isArray(payload.categories) ? payload.categories : [];
      renderGallery(categories);
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
