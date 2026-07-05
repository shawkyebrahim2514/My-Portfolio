import { memo } from 'react';
import BackShape from './BackShape';
import ActualImage from './ActualImage';
import CircularText from '../../../components/CircularText';
import { SanityAboutPage } from '../../../Types';
import styles from './Image.module.css';

function Image({ personImage, circularRingText }: Readonly<Pick<SanityAboutPage, 'personImage' | 'circularRingText'>>) {
    return (
        <div className={styles.frame}>
            <div className={styles.ring}>
                <CircularText
                    text={circularRingText.repeat(2)}
                    size="calc(var(--avatar-size) * 1.24)"
                    spinDuration={24}
                />
            </div>
            <BackShape />
            <ActualImage personImage={personImage} />
        </div>
    )
}

export default memo(Image);