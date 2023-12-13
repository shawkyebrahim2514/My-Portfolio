import { SanitySkill } from "../sanity";

export type TechnologySkill = Omit<SanitySkill, "categoryName" | "rank">;
