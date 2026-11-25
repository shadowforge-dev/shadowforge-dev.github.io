/**
 * shadowforge.dev on Cloudflare Pages: static files plus the Hearth feedback proxy.
 *
 * POST /api/feedback forwards a message to Hearth (api.shadowforge.dev) with the app
 * token, which only this worker holds. Same shape as the worker on psydex.cards,
 * quiverbooks.app and oldgold.shadowforge.dev, except that this site serves four
 * apps, so the form says which one it's about (checked against APPS).
 *
 * Environment (Cloudflare Pages → shadowforge → Settings → Variables and Secrets):
 *   HEARTH_APP_TOKEN — the X-App-Token for the Hearth API
 */
const APPS = ["psydex", "quiverbooks", "oldgold", "tallystick"];
const CATEGORIES = ["general", "bug", "feature"];

// Repository files that were never meant to be pages.
const HIDDEN = /^\/(\.github\/|\.gitignore$|README\.md$|package(-lock)?\.json$|script\.test\.js$|_worker\.js$|CNAME$)/;

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        if (url.pathname === "/api/feedback") {
            if (request.method !== "POST") return json({ error: "POST only" }, 405);
            return handleFeedback(request, env);
        }
        if (HIDDEN.test(url.pathname)) return new Response("Not found", { status: 404 });
        return env.ASSETS.fetch(request);
    },
};

async function handleFeedback(request, env) {
    let body;
    try {
        body = await request.json();
    } catch {
        return json({ error: "Invalid JSON" }, 400);
    }
    const { app, category, message, contactEmail } = body || {};
    if (!APPS.includes(app)) return json({ error: "Pick which app this is about" }, 400);
    if (!CATEGORIES.includes(category) || typeof message !== "string" || !message.trim()) {
        return json({ error: "Category and message are required" }, 400);
    }
    if (message.length > 2000) return json({ error: "Message is over 2000 characters" }, 400);

    const payload = {
        appId: app,
        category,
        message,
        device: {
            model: "Web",
            osVersion: request.headers.get("user-agent") || "Unknown",
            appVersion: "web-1.0",
            appBuild: "1",
            locale: request.headers.get("accept-language") || "en",
        },
    };
    if (typeof contactEmail === "string" && contactEmail.trim()) payload.contactEmail = contactEmail.trim();

    try {
        const res = await fetch("https://api.shadowforge.dev/forge/feedback", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-App-Token": env.HEARTH_APP_TOKEN || "",
            },
            body: JSON.stringify(payload),
        });
        return new Response(await res.text(), { status: res.status, headers: { "Content-Type": "application/json" } });
    } catch {
        return json({ error: "Upstream error" }, 502);
    }
}

function json(data, status = 200) {
    return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
}
