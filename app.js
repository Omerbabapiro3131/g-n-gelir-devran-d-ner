const DEFAULT_API_KEY = "AIzaSyDaaVAk5Rfsg6FCZSJDi7Vd8Rnyk3Uyi34";
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const translations = {
  tr: {
    title: "CapyAI",
    subtitle: "Kod yazma ve sohbet odaklı, Gemini 2.5 Flash destekli asistan.",
    ipTitle: "IP Bilgisi",
    yourIp: "IP Adresiniz:",
    country: "Ülke:",
    siteLanguage: "Site Dili:",
    apiTitle: "Gemini Ayarları",
    apiLabel: "Gemini API Key",
    apiHint: "Anahtar localStorage'da saklanır.",
    chatTitle: "CapyAI Sohbet",
    send: "Gönder",
    close: "Kapat",
    promptPlaceholder: "Sorunu yaz...",
    ipModalTitle: "Hoş geldin!",
    siteLangName: "Türkçe",
    aiError: "CapyAI yanıt üretirken bir hata oluştu.",
    ipModalText: (ip, country) => `IP adresin ${ip}. Algılanan ülke: ${country}.`,
  },
  en: {
    title: "CapyAI",
    subtitle: "Coding and chat assistant powered by Gemini 2.5 Flash.",
    ipTitle: "IP Information",
    yourIp: "Your IP:",
    country: "Country:",
    siteLanguage: "Site Language:",
    apiTitle: "Gemini Settings",
    apiLabel: "Gemini API Key",
    apiHint: "The key is stored in localStorage.",
    chatTitle: "CapyAI Chat",
    send: "Send",
    close: "Close",
    promptPlaceholder: "Type your question...",
    ipModalTitle: "Welcome!",
    siteLangName: "English",
    aiError: "CapyAI could not generate a response.",
    ipModalText: (ip, country) => `Your IP is ${ip}. Detected country: ${country}.`,
  },
};

const dom = {
  userIp: document.getElementById("userIp"),
  userCountry: document.getElementById("userCountry"),
  siteLanguage: document.getElementById("siteLanguage"),
  apiKey: document.getElementById("apiKey"),
  chatLog: document.getElementById("chatLog"),
  chatForm: document.getElementById("chatForm"),
  promptInput: document.getElementById("promptInput"),
  sendBtn: document.getElementById("sendBtn"),
  ipModal: document.getElementById("ipModal"),
  sloganModal: document.getElementById("sloganModal"),
  ipModalText: document.getElementById("ipModalText"),
  ipModalClose: document.getElementById("ipModalClose"),
  sloganModalClose: document.getElementById("sloganModalClose"),
};

let locale = "tr";

function t(key) {
  return translations[locale][key] || translations.tr[key] || key;
}

function applyTranslations() {
  document.documentElement.lang = locale;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    node.textContent = t(key);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    const key = node.dataset.i18nPlaceholder;
    node.placeholder = t(key);
  });
  dom.siteLanguage.textContent = t("siteLangName");
}

function showModal(modal) {
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}

function hideModal(modal) {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

function addMessage(role, text) {
  const div = document.createElement("div");
  div.className = `msg ${role}`;
  div.textContent = text;
  dom.chatLog.appendChild(div);
  dom.chatLog.scrollTop = dom.chatLog.scrollHeight;
}

async function fetchIpInfo() {
  const res = await fetch("https://ipapi.co/json/");
  if (!res.ok) throw new Error("IP API error");
  return res.json();
}

async function askGemini(prompt) {
  const apiKey = dom.apiKey.value.trim() || DEFAULT_API_KEY;
  const body = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Kullanıcının mesajını geldiği dilde yanıtla. Eğer kullanıcı kod isterse kodu blok içinde açıkla ve üret.\n\nKullanıcı mesajı:\n${prompt}`,
          },
        ],
      },
    ],
  };

  const res = await fetch(`${GEMINI_URL}?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Gemini API error");

  const data = await res.json();
  return (
    data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("\n") ||
    t("aiError")
  );
}

async function init() {
  dom.apiKey.value = localStorage.getItem("capyai-gemini-key") || DEFAULT_API_KEY;
  dom.apiKey.addEventListener("change", () => {
    localStorage.setItem("capyai-gemini-key", dom.apiKey.value.trim());
  });

  try {
    const ipData = await fetchIpInfo();
    const countryCode = String(ipData.country_code || "").toUpperCase();
    locale = countryCode === "GB" ? "en" : "tr";
    applyTranslations();

    dom.userIp.textContent = ipData.ip || "-";
    dom.userCountry.textContent = ipData.country_name || "-";
    dom.ipModalText.textContent = t("ipModalText")(ipData.ip || "-", ipData.country_name || "-");
  } catch {
    locale = "tr";
    applyTranslations();
    dom.ipModalText.textContent = t("ipModalText")("-", "-");
  }

  showModal(dom.ipModal);

  dom.ipModalClose.addEventListener("click", () => {
    hideModal(dom.ipModal);
    showModal(dom.sloganModal);
  });

  dom.sloganModalClose.addEventListener("click", () => {
    hideModal(dom.sloganModal);
  });

  dom.chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const prompt = dom.promptInput.value.trim();
    if (!prompt) return;

    addMessage("user", prompt);
    dom.promptInput.value = "";
    dom.sendBtn.disabled = true;

    try {
      const answer = await askGemini(prompt);
      addMessage("ai", answer);
    } catch {
      addMessage("ai", t("aiError"));
    } finally {
      dom.sendBtn.disabled = false;
    }
  });
}

init();
