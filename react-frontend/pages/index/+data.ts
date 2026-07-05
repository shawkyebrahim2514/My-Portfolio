import { getAboutPage } from '../../src/APIs';
import type { SanityAboutPage } from '../../src/Types';

export async function data(): Promise<SanityAboutPage> {
  return getAboutPage();
}
