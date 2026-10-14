import { build } from "esbuild";
import { mkdir, copyFile, writeFile, cp } from "node:fs/promises";
await mkdir("extension", { recursive: true });
await build({
  entryPoints: ["src/content.jsx"],
  bundle: true,
  minify: true,
  outfile: "extension/content.js",
  define: { "process.env.NODE_ENV": '"production"' },
  target: "chrome120",
  loader: { ".png": "dataurl" },
});
await copyFile("src/reader.css", "extension/reader.css");
await writeFile(
  "extension/manifest.json",
  JSON.stringify(
    {
      manifest_version: 3,
      name: "Sol Markdown",
      version: "1.0.4",
      icons: Object.fromEntries(
        [16, 32, 48, 128].map((size) => [size, `icons/icon-${size}.png`]),
      ),
      action: {
        default_title: "Sol Markdown",
        default_icon: Object.fromEntries(
          [16, 32].map((size) => [size, `icons/icon-${size}.png`]),
        ),
      },
      description:
        "A quiet reader for local Markdown files. No accounts or network requests.",
      permissions: ["storage"],
      content_scripts: [
        {
          matches: ["file:///*"],
          js: ["content.js"],
          css: ["reader.css"],
          run_at: "document_idle",
        },
      ],
    },
    null,
    2,
  ),
);

await cp("assets", "extension/icons", { recursive: true });
await cp("licenses", "extension/licenses", { recursive: true });
await copyFile("THIRD-PARTY-NOTICES.md", "extension/THIRD-PARTY-NOTICES.md");
await copyFile("LICENSE", "extension/LICENSE");
