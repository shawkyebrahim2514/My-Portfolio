// Get react-icons from https://react-icons.github.io/react-icons/#/

import {skills} from './units/skills'
import {collegeCourses} from './units/collegeCourses'
import {internships} from './units/internships'
import {projects} from './units/projects'
import {contacts} from './units/contacts'
import {certificates} from './units/certificates'
import {professionalExperience} from './units/professionalExperience'
import {portfolio} from './portfolio'
import {
  spacer,
  divider,
  externalImage,
  imageRow,
  figure,
  callout,
  note,
  keyTakeaways,
  quote,
  expandableDetails,
  youtube,
  curatedVideo,
  podcastEpisode,
  readingItem,
  listeningItem,
  linkPreview,
  facebookResource,
} from './objects/richContent'
import {
  hubPage,
  hubEntry,
  hubCategory,
  hubFollow,
  hubChannelsDirectoryPage,
  hubLibraryPage,
  hubLibraryCollection,
  hubLibrarySave,
} from './hub'
import {remoteImageCrop} from './objects/remoteImageCrop'

export const schemaTypes = [
  portfolio,
  professionalExperience,
  internships,
  collegeCourses,
  projects,
  certificates,
  skills,
  contacts,
  // Hub: content-sharing section (articles/channels/podcasts/listen/reading lists),
  // entered via an About-page teaser rather than a navbar tab.
  hubPage,
  hubEntry,
  hubCategory,
  hubFollow,
  hubChannelsDirectoryPage,
  hubLibraryPage,
  hubLibraryCollection,
  hubLibrarySave,
  remoteImageCrop,
  // Rich-content object types (Portable Text) used by description fields.
  spacer,
  divider,
  externalImage,
  imageRow,
  figure,
  callout,
  note,
  keyTakeaways,
  quote,
  expandableDetails,
  youtube,
  curatedVideo,
  podcastEpisode,
  readingItem,
  listeningItem,
  linkPreview,
  facebookResource,
]
