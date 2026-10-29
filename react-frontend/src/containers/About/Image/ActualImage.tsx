import { SanityAboutPage } from '../../../Types';
import styles from './Image.module.css';
import { sanityImageProps } from '../../../utils/sanityImage';

export type PortraitProps = Readonly<Pick<SanityAboutPage, 'personImage'>> & {
    priority?: boolean;
};

export default function ActualImage({ personImage, priority = true }: PortraitProps) {
    return (
        <div className={styles.imageFrame}>
            <img
                {...sanityImageProps(
                    personImage,
                    640,
                    '(max-width: 900px) 150px, (max-width: 945px) 190px, (max-width: 1200px) calc(22vw - 18px), 246px'
                )}
                alt="Shawky Ebrahim"
                width={320}
                height={320}
                fetchPriority={priority ? 'high' : undefined}
                loading={priority ? 'eager' : 'lazy'}
                decoding="async"
                className={styles.image}
            />
        </div>
    );
}
