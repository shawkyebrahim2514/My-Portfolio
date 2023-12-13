import { SanityEducationCourse } from "../sanity";

export type Course = Omit<SanityEducationCourse, "rank">;