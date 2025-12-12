// Cloudflare Pages Function - Geo-based language middleware
export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);

  // Skip for static assets and index files (prevent loop)
  if (url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|pdf|woff|woff2|ttf|html)$/)) {
    return next();
  }

  // Skip if already an index file path
  if (url.pathname === '/index.html' || url.pathname === '/index-en.html') {
    return next();
  }

  // Get country from Cloudflare header
  const country = request.cf?.country || 'BR';

  // Check for language override cookie
  const cookies = request.headers.get('cookie') || '';
  const langOverride = cookies.match(/lang=(ptbr|en)/)?.[1];

  // Check for ?lang= query parameter (for manual switching)
  const langParam = url.searchParams.get('lang');

  // Determine language: param > cookie > geo
  let lang = 'ptbr';
  if (langParam === 'en' || langParam === 'ptbr') {
    lang = langParam;
  } else if (langOverride) {
    lang = langOverride;
  } else if (country !== 'BR') {
    lang = 'en';
  }

  // Route paths that should serve index
  const routePaths = ['/', '/opensource', '/projetos', '/projects', '/destaques', '/highlights', '/sobre', '/about', '/experiencia', '/experience', '/contato', '/contact'];
  const isRoutePath = routePaths.some(path => url.pathname === path || url.pathname.startsWith(path + '/'));

  if (isRoutePath) {
    // Rewrite to appropriate index file
    const indexFile = lang === 'en' ? '/index-en.html' : '/index.html';
    const displayLang = lang === 'ptbr' ? 'pt-BR' : 'en';

    // Create new URL for the index file
    const assetUrl = new URL(indexFile, url.origin);

    // Fetch directly from ASSETS binding
    const response = await env.ASSETS.fetch(assetUrl.toString());

    // Clone response to modify headers
    const newResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: new Headers(response.headers)
    });

    // Set language cookie if param was provided
    if (langParam) {
      newResponse.headers.set('Set-Cookie', `lang=${lang}; path=/; max-age=31536000; SameSite=Lax`);
    }

    // Add language header for debugging
    newResponse.headers.set('X-Language', displayLang);
    newResponse.headers.set('X-Country', country);
    newResponse.headers.set('X-Lang-Source', langParam ? 'param' : (langOverride ? 'cookie' : 'geo'));
    newResponse.headers.set('X-Cookie-Lang', langOverride || 'none');

    // Prevent edge caching - vary by country
    newResponse.headers.set('Cache-Control', 'private, no-store, must-revalidate');
    newResponse.headers.set('Vary', 'Accept-Language, Cookie');

    return newResponse;
  }

  return next();
}
