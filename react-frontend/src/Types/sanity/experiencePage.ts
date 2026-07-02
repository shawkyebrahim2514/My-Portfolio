import { CommonTitle } from "./common";
import { RichContentNode } from './richContent';

type Experience = {
    description: RichContentNode[];
}

type Internship = Experience & {
    technologies: string[];
}

type SanityInternshipsSection = CommonTitle & {
    internships: Internship[];
}

type SanityprofessionalExperienceSection = CommonTitle & {
    professionalExperience: Internship[];
}

type SanityCertificatesSection = CommonTitle & {
    certificates: Experience[];
}

export type SanityExperiencePage = {
    certificatesSection: SanityCertificatesSection;
    internshipsSection: SanityInternshipsSection;
    professionalExperienceSection: SanityprofessionalExperienceSection;
}