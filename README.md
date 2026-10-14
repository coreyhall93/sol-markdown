# Sol Markdown

<img src="assets/icon-128.png" width="64" height="64" alt="Sol Markdown icon">

A local Markdown reader for Helium and other Chromium browsers. Open a `.md` or `.markdown` file and see headings, tables, lists, images, and links as a clean document.

## Install in Helium

If you cloned or downloaded this repository, first follow **Build from source** below to generate the `extension` folder. Packaged downloads already include it.

1. Keep this folder somewhere permanent.
2. Open `chrome://extensions` in Helium.
3. Enable **Developer mode**.
4. Choose **Load unpacked** and select this folder's **extension** subfolder.
5. Open Sol Markdown's **Details** and enable **Allow access to file URLs**.
6. Open or reload a local Markdown file.

Disable other Markdown viewer extensions if both try to render the same file. Your existing HTML index stays unchanged. Its local Markdown links open in the reader.

## Reader controls

- **View source** switches between the original Markdown and the formatted document.
- **Widen** gives tables and long documents more space.
- **System theme**, **Light**, and **Dark** set the appearance.
- **Print** uses the browser print dialog with the toolbar and outline removed.
- The outline jumps to headings. Relative links resolve from the original Markdown file's location.

Theme and width are saved locally in the browser. Source view is temporary. Refresh the file after editing it to see changes.

## Privacy and behavior

There is no background worker, analytics, account, CDN, or remote Markdown service. The content script matches local files only and exits unless the path ends in `.md` or `.markdown` and the browser presents it as a plain text document. Chromium requires broad local file matching; the script immediately leaves other file types alone.

Formatting runs inside the browser using bundled Marked and DOMPurify. Scripts, event handlers, embedded frames, forms, and unsafe link protocols are removed. Remote images become links so reading a document does not automatically contact their servers. Local file images can display. Clicking an external link or image link navigates normally.

This version handles Markdown and ordinary sanitized HTML. It does not execute diagrams, syntax highlighters, or math scripts. Checkboxes are read-only.

## Build from source

Requires Node.js 20 or newer and npm.

```sh
npm ci
npm run build
```

Load the generated `extension` directory. After rebuilding, use the reload button for Sol Markdown at `chrome://extensions`, then reload the Markdown tab.

The document model contains `source`, `mode` (`rendered` or `source`), `theme` (`system`, `light`, or `dark`), and `width` (`reading` or `wide`). `src/content.jsx` owns rendering and state. `src/button.jsx` adapts the shadcn/ui React Button structure. `src/reader.css` supplies local reader styles without a CSS runtime. `build.mjs` creates the Manifest V3 package with esbuild.

## Report an issue

[Open an issue](https://github.com/coreyhall93/sol-markdown/issues/new) with the browser version, expected behavior, and what happened. Use a small Markdown example with private information removed.

## Credits and licenses

Inspired by [simov/markdown-viewer](https://github.com/simov/markdown-viewer), especially its local-file content-script approach. This is a new implementation, not a fork of that extension. No simov implementation code is copied. Its MIT license is retained in `licenses/markdown-viewer-LICENSE` for reference.

The React Button in `src/button.jsx` is adapted from [shadcn/ui](https://github.com/shadcn-ui/ui), under the MIT license in `licenses/shadcn-ui-LICENSE.md`. Its class-variance-authority variants, Radix Slot composition, and class-merging pattern are retained with local CSS classes.

Bundled dependency license files are in `licenses/dependencies`. `package-lock.json` records exact versions. `THIRD-PARTY-NOTICES.md` lists the runtime packages.
