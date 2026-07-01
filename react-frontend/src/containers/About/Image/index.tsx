import { memo } from 'react';
import BackShape from './BackShape';
import ActualImage from './ActualImage';
import { SanityAboutPage } from '../../../Types';
import styles from './Image.module.css';

function Image({ personImage }: Readonly<Pick<SanityAboutPage, 'personImage'>>) {
    return (
        <div className={styles.frame}>
            <BackShape />
            <ActualImage personImage={personImage} />
        </div>
    )
}

export default memo(Image);