import { memo } from 'react';
import { SanityAboutPage } from '../../../Types';
import HTMLMarkdown from '../../../components/HTMLMarkdown';
import styles from './Content.module.css';

function Content({
    description,
}: Readonly<Omit<SanityAboutPage, 'personImage'>>) {
    return (
        <div className={styles.content}>
            <HTMLMarkdown markdown={description} />
        </div>
    )
}

export default memo(Content);
