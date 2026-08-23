import { RichContentNode } from './richContent';
import { SanityHubEntrySummary } from './hubEntry';
import { SanityHubDirectoryChannel } from './hubChannelsDirectory';

export type SanityAboutPage = {
    personImage: string;
    circularRingText: string;
    description: RichContentNode[];
    // Items can be `null` if a referenced hubEntry is deleted or temporarily
    // unresolvable — callers must filter before rendering.
    featuredHubEntries: (SanityHubEntrySummary | null)[];
    featuredFollows?: (SanityHubDirectoryChannel | null)[];
}