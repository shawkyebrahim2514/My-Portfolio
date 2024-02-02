import { createClient } from '@sanity/client'

const sanityClient = createClient({
    projectId: 'h48br789',
    dataset: 'production',
    useCdn: true
})

export default sanityClient;