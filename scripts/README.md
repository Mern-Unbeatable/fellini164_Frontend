# visual-diff

Pixel-diffs a running page in this app against a reference PNG exported from Figma, so layout
mismatches get caught automatically instead of by eyeballing screenshots back and forth.

## Workflow

1. Get a reference PNG from the Figma frame (via the Figma MCP's `get_screenshot` tool, or by
   exporting a PNG from Figma directly). Save it locally, e.g. `figma-ref.png`.
2. Start the dev server: `npm run dev`
3. Run the diff:

   ```
   node scripts/visual-diff.mjs --url http://localhost:5173/user/habits --figma figma-ref.png
   ```

   Optional flags:
   - `--selector ".some-css-selector"` — screenshot just one element instead of the full viewport
     (use this to compare a single card/board panel rather than the whole page).
   - `--dark` — render the page in dark color scheme.
   - `--out <dir>` — where to write `local.png` and `diff.png` (default: `visual-diff-out/`).
   - `--threshold <percent>` — max allowed mismatch percentage before the script exits non-zero
     (default: `0.1`).
   - `--localStorage "key=value,key2=value2"` — seed localStorage before first navigation.
     **Required for any `/user/...` route** — those are behind `ProtectedRoute`, which checks
     `isAuthenticated` from `auth_token` in localStorage; without this the page just redirects to
     `/login` and you silently diff the login screen instead. Example:
     `--localStorage 'auth_token="dev-fake-token",auth_user={"role":"USER","firstName":"Dev"}'`
   - `--click "Button Text"` — click an element by text after load (e.g. to switch a view tab)
     before taking the screenshot.

4. Check the console output for the mismatch percentage, and open `diff.png` — mismatched pixels
   are highlighted in red.

The reference PNG's dimensions drive the browser viewport size, so the comparison is pixel-for-
pixel at the same resolution as the Figma export.
