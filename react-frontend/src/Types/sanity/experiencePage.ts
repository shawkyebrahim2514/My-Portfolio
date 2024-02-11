import { CommonTitle } from "./common";

type Date = {
    from: string;
    to: string;
}

type Internship = {
    title: string;
    subTitle: string;
    date: Date,
    link: string;
    description: string;
    technologies: string[];
}

type Certificate = {
    title: string;
    subTitle: string;
    description: string;
    date: string;
    link: string;
}

type SanityInternshipsSection = CommonTitle & {
    internships: Internship[];
}

type SanityCertificatesSection = CommonTitle & {
    certificates: Certificate[];
}

export type SanityExperiencePage = {
    certificatesSection: SanityCertificatesSection;
    internshipsSection: SanityInternshipsSection;
}