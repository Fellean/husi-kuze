const DEFAULT_DATA = { galleryCategories: [], customArticles: [] };

let data = structuredClone(DEFAULT_DATA);
let selectedArticle = null;
let dirty = false;
let uploading = false;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const state = $("#saveState");
const saveButton = $("#saveLocal");
const publishButton = $("#publish");
const categoriesRoot = $("#categories");
const articleListRoot = $("#articleList");
const articleCanvas = $("#articleCanvas");
const toast = $("#toast");
const sortableConfigs = new WeakMap();

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72);
}

function plain(element) {
  return element.innerText.replace(/\u00a0/g, " ").trim();
}

function setEditable(element, value, onChange) {
  element.textContent = value ?? "";
  element.addEventListener("input", () => {
    onChange(plain(element));
    markDirty();
  });
  element.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !element.classList.contains("paragraph")) {
      event.preventDefault();
      element.blur();
    }
  });
}

function markDirty() {
  dirty = true;
  state.textContent = "Neuložené změny";
  state.classList.add("dirty");
}

function markClean(message = "Všechno uložené") {
  dirty = false;
  state.textContent = message;
  state.classList.remove("dirty");
}

function showToast(message, kind = "ok") {
  toast.textContent = message;
  toast.dataset.kind = kind;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 4200);
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { "content-type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || `Chyba ${response.status}`);
  return result;
}

async function load() {
  try {
    const [content, status] = await Promise.all([api("/api/content"), api("/api/status")]);
    data = {
      galleryCategories: Array.isArray(content.galleryCategories) ? content.galleryCategories : [],
      customArticles: Array.isArray(content.customArticles) ? content.customArticles : [],
    };
    $("#branchName").textContent = status.isGit
      ? `větev ${status.branch || "nezjištěná"}`
      : "složka není Git repozitář";
    $("#gitMessage").textContent = status.isGit
      ? (status.hasRemote
          ? "Publikování odešle změny do GitHubu. Cloudflare potom spustí nový build."
          : "Chybí Git remote „origin“. Uložit půjde, publikovat zatím ne.")
      : "Lokální uložení funguje, ale pro publikování otevři editor uvnitř naklonovaného repozitáře.";
    saveButton.disabled = false;
    publishButton.disabled = !status.isGit || !status.hasRemote;
    render();
    markClean("Načteno");
  } catch (error) {
    state.textContent = "Editor se nepřipojil";
    showToast(error.message, "error");
  }
}

function makeSortable(container, selector, collection, onRender) {
  sortableConfigs.set(container, { selector, collection, onRender });
  if (container.dataset.sortableBound === "true") return;
  container.dataset.sortableBound = "true";
  let from = null;
  container.addEventListener("dragstart", (event) => {
    const config = sortableConfigs.get(container);
    const card = event.target.closest(config.selector);
    if (!card || event.target.closest("[contenteditable], input, textarea, button, summary")) {
      event.preventDefault();
      return;
    }
    from = Number(card.dataset.index);
    card.classList.add("dragging");
    event.dataTransfer.effectAllowed = "move";
  });
  container.addEventListener("dragend", (event) => {
    const config = sortableConfigs.get(container);
    event.target.closest(config.selector)?.classList.remove("dragging");
    from = null;
  });
  container.addEventListener("dragover", (event) => {
    if (from === null) return;
    const config = sortableConfigs.get(container);
    const card = event.target.closest(config.selector);
    if (!card) return;
    event.preventDefault();
    const to = Number(card.dataset.index);
    if (to === from) return;
    const [moved] = config.collection.splice(from, 1);
    config.collection.splice(to, 0, moved);
    from = to;
    markDirty();
    config.onRender();
  });
}

async function uploadImage(file) {
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error(`Soubor ${file.name} nejde přečíst.`));
    reader.readAsDataURL(file);
  });
  return api("/api/image", {
    method: "POST",
    body: JSON.stringify({ name: file.name, dataUrl }),
  });
}

async function addImages(files, category) {
  if (!files.length || uploading) return;
  uploading = true;
  state.textContent = `Nahrávám ${files.length} ${files.length === 1 ? "fotku" : "fotek"}…`;
  try {
    for (const file of files) {
      const uploaded = await uploadImage(file);
      category.images.push({
        src: uploaded.src,
        alt: "",
        title: file.name.replace(/\.[^.]+$/, ""),
        caption: "",
      });
    }
    markDirty();
    renderGallery();
    showToast("Fotky jsou v projektu. Publikují se spolu s ostatními změnami.");
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    uploading = false;
  }
}

