import { SanityAboutPage } from '../../../Types';
import styles from './Image.module.css';

export default function ActualImage({ personImage }: Readonly<Pick<SanityAboutPage, 'personImage'>>) {
    return (
        <div className={styles.imageFrame}>
            <img src={personImage}
                alt="Shawky Ebrahim"
                width={320}
                height={320}
                fetchPriority="high"
                decoding="async"
                className={styles.image} />
        </div>
    )
}
