import { cx } from '../../utils/cx';
import styles from './StarBorder.module.css';

type StarBorderProps = {
    readonly className?: string;
    readonly children: React.ReactNode;
};

// Zero-dependency, CSS-only port of react-bits' Star Border: two blurred
// radial-gradient "comets" orbit behind the content on an infinite loop,
// only ever visible through a thin padding gap — reading as an animated
// glowing border traveling around the button. `children` must render its
// own opaque background/border-radius (e.g. Button/ButtonLink already do)
// so it fully occludes the comets except at that thin gap.
export default function StarBorder({ className, children }: StarBorderProps) {
    return (
        <span className={cx(styles.wrapper, className)}>
            <span className={styles.gradientBottom} aria-hidden="true" />
            <span className={styles.gradientTop} aria-hidden="true" />
            {children}
        </span>
    );
}
