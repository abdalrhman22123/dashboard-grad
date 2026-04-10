(function () {
  var sidebar = document.getElementById("sidebar");
  var overlay = document.getElementById("overlay");
  var menuBtn = document.getElementById("menuBtn");
  var closeBtn = document.getElementById("sidebarClose");

  var tabs = Array.prototype.slice.call(document.querySelectorAll(".st-tab"));
  var panels = {
    accountPanel: document.getElementById("accountPanel"),
    prefsPanel: document.getElementById("prefsPanel"),
    notifPanel: document.getElementById("notifPanel"),
    securityPanel: document.getElementById("securityPanel"),
    displayPanel: document.getElementById("displayPanel"),
    vehiclePanel: document.getElementById("vehiclePanel"),
    subPanel: document.getElementById("subPanel"),
  };

  var toast = document.getElementById("toast");
  var saveBtn = document.getElementById("saveSettingsBtn");
  var resetBtn = document.getElementById("resetDefaultBtn");
  var exportBtn = document.getElementById("exportBtn");
  var deactivateBtn = document.getElementById("deactivateBtn");
  var deleteBtn = document.getElementById("deleteBtn");
  var avatarInput = document.getElementById("avatarInput");
  var avatarImg = document.getElementById("profileAvatar");
  var avatarFallback = document.getElementById("avatarFallback");
  var removeAvatarBtn = document.getElementById("removeAvatarBtn");

  var defaults = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    dob: "",
    location: "New York, USA",
  };

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 1800);
  }

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

  function setActivePanel(panelId) {
    tabs.forEach(function (tab) {
      tab.classList.toggle("is-active", tab.getAttribute("data-panel") === panelId);
    });
    Object.keys(panels).forEach(function (key) {
      panels[key].classList.toggle("is-hidden", key !== panelId);
    });
  }

  function resetFields() {
    document.getElementById("firstName").value = defaults.firstName;
    document.getElementById("lastName").value = defaults.lastName;
    document.getElementById("email").value = defaults.email;
    document.getElementById("phone").value = defaults.phone;
    document.getElementById("dob").value = defaults.dob;
    document.getElementById("location").value = defaults.location;
  }

  function removeAvatar() {
    avatarImg.src = "";
    avatarImg.classList.add("is-hidden");
    avatarFallback.classList.remove("is-hidden");
    avatarInput.value = "";
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      setActivePanel(tab.getAttribute("data-panel"));
    });
  });

  menuBtn.addEventListener("click", openNav);
  closeBtn.addEventListener("click", closeNav);
  overlay.addEventListener("click", closeNav);
  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) closeNav();
  });

  saveBtn.addEventListener("click", function () {
    showToast("Settings saved");
  });

  resetBtn.addEventListener("click", function () {
    resetFields();
    removeAvatar();
    showToast("Reset to default values");
  });

  exportBtn.addEventListener("click", function () {
    showToast("Preparing export...");
  });

  deactivateBtn.addEventListener("click", function () {
    showToast("Account deactivated (demo)");
  });

  deleteBtn.addEventListener("click", function () {
    var ok = window.confirm("Delete account permanently? This is a demo action.");
    if (ok) showToast("Account delete requested");
  });

  avatarInput.addEventListener("change", function (e) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    var max = 2 * 1024 * 1024;
    if (file.size > max) {
      showToast("Image too large. Max 2MB.");
      avatarInput.value = "";
      return;
    }
    var reader = new FileReader();
    reader.onload = function (ev) {
      avatarImg.src = ev.target.result;
      avatarImg.classList.remove("is-hidden");
      avatarFallback.classList.add("is-hidden");
      showToast("Profile photo updated");
    };
    reader.readAsDataURL(file);
  });

  removeAvatarBtn.addEventListener("click", function () {
    removeAvatar();
    showToast("Profile photo removed");
  });
})();
