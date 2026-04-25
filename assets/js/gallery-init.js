/**
 * Gallery Logic for Image Hosting
 * Handles categories: bgimg, YuriGifs, YuriHugs
 */
(() => {
  const CATEGORIES = {
    bgimg: {
      label: "Background Images",
      path: "bgimg/",
      images: ["botpink.png", "botpink2.png", "botviolet.png", "pink.jpg"] // Add your filenames here
    },
    YuriGifs: {
      label: "Yuri Gifs",
      path: "YuriGifs/",
      images: ["yuri1.gif", "yuri2.gif", "yuri3.gif", "yuri4.gif", "yuri5.gif", "yuri6.gif", "yuri7.gif", "yuri8.gif"] // Add your filenames here
    },
    YuriHugs: {
      label: "Yuri Hugs",
      path: "YuriHugs/",
      images: ["hug1.gif", "hug2.gif", "hug3.gif", "hug4.gif", "hug5.gif", "hug6.gif", "hug7.gif", "hug8.gif", "hug9.gif"] // Add your filenames here
    }
  };

  const createGallerySection = (key, cat) => {
    const section = document.createElement("div");
    section.className = "gallery-section";

    const button = document.createElement("button");
    button.className = "collapsible-trigger";
    button.innerHTML = `<span>${cat.label}</span>`;
    
    const content = document.createElement("div");
    content.className = "collapsible-content";
    
    const grid = document.createElement("div");
    grid.className = "gallery-grid";

    cat.images.forEach(imgName => {
      const fullPath = `${cat.path}${imgName}`;
      const item = document.createElement("div");
      item.className = "gallery-item";
      
      const link = document.createElement("a");
      link.href = fullPath;
      link.target = "_blank"; // Opens the image alone

      const img = document.createElement("img");
      img.src = fullPath;
      img.alt = imgName;
      img.loading = "lazy";

      link.appendChild(img);
      item.appendChild(link);
      grid.appendChild(item);
    });

    content.appendChild(grid);
    
    button.onclick = () => {
      const isOpen = content.classList.contains("open");
      // Close all others first for a clean accordion effect
      document.querySelectorAll(".collapsible-content").forEach(c => c.classList.remove("open"));
      document.querySelectorAll(".collapsible-trigger").forEach(b => b.classList.remove("active"));
      
      if (!isOpen) {
        content.classList.add("open");
        button.classList.add("active");
      }
    };

    section.appendChild(button);
    section.appendChild(content);
    return section;
  };

  const init = () => {
    const mainContainer = document.getElementById("main");
    if (!mainContainer) return;

    mainContainer.style.display = "block";
    mainContainer.style.opacity = "1";
    mainContainer.innerHTML = ""; // Clear loader

    const wrapper = document.createElement("div");
    wrapper.className = "gallery-container";

    Object.keys(CATEGORIES).forEach(key => {
      wrapper.appendChild(createGallerySection(key, CATEGORIES[key]));
    });

    mainContainer.appendChild(wrapper);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();