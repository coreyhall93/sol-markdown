import defaultIcon from "../assets/icon-32.png";

export function setDocumentIcon(parsedMarkdown) {
  const selector = 'link[rel~="icon"][href]';
  const extensionIcon = (link) => /^(chrome|moz)-extension:/.test(link.href);
  const existing = [...document.head.querySelectorAll(selector)].find(
    (link) => link.getAttribute("href").trim() && !extensionIcon(link),
  );
  let href = existing?.href || defaultIcon;

  // Template contents are inert: inspecting HTML must never load its resources.
  const template = document.createElement("template");
  template.innerHTML = parsedMarkdown;
  for (const link of template.content.querySelectorAll(selector)) {
    const raw = link.getAttribute("href").trim();
    if (!raw || raw.startsWith("#")) continue;
    try {
      const url = new URL(raw, location.href);
      if (
        (url.protocol === "file:" && !url.hostname) ||
        (url.protocol === "data:" && /^data:image\//i.test(raw))
      ) {
        href = url.href;
        break;
      }
    } catch {}
  }
  const icon = existing || document.createElement("link");
  icon.rel = "icon";
  icon.href = href;
  const restore = () => {
    for (const link of document.head.querySelectorAll(selector)) {
      if (link !== icon && extensionIcon(link)) link.remove();
    }
    if (icon.rel !== "icon") icon.rel = "icon";
    if (icon.getAttribute("href") !== href) icon.href = href;
    if (icon.parentNode !== document.head) document.head.append(icon);
  };
  restore();
  new MutationObserver(restore).observe(document.head, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["href", "rel"],
  });
}