function renderImage(image, category, index) {
  const fragment = $("#imageTemplate").content.cloneNode(true);
  const card = $(".imageCard", fragment);
  card.dataset.index = index;
  const preview = $("img", card);
  preview.src = image.src;
  preview.alt = image.alt || "";
  setEditable($(".imageTitle", card), image.title, (value) => { image.title = value; });
  setEditable($(".imageCaption", card), image.caption, (value) => { image.caption = value; });
  const alt = $(".imageAlt", card);
  alt.value = image.alt || "";
  alt.addEventListener("input", () => {
    image.alt = alt.value;
    preview.alt = alt.value;
    markDirty();
  });
  const protectedInput = $(".protectedPreview", card);
  protectedInput.checked = Boolean(image.protectedPreview);
  protectedInput.addEventListener("change", () => {
    image.protectedPreview = protectedInput.checked || undefined;
    markDirty();
  });
  $(".deleteImage", card).addEventListener("click", () => {
    if (!confirm(`Odebrat „${image.title || "fotku"}“ z webu? Původní soubor zůstane v projektu.`)) return;
    category.images.splice(index, 1);
    markDirty();
    renderGallery();
  });
  return fragment;
}

function renderCategory(category, index) {
  const fragment = $("#categoryTemplate").content.cloneNode(true);
  const card = $(".categoryCard", fragment);
  card.dataset.index = index;
  setEditable($(".categoryTitle", card), category.title, (value) => {
    category.title = value;
    category.id = category.id || slugify(value);
  });
  setEditable($(".categoryDescription", card), category.description, (value) => {
    category.description = value;
  });
  $(".deleteCategory", card).addEventListener("click", () => {
    if (!confirm(`Smazat kategorii „${category.title}“ i všechny její karty z webu?`)) return;
    data.galleryCategories.splice(index, 1);
    markDirty();
    renderGallery();
  });
  const picker = $(".imagePicker", card);
  picker.addEventListener("change", () => addImages([...picker.files], category));
  const grid = $(".imageGrid", card);
  category.images ||= [];
  category.images.forEach((image, imageIndex) => grid.append(renderImage(image, category, imageIndex)));
  makeSortable(grid, ".imageCard", category.images, renderGallery);
  return fragment;
}

function renderGallery() {
  categoriesRoot.replaceChildren();
  data.galleryCategories.forEach((category, index) => {
    category.images ||= [];
    categoriesRoot.append(renderCategory(category, index));
  });
  makeSortable(categoriesRoot, ".categoryCard", data.galleryCategories, renderGallery);
}

function currentArticle() {
  return selectedArticle === null ? null : data.customArticles[selectedArticle];
}

function renderArticleList() {
  articleListRoot.replaceChildren();
  data.customArticles.forEach((article, index) => {
    const fragment = $("#articleListTemplate").content.cloneNode(true);
    const item = $(".articleListItem", fragment);
    item.dataset.index = index;
    item.classList.toggle("selected", index === selectedArticle);
    $(".articleNo", item).textContent = String(index + 1).padStart(2, "0");
    $(".articleKicker", item).textContent = article.kicker || "Autorský text";
    $(".articleTitle", item).textContent = article.title || "Bez názvu";
    item.addEventListener("click", () => {
      selectedArticle = index;
      renderArticles();
    });
    articleListRoot.append(fragment);
  });
  makeSortable(articleListRoot, ".articleListItem", data.customArticles, () => {
    if (selectedArticle !== null) selectedArticle = Math.min(selectedArticle, data.customArticles.length - 1);
    renderArticles();
  });
}

function renderParagraph(paragraph, section, index) {
  const fragment = $("#paragraphTemplate").content.cloneNode(true);
  const row = $(".paragraphRow", fragment);
  setEditable($(".paragraph", row), paragraph, (value) => {
    section.paragraphs[index] = value;
  });
  $(".deleteParagraph", row).addEventListener("click", () => {
    section.paragraphs.splice(index, 1);
    markDirty();
    renderArticleCanvas();
  });
  return fragment;
}

function renderSection(section, article, index) {
  const fragment = $("#sectionTemplate").content.cloneNode(true);
  const block = $(".sectionPreview", fragment);
  block.dataset.index = index;
  $(".sectionNo", block).textContent = String(index + 1).padStart(2, "0");
  setEditable($(".sectionTitle", block), section.title, (value) => { section.title = value; });
  const paragraphs = $(".paragraphList", block);
  section.paragraphs ||= [];
  section.paragraphs.forEach((paragraph, paragraphIndex) => {
    paragraphs.append(renderParagraph(paragraph, section, paragraphIndex));
  });
  $(".addParagraph", block).addEventListener("click", () => {
    section.paragraphs.push("Nový odstavec");
    markDirty();
    renderArticleCanvas();
  });
  $(".deleteSection", block).addEventListener("click", () => {
    if (!confirm(`Smazat kapitolu „${section.title}“?`)) return;
    article.sections.splice(index, 1);
    markDirty();
    renderArticleCanvas();
  });
  return fragment;
}

async function setCover(article, file) {
  const uploaded = await uploadImage(file);
  article.cover = uploaded.src;
  article.coverAlt ||= article.title;
  markDirty();
  renderArticleCanvas();
}

