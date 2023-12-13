import { SanityInternship, SanityCertificate } from "../sanity";

export type Internship = Omit<SanityInternship, "rank">;

export type Certificate = Omit<SanityCertificate, "rank">;