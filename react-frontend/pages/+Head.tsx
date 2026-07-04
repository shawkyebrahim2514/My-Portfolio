// Global <head> tags that used to live in the single shared index.html —
// these apply to every page's initial HTML load (favicon/manifest/theme-color
// are truly global; the JSON-LD Person schema and keywords describe the site
// owner and are crawler-facing, so they're fine to keep global per-page
// <title>/<description>/<image> are handled by +config.ts instead, see
// https://vike.dev/Head#only-html).
export function Head() {
  return (
    <>
      <meta name="theme-color" content="#13262e" />
      <meta name="author" content="Shawky Ebrahim" />
      <meta
        name="keywords"
        content="Shawky Ebrahim, Software Engineer, Microsoft, portfolio, frontend, React, web development"
      />
      <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/logo192.png" />
      <link rel="manifest" href="/manifest.json" />

      {/* Structured data: Person */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Shawky Ebrahim',
            url: 'https://shawkyebrahim.vercel.app/',
            image: 'https://shawkyebrahim.vercel.app/og-image.png',
            jobTitle: 'Software Engineer',
            worksFor: { '@type': 'Organization', name: 'Microsoft' },
            sameAs: [
              'https://github.com/shawkyebrahim2514',
              'https://www.linkedin.com/in/shawkyebrahim2514/',
              'https://www.facebook.com/shawkyebrahim2514/',
              'https://www.behance.net/shawkyebrahim2514',
              'https://t.me/shawkyebrahim2514',
              'https://wuzzuf.net/me/shawkyebrahim2514',
            ],
          }),
        }}
      />
    </>
  );
}
