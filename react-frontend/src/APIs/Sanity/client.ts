import { createClient } from '@sanity/client'

// Config is sourced from Vite env vars, falling back to the public project
// defaults so the app keeps working without a local .env. See .env.example.
const sanityClient = createClient({
    projectId: import.meta.env.VITE_SANITY_PROJECT_ID ?? 'h48br789',
    dataset: import.meta.env.VITE_SANITY_DATASET ?? 'production',
    apiVersion: import.meta.env.VITE_SANITY_API_VERSION ?? '2022-03-07',
    useCdn: true,
})

export default sanityClient;