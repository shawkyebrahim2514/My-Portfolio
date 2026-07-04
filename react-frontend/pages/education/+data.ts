import { getEducationPage } from '../../src/APIs';
import type { SanityEducationPage } from '../../src/Types';

export async function data(): Promise<SanityEducationPage> {
  return getEducationPage();
}
