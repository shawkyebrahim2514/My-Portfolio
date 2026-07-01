import { memo } from 'react'
import BlurBackground from '../../../BlurBackground';
import { cx } from '../../../../utils/cx';
import styles from './ImageOverlay.module.css';

type ImageOverlayProps = {
    readonly isHovered: boolean,
}

function ImageOverlay({ isHovered }: ImageOverlayProps) {
    return (
        <div className={cx(styles.overlay, isHovered && styles.overlayHovered)}>
            <BlurBackground backgroundColor={'var(--color-base-700)'} />
        </div>
    )
}

export default memo(ImageOverlay);