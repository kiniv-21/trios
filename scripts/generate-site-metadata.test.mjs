import assert from 'node:assert/strict';
import test from 'node:test';
import { fetchSiteMetadata, injectMetadata, renderMetadata } from './generate-site-metadata.mjs';

test('escapes metadata text for HTML text and attribute contexts', () => {
  const html = renderMetadata({
    title: `T "'&<>`,
    description: `D "'&<>`,
  });

  assert.match(html, /<title>T &quot;&#39;&amp;&lt;&gt;<\/title>/);
  assert.match(html, /name="description" content="D &quot;&#39;&amp;&lt;&gt;"/);
  assert.match(html, /property="og:description" content="D &quot;&#39;&amp;&lt;&gt;"/);
});

test('uses non-empty fallback metadata and includes crawler tags once', () => {
  const html = renderMetadata({ title: '  ', description: null });

  assert.match(html, /<title>Trios Art \| Hand-Painted Jute Bags<\/title>/);
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
  assert.equal((html.match(/property="og:title"/g) || []).length, 1);
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
});

test('uses a preview URL for canonical and Open Graph metadata when configured', () => {
  const html = renderMetadata({
    title: 'Preview title',
    description: 'Preview description',
    canonicalUrl: 'https://triosart.in/preview/',
  });

  assert.match(html, /rel="canonical" href="https:\/\/triosart\.in\/preview\/"/);
  assert.match(html, /property="og:url" content="https:\/\/triosart\.in\/preview\/"/);
});

test('replaces only the marked metadata block', () => {
  const template = '<head><!-- SITE_METADATA_START -->old<!-- SITE_METADATA_END --></head><body>unchanged</body>';
  const html = injectMetadata(template, { title: 'Current', description: 'Current description' });

  assert.match(html, /<title>Current<\/title>/);
  assert.match(html, /content="Current description"/);
  assert.match(html, /<body>unchanged<\/body>/);
  assert.equal((html.match(/property="og:title"/g) || []).length, 1);
});

test('reads only the public title and description rows using the anon key', async () => {
  const originalFetch = globalThis.fetch;
  let requestUrl;
  let requestHeaders;
  globalThis.fetch = async (url, options) => {
    requestUrl = new URL(url);
    requestHeaders = options.headers;
    return new Response(JSON.stringify([
      { key: 'site_tab_title', value: 'Current title' },
      { key: 'site_meta_description', value: 'Current description' },
    ]), { status: 200 });
  };

  try {
    const metadata = await fetchSiteMetadata('https://example.supabase.co', 'public-anon-key');

    assert.deepEqual(metadata, { title: 'Current title', description: 'Current description' });
    assert.equal(requestUrl.pathname, '/rest/v1/site_content');
    assert.equal(requestUrl.searchParams.get('select'), 'key,value');
    assert.equal(requestUrl.searchParams.get('key'), 'in.(site_tab_title,site_meta_description)');
    assert.equal(requestHeaders.apikey, 'public-anon-key');
    assert.equal(requestHeaders.Authorization, 'Bearer public-anon-key');
  } finally {
    globalThis.fetch = originalFetch;
  }
});