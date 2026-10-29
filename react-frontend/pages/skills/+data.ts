import { getSkillsPage } from '../../src/APIs';
import type { SanitySkillsPage } from '../../src/Types';

export async function data(): Promise<SanitySkillsPage> {
    return getSkillsPage();
}
