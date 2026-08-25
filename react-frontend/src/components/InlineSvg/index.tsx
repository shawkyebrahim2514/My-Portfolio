import { memo } from 'react';
import { cx } from '../../utils/cx';
import styles from './InlineSvg.module.css';

type InlineSvgProps = {
    readonly svg: string;
    readonly className?: string;
};

// Renders an icon's raw SVG markup (as stored on the document by
// sanity-plugin-icon-manager with `inlineSvg: true`). The markup comes from a
// trusted source (our own CMS / the Iconify API), and the CSS normalises the
// stored width/height to 1em so it scales with font-size like the site's other
// (FontAwesome) icons.
function InlineSvg({ svg, className }: InlineSvgProps) {
    return (
        <span
            className={cx(styles.icon, className)}
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
}

export default memo(InlineSvg);
