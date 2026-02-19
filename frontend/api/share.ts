export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const params = url.searchParams;

  const symX  = (params.get('symX')  ?? 'TOKEN').toUpperCase();
  const symY  = (params.get('symY')  ?? 'TOKEN').toUpperCase();
  const mode  = params.get('mode')  ?? 'current';
  const price = params.get('price') ?? '0';
  const mult  = params.get('mult')  ?? '1';
  const pct   = params.get('pct')   ?? '0';
  const mcY   = params.get('mcY')   ?? '0';

  const baseUrl = `${url.protocol}//${url.host}`;
  const ogImageUrl = `${baseUrl}/api/og?symX=${symX}&symY=${symY}&mode=${mode}&price=${price}&mult=${mult}&pct=${pct}&mcY=${mcY}`;
  const appUrl = `${baseUrl}/?sim=${symX}&ref=${symY}&mode=${mode}`;

  const sign = parseFloat(pct) >= 0 ? '+' : '';
  const title = `${symX} com MC de ${symY}: $${parseFloat(price).toLocaleString('en-US', { maximumFractionDigits: 4 })} (${parseFloat(mult).toFixed(2)}X)`;
  const description = `E se ${symX} tivesse o market cap ${mode === 'ath' ? 'na máxima histórica' : 'atual'} de ${symY}? Preço seria ${sign}${parseFloat(pct).toFixed(1)}% — simulado no TokenomicsRadar.`;

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} — TokenomicsRadar</title>

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="TokenomicsRadar" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${ogImageUrl}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${appUrl}" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${ogImageUrl}" />

  <!-- Redirect to app -->
  <meta http-equiv="refresh" content="0; url=${appUrl}" />
  <script>window.location.replace("${appUrl}");</script>
</head>
<body style="background:#060d06;color:#39d353;font-family:monospace;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
  <p>Redirecionando para TokenomicsRadar...</p>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
