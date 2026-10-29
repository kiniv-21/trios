import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';

const DEFAULT_TITLE = 'Trios Art | Hand-Painted Jute Bags';
const DEFAULT_DESCRIPTION = 'Trios Art offers unique hand-painted jute bags that combine artistic expression with sustainable fashion. Shop our collection of eco-friendly, stylish bags.';
const CANONICAL_URL = 'https://triosart.in/';
const PREVIEW_IMAGE = 'https://vrslzovxbefihxcjniyo.supabase.co/storage/v1/object/public/product-images/Beaded%20miniatures%20combo%20set/1785137707125-combo.jpeg';
const START_MARKER = '<!-- SITE_METADATA_START -->';
const END_MARKER = '<!-- SITE_METADATA_END -->';

export const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

export const renderMetadata = ({ title, description, canonicalUrl = CANONICAL_URL }) => {
  const safeTitle = escapeHtml(String(title || '').trim() || DEFAULT_TITLE);
  const safeDescription = escapeHtml(String(description || '').trim() || DEFAULT_DESCRIPTION);
  const safeCanonicalUrl = escapeHtml(String(canonicalUrl || '').trim() || CANONICAL_URL);
  const safeImage = escapeHtml(PREVIEW_IMAGE);

  return [
    `<title>${safeTitle}</title>`,
    `<meta name="description" content="${safeDescription}" />`,
    `<link rel="canonical" href="${safeCanonicalUrl}" />`,
    `<meta property="og:title" content="${safeTitle}" />`,
    `<meta property="og:description" content="${safeDescription}" />`,
    `<meta property="og:url" content="${safeCanonicalUrl}" />`,
    '<meta property="og:type" content="website" />',
    `<meta property="og:image" content="${safeImage}" />`,
    `<meta property="og:image:secure_url" content="${safeImage}" />`,
    '<meta property="og:image:type" content="image/jpeg" />',
    '<meta property="og:image:width" content="1169" />',
    '<meta property="og:image:height" content="860" />',
    '<meta property="og:image:alt" content="Handcrafted beaded miniatures from Trios Art" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${safeTitle}" />`,
    `<meta name="twitter:description" content="${safeDescription}" />`,
    `<meta name="twitter:image" content="${safeImage}" />`,
  ].join('\n    ');
};

export const injectMetadata = (html, metadata) => {
  const start = html.indexOf(START_MARKER);
  const end = html.indexOf(END_MARKER);
  if (start < 0 || end < start) {
    throw new Error('Metadata markers were not found in the built HTML.');
  }

  const block = `${START_MARKER}\n    ${renderMetadata(metadata)}\n    ${END_MARKER}`;
  return `${html.slice(0, start)}${block}${html.slice(end + END_MARKER.length)}`;
};

export const fetchSiteMetadata = async (supabaseUrl, anonKey) => {
  const endpoint = new URL('rest/v1/site_content', `${supabaseUrl.replace(/\/+$/, '')}/`);
  endpoint.searchParams.set('select', 'key,value');
  endpoint.searchParams.set('key', 'in.(site_tab_title,site_meta_description)');

  const response = await fetch(endpoint, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`Supabase metadata request failed with HTTP ${response.status}.`);
  }

  const rows = await response.json();
  if (!Array.isArray(rows)) throw new Error('Supabase metadata response was not a list.');

  const values = new Map(rows.map((row) => [row.key, row.value]));
  return {
    title: values.get('site_tab_title'),
    description: values.get('site_meta_description'),
  };
};

const run = async () => {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
  const isRequired = process.env.REQUIRE_SUPABASE_METADATA === 'true';
  let metadata = { title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION };

  if (!supabaseUrl || !anonKey) {
    if (isRequired) throw new Error('Supabase build metadata configuration is missing.');
    console.warn('Supabase build metadata is unavailable; using static defaults.');
  } else {
    metadata = await fetchSiteMetadata(supabaseUrl, anonKey);
  }

  const htmlPath = fileURLToPath(new URL('../dist/index.html', import.meta.url));
  const html = await readFile(htmlPath, 'utf8');
  await writeFile(htmlPath, injectMetadata(html, {
    ...metadata,
    canonicalUrl: process.env.SITE_CANONICAL_URL,
  }));
  console.log('Generated initial HTML metadata.');
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  run().catch((error) => {
    console.error(`Site metadata generation failed: ${error.message}`);
    process.exitCode = 1;
  });
}