// Frontend analytics tracker
// Fires events to /api/track

let sessionId: string | null = null;
let pageStartTime: number = Date.now();
let formStarted = false;

function getSessionId(): string {
  if (sessionId) return sessionId;
  if (typeof window === "undefined") return "ssr";
  const stored = sessionStorage.getItem("kp_sid");
  if (stored) {
    sessionId = stored;
    return sessionId;
  }
  const id = "sid_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
  sessionStorage.setItem("kp_sid", id);
  sessionId = id;
  return sessionId;
}

async function fire(eventType: string, payload?: Record<string, unknown>) {
  try {
    await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: getSessionId(),
        eventType,
        page: typeof window !== "undefined" ? window.location.pathname : "/",
        payload: payload ? JSON.stringify(payload) : null,
      }),
      keepalive: true,
    });
  } catch {
    // silent fail
  }
}

export function trackPageview() {
  pageStartTime = Date.now();
  fire("pageview", { url: window.location.href, referrer: document.referrer });
}

export function trackScrollDepth(percent: number) {
  fire("scroll_depth", { percent });
}

export function trackSectionView(section: string) {
  fire("section_view", { section });
}

export function trackClick(label: string, extra?: Record<string, unknown>) {
  fire("click", { label, ...extra });
}

export function trackFormStart() {
  if (!formStarted) {
    formStarted = true;
    fire("form_start");
  }
}

export function trackFormSubmit(packageType: string) {
  fire("form_submit", { packageType });
}

export function trackFormError(field: string, message: string) {
  fire("form_error", { field, message });
}

export function trackTimeOnPage() {
  const seconds = Math.round((Date.now() - pageStartTime) / 1000);
  fire("time_on_page", { seconds });
}

// Initialize scroll depth tracking
export function initTracking() {
  if (typeof window === "undefined") return;

  trackPageview();

  // Aktif ziyaretçi sayımı için periyodik sinyal (sayfa açıkken)
  const heartbeat = () => fire("heartbeat");
  heartbeat();
  const heartbeatId = window.setInterval(heartbeat, 45000);

  const milestones = new Set<number>();
  const checkScroll = () => {
    const scrolled = window.scrollY + window.innerHeight;
    const total = document.body.scrollHeight;
    const pct = Math.round((scrolled / total) * 100);
    [25, 50, 75, 90, 100].forEach((m) => {
      if (pct >= m && !milestones.has(m)) {
        milestones.add(m);
        trackScrollDepth(m);
      }
    });
  };
  window.addEventListener("scroll", checkScroll, { passive: true });

  // Section view observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id || entry.target.getAttribute("data-section");
          if (id) trackSectionView(id);
        }
      });
    },
    { threshold: 0.3 }
  );

  document.querySelectorAll("[data-section]").forEach((el) => observer.observe(el));

  // Time on page - fire on unload
  const onUnload = () => {
    window.clearInterval(heartbeatId);
    trackTimeOnPage();
  };
  window.addEventListener("beforeunload", onUnload);
  window.addEventListener("pagehide", onUnload);
}
