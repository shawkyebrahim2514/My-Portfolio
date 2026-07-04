import { getProjectsPage } from '../../src/APIs';
import type { SanityProjectsPage } from '../../src/Types';

export async function data(): Promise<SanityProjectsPage> {
  return getProjectsPage();
}
