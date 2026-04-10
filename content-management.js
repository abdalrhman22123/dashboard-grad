(function () {
  var sidebar = document.getElementById("sidebar");
  var overlay = document.getElementById("overlay");
  var menuBtn = document.getElementById("menuBtn");
  var closeBtn = document.getElementById("sidebarClose");

  var titleInput = document.getElementById("titleInput");
  var subtitleInput = document.getElementById("subtitleInput");
  var descriptionInput = document.getElementById("descriptionInput");
  var titleCount = document.getElementById("titleCount");
  var subtitleCount = document.getElementById("subtitleCount");
  var descriptionCount = document.getElementById("descriptionCount");
  var previewTitle = document.getElementById("previewTitle");
  var previewSubtitle = document.getElementById("previewSubtitle");
  var previewDescription = document.getElementById("previewDescription");

  var resetBtn = document.getElementById("resetBtn");
  var previewBtn = document.getElementById("previewBtn");
  var saveBtn = document.getElementById("saveBtn");
  var saveStatusText = document.getElementById("saveStatusText");
  var uploadBtn = document.querySelector(".cm-files-head .cm-btn--primary");
  var imageSearchInput = document.getElementById("imageSearchInput");
  var fileList = document.getElementById("fileList");
  var fileRows = Array.prototype.slice.call(fileList.querySelectorAll(".cm-file"));
  var toast = document.getElementById("toast");

  var tabButtons = Array.prototype.slice.call(document.querySelectorAll(".cm-tab"));
  var sectionPills = Array.prototype.slice.call(document.querySelectorAll(".cm-pill"));
  var toolbarBtns = Array.prototype.slice.call(document.querySelectorAll(".cm-tool"));

  var sectionTemplates = {
    hero: {
      title: "Take Control of Your Car",
      subtitle: "The Ultimate Smart Car Companion",
      description:
        "Control your vehicle from anywhere with our advanced mobile app. Climate control, security, diagnostics, and entertainment-all in your pocket.",
    },
    features: {
      title: "Everything You Need In One App",
      subtitle: "Powerful Features",
      description:
        "Explore climate automation, route intelligence, charging schedules, and live diagnostics designed for everyday drivers.",
    },
    pricing: {
      title: "Simple Plans For Every Driver",
      subtitle: "Flexible Pricing",
      description:
        "Choose monthly or yearly plans with transparent pricing and premium add-ons for smart automation.",
    },
    testimonials: {
      title: "Trusted By Drivers Worldwide",
      subtitle: "What Customers Say",
      description:
        "See how CarOS helps drivers save time, reduce stress, and enjoy better control of their vehicles.",
    },
    footer: {
      title: "Ready To Drive Smarter?",
      subtitle: "Get Started Today",
      description:
        "Join CarOS and upgrade your daily driving experience with modern, connected vehicle management.",
    },
  };

  function openNav() {
    sidebar.classList.add("is-open");
    overlay.classList.add("is-open");
    menuBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeNav() {
    sidebar.classList.remove("is-open");
    overlay.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(showToast._timer);
    showToast._timer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 1800);
  }

  function updateCountersAndPreview() {
    titleCount.textContent = titleInput.value.length;
    subtitleCount.textContent = subtitleInput.value.length;
    descriptionCount.textContent = descriptionInput.value.length;
    previewTitle.textContent = titleInput.value || "Title preview";
    previewSubtitle.textContent = subtitleInput.value || "Subtitle preview";
    previewDescription.textContent = descriptionInput.value || "Description preview";
  }

  function loadSection(key) {
    var data = sectionTemplates[key];
    if (!data) return;
    titleInput.value = data.title;
    subtitleInput.value = data.subtitle;
    descriptionInput.value = data.description;
    updateCountersAndPreview();
    showToast("Loaded " + key + " section");
  }

  function setActiveTab(targetId) {
    tabButtons.forEach(function (btn) {
      var active = btn.getAttribute("data-tab-target") === targetId;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", active ? "true" : "false");
    });
    document.getElementById("contentPanel").classList.toggle("cm-panel--hidden", targetId !== "contentPanel");
    document.getElementById("seoPanel").classList.toggle("cm-panel--hidden", targetId !== "seoPanel");
  }

  function filterImages(query) {
    var q = query.trim().toLowerCase();
    fileRows.forEach(function (row) {
      var text = row.getAttribute("data-search") || "";
      row.classList.toggle("is-hidden", q && text.toLowerCase().indexOf(q) === -1);
    });
  }

  function addFakeUpload() {
    var fileName = "new-upload-" + String(Date.now()).slice(-4) + ".jpg";
    var row = document.createElement("article");
    row.className = "cm-file";
    row.setAttribute("data-search", fileName + " upload");
    row.innerHTML =
      '<div class="cm-thumb"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg></div>' +
      '<div class="cm-file__info"><p class="cm-file__name">' + fileName + '</p><p class="cm-file__meta">Upload</p></div>' +
      '<div class="cm-file__meta-row"><p class="cm-file__col">0.6 MB</p><p class="cm-file__col">1280x720</p><p class="cm-file__col">Just now</p></div>' +
      '<div class="cm-file__actions"><button class="cm-icbtn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg></button><button class="cm-icbtn danger"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/></svg></button></div>';
    fileList.prepend(row);
    fileRows = Array.prototype.slice.call(fileList.querySelectorAll(".cm-file"));
    showToast("Image uploaded");
  }

  function applyFormat(format) {
    var t = descriptionInput;
    var start = t.selectionStart || 0;
    var end = t.selectionEnd || 0;
    var selected = t.value.slice(start, end) || "text";
    var prefix = "";
    var suffix = "";
    if (format === "bold") {
      prefix = "**";
      suffix = "**";
    } else if (format === "heading") {
      prefix = "## ";
    } else if (format === "bullet") {
      prefix = "- ";
    }
    t.value = t.value.slice(0, start) + prefix + selected + suffix + t.value.slice(end);
    updateCountersAndPreview();
    t.focus();
  }

  menuBtn.addEventListener("click", openNav);
  closeBtn.addEventListener("click", closeNav);
  overlay.addEventListener("click", closeNav);
  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) closeNav();
  });

  [titleInput, subtitleInput, descriptionInput].forEach(function (el) {
    el.addEventListener("input", updateCountersAndPreview);
  });

  tabButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      setActiveTab(btn.getAttribute("data-tab-target"));
    });
  });

  sectionPills.forEach(function (pill) {
    pill.addEventListener("click", function () {
      sectionPills.forEach(function (p) {
        p.classList.remove("is-active");
      });
      pill.classList.add("is-active");
      loadSection(pill.getAttribute("data-section"));
    });
  });

  toolbarBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      toolbarBtns.forEach(function (b) {
        b.classList.remove("is-active");
      });
      btn.classList.add("is-active");
      applyFormat(btn.getAttribute("data-format"));
      window.setTimeout(function () {
        btn.classList.remove("is-active");
      }, 300);
    });
  });

  resetBtn.addEventListener("click", function () {
    loadSection("hero");
    showToast("Reset to default");
  });

  previewBtn.addEventListener("click", function () {
    document.getElementById("previewCard").scrollIntoView({ behavior: "smooth", block: "center" });
    showToast("Preview focused");
  });

  saveBtn.addEventListener("click", function () {
    var now = new Date();
    var mins = String(now.getMinutes()).padStart(2, "0");
    saveStatusText.textContent = "Last saved: " + now.getHours() + ":" + mins;
    showToast("Changes saved");
  });

  imageSearchInput.addEventListener("input", function () {
    filterImages(imageSearchInput.value);
  });

  uploadBtn.addEventListener("click", function () {
    addFakeUpload();
  });

  updateCountersAndPreview();
})();
