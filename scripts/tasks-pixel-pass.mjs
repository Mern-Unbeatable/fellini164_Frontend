#!/usr/bin/env node
// Pixel-pass runner for Tasks Board — compares local Playwright screenshots vs Figma MCP exports.

import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'visual-diff-out', 'tasks-pixel-pass');
const FIGMA = path.join(OUT, 'figma');
const LOCAL = path.join(OUT, 'local');
const DIFF = path.join(OUT, 'diff');
const THRESHOLD = Number(process.env.PIXEL_THRESHOLD || '1.5');

const AUTH =
  'auth_token="pixel-pass",auth_user={"role":"USER","firstName":"R","lastName":"A"}';

const PIXEL_QUERY = 'pixelPass=1';

const SCENARIOS = [
  {
    id: '01-empty-board',
    path: '/user/tasks?empty=1',
    figma: '01-empty-board.png',
    setup: async () => {},
  },
  {
    id: '02-ghost-hover',
    path: '/user/tasks?empty=1',
    figma: '02-ghost-hover.png',
    setup: async (page) => {
      const card = page.getByText('Exercise Routine', { exact: true }).first();
      await card.hover();
      await page.waitForTimeout(300);
    },
  },
  {
    id: '03-populated-board',
    path: '/user/tasks',
    figma: '03-populated-board.png',
    setup: async () => {},
  },
];

function parseLocalStorage(arg) {
  return arg.split(/,(?=[^,]+=)/).map((pair) => {
    const eq = pair.indexOf('=');
    return [pair.slice(0, eq), pair.slice(eq + 1)];
  });
}

function compare(figmaPath, localPath, diffPath) {
  const figmaPng = PNG.sync.read(fs.readFileSync(figmaPath));
  const localPng = PNG.sync.read(fs.readFileSync(localPath));
  const { width, height } = figmaPng;

  if (localPng.width !== width || localPng.height !== height) {
    console.warn(`  size mismatch figma ${width}x${height} vs local ${localPng.width}x${localPng.height}`);
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
  fs.writeFileSync(diffPath, PNG.sync.write(diff));
  const pct = (mismatched / (w * h)) * 100;
  return { mismatched, pct, w, h };
}

function installStableEnvironment(page) {
  return page.addInitScript(() => {
    const fixed = new Date('2026-05-13T12:00:00');
    const RealDate = Date;
    class MockDate extends RealDate {
      constructor(...args) {
        if (args.length === 0) super(fixed.getTime());
        else super(...args);
      }
      static now() {
        return fixed.getTime();
      }
    }
    MockDate.parse = RealDate.parse;
    MockDate.UTC = RealDate.UTC;
    window.Date = MockDate;
  });
}

async function main() {
  for (const dir of [LOCAL, DIFF]) fs.mkdirSync(dir, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    executablePath:
      process.env.PLAYWRIGHT_CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  });

  const results = [];

  for (const scenario of SCENARIOS) {
    const figmaPath = path.join(FIGMA, scenario.figma);
    const localPath = path.join(LOCAL, `${scenario.id}.png`);
    const diffPath = path.join(DIFF, `${scenario.id}.png`);

    const figmaPng = PNG.sync.read(fs.readFileSync(figmaPath));
    const page = await browser.newPage({
      viewport: { width: figmaPng.width, height: figmaPng.height },
      colorScheme: 'light',
    });

    await installStableEnvironment(page);
    await page.addInitScript((entries) => {
      for (const [k, v] of entries) localStorage.setItem(k, v);
    }, parseLocalStorage(AUTH));

    const url = `http://localhost:5173${scenario.path}${scenario.path.includes('?') ? '&' : '?'}${PIXEL_QUERY}`;
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    await scenario.setup(page);
    await page.screenshot({ path: localPath });

    const { mismatched, pct, w, h } = compare(figmaPath, localPath, diffPath);
    const pass = pct <= THRESHOLD;
    results.push({ ...scenario, mismatched, pct, w, h, pass });
    console.log(`${pass ? 'PASS' : 'FAIL'} ${scenario.id}: ${pct.toFixed(2)}% (${mismatched}/${w * h}px)`);
    await page.close();
  }

  await browser.close();

  const summaryPath = path.join(OUT, 'summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify({ threshold: THRESHOLD, results }, null, 2));
  console.log(`\nSummary: ${summaryPath}`);

  const failed = results.filter((r) => !r.pass);
  if (failed.length) {
    console.error(`\n${failed.length} scenario(s) exceed ${THRESHOLD}% threshold`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
