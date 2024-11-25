import { CommonTitle } from "./common";

type Date = {
    from: string;
    to: string;
}

type Experience = {
    title: string;
    subTitle: string;
    date: Date;
    link: string;
    description: string;
}

type Internship = Experience & {
    technologies: string[];
}

type SanityInternshipsSection = CommonTitle & {
    internships: Internship[];
}

type SanityCertificatesSection = CommonTitle & {
    certificates: Experience[];
}

export type SanityExperiencePage = {
    certificatesSection: SanityCertificatesSection;
    internshipsSection: SanityInternshipsSection;
}