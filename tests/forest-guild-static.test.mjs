import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const entry = '03_心得作業小禮包.html';
const base = 'https://yoyo700702ai.github.io/ai-accounting-course/';
const gift = fs.readFileSync(path.join(root, entry), 'utf8');
const forest = fs.readFileSync(path.join(root, 'forest-guild.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'assets/forest-guild/site.css'), 'utf8');

function references(html) {
  return [
    ...Array.from(html.matchAll(/\b(?:href|src|poster)\s*=\s*["']([^"']+)["']/g), m => m[1]),
    ...Array.from(html.matchAll(/\bsrc:\s*["']([^"']+)["']/g), m => m[1]),
    ...Array.from(html.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/g), m => m[1]),
  ];
}

test('latest five tabs retain existing game anchors and three tools', () => {
  assert.equal((gift.match(/class="tab-pane(?: active)?" id="tab\d"/g) || []).length, 5);
  for (const id of ['hongmen', 'taohuaStage', 'hongmenStage', 'zhuzhiwuStage', 'codex-forest-guild']) {
    assert(gift.includes(`id="${id}"`), id);
  }
  assert.equal((gift.match(/<article class="tool-card"/g) || []).length, 3);
  assert.match(gift, /href="forest-guild\.html"/);
  assert.match(gift, /\.tool-cover\.forest-guild-cover img\s*\{[^}]*height:\s*auto/);
  assert.match(gift, /activateGiftHashTarget\(\)/);
  assert.match(gift, /location\.hash/);
  assert.match(gift, /searchParams|get\('tab'\)/);
});

test('page links, media and dynamic game previews resolve under the project subpath', () => {
  for (const [filename, html] of [[entry, gift], ['forest-guild.html', forest], ['assets/forest-guild/site.css', css]]) {
    for (const reference of references(html)) {
      if (/^(?:data:|mailto:|tel:|javascript:|#)/i.test(reference)) continue;
      assert(!reference.startsWith('/'), `${filename}: root-relative URL ${reference}`);
      const url = new URL(reference.replaceAll('&amp;', '&'), new URL(filename, base));
      assert(!/^(?:localhost|127\.0\.0\.1)$/.test(url.hostname));
      if (!url.href.startsWith(base)) continue;
      const relative = decodeURIComponent(url.pathname.slice(new URL(base).pathname.length));
      assert(fs.existsSync(path.join(root, relative)), `${filename}: missing ${relative}`);
    }
  }
});

test('inline scripts have valid syntax', () => {
  for (const [filename, html] of [[entry, gift], ['forest-guild.html', forest]]) {
    for (const match of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)) {
      new vm.Script(match[1], { filename });
    }
  }
});

test('shared hongmen link and direct toolbox link select the correct tab', () => {
  for (const [search, hash, expectedTab] of [['', '#hongmen', 'tab3'], ['?tab=tab5', '#codex-forest-guild', 'tab5']]) {
    const paneIds = Array.from(gift.matchAll(/class="tab-pane(?: active)?" id="(tab\d)"/g), m => m[1]);
    const makeNode = (id, pane) => {
      const classes = new Set(pane ? ['tab-pane'] : []);
      return { id, dataset: { tab: id }, addEventListener() {}, classList: {
        contains: name => classes.has(name),
        toggle: (name, state) => state ? classes.add(name) : classes.delete(name),
      } };
    };
    const panes = paneIds.map(id => makeNode(id, true));
    const buttons = paneIds.map(id => makeNode(id, false));
    const id = hash.slice(1);
    const parentId = Array.from(gift.slice(0, gift.indexOf(`id="${id}"`)).matchAll(/class="tab-pane(?: active)?" id="(tab\d)"/g)).at(-1)[1];
    let scrolled = false;
    const target = { closest: () => panes.find(pane => pane.id === parentId), scrollIntoView: () => { scrolled = true; } };
    const document = {
      getElementById: key => key === id ? target : panes.find(pane => pane.id === key),
      querySelectorAll: selector => selector === '.tab-pane' ? panes : selector === '.tab-btn' ? buttons : [],
    };
    const context = vm.createContext({ document, URLSearchParams, location: { search, hash },
      window: { scrollTo() {}, addEventListener() {} }, requestAnimationFrame: callback => callback() });
    for (const match of gift.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)) vm.runInContext(match[1], context);
    assert.equal(panes.find(pane => pane.classList.contains('active')).id, expectedTab);
    assert.equal(buttons.find(button => button.classList.contains('active')).id, expectedTab);
    assert(scrolled, hash);
  }
});

test('guide exposes only current preview.7 learner downloads', () => {
  const links = references(forest).filter(reference => reference.includes('/downloads/forest-guild/'));
  assert.equal(links.length, 3);
  for (const link of links) {
    assert(link.startsWith('https://yoyo-ai-gift-pack.hankvictor1023.chatgpt.site/downloads/forest-guild/'));
    assert(link.includes('0.5.11-preview.7'));
  }
  assert(links.some(link => link.endsWith('.exe')));
  assert(links.some(link => link.endsWith('.zip')));
  assert(links.some(link => link.endsWith('.txt')));
  assert(!forest.includes('下載準備中'));
  assert(forest.includes(`href="${entry}?tab=tab5"`));
});

test('learner instructions retain avatar, platform, update, unlock and minimize details', () => {
  assert.equal((forest.match(/<details>/g) || []).length, 9);
  assert.match(forest, /Microsoft Store／MSIX/);
  assert.match(forest, /不必另外安裝 CLI、設定路徑或修改 WindowsApps 權限/);
  assert.match(forest, /下載約 194 MB/);
  assert.match(forest, /本機測試約 245 MB/);
  for (const text of ['恢復預設頭像', 'PNG、JPG 或 BMP', 'Windows 11', 'lucide-circle-alert', '500 萬 TOKEN', '每天最多一位', '第一次啟用', '不要刪除存檔或先卸載', '縮小到 Windows 下方工作列', '試用版尚未完成程式簽章']) {
    assert(forest.includes(text), text);
  }
  assert(forest.indexOf('class="before-install platform-notice"') > forest.indexOf('<section class="hero"'));
});

test('social preview points to this GitHub entry and bundled image', () => {
  assert(gift.includes(`property="og:url" content="${base}${encodeURIComponent(entry)}"`));
  assert(gift.includes(`${base}assets/course-art/gift-pack-og.png`));
  assert(fs.existsSync(path.join(root, 'assets/course-art/gift-pack-og.png')));
});
