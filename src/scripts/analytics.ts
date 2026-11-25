type Command = (...args: unknown[]) => void;
type ClarityCommand = Command & { q?: unknown[][] };

const analyticsWindow = window as Window & {
  dataLayer?: IArguments[];
  clarity?: ClarityCommand;
};
const preferenceKey = "eg-analytics-choice-v1";
const panel = document.querySelector<HTMLElement>("[data-analytics-consent]");
const settings = document.querySelector<HTMLElement>("[data-analytics-settings]");

if (panel && settings) {
  const { origin, base, measurementId, clarityId, pagePath } = panel.dataset;
  if (location.origin === origin && base === "/" && measurementId && pagePath) {
    setup(panel, settings, measurementId, pagePath, clarityId);
  }
}

function setup(
  panel: HTMLElement,
  settings: HTMLElement,
  measurementId: string,
  pagePath: string,
  clarityId?: string,
) {
  let saved: string | null = null;
  try {
    saved = localStorage.getItem(preferenceKey);
  } catch {
    // Analytics remains off when the choice cannot be read.
  }

  let active = false;
  const disableKey = `ga-disable-${measurementId}` as const;
  function gtag() {
    (analyticsWindow.dataLayer ??= []).push(arguments);
  }
  const send = gtag as Command;
  const adConsent = { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" };

  function track(event: string) {
    if (active) send("event", event, { send_to: measurementId });
  }

  function enable() {
    if (active) return;
    active = true;

    const source = document.referrer ? new URL(document.referrer) : null;
    const referrer = source && /^(https?):$/.test(source.protocol) ? source.origin : "";
    send("consent", "default", { ...adConsent, analytics_storage: "denied" });
    send("consent", "update", { ...adConsent, analytics_storage: "granted" });
    send("js", new Date());
    send("config", measurementId, {
      page_location: new URL(pagePath, location.origin).href,
      page_referrer: referrer,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`);

    if (pagePath === "/portfolio/") track("view_portfolio");
    if (pagePath === "/consultation/") track("consultation_start");

    if (
      clarityId &&
      pagePath !== "/consultation/" &&
      pagePath !== "/404.html" &&
      !location.search &&
      !location.hash
    ) {
      const clarity: ClarityCommand = (...args) => (clarity.q ??= []).push(args);
      analyticsWindow.clarity = clarity;
      clarity("consentv2", { ad_Storage: "denied", analytics_Storage: "granted" });
      loadScript(`https://www.clarity.ms/tag/${encodeURIComponent(clarityId)}`);
    }
  }

  function withdraw() {
    active = false;
    Object.assign(analyticsWindow, { [disableKey]: true });
    analyticsWindow.clarity?.("consentv2", { ad_Storage: "denied", analytics_Storage: "denied" });
    for (const entry of document.cookie.split(";")) {
      const name = entry.split("=")[0].trim();
      if (!/^(_ga(?:_[A-Z0-9]+)?|_clck|_clsk)$/i.test(name)) continue;
      document.cookie = `${name}=; Max-Age=0; Path=/; Secure`;
      document.cookie = `${name}=; Max-Age=0; Path=/; Domain=${location.hostname}; Secure`;
    }
    location.reload();
  }

  settings.hidden = false;
  const settingsButton = settings.querySelector("button");
  settingsButton?.addEventListener("click", () => {
    panel.hidden = false;
    panel.querySelector("h2")?.focus();
  });

  panel.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const choice = event.target.closest<HTMLButtonElement>("button[data-analytics-choice]")?.dataset
      .analyticsChoice;
    if (choice !== "accepted" && choice !== "declined") return;
    try {
      localStorage.setItem(preferenceKey, choice);
    } catch {
      // The choice still applies to the current page.
    }
    panel.hidden = true;
    if (settingsButton && panel.contains(document.activeElement)) {
      settingsButton.focus({ preventScroll: true });
    }
    if (choice === "accepted") enable();
    if (choice === "declined" && active) withdraw();
  });

  window.addEventListener("storage", (event) => {
    if (
      active &&
      (event.key === preferenceKey || event.key === null) &&
      event.newValue !== "accepted"
    )
      withdraw();
  });

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element) || event.defaultPrevented) return;
    const href = event.target.closest("a")?.getAttribute("href")?.toLowerCase();
    if (href?.startsWith("tel:")) track("click_phone");
    if (href?.startsWith("mailto:")) track("click_email");
  });

  if (saved === "accepted") enable();
  else if (saved !== "declined") panel.hidden = false;
}

function loadScript(src: string) {
  const script = document.createElement("script");
  script.async = true;
  script.referrerPolicy = "no-referrer";
  script.src = src;
  document.head.append(script);
}
