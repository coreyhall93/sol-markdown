import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { Button } from "./button";
import { ThemeMenu } from "./theme-menu";

const decode = (value) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};
const markdownPath = /\.(md|markdown)$/i.test(decode(location.pathname));
const sourceNode = document.body?.querySelector(":scope > pre");
if (location.protocol === "file:" && markdownPath && sourceNode) {
  const source = sourceNode.textContent;
  const fragment = DOMPurify.sanitize(
    marked.parse(source, { gfm: true, breaks: false }),
    {
      RETURN_DOM_FRAGMENT: true,
      FORBID_TAGS: [
        "script",
        "style",
        "iframe",
        "object",
        "embed",
        "form",
        "button",
        "svg",
        "math",
        "video",
        "audio",
        "source",
        "link",
        "meta",
      ],
      FORBID_ATTR: ["style", "srcset", "autofocus", "background"],
      ALLOWED_URI_REGEXP:
        /^(?:(?:https?|mailto|tel|file):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i,
    },
  );
  fragment.querySelectorAll("input").forEach((input) => {
    if (input.type !== "checkbox") input.remove();
    else {
      input.disabled = true;
      input.removeAttribute("name");
      input.removeAttribute("value");
    }
  });
  fragment.querySelectorAll("img").forEach((img) => {
    const raw = img.getAttribute("src") || "";
    let url;
    try {
      url = new URL(raw, location.href);
    } catch {
      img.remove();
      return;
    }
    if (url.protocol === "file:") {
      img.src = url.href;
      img.loading = "lazy";
    } else {
      const link = document.createElement("a");
      link.textContent = img.alt ? `Image: ${img.alt}` : "Open image";
      if (["https:", "http:"].includes(url.protocol)) {
        link.href = url.href;
        link.rel = "noreferrer noopener";
      }
      img.replaceWith(link);
    }
  });
  fragment.querySelectorAll("a").forEach((a) => {
    try {
      const url = new URL(a.getAttribute("href") || "", location.href);
      if (
        !["file:", "http:", "https:", "mailto:", "tel:"].includes(url.protocol)
      )
        a.removeAttribute("href");
    } catch {
      a.removeAttribute("href");
    }
  });
  fragment.querySelectorAll("table").forEach((table) => {
    const wrap = document.createElement("div");
    wrap.className = "sol-table";
    table.replaceWith(wrap);
    wrap.append(table);
  });
  const headings = [];
  const ids = new Set();
  fragment.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((h, index) => {
    let id =
      h.textContent
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, "-")
        .replace(/^-|-$/g, "") || "section";
    const base = id;
    let n = 2;
    while (ids.has(id)) id = `${base}-${n++}`;
    ids.add(id);
    h.id = id;
    headings.push({ id, text: h.textContent, level: Number(h.tagName[1]) });
  });
  const holder = document.createElement("div");
  holder.append(fragment);
  const html = holder.innerHTML;
  const title =
    headings.find((h) => h.level === 1)?.text ||
    decode(location.pathname.split("/").pop());
  document.title = title;
  const mount = document.createElement("div");
  mount.id = "sol-markdown";
  document.body.replaceChildren(mount);
  function App() {
    const [model, setModel] = useState({
      source,
      mode: "rendered",
      theme: "system",
      width: "reading",
    });
    React.useEffect(() => {
      chrome.storage.local.get(["theme", "width"], (prefs) =>
        setModel((m) => ({
          ...m,
          theme: ["system", "light", "dark"].includes(prefs.theme)
            ? prefs.theme
            : "system",
          width: prefs.width === "wide" ? "wide" : "reading",
        })),
      );
    }, []);
    React.useEffect(() => {
      if (location.hash) {
        const id = decode(location.hash.slice(1));
        document.getElementById(id)?.scrollIntoView();
      }
    }, []);
    React.useEffect(() => {
      document.documentElement.dataset.solTheme = model.theme;
      document.documentElement.dataset.solWidth = model.width;
    }, [model.theme, model.width]);
    function preference(key, value) {
      setModel((m) => ({ ...m, [key]: value }));
      chrome.storage.local.set({ [key]: value });
    }
    return (
      <>
        <header className="sol-toolbar">
          <a className="sol-brand" href="#">
            Sol <span>Markdown</span>
          </a>
          <nav aria-label="Reader controls">
            <Button
              aria-pressed={model.mode === "source"}
              onClick={() =>
                setModel((m) => ({
                  ...m,
                  mode: m.mode === "rendered" ? "source" : "rendered",
                }))
              }
            >
              {model.mode === "rendered" ? "View source" : "Read document"}
            </Button>
            <Button
              aria-pressed={model.width === "wide"}
              onClick={() =>
                preference(
                  "width",
                  model.width === "reading" ? "wide" : "reading",
                )
              }
            >
              {model.width === "reading" ? "Widen" : "Reading width"}
            </Button>
            <ThemeMenu
              value={model.theme}
              onValueChange={(value) => preference("theme", value)}
            />
            <Button onClick={() => window.print()}>Print</Button>
          </nav>
        </header>
        <div className="sol-layout">
          {model.mode === "rendered" && headings.length > 1 && (
            <aside className="sol-outline">
              <p>ON THIS PAGE</p>
              <nav aria-label="Document outline">
                {headings.map((h) => (
                  <a
                    style={{ paddingLeft: (h.level - 1) * 10 }}
                    key={h.id}
                    href={`#${h.id}`}
                  >
                    {h.text}
                  </a>
                ))}
              </nav>
            </aside>
          )}
          <main>
            {model.mode === "source" ? (
              <pre className="sol-source">{model.source}</pre>
            ) : (
              <article
                className="sol-prose"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            )}
            <footer>
              LOCAL FILE <span>·</span>{" "}
              {decode(location.pathname.split("/").pop())}
            </footer>
          </main>
        </div>
      </>
    );
  }
  createRoot(mount).render(<App />);
}
