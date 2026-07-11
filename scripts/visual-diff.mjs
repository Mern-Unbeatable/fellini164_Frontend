#!/usr/bin/env node
// Pixel-diffs a live local page (via Playwright) against a reference PNG exported from Figma
// (via the Figma MCP's get_screenshot tool). Usage documented in scripts/README.md.

import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import fs from 'node:fs';
import path from 'node:path';

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] : fallback;
}

async function main() {
  const url = arg('url');
  const figmaPath = arg('figma');
  const selector = arg('selector');
  const outDir = arg('out', 'visual-diff-out');
  const threshold = Number(arg('threshold', '0.1'));
  const darkMode = process.argv.includes('--dark');

  if (!url || !figmaPath) {
    console.error(
      'Usage: node scripts/visual-diff.mjs --url <local-url> --figma <path-to-figma-png> ' +
        '[--selector <css-selector>] [--out <dir>] [--threshold <percent>] [--dark]'
    );
    process.exit(1);
  }

  fs.mkdirSync(outDir, { recursive: true });

  const figmaPng = PNG.sync.read(fs.readFileSync(figmaPath));
  const { width, height } = figmaPng;

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width, height },
    colorScheme: darkMode ? 'dark' : 'light',
  });
  await page.goto(url, { waitUntil: 'networkidle' });

  const localPath = path.join(outDir, 'local.png');
  if (selector) {
    await page.locator(selector).screenshot({ path: localPath });
  } else {
    await page.screenshot({ path: localPath });
  }
  await browser.close();

  const localPng = PNG.sync.read(fs.readFileSync(localPath));

  if (localPng.width !== width || localPng.height !== height) {
    console.warn(
      `Size mismatch — figma: ${width}x${height}, local: ${localPng.width}x${localPng.height}. ` +
        'Diffing the overlapping top-left region only; crop/resize inputs to match for an exact compare.'
    );
  }

  const w = Math.min(width, localPng.width);
  const h = Math.min(height, localPng.height);

  const crop = (png) => {
    const cropped = new PNG({ width: w, height: h });
    PNG.bitblt(png, cropped, 0, 0, w, h, 0, 0);
    return cropped;
  };

  const a = crop(figmaPng);
  const b = crop(localPng);
  const diff = new PNG({ width: w, height: h });

  const mismatched = pixelmatch(a.data, b.data, diff.data, w, h, { threshold: 0.1 });
  const diffPath = path.join(outDir, 'diff.png');
  fs.writeFileSync(diffPath, PNG.sync.write(diff));

  const mismatchPct = (mismatched / (w * h)) * 100;

  console.log(`Compared ${w}x${h}px — mismatched pixels: ${mismatched} (${mismatchPct.toFixed(2)}%)`);
  console.log(`Local screenshot: ${localPath}`);
  console.log(`Diff image:       ${diffPath}`);

  if (mismatchPct > threshold) {
    console.error(`FAIL — mismatch ${mismatchPct.toFixed(2)}% exceeds threshold ${threshold}%`);
    process.exit(1);
  }
  console.log(`PASS — within threshold (${threshold}%)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
