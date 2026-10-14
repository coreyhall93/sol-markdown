# Verification

Verified on October 14, 2026 in the installed Helium executable, using an isolated browser profile with the unpacked Manifest V3 extension. The normal Helium profile was not modified.

26 browser checks passed.

- Markdown formatting.
- GFM tables.
- GFM checked checkbox.
- Checkbox remains read only.
- Absolute local links preserved.
- Unsafe protocol removed.
- Executable HTML removed.
- No script executed.
- Remote images not embedded.
- Remote table backgrounds removed.
- Reading untrusted Markdown makes no HTTP requests.
- Remote image becomes a link.
- Duplicate heading anchors unique.
- Source toggle shows original Markdown.
- Dark theme applies.
- Theme and width persist across reload.
- Relative Markdown navigation.
- Destination rendered automatically.
- Mobile page fits viewport.
- Reference document tables rendered.
- Real links table fits mobile viewport.
- Print hides reader controls.
- Print uses dark text even in dark theme.
- HTML files left unchanged.
- Original index unchanged.
- Original index links open formatted documents.

A local HTML index and its linked Markdown reference document were tested directly. Sanitization tests used a separate fixture. Deliberately invalid local image paths in that fixture emitted expected file-not-found console errors. No HTTP requests were observed while reading the fixture.

An independent source review identified a legacy table-background image attribute that could trigger requests. The attribute is now removed and the browser check passes.

`npm audit --omit=dev` reported zero vulnerabilities at build time. This is a point-in-time check.

The runtime JavaScript bundle is 297984 bytes. No background worker is declared.

pstack informed the work through Model the Domain (one document and preference model) and Prove It Works (the real extension loaded in Helium). shadcn/ui supplies the adapted React Button. The architecture follows Markdown Viewer’s in-place local-document approach. Attribution is in README.md and the bundled license notices.

## Version 1.0.2 theme menu

Verified in isolated Helium on October 14, 2026. The original 26 browser checks passed again. Thirteen additional checks passed for accessible radio items, exactly one selected choice, closing after selection, focus return, persistence, dark menu colors, keyboard Home/arrow/Enter selection, Escape dismissal and focus return, outside-click dismissal, 390px viewport placement, hiding the menu during print, and following system appearance.

The theme menu uses the shadcn/ui Dropdown Menu radio-item composition because these controls select a preference rather than navigate to pages. The native select was replaced with a button and themed popup.
