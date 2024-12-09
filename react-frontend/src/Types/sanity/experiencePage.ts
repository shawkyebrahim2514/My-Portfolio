import { CommonTitle } from "./common";

type Experience = {
    description: string;
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