import { createClient } from '@sanity/client'

const sanityClient = createClient({
    projectId: 'h48br789',
    dataset: 'production',
    useCdn: true,
    apiVersion: '2022-03-07',
})

export default sanityClient;