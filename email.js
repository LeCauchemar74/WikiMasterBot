(() => {
  "use strict";

  if (location.hostname !== "10minutemail.com") return;

  const STORAGE_KEY = "wmph_settings";
  const DEFAULTS = {
    emailPollMs: 500,
    emailFillDelay: 150,
    signupFillDelay: 150
  };

  let settings = {...DEFAULTS};
  let lastCode = null;
  let lastMessage = null;
  let lastAddress = null;
  let pollTimer = null;
  let addressSending = false;
  let codeSending = false;

  const normalize = s => (s || "").replace(/\s+/g, " ").trim();
  const sleep = ms => new Promise(r => setTimeout(r, Math.max(0, Number(ms) || 0)));

  async function loadSettings() {
    try {
      const data = await chrome.storage.local.get(STORAGE_KEY);
      settings = {...DEFAULTS, ...(data[STORAGE_KEY] || {})};
    } catch {}
  }

  function getAddress() {
    const input = document.querySelector("#mail_address");
    const value = normalize(input?.value || input?.getAttribute("value") || "");
    if (/^[^\s@]+@[^\s@]+$/.test(value)) return value;

    const display = document.querySelector(".mail_address_display");
    const text = normalize(display?.textContent || "");
    if (/^[^\s@]+@[^\s@]+$/.test(text)) return text;

    return null;
  }

  async function sendAddress(address) {
    if (!address || address === lastAddress || addressSending) return;
    addressSending = true;
    try {
      await sleep(settings.signupFillDelay);
      const result = await chrome.runtime.sendMessage({
        type: "wmph_email_address",
        email: address,
        sourceWindowId: await getWindowId()
      });
      if (result?.ok && result.sent > 0) lastAddress = address;
    } catch (error) {
      console.warn("[WikiMasters Pack Hunter] Impossible d'envoyer l'adresse temporaire :", error);
    } finally { addressSending = false; }
  }

  function getMessageBlocks() {
    return [...document.querySelectorAll(".mail_message")];
  }

  function isWikiMastersMessage(block) {
    const text = normalize(block?.innerText || block?.textContent);
    return /wiki-masters\.com/i.test(text) || /WikiMasters/i.test(text);
  }

  function extractCode(block) {
    if (!block || !isWikiMastersMessage(block)) return null;

    // Prefer the actual message body instead of the sender/subject header.
    const body = block.querySelector(".message_bottom") || block;
    const text = normalize(body.innerText || body.textContent);

    // The WikiMasters email explicitly says "code de vérification" and the
    // example message contains a 6-digit code on its own paragraph.
    const contextual = text.match(/code(?:\s+de\s+v[ée]rification)?[^0-9]{0,120}(\d{6,12})/i);
    if (contextual) return contextual[1];

    // Fallback: look for a standalone 6-12 digit value in a paragraph.
    const paragraphs = [...body.querySelectorAll("p, h1, h2, h3, strong")]
      .map(el => normalize(el.textContent))
      .filter(Boolean);
    for (const p of paragraphs) {
      const m = p.match(/^(\d{6,12})$/);
      if (m) return m[1];
    }

    return null;
  }

  function findNewestCode() {
    const blocks = getMessageBlocks();
    // Newest mail is normally first, but scan all messages in case the site
    // changes ordering.
    for (const block of blocks) {
      const code = extractCode(block);
      if (!code) continue;
      const messageId = block.getAttribute("data-message-index") || code;
      return {code, messageId};
    }
    return null;
  }

  async function sendCode(code, messageId) {
    if (!code || code === lastCode && messageId === lastMessage || codeSending) return;
    codeSending = true;

    try {
      await sleep(settings.emailFillDelay);
      const result = await chrome.runtime.sendMessage({
        type: "wmph_email_code",
        code,
        messageId,
        sourceWindowId: await getWindowId()
      });
      if (result?.ok && result.sent > 0) { lastCode = code; lastMessage = messageId; }
    } catch (error) {
      console.warn("[WikiMasters Pack Hunter] Impossible d'envoyer le code OTP :", error);
    } finally { codeSending = false; }
  }

  async function getWindowId() {
    try {
      const current = await chrome.tabs.query({active:true, currentWindow:true});
      return current[0]?.windowId ?? null;
    } catch {
      return null;
    }
  }

  function scan() {
    const address = getAddress();
    if (address) sendAddress(address);

    const found = findNewestCode();
    if (found) sendCode(found.code, found.messageId);
  }

  function scheduleScan() {
    if (pollTimer) return;
    pollTimer = setTimeout(() => {
      pollTimer = null;
      scan();
    }, Math.max(50, Number(settings.emailPollMs) || DEFAULTS.emailPollMs));
  }

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local" || !changes[STORAGE_KEY]) return;
    settings = {...DEFAULTS, ...(changes[STORAGE_KEY].newValue || {})};
    scheduleScan();
  });

  const observer = new MutationObserver(scheduleScan);
  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    characterData: true
  });

  loadSettings().then(() => {
    scan();
    setInterval(scan, Math.max(100, Number(settings.emailPollMs) || DEFAULTS.emailPollMs));
  });
})();
