import { SanityAboutPage } from '../../../Types';
import styles from './Image.module.css';

export default function ActualImage({ personImage }: Readonly<Pick<SanityAboutPage, 'personImage'>>) {
    return (
        <div className={styles.imageFrame}>
            <img src={personImage}
                alt="Shawky Ebrahim"
                className={styles.image} />
        </div>
    )
}
