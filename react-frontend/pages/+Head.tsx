// Global <head> tags that used to live in the single shared index.html —
// these apply to every page's initial HTML load (favicon/manifest/theme-color
// are truly global; canonical/OG URL and JSON-LD are derived from the current
// path). Per-page <title>/<description>/<image> are handled by +config.ts, see
// https://vike.dev/Head#only-html.
import { usePageContext } from "vike-react/usePageContext";
import type { SanityHubEntry } from "../src/Types";
import { siteJsonLdGraph } from "../src/seo/jsonld";
import { SITE_NAME, canonicalUrl, isHubEntryPath } from "../src/seo/site";

export function Head() {
  const pageContext = usePageContext();
  const pathname = pageContext.urlPathname || "/";
  const canonical = canonicalUrl(pathname);
  const entry = (pageContext.data as { entry?: SanityHubEntry } | undefined)?.entry;
  const jsonLd = siteJsonLdGraph(pathname, isHubEntryPath(pathname) ? entry : undefined);
  const ogType = isHubEntryPath(pathname) ? "article" : pathname === "/" ? "profile" : "website";
  const locale = entry?.language === "ar" ? "ar_AR" : "en_US";

  return (
    <>
      <meta name="theme-color" content="#13262e" />
      <meta name="author" content="Shawky Ebrahim" />
      <meta
        name="keywords"
        content="Shawky Ebrahim, Software Engineer, Microsoft, portfolio, frontend, React, web development, Hub"
      />
      <link rel="canonical" href={canonical} />
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="apple-touch-icon" href="/logo192.png" />
      <link rel="manifest" href="/manifest.json" />

      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={locale} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
