import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2023-01-01'})

const [pub, draft, follows, featured, sample] = await Promise.all([
  client.fetch(
    '*[_id=="hubChannelsDirectoryPage-singleton"][0]{ _id, "n": count(channels), "refs": count(channels[_ref != null]), "objs": count(channels[defined(url)]) }',
  ),
  client.fetch(
    '*[_id=="drafts.hubChannelsDirectoryPage-singleton"][0]{ _id, "n": count(channels), "refs": count(channels[_ref != null]), "objs": count(channels[defined(url)]) }',
  ),
  client.fetch('count(*[_type=="hubFollow"])'),
  client.fetch('count(*[_type=="hubFollow" && featuredInAbout==true])'),
  client.fetch(
    '*[_type=="hubFollow"] | order(name asc)[0...5]{ _id, name, platform, url, featuredInAbout, "hasCoverFocus": defined(coverFocus), "hasNote": defined(note) }',
  ),
])

console.log(JSON.stringify({pub, draft, follows, featured, sample}, null, 2))
