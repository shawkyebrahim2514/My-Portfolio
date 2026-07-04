import { getContactsPage } from '../../src/APIs';
import type { SanityContactsPage } from '../../src/Types';

export async function data(): Promise<SanityContactsPage> {
  return getContactsPage();
}
