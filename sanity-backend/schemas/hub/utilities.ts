// Shared slug-uniqueness check for Hub document types. Sanity's `slug` field
// only validates format by default — it does NOT check that the value is
// unique across the dataset. This mirrors the standard Sanity recipe: query
// for any OTHER document of the same `_type` (excluding both the draft and
// published IDs of the document currently being edited) that already has the
// same slug value.
export const makeIsUniqueSlug = (typeName: string) => {
    return async (slug: string, context: any) => {
        const { document, getClient } = context
        const client = getClient({ apiVersion: '2023-01-01' })
        const id = document._id.replace(/^drafts\./, '')
        const params = {
            draft: `drafts.${id}`,
            published: id,
            slug,
            type: typeName,
        }
        const query = `!defined(*[_type == $type && !(_id in [$draft, $published]) && slug.current == $slug][0]._id)`
        return client.fetch(query, params)
    }
}
