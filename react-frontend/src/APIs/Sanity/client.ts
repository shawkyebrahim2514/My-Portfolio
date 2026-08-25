import { createClient } from '@sanity/client'

// Config is sourced from Vite env vars, falling back to the public project
// defaults so the app keeps working without a local .env. See .env.example.
const sanityClient = createClient({
    projectId: import.meta.env.VITE_SANITY_PROJECT_ID ?? 'h48br789',
    dataset: import.meta.env.VITE_SANITY_DATASET ?? 'production',
    apiVersion: import.meta.env.VITE_SANITY_API_VERSION ?? '2022-03-07',
    // The site is a pure static prerender (Vike SSG): every query runs at BUILD
    // time via +data.ts / onBeforePrerenderStart, never in the browser. The
    // Sanity API CDN is eventually consistent (stale up to ~60s after publish),
    // so with useCdn:true a webhook-triggered rebuild that starts seconds after
    // a publish can race the CDN and bake stale content. useCdn:false hits the
    // live API, guaranteeing the build always gets the freshest data — no wait
    // or debounce needed. (There is no runtime/browser cost since nothing
    // fetches Sanity client-side.)
    useCdn: false,
})

export default sanityClient;