import { getExperiencePage } from '../../src/APIs';
import type { SanityExperiencePage } from '../../src/Types';

export async function data(): Promise<SanityExperiencePage> {
  return getExperiencePage();
}
