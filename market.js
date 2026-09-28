(() => {
  "use strict";

  const SOURCE = "wmph-market";
  const STORAGE_KEY = "wmph_market_cache";
  const CACHE_TTL = 90 * 60 * 1000;
  const RETRY_BACKOFF = 5 * 60 * 1000;
  const SCAN_DEBOUNCE = 250;
  const CARD_DATA_TIMEOUT = 10000;
  const MAX_CONCURRENCY = 3;
  const MAX_API_ATTEMPTS = 2;
  const PAGE_LOAD_AT = Date.now();
  const HOSTS = new Set(["www.wiki-masters.com", "wiki-masters.com"]);

  let cache = {};
  let initialized = false;
  let scanTimer = null;
  let requestSeq = 0;
  let requestedIds = new Set();
  let queue = [];
  let workersRunning = false;
  let persistQueue = Promise.resolve();

  const normalize = value => (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  function isCollectionPage() {
    try {
      const url = new URL(location.href);
      return HOSTS.has(url.hostname) && url.pathname.startsWith("/collection");
    } catch {
      return false;
    }
  }

  function getTitles() {
    if (!isCollectionPage()) return [];
    return [...document.querySelectorAll("h3")]
      .filter(h3 => h3.closest(".relative.isolate.group"))
      .map((h3, index) => ({
        index,
        h3,
        root: h3.closest(".relative.isolate.group"),
        name: (h3.textContent || "").replace(/\s+/g, " ").trim()
      }))
      .filter(item => item.name && item.root);
  }

  function fresh(entry) {
    return entry?.average != null &&
      Date.now() - Number(entry.updatedAt || 0) < CACHE_TTL;
  }

  function backedOff(entry) {
    const failedAt = Number(entry?.failedAt || 0);
    return failedAt >= PAGE_LOAD_AT && Date.now() - failedAt < RETRY_BACKOFF;
  }

  function formatPrice(value) {
    return new Intl.NumberFormat("fr-FR", {maximumFractionDigits: 0}).format(Number(value));
  }

  function findSlot(root) {
    return root?.querySelector(":scope > .wmph-market-price-slot") || null;
  }

  function ensureSlot(title) {
    const root = title.root;
    if (!root) return null;

    let slot = findSlot(root);
    if (slot) return slot;

    slot = document.createElement("div");
    slot.className = "wmph-market-price-slot";
    slot.dataset.cardName = title.name;
    slot.dataset.state = "loading";
    slot.textContent = "Recherche du prix…";

    Object.assign(slot.style, {
      display: "block",
      width: "100%",
      minHeight: "18px",
      marginTop: "4px",
      padding: "2px 0 0",
      textAlign: "center",
      font: "800 11px/1.25 system-ui,sans-serif",
      letterSpacing: ".1px",
      color: "var(--color-accent)",
      textShadow: "0 0 8px color-mix(in srgb, var(--color-accent) 55%, transparent)",
      pointerEvents: "none",
      userSelect: "none",
      opacity: "0.95",
      boxSizing: "border-box"
    });

    slot.title = "Prix moyen du marché — données WikiMasters";
    root.appendChild(slot);
    return slot;
  }

  function setSlot(title, state, text, extra = {}) {
    const slot = ensureSlot(title);
    if (!slot) return;

    slot.dataset.state = state;
    if (extra.cardId != null) {
      slot.dataset.cardId = extra.cardId;
      title.root.dataset.wmphCardId = extra.cardId;
    }
    if (extra.rarity != null) {
      slot.dataset.rarity = extra.rarity || "";
      title.root.dataset.wmphCardRarity = extra.rarity || "";
    }
    if (extra.price != null) {
      slot.dataset.price = String(extra.price);
      title.root.dataset.wmphCardPrice = String(extra.price);
    }
    slot.textContent = text;
  }

  async function loadCache() {
    try {
      const data = await chrome.storage.local.get(STORAGE_KEY);
      cache = data[STORAGE_KEY] || {};
    } catch {
      cache = {};
    }
  }

  function persistCache() {
    persistQueue = persistQueue
      .then(() => chrome.storage.local.set({[STORAGE_KEY]: cache}))
      .catch(() => {});
    return persistQueue;
  }

  async function fetchAverage(entry) {
    const url = `/api/marketplace/cards/${encodeURIComponent(entry.id)}/sales?scope=summary`;

    for (let attempt = 1; attempt <= MAX_API_ATTEMPTS; attempt++) {
      try {
        const response = await fetch(url, {
          credentials: "same-origin",
          cache: "no-store",
          headers: {Accept: "application/json"}
        });

        if (!response.ok) {
          if (attempt < MAX_API_ATTEMPTS && (response.status === 429 || response.status >= 500)) {
            await sleep(300 * attempt);
            continue;
          }
          throw new Error(String(response.status));
        }

        const data = await response.json();
        const summary = data?.summary || {};
        let rarity = entry.rarity && summary[entry.rarity] ? entry.rarity : null;

        if (!rarity) {
          const keys = Object.keys(summary);
          if (keys.length === 1) rarity = keys[0];
        }

        const average = rarity ? Number(summary[rarity]?.average) : NaN;
        if (!Number.isFinite(average)) throw new Error("average unavailable");

        return {average, rarity: rarity || entry.rarity || null};
      } catch {
        if (attempt < MAX_API_ATTEMPTS) {
          await sleep(300 * attempt);
          continue;
        }
        throw new Error("request failed");
      }
    }

    throw new Error("request failed");
  }

  async function processQueue() {
    if (workersRunning) return;
    workersRunning = true;

    const worker = async () => {
      while (queue.length) {
        const entry = queue.shift();
        if (!entry?.id) continue;

        if (fresh(cache[entry.id]) || backedOff(cache[entry.id])) continue;

        const title = getTitles()[entry.index];
        if (title) setSlot(title, "loading", "Recherche du prix…", {
          cardId: entry.id,
          rarity: entry.rarity || ""
        });

        try {
          const result = await fetchAverage(entry);

          cache[entry.id] = {
            ...cache[entry.id],
            id: entry.id,
            name: entry.name,
            rarity: result.rarity,
            average: result.average,
            updatedAt: Date.now(),
            failedAt: 0
          };

          const currentTitles = getTitles();
          const currentTitle = currentTitles[entry.index] ||
            currentTitles.find(item => normalize(item.name) === normalize(entry.name));

          if (currentTitle) {
            setSlot(currentTitle, "ready", `Moyenne : ${formatPrice(result.average)}`, {
              cardId: entry.id,
              rarity: result.rarity || entry.rarity || "",
              price: result.average
            });
          }

          persistCache();
        } catch {
          cache[entry.id] = {
            ...cache[entry.id],
            id: entry.id,
            name: entry.name,
            rarity: entry.rarity || null,
            failedAt: Date.now()
          };

          const currentTitles = getTitles();
          const currentTitle = currentTitles[entry.index] ||
            currentTitles.find(item => normalize(item.name) === normalize(entry.name));

          if (currentTitle) {
            setSlot(currentTitle, "unavailable", "Prix temporairement indisponible", {
              cardId: entry.id,
              rarity: entry.rarity || ""
            });
          }

          persistCache();
        }
      }
    };

    await Promise.all(Array.from({length: MAX_CONCURRENCY}, () => worker()));
    workersRunning = false;
    if (queue.length) processQueue();
  }

  function enqueue(entries) {
    for (const entry of entries) {
      if (!entry?.id || requestedIds.has(entry.id)) continue;
      requestedIds.add(entry.id);

      const cached = cache[entry.id];
      if (fresh(cached)) {
        const title = getTitles()[entry.index];
        if (title) {
          setSlot(title, "cached", `Moyenne : ${formatPrice(cached.average)}`, {
            cardId: entry.id,
            rarity: cached.rarity || entry.rarity || "",
            price: cached.average
          });
        }
        continue;
      }

      if (backedOff(cached)) {
        const title = getTitles()[entry.index];
        if (title) {
          setSlot(title, "unavailable", "Prix temporairement indisponible", {
            cardId: entry.id,
            rarity: cached.rarity || entry.rarity || ""
          });
        }
        continue;
      }

      queue.push(entry);
    }

    processQueue();
  }

  function requestCardData() {
    const titles = getTitles();
    if (!titles.length || !initialized) return;

    const requestId = ++requestSeq;

    const handler = event => {
      if (event.source !== window) return;

      const data = event.data;
      if (!data || data.source !== SOURCE || data.action !== "cardData" || data.requestId !== requestId) return;

      window.removeEventListener("message", handler);

      const entries = [];
      for (const card of data.cards || []) {
        if (!card?.id) continue;

        const title = titles[card.index] ||
          titles.find(item => normalize(item.name) === normalize(card.name));
        if (!title) continue;

        title.root.dataset.wmphCardId = card.id;
        title.root.dataset.wmphCardRarity = card.rarity || "";
        ensureSlot(title);

        entries.push({
          index: card.index,
          id: card.id,
          name: title.name,
          rarity: card.rarity || null
        });
      }

      enqueue(entries);
    };

    window.addEventListener("message", handler);
    window.postMessage({
      source: SOURCE,
      action: "getCardData",
      requestId
    }, "*");

    setTimeout(() => window.removeEventListener("message", handler), CARD_DATA_TIMEOUT);
  }

  function scan() {
    if (!isCollectionPage()) return;

    const titles = getTitles();
    for (const title of titles) ensureSlot(title);
    requestCardData();
  }

  function scheduleScan() {
    clearTimeout(scanTimer);
    scanTimer = setTimeout(scan, SCAN_DEBOUNCE);
  }

  chrome.runtime.onMessage.addListener(message => {
    if (message?.type === "wmph" && message.action === "marketCacheCleared") {
      cache = {};
      requestedIds.clear();
      queue = [];
      scan();
    }
  });

  const observer = new MutationObserver(() => {
    if (isCollectionPage()) scheduleScan();
  });

  async function init() {
    await loadCache();
    initialized = true;
    observer.observe(document.documentElement || document, {
      subtree: true,
      childList: true
    });
    scan();
  }

  init();
})();