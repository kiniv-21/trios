import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const allowedOrigins = new Set([
  'https://triosart.in',
  'https://www.triosart.in',
  'http://localhost:5173',
]);

const responseHeaders = (origin: string | null) => ({
  'Access-Control-Allow-Origin': origin && allowedOrigins.has(origin) ? origin : 'https://triosart.in',
  'Access-Control-Allow-Headers': 'authorization, apikey, x-client-info, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
  Vary: 'Origin',
});

const jsonResponse = (body: Record<string, string>, status: number, origin: string | null) =>
  new Response(JSON.stringify(body), { status, headers: responseHeaders(origin) });

Deno.serve(async (request) => {
  const origin = request.headers.get('Origin');
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: responseHeaders(origin) });
  }
  if (request.method !== 'POST') return jsonResponse({ error: 'Method not allowed.' }, 405, origin);
  if (!origin || !allowedOrigins.has(origin)) return jsonResponse({ error: 'Origin not allowed.' }, 403, origin);

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const githubToken = Deno.env.get('GITHUB_WORKFLOW_TOKEN');
  const authorization = request.headers.get('Authorization');
  const accessToken = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!supabaseUrl || !anonKey || !githubToken || !accessToken || !authorization) {
    return jsonResponse({ error: 'Publishing is not configured.' }, 503, origin);
  }

  const supabase = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: userData, error: userError } = await supabase.auth.getUser(accessToken);
  if (userError || !userData.user) return jsonResponse({ error: 'Authentication required.' }, 401, origin);

  const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin_user');
  if (adminError || isAdmin !== true) return jsonResponse({ error: 'Admin access required.' }, 403, origin);

  try {
    const githubResponse = await fetch(
      'https://api.github.com/repos/kiniv-21/trios/actions/workflows/deploy.yml/dispatches',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
        body: JSON.stringify({ ref: 'main', inputs: { target: 'production' } }),
      },
    );

    if (!githubResponse.ok) return jsonResponse({ error: 'GitHub did not accept the publish request.' }, 502, origin);
    return jsonResponse({ status: 'queued' }, 200, origin);
  } catch {
    return jsonResponse({ error: 'Could not contact GitHub to queue publishing.' }, 502, origin);
  }
});