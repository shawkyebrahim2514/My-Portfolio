import Highlight from './Highlight.astro';
import Tag from './Tag.astro';
import LinkButton from './LinkButton.astro';
import Callout from './Callout.astro';
import Quote from './Quote.astro';
import Center from './Center.astro';
import Spacer from './Spacer.astro';
import ProseImage from './ProseImage.astro';

/**
 * Component map passed to `<Content components={proseComponents} />` so ported
 * MDX content can use these without per-file imports.
 */
export const proseComponents = {
  Highlight,
  Tag,
  LinkButton,
  Callout,
  Quote,
  Center,
  Spacer,
  ProseImage,
};

export {
  Highlight,
  Tag,
  LinkButton,
  Callout,
  Quote,
  Center,
  Spacer,
  ProseImage,
};
