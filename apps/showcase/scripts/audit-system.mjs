import { chromium } from '@playwright/test';
import axe from 'axe-core';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const phase = process.argv[2] || 'before';
const output = fileURLToPath(new URL(`../test-results/system-${phase}/`, import.meta.url));
await mkdir(output, { recursive: true });
const report = { phase, scans: [], errors: [], captures: [] };
const browser = await chromium.launch();
const catalog = JSON.parse(await readFile(new URL('../../../sis-foundations-prototype/src/data/catalog.json', import.meta.url), 'utf8'));
const modes = [];
for (const theme of ['light', 'dark']) for (const dir of ['ltr', 'rtl']) for (const density of ['comfortable', 'compact']) modes.push({ theme, dir, density });
async function scan(page, name, url, width, capture = false) {
  await page.setViewportSize({ width, height: 1000 });
  await page.goto(url);
  await page.locator('#root').waitFor();
  await page.evaluate(async () => { await document.fonts.ready; });
  await page.addScriptTag({ content: axe.source });
  const result = await page.evaluate(async () => {
    const accessibility = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21aa','wcag22aa','best-practice'] } });
    const root = document.documentElement;
    const visible = (node) => !!(node.getBoundingClientRect().width && node.getBoundingClientRect().height) && getComputedStyle(node).visibility !== 'hidden';
    const targets = [...document.querySelectorAll('button, a[href], summary, input, select, textarea, [role="tab"]')].filter(node => !node.disabled && visible(node)).map(node => {
      const target = node.matches('.sis-choice-input') ? node.closest('label') : node;
      const rect = target.getBoundingClientRect();
      return { label: node.getAttribute('aria-label') || node.textContent?.trim().slice(0,70) || node.getAttribute('placeholder') || node.tagName, width: +rect.width.toFixed(1), height: +rect.height.toFixed(1), class: node.className };
    }).filter(target=>target.width < 43.5 || target.height < 43.5);
    return { width: innerWidth, scrollWidth: root.scrollWidth, tokens: getComputedStyle(root).getPropertyValue('--sys-color-text-primary').trim(), font: getComputedStyle(document.body).fontFamily, violations: accessibility.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})), smallTargets: targets };
  });
  report.scans.push({ name, url, ...result });
  if (capture) { const path = `${output}${name.replaceAll(/[^a-z0-9-]/gi,'-')}.png`; await page.screenshot({path,fullPage:true}); report.captures.push({name,path}); }
}
const context = await browser.newContext({ reducedMotion: 'reduce' });
const page = await context.newPage();
page.on('pageerror', error => report.errors.push({url:page.url(),message:error.message}));
for (const mode of modes) {
  const query = new URLSearchParams(mode);
  for (const route of ['overview','students','courses','assistant','settings','gallery']) await scan(page, `app-${route}-${mode.theme}-${mode.dir}-${mode.density}`, `http://localhost:4680/?${query}#${route}`, 1440, mode.dir==='ltr' && mode.density==='comfortable');
  await scan(page, `library-${mode.theme}-${mode.dir}-${mode.density}`, `http://localhost:4677/?${query}`, 430, true);
}
for (const width of [320,390,834]) for (const route of ['overview','students','courses','assistant','settings','gallery']) await scan(page, `app-${route}-${width}`, `http://localhost:4680/?theme=light#${route}`, width, width===390);
for (const entry of catalog) {
  if (entry.group === 'Review') continue;
  for (const [theme,lang,width] of [['light','en',1440],['dark','ar',320]]) await scan(page, `workbench-${entry.id}-${theme}`, `http://localhost:4173/?embed=1&item=${entry.id}&theme=${theme}&lang=${lang}&density=compact`, width);
}
await browser.close();
await writeFile(`${output}report.json`, JSON.stringify(report,null,2));
const summary = {phase,scans:report.scans.length,errors:report.errors, violations:report.scans.filter(s=>s.violations.length).map(s=>({name:s.name,violations:s.violations.map(v=>({id:v.id,count:v.nodes.length}))})),overflow:report.scans.filter(s=>s.scrollWidth>s.width).map(s=>({name:s.name,width:s.width,scrollWidth:s.scrollWidth})),missingTokens:report.scans.filter(s=>!s.tokens).map(s=>s.name),report:`${output}report.json`};
console.log(JSON.stringify(summary,null,2));