function renderArticleCanvas() {
  const article = currentArticle();
  if (!article) {
    articleCanvas.className = "articleCanvas empty";
    articleCanvas.innerHTML = "<p>Vyber článek vlevo nebo založ nový.</p>";
    return;
  }
  articleCanvas.className = "articleCanvas";
  const fragment = $("#articleCanvasTemplate").content.cloneNode(true);
  const preview = $(".articlePreview", fragment);
  setEditable($(".previewKicker", preview), article.kicker, (value) => { article.kicker = value; renderArticleList(); });
  setEditable($(".previewTitle", preview), article.title, (value) => {
    article.title = value;
    article.slug = article.slug || slugify(value);
    renderArticleList();
  });
  setEditable($(".previewDek", preview), article.dek, (value) => { article.dek = value; });
  setEditable($(".previewDate", preview), article.date, (value) => { article.date = value; });
  setEditable($(".previewThesis", preview), article.thesis, (value) => { article.thesis = value; });
  const cover = $(".previewCover", preview);
  cover.src = article.cover || "/gallery/jehelnice-lebka.webp";
  cover.alt = article.coverAlt || "";
  $(".coverPicker input", preview).addEventListener("change", async (event) => {
    const [file] = event.currentTarget.files;
    if (!file) return;
    try {
      await setCover(article, file);
    } catch (error) {
      showToast(error.message, "error");
    }
  });
  const sectionList = $(".sectionList", preview);
  article.sections ||= [];
  article.sections.forEach((section, index) => sectionList.append(renderSection(section, article, index)));
  makeSortable(sectionList, ".sectionPreview", article.sections, renderArticleCanvas);
  $(".addSection", preview).addEventListener("click", () => {
    article.sections.push({ title: "Nová kapitola", paragraphs: ["Nový odstavec"] });
    markDirty();
    renderArticleCanvas();
  });
  $(".deleteArticle", preview).addEventListener("click", () => {
    if (!confirm(`Opravdu smazat celý článek „${article.title}“?`)) return;
    data.customArticles.splice(selectedArticle, 1);
    selectedArticle = data.customArticles.length ? Math.min(selectedArticle, data.customArticles.length - 1) : null;
    markDirty();
    renderArticles();
  });
  articleCanvas.replaceChildren(fragment);
}

function renderArticles() {
  renderArticleList();
  renderArticleCanvas();
}

function render() {
  renderGallery();
  renderArticles();
}

async function save(publish = false) {
  if (uploading) return showToast("Počkej, ještě se nahrávají obrázky.", "error");
  saveButton.disabled = true;
  publishButton.disabled = true;
  state.textContent = publish ? "Publikuju…" : "Ukládám…";
  try {
    const result = await api(publish ? "/api/publish" : "/api/save", {
      method: "POST",
      body: JSON.stringify({ data }),
    });
    if (publish) {
      markClean(result.pushed ? "Publikováno na GitHub" : "Beze změn");
      showToast(result.message || "GitHub změnu přijal. Cloudflare teď staví novou verzi.");
    } else {
      markClean("Uloženo v počítači");
      showToast("Rozepsaná verze je uložená. Na webu zatím není.");
    }
  } catch (error) {
    state.textContent = "Uložení selhalo";
    showToast(error.message, "error");
  } finally {
    saveButton.disabled = false;
    publishButton.disabled = false;
  }
}

$("#saveLocal").addEventListener("click", () => save(false));
$("#publish").addEventListener("click", () => save(true));

$("#addCategory").addEventListener("click", () => {
  const category = { id: `nova-kategorie-${Date.now()}`, title: "Nová kategorie", description: "Klikni a napiš krátký popis.", images: [] };
  data.galleryCategories.push(category);
  markDirty();
  renderGallery();
  requestAnimationFrame(() => $$(".categoryTitle").at(-1)?.focus());
});

$("#globalImagePicker").addEventListener("change", async (event) => {
  if (!data.galleryCategories.length) {
    showToast("Nejdřív vytvoř kategorii, do které fotky patří.", "error");
    return;
  }
  await addImages([...event.currentTarget.files], data.galleryCategories[0]);
});

$("#addArticle").addEventListener("click", () => {
  $("#newArticleTitle").value = "";
  $("#newArticleDialog").showModal();
  requestAnimationFrame(() => $("#newArticleTitle").focus());
});

$("#confirmArticle").addEventListener("click", (event) => {
  const title = $("#newArticleTitle").value.trim();
  if (!title) {
    event.preventDefault();
    return $("#newArticleTitle").focus();
  }
  data.customArticles.push({
    slug: slugify(title),
    kicker: "Autorský text · pracovní verze",
    title,
    dek: "Klikni sem a napiš perex článku.",
    date: new Intl.DateTimeFormat("cs-CZ", { month: "long", year: "numeric" }).format(new Date()),
    cover: "/gallery/jehelnice-lebka.webp",
    coverAlt: title,
    thesis: "Klikni sem a napiš hlavní tezi.",
    sections: [{ title: "První kapitola", paragraphs: ["Klikni sem a začni psát."] }],
    sources: [],
  });
  selectedArticle = data.customArticles.length - 1;
  markDirty();
  renderArticles();
});

$$(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    $$(".tab").forEach((item) => item.classList.toggle("active", item === tab));
    $$(".panel").forEach((panel) => panel.classList.remove("active"));
    $(`#${tab.dataset.tab}Panel`).classList.add("active");
  });
});

window.addEventListener("beforeunload", (event) => {
  if (!dirty) return;
  event.preventDefault();
  event.returnValue = "";
});

load();
