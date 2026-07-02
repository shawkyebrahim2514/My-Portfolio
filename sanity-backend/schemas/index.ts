// Get react-icons from https://react-icons.github.io/react-icons/#/

import { skills } from './units/skills'
import { collegeCourses } from './units/collegeCourses'
import { internships } from './units/internships'
import { projects } from './units/projects'
import { contacts } from './units/contacts'
import { certificates } from './units/certificates'
import { professionalExperience } from './units/professionalExperience'
import { portfolio } from './portfolio'
import { spacer, divider, imageRow, callout } from './objects/richContent'

export const schemaTypes = [
    portfolio,
    professionalExperience,
    internships,
    collegeCourses,
    projects,
    certificates,
    skills,
    contacts,
    // Rich-content object types (Portable Text) used by description fields.
    spacer,
    divider,
    imageRow,
    callout,
]
