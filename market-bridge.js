(() => {
  "use strict";

  if (window.__wmphMarketBridgeInstalled) return;
  window.__wmphMarketBridgeInstalled = true;

  const SOURCE = "wmph-market";
  const HOSTS = new Set(["www.wiki-masters.com", "wiki-masters.com"]);
  const normalize = value => (value || "").replace(/\s+/g, " ").trim();

  function getFiber(node) {
    if (!node) return null;
    const directKey = Object.keys(node).find(key => key.startsWith("__reactFiber$"));
    if (directKey && node[directKey]) return node[directKey];

    const propsKey = Object.keys(node).find(key => key.startsWith("__reactProps$"));
    const props = propsKey ? node[propsKey] : null;
    const refNode = props?.ref?.current;
    if (!refNode) return null;

    const refFiberKey = Object.keys(refNode).find(key => key.startsWith("__reactFiber$"));
    return refFiberKey ? refNode[refFiberKey] : null;
  }

  function getCard(fiber) {
    for (let depth = 0; fiber && depth < 40; depth++, fiber = fiber.return) {
      for (const props of [fiber.pendingProps, fiber.memoizedProps]) {
        const card = props?.card;
        if (card && typeof card === "object" && typeof card.id === "string") return card;
      }
    }
    return null;
  }

  function getRarity(h3, card) {
    const value = card?.rarity ?? card?.rarityCode ?? card?.rarity_name;
    if (typeof value === "string" && value.trim()) return value.trim().toUpperCase();

    const root = h3.closest(".relative.isolate.group") || h3.parentElement;
    if (!root) return null;

    const known = new Set(["L", "UR", "SR", "R", "C", "PC"]);
    for (const element of root.querySelectorAll("div,span,p")) {
      const text = normalize(element.textContent);
      if (known.has(text)) return text;
    }

    const match = (root.outerHTML || "").match(/--color-rarity-([a-z]+)/i);
    return match ? match[1].toUpperCase() : null;
  }

  function scan() {
    if (!HOSTS.has(location.hostname) || !new URL(location.href).pathname.startsWith("/collection")) return [];

    const seen = new Set();
    const cards = [];

    for (const [index, h3] of [...document.querySelectorAll("h3")].entries()) {
      const name = normalize(h3.textContent);
      const card = getCard(getFiber(h3));
      if (!name || !card?.id || seen.has(card.id)) continue;

      seen.add(card.id);
      cards.push({index, name, id: card.id, rarity: getRarity(h3, card)});
    }

    return cards;
  }

  window.addEventListener("message", event => {
    if (event.source !== window) return;
    if (event.data?.source !== SOURCE || event.data?.action !== "getCardData") return;

    window.postMessage({
      source: SOURCE,
      action: "cardData",
      requestId: event.data.requestId,
      cards: scan()
    }, "*");
  });
})();