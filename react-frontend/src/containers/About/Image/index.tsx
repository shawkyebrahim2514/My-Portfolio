import { memo } from 'react';
import ActualImage, { type PortraitProps } from './ActualImage';
import styles from './Image.module.css';

function Image({ personImage, priority }: PortraitProps) {
    return (
        <figure className={styles.frame} data-portrait-concept="signature">
            <ActualImage personImage={personImage} priority={priority} />
        </figure>
    );
}

export default memo(Image);
