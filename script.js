(() => {
  const OS_REPO = "Techman-cyber/Hex-OS";
  const RELEASES_API = `https://api.github.com/repos/${OS_REPO}/releases/latest`;
  const RELEASES_PAGE = `https://github.com/${OS_REPO}/releases`;
  const downloadButton = document.getElementById("downloadButton");
  const releaseText = document.getElementById("releaseText");
  const releaseWarning = document.getElementById("releaseWarning");

  // Always resolve downloads from the OS repository, never the website repository.
  async function loadLatestRelease() {
    try {
      const response = await fetch(RELEASES_API, {
        headers: { "Accept": "application/vnd.github+json" }
      });
      if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
      const release = await response.json();
      const assets = Array.isArray(release.assets) ? release.assets : [];
      const iso = assets.find(asset => /\.iso$/i.test(asset.name));
      const checksum = assets.find(asset => /sha256|checksum/i.test(asset.name));

      if (!iso) throw new Error("No ISO asset found in latest release");

      downloadButton.href = iso.browser_download_url;
      downloadButton.setAttribute("download", iso.name);
      downloadButton.innerHTML = `Download ${escapeHTML(iso.name)} <span>↓</span>`;
      releaseText.textContent = `${release.tag_name || "Latest release"} · ${(iso.size / (1024 ** 3)).toFixed(2)} GB`;
      releaseWarning.hidden = true;

      const card = document.querySelector(".checksum small");
      if (card && checksum) {
        card.textContent = `Checksum file available: ${checksum.name}. Verify the ISO before installing.`;
      }
      const releasesLink = document.querySelector(".card-release-link");
      if (releasesLink) releasesLink.href = release.html_url || RELEASES_PAGE;
    } catch (error) {
      downloadButton.href = RELEASES_PAGE;
      downloadButton.removeAttribute("download");
      downloadButton.innerHTML = `View OS releases <span>↗</span>`;
      releaseText.textContent = "Release information unavailable";
      releaseWarning.hidden = false;
      console.info("HEX release lookup:", error.message);
    }
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  loadLatestRelease();

  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  menuToggle?.addEventListener("click", () => navLinks.classList.toggle("open"));
  navLinks?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => navLinks.classList.remove("open")));

  const progress = document.getElementById("progress");
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  // Gentle pointer parallax on the 3D emblem.
  const stage = document.getElementById("hexStage");
  const art = document.querySelector(".hero-art");
  if (stage && art && matchMedia("(pointer:fine)").matches) {
    art.addEventListener("pointermove", event => {
      const rect = art.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      stage.style.transform = `rotateY(${x * 9}deg) rotateX(${-y * 7}deg)`;
    });
    art.addEventListener("pointerleave", () => stage.style.transform = "");
  }

  // Subtle depth movement for the desktop mockup.
  const preview = document.getElementById("desktopWindow");
  if (preview && matchMedia("(pointer:fine)").matches) {
    preview.addEventListener("pointermove", event => {
      const r = preview.getBoundingClientRect();
      const x = (event.clientX - r.left) / r.width - .5;
      const y = (event.clientY - r.top) / r.height - .5;
      preview.style.transform = `perspective(1200px) rotateX(${2 - y * 3}deg) rotateY(${x * 3}deg)`;
    });
    preview.addEventListener("pointerleave", () => preview.style.transform = "");
  }
})();