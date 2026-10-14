import defaultIcon from "../assets/icon-32.png";

export function setDocumentIcon(parsedMarkdown) {
  if (
    [...document.head.querySelectorAll('link[rel~="icon"][href]')].some(
      (link) => link.getAttribute("href").trim(),
    )
  )
    return;

  // Template contents are inert: inspecting HTML must never load its resources.
  const template = document.createElement("template");
  template.innerHTML = parsedMarkdown;
  let href = defaultIcon;
  for (const link of template.content.querySelectorAll(
    'link[rel~="icon"][href]',
  )) {
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
  const icon = document.createElement("link");
  icon.rel = "icon";
  icon.href = href;
  document.head.append(icon);
}
