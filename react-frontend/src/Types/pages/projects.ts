import { SanityProject } from "../sanity";

export type Project = Omit<SanityProject, 'rank'>;