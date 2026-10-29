import { memo } from 'react';
import styles from './MainImage.module.css';
import { sanityImageProps } from '../../../utils/sanityImage';

function MainImage({ imgSrc, isHovered }: { imgSrc: string; isHovered: boolean }) {
    return (
        <img
            className={styles.image}
            style={{ scale: isHovered ? '1.2' : '1' }}
            {...sanityImageProps(imgSrc, 1280, '(max-width: 768px) calc(100vw - 64px), 480px')}
            loading="lazy"
            decoding="async"
            alt={imgSrc}
        />
    );
}

export default memo(MainImage);
