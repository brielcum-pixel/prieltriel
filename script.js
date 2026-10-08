// Dave Mark site logic. No frameworks. Portfolio data is separate from rendering.
(function(){
  "use strict";

  // ---------- Config ----------
  var CONFIG = window.DM_CONFIG || {};
  var CONTACT_EMAIL = CONFIG.contactEmail || "booking@davemarktattoo.com";
  var FORM_ENDPOINT = CONFIG.formEndpoint || "";

  // ---------- Portfolio data ----------
  // To add a piece: drop the file into assets/tattoos/ and add one entry here.
  // category values: black-grey, fine-line, custom, meaningful
  var PORTFOLIO = [
    { src: "assets/tattoos/saint-shoulder.jpg", alt: "Black and grey tattoo of an armored archangel with spear on an upper arm, with fine geometric linework behind the figure", title: "Archangel · Upper Arm", detail: "Black and Grey · Custom", category: "black-grey", layout: "tall" },
    { src: "assets/tattoos/back-piece.jpg", alt: "Full back tattoo with two angels, an all seeing eye, and architectural geometry in black and grey", title: "Cathedral Back Piece", detail: "Black and Grey · Large Scale", category: "black-grey", layout: "tall" },
    { src: "assets/tattoos/angel-sleeve.webp", alt: "Black and grey angel portrait with lettering reading Rise Again on a full sleeve", title: "Angel Portrait Sleeve", detail: "Black and Grey · Portrait and Script", category: "black-grey", layout: "tall" },
    { src: "assets/tattoos/saint-forearm.jpg", alt: "Black and grey Saint Michael with shield and staff standing over a figure, with an owl above, on a forearm", title: "Saint Figure · Forearm", detail: "Black and Grey · Fine Shading", category: "black-grey", layout: "tall" },
    { src: "assets/tattoos/bat-shoulder.jpg", alt: "Fine line black and grey bat hanging from a scythe with web detailing on an upper arm", title: "Hanging Bat · Upper Arm", detail: "Fine Line · Black and Grey", category: "fine-line", layout: "tall" },
    { src: "assets/tattoos/ramen-bowl.jpg", alt: "Fine line tattoo of a ramen bowl with characters peeking from the noodles on a calf", title: "Ramen Bowl · Calf", detail: "Fine Line · Illustrative Custom", category: "custom", layout: "tall" },
    { src: "assets/tattoos/cat-outline.jpg", alt: "Minimal fine line outline of a resting cat with lettering on a forearm", title: "Resting Cat · Forearm", detail: "Fine Line · Custom Concept", category: "custom", layout: "tall" },
    { src: "assets/tattoos/script-forearm.jpg", alt: "Forearm tattoo with script reading Different Not Less inside an enso style circle with flame accents", title: "Different Not Less · Forearm", detail: "Meaningful · Script and Symbol", category: "meaningful", layout: "tall" },
    { src: "assets/tattoos/poseidon-sleeve.jpg", alt: "Black and grey full sleeve of a bearded sea god portrait above a tall ship on the forearm", title: "Sea God Sleeve · Full Arm", detail: "Black and Grey · Portrait Sleeve", category: "black-grey", layout: "tall" }
  ];

  // ---------- Nav ----------
  var menuBtn = document.getElementById("menuBtn");
  var mobileMenu = document.getElementById("mobileMenu");
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", function(){
      var open = mobileMenu.hasAttribute("hidden");
      if (open) { mobileMenu.removeAttribute("hidden"); menuBtn.setAttribute("aria-expanded", "true"); menuBtn.setAttribute("aria-label", "Close menu"); }
      else { mobileMenu.setAttribute("hidden", ""); menuBtn.setAttribute("aria-expanded", "false"); menuBtn.setAttribute("aria-label", "Open menu"); }
    });
    mobileMenu.querySelectorAll("a").forEach(function(a){
      a.addEventListener("click", function(){ mobileMenu.setAttribute("hidden", ""); menuBtn.setAttribute("aria-expanded", "false"); });
    });
  }

  var links = document.querySelectorAll(".nav-link");
  var ids = ["home", "work", "artist", "styles", "portfolio", "process", "consultation", "contact"];
  function onScroll(){
    var y = window.scrollY + 160, current = "home";
    ids.forEach(function(id){ var el = document.getElementById(id); if (el && el.offsetTop <= y) current = id; });
    links.forEach(function(l){ l.classList.toggle("is-active", l.getAttribute("href") === "#" + current); });
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  // ---------- Image loading states ----------
  function wireImage(img){
    function done(ok){
      img.classList.remove("loaded");
      if (ok) img.classList.add("loaded");
      else img.classList.add("img-missing");
    }
    if (img.complete && img.naturalWidth > 0) done(true);
    else if (img.complete) done(false);
    else {
      img.addEventListener("load", function(){ done(true); });
      img.addEventListener("error", function(){ done(false); });
    }
  }
  document.querySelectorAll("figure img").forEach(wireImage);

  // ---------- Gallery ----------
  var gallery = document.getElementById("gallery");
  var count = document.getElementById("galleryCount");
  var activeFilter = "all";
  var visibleItems = [];

  function matchesCategory(item){
    if (activeFilter === "all") return true;
    if (activeFilter === "fine-line") return item.category === "fine-line" || item.category === "custom";
    return item.category === activeFilter;
  }

  function renderGallery(){
    if (!gallery) return;
    gallery.innerHTML = "";
    visibleItems = PORTFOLIO.filter(matchesCategory);
    visibleItems.forEach(function(item, idx){
      var fig = document.createElement("figure");
      fig.className = "g-item" + (item.layout === "wide" ? " wide" : " tall");
      fig.style.margin = "0";

      var btn = document.createElement("button");
      btn.className = "g-btn";
      btn.type = "button";
      btn.setAttribute("aria-label", "View larger: " + item.title + ". " + item.detail);
      btn.dataset.index = String(idx);

      var skel = document.createElement("span");
      skel.className = "skeleton";
      skel.setAttribute("aria-hidden", "true");

      var img = document.createElement("img");
      img.src = item.src;
      img.alt = item.alt;
      img.loading = "lazy";
      img.decoding = "async";

      var cap = document.createElement("figcaption");
      var strong = document.createElement("strong");
      strong.textContent = item.title;
      var span = document.createElement("span");
      span.textContent = item.detail;
      cap.appendChild(strong); cap.appendChild(span);
      var inner = document.createElement("div");
      inner.appendChild(skel);
      inner.appendChild(img);
      inner.style.position = "relative";
      btn.appendChild(inner);
      btn.addEventListener("click", function(){ openLightbox(idx); });
      fig.appendChild(btn);
      fig.appendChild(cap);
      gallery.appendChild(fig);
      wireImage(img);
    });
    if (count) count.textContent = visibleItems.length + (visibleItems.length === 1 ? " piece" : " pieces");
  }

  var filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach(function(b){
    b.addEventListener("click", function(){
      activeFilter = b.dataset.filter;
      filterBtns.forEach(function(x){
        var on = x === b;
        x.classList.toggle("is-active", on);
        x.setAttribute("aria-pressed", on ? "true" : "false");
      });
      renderGallery();
    });
  });
  document.querySelectorAll("[data-filter-link]").forEach(function(a){
    a.addEventListener("click", function(){
      var f = a.getAttribute("data-filter-link");
      var target = document.querySelector('.filter-btn[data-filter="' + f + '"]');
      if (target) target.click();
    });
  });
  renderGallery();

  // ---------- Lightbox ----------
  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lbImg");
  var lbCap = document.getElementById("lbCaption");
  var lbCount = document.getElementById("lbCount");
  var lbIndex = 0;
  var lastFocus = null;

  function showLb(){
    var item = visibleItems[lbIndex];
    if (!item) return;
    lbImg.src = item.src;
    lbImg.alt = item.alt;
    lbCap.textContent = item.title + " · " + item.detail;
    if (lbCount) lbCount.textContent = (lbIndex + 1) + " of " + visibleItems.length;
  }
  function openLightbox(i){
    lbIndex = i; lastFocus = document.activeElement;
    showLb();
    lb.hidden = false; document.body.style.overflow = "hidden";
    var c = lb.querySelector(".lb-close"); if (c) c.focus();
  }
  function closeLightbox(){
    if (!lb || lb.hidden) return;
    lb.hidden = true; document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function step(d){
    if (!visibleItems.length) return;
    lbIndex = (lbIndex + d + visibleItems.length) % visibleItems.length;
    showLb();
  }
  var prev = document.getElementById("lbPrev");
  var next = document.getElementById("lbNext");
  if (prev) prev.addEventListener("click", function(){ step(-1); });
  if (next) next.addEventListener("click", function(){ step(1); });
  document.querySelectorAll("[data-lb-close]").forEach(function(b){ b.addEventListener("click", closeLightbox); });
  document.addEventListener("keydown", function(e){
    if (lb.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  // ---------- Consultation form ----------
  // Submission is isolated here. Connect FORM_ENDPOINT later without touching validation or UI.
  function submitInquiry(payload){
    if (FORM_ENDPOINT) {
      return fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }).then(function(res){
        if (!res.ok) throw new Error("Submit failed");
        return { sent: true };
      });
    }
    // No backend connected: fall back to the client's email app.
    var subject = "Consultation inquiry: " + payload.name + " / " + (payload.style || "style open");
    var body = [
      "Name: " + payload.name,
      "Email: " + payload.email,
      "Phone: " + (payload.phone || "not provided"),
      "Idea: " + payload.idea,
      "Meaning: " + (payload.meaning || "not provided"),
      "Style: " + (payload.style || "not provided"),
      "Placement: " + (payload.placement || "not provided"),
      "Size: " + (payload.size || "not provided"),
      "Preferred date: " + (payload.date || "not provided"),
      "Notes: " + (payload.notes || "none"),
      "Reference files selected: " + payload.fileNames
    ].join("\n");
    window.location.href = "mailto:" + CONTACT_EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    return Promise.resolve({ sent: false, fallback: true });
  }

  var form = document.getElementById("consultForm");
  var note = document.getElementById("formNote");
  var success = document.getElementById("formSuccess");
  var fieldsWrap = document.getElementById("formFields");
  var submitBtn = document.getElementById("submitBtn");
  var fileInput = document.getElementById("cRefs");
  var fileList = document.getElementById("fileList");

  function setInvalid(id, bad){
    var f = document.getElementById(id);
    if (!f) return;
    var wrap = f.closest(".field") || f.closest(".consent");
    if (wrap) wrap.classList.toggle("invalid", bad);
    f.setAttribute("aria-invalid", bad ? "true" : "false");
  }

  if (fileInput && fileList) {
    fileInput.addEventListener("change", function(){
      fileList.innerHTML = "";
      Array.from(fileInput.files || []).slice(0, 8).forEach(function(f){
        var li = document.createElement("li");
        li.textContent = f.name;
        fileList.appendChild(li);
      });
    });
  }

  if (form) {
    ["cName", "cEmail", "cIdea"].forEach(function(id){
      var f = document.getElementById(id);
      if (f) f.addEventListener("input", function(){ setInvalid(id, false); });
    });
    var consent = document.getElementById("cConsent");
    if (consent) consent.addEventListener("change", function(){ setInvalid("cConsent", false); });

    form.addEventListener("submit", function(e){
      e.preventDefault();
      var name = document.getElementById("cName");
      var email = document.getElementById("cEmail");
      var idea = document.getElementById("cIdea");
      var ok = true;
      var badName = !name.value.trim(); setInvalid("cName", badName); if (badName) ok = false;
      var badEmail = !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value.trim()); setInvalid("cEmail", badEmail); if (badEmail) ok = false;
      var badIdea = idea.value.trim().length < 5; setInvalid("cIdea", badIdea); if (badIdea) ok = false;
      var badConsent = !(consent && consent.checked); setInvalid("cConsent", badConsent); if (badConsent) ok = false;
      if (!ok) { note.textContent = "Please review the highlighted fields."; return; }

      var val = function(id){ var el = document.getElementById(id); return el ? el.value.trim() : ""; };
      var payload = {
        name: val("cName"), email: val("cEmail"), phone: val("cPhone"),
        idea: val("cIdea"), meaning: val("cMeaning"), style: val("cStyle"),
        placement: val("cPlacement"), size: val("cSize"), date: val("cDate"),
        notes: val("cNotes"),
        fileNames: fileInput && fileInput.files && fileInput.files.length
          ? Array.from(fileInput.files).map(function(f){ return f.name; }).join(", ")
          : "none attached"
      };

      submitBtn.disabled = true;
      submitBtn.textContent = "Sending Inquiry";
      note.textContent = "Preparing your inquiry.";

      submitInquiry(payload).then(function(){
        fieldsWrap.hidden = true;
        success.hidden = false;
        var detail = document.getElementById("successDetail");
        if (detail) detail.textContent = "Inquiry from " + payload.name + " · " + payload.email + ". Reference: " + new Date().toLocaleDateString() + ".";
        success.focus();
      }).catch(function(){
        note.textContent = "Something did not send. Please email " + CONTACT_EMAIL + " directly with your idea.";
      }).finally(function(){
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit Consultation Inquiry";
      });
    });

    var again = document.getElementById("newInquiryBtn");
    if (again) again.addEventListener("click", function(){
      form.reset();
      if (fileList) fileList.innerHTML = "";
      success.hidden = true;
      fieldsWrap.hidden = false;
      note.textContent = "";
      document.getElementById("cName").focus();
    });
  }

  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
