#!/usr/bin/env node
/**
 * Task 10: SEO Production Validation Script
 * Usage: node scripts/validate-seo.mjs [BASE_URL]
 * Example: node scripts/validate-seo.mjs https://zonasurtech.online
 *
 * Checks:
 * - Canonical tag presence
 * - robots.txt correctness
 * - sitemap.xml reachability + URL count
 * - Redirect chains (www, http)
 * - Status codes for critical routes
 * - X-Robots-Tag on static assets
 * - HSTS header presence
 */

const BASE_URL = process.argv[2] || 'https://zonasurtech.online';

// ─── ANSI Colors ─────────────────────────────────────────────
const OK   = '\x1b[32m✓\x1b[0m';
const FAIL = '\x1b[31m✗\x1b[0m';
const WARN = '\x1b[33m⚠\x1b[0m';
const INFO = '\x1b[36mℹ\x1b[0m';

let passed = 0;
let failed = 0;

function pass(label, detail = '') {
  console.log(`  ${OK} ${label}${detail ? ` \x1b[2m(${detail})\x1b[0m` : ''}`);
  passed++;
}

function fail(label, detail = '') {
  console.log(`  ${FAIL} ${label}${detail ? ` \x1b[31m(${detail})\x1b[0m` : ''}`);
  failed++;
}

function warn(label, detail = '') {
  console.log(`  ${WARN} ${label}${detail ? ` \x1b[33m(${detail})\x1b[0m` : ''}`);
}

function section(title) {
  console.log(`\n\x1b[1m── ${title} ──\x1b[0m`);
}

/**
 * Fetch with redirect tracking (follows up to 10 hops)
 */
async function fetchWithRedirects(url, options = {}) {
  let current = url;
  const chain = [url];
  let response;

  for (let i = 0; i < 10; i++) {
    response = await fetch(current, {
      redirect: 'manual',
      ...options,
      headers: { 'User-Agent': 'ZST-SEO-Validator/1.0', ...(options.headers || {}) },
    });

    const loc = response.headers.get('location');
    if ((response.status >= 300 && response.status < 400) && loc) {
      current = loc.startsWith('http') ? loc : new URL(loc, current).href;
      chain.push(current);
    } else {
      break;
    }
  }

  return { response, finalUrl: current, chain };
}

// ─── TEST RUNNER ─────────────────────────────────────────────

async function checkRedirects() {
  section('Redirect Canonicalization');

  // http → https
  const http = `http://${new URL(BASE_URL).hostname}`;
  const { response: r1, chain: c1 } = await fetchWithRedirects(http);
  if (r1.url?.startsWith('https://') || c1.at(-1)?.startsWith('https://')) {
    pass('http → https redirect', `${r1.status} → ${c1.at(-1)}`);
  } else {
    fail('http → https redirect MISSING', c1.join(' → '));
  }

  // www → non-www
  const www = `https://www.${new URL(BASE_URL).hostname}`;
  const { response: r2, chain: c2 } = await fetchWithRedirects(www);
  const finalUrl = c2.at(-1) || '';
  if (!finalUrl.includes('www.')) {
    pass('www → non-www redirect', `${c2[0]} → ${finalUrl}`);
  } else {
    fail('www → non-www redirect NOT working', `Final URL: ${finalUrl}`);
  }
}

async function checkStatusCodes() {
  section('Critical Route Status Codes');

  const routes = [
    { path: '/',          expectedStatus: 200, label: 'Homepage' },
    { path: '/pricing',   expectedStatus: 200, label: 'Pricing' },
    { path: '/features',  expectedStatus: 200, label: 'Features' },
    { path: '/use-cases', expectedStatus: 200, label: 'Use Cases' },
    { path: '/contact',   expectedStatus: 200, label: 'Contact' },
    { path: '/sitemap.xml', expectedStatus: 200, label: 'Sitemap XML' },
    { path: '/robots.txt',  expectedStatus: 200, label: 'Robots.txt' },
    // These MUST NOT be 200
    { path: '/auth/register.txt', expectedStatus: [404, 410], label: 'register.txt (must 404/410)' },
    { path: '/dashboard',  expectedStatus: [301, 302, 307, 308, 403, 404], label: 'Dashboard (no 200)' },
  ];

  for (const route of routes) {
    const url = `${BASE_URL}${route.path}`;
    try {
      const res = await fetch(url, { redirect: 'manual' });
      const expected = Array.isArray(route.expectedStatus)
        ? route.expectedStatus
        : [route.expectedStatus];

      if (expected.includes(res.status)) {
        pass(route.label, `${res.status}`);
      } else {
        fail(route.label, `Expected ${expected.join('/')} got ${res.status} — ${url}`);
      }
    } catch (e) {
      fail(route.label, `Fetch error: ${e.message}`);
    }
  }
}

async function checkCanonical() {
  section('Canonical Tags');

  const pages = [
    { path: '/',         expected: BASE_URL },
    { path: '/pricing',  expected: `${BASE_URL}/pricing` },
    { path: '/features', expected: `${BASE_URL}/features` },
  ];

  for (const page of pages) {
    try {
      const res = await fetch(`${BASE_URL}${page.path}`);
      const html = await res.text();

      const match = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)
                 || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);

      if (!match) {
        fail(`No canonical tag on ${page.path}`);
        continue;
      }

      const canonicalHref = match[1];
      if (canonicalHref === page.expected || canonicalHref === page.expected + '/') {
        pass(`Canonical correct on ${page.path}`, canonicalHref);
      } else {
        fail(`Wrong canonical on ${page.path}`, `Expected ${page.expected}, got ${canonicalHref}`);
      }
    } catch (e) {
      fail(`Cannot check canonical on ${page.path}`, e.message);
    }
  }
}

async function checkRobots() {
  section('Robots.txt Validation');

  try {
    const res = await fetch(`${BASE_URL}/robots.txt`);
    const text = await res.text();

    if (res.status === 200) {
      pass('robots.txt is reachable', `${res.status}`);
    } else {
      fail('robots.txt not reachable', `${res.status}`);
    }

    const checks = [
      { rule: 'Sitemap line present',         match: /Sitemap:/i },
      { rule: 'Disallow /_next/',             match: /Disallow:.*\/_next\//i },
      { rule: 'Disallow /api/',               match: /Disallow:.*\/api\//i },
      { rule: 'Disallow /auth/',              match: /Disallow:.*\/auth\//i },
      { rule: 'Disallow *.txt',               match: /Disallow:.*\\*\.txt|Disallow:.*\.txt/i },
    ];

    for (const check of checks) {
      if (check.match.test(text)) {
        pass(check.rule);
      } else {
        fail(check.rule, 'Rule missing from robots.txt');
      }
    }
  } catch (e) {
    fail('robots.txt fetch failed', e.message);
  }
}

async function checkSitemap() {
  section('Sitemap.xml');

  try {
    const res = await fetch(`${BASE_URL}/sitemap.xml`);
    const text = await res.text();

    if (res.status === 200) {
      pass('sitemap.xml reachable', `HTTP ${res.status}`);
    } else {
      fail('sitemap.xml not reachable', `HTTP ${res.status}`);
      return;
    }

    const urlMatches = text.match(/<url>/gi);
    const urlCount = urlMatches ? urlMatches.length : 0;

    if (urlCount >= 5) {
      pass(`Sitemap has ${urlCount} URLs`, 'minimum 5 required');
    } else {
      fail(`Sitemap has only ${urlCount} URLs`, 'minimum 5 required');
    }

    // Ensure no www or http URLs
    if (text.includes('www.')) {
      fail('Sitemap contains www. URLs', 'Canonical must be non-www');
    } else {
      pass('No www. URLs in sitemap');
    }

    if (text.includes('http://')) {
      fail('Sitemap contains http:// URLs', 'Must use https://');
    } else {
      pass('All sitemap URLs use https://');
    }
  } catch (e) {
    fail('sitemap.xml fetch failed', e.message);
  }
}

async function checkStaticAssetHeaders() {
  section('Static Asset Indexing Prevention');

  try {
    // Fetch the home page to find a real _next/static URL
    const homeRes = await fetch(BASE_URL);
    const homeHtml = await homeRes.text();

    const staticMatch = homeHtml.match(/\/_next\/static\/[^\s"']+\.js/);
    if (!staticMatch) {
      warn('Cannot find a /_next/static/ URL in the HTML — skipping header check');
      return;
    }

    const staticUrl = `${BASE_URL}${staticMatch[0]}`;
    const staticRes = await fetch(staticUrl);
    const xRobots = staticRes.headers.get('x-robots-tag') || '';

    if (xRobots.toLowerCase().includes('noindex')) {
      pass('X-Robots-Tag: noindex on /_next/static/', `Got: ${xRobots}`);
    } else {
      fail('X-Robots-Tag missing on static assets', `URL: ${staticUrl} | Got: "${xRobots}"`);
    }
  } catch (e) {
    warn('Static asset header check failed', e.message);
  }
}

async function checkHSTS() {
  section('Security Headers');

  try {
    const res = await fetch(BASE_URL);
    const hsts = res.headers.get('strict-transport-security') || '';

    if (hsts.includes('max-age')) {
      pass('HSTS header present', hsts);
    } else {
      fail('HSTS (Strict-Transport-Security) missing');
    }
  } catch (e) {
    fail('Cannot check HSTS', e.message);
  }
}

// ─── MAIN ─────────────────────────────────────────────────────
async function main() {
  console.log(`\n\x1b[1mZonaSur Tech — SEO Production Validator\x1b[0m`);
  console.log(`Target: \x1b[36m${BASE_URL}\x1b[0m`);
  console.log('─'.repeat(50));

  await checkRedirects();
  await checkStatusCodes();
  await checkCanonical();
  await checkRobots();
  await checkSitemap();
  await checkStaticAssetHeaders();
  await checkHSTS();

  console.log('\n' + '─'.repeat(50));
  console.log(`\x1b[1mResults: ${OK} ${passed} passed  ${FAIL} ${failed} failed\x1b[0m\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((e) => {
  console.error('Fatal error:', e);
  process.exit(1);
});
