import { memo } from 'react';
import { SanityAboutPage } from '../../../Types';
import RichContent from '../../../components/RichContent';
import styles from './Content.module.css';

function Content({
    description,
}: Readonly<Omit<SanityAboutPage, 'personImage'>>) {
    return (
        <div className={styles.content}>
            <RichContent value={description} />
        </div>
    )
}

export default memo(Content);
