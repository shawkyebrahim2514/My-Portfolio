import { SanityAboutPage } from '../../../Types';
import styles from './Image.module.css';
import { sanityImageProps } from '../../../utils/sanityImage';

export default function ActualImage({
    personImage,
}: Readonly<Pick<SanityAboutPage, 'personImage'>>) {
    return (
        <div className={styles.imageFrame}>
            <img
                {...sanityImageProps(personImage, 640, '(max-width: 552px) 58vw, 320px')}
                alt="Shawky Ebrahim"
                width={320}
                height={320}
                fetchPriority="high"
                decoding="async"
                className={styles.image}
            />
        </div>
    );
}
