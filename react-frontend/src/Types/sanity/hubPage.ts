import { CommonTitle } from './common';
import { RichContentNode } from './richContent';

// Mirrors sanity-backend/schemas/hub/hubPage.ts (singleton page-level config
// for the /hub index — analogous to projectsPage/skillsPage etc., but NOT
// part of `portfolio.pages` since Hub has no navbar tab).
export type SanityHubPage = CommonTitle & {
    intro: RichContentNode[];
};
