import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faXmark } from '@fortawesome/free-solid-svg-icons';
import { usePreview } from '../../contexts/PreviewContext';
import styles from './PreviewBanner.module.css';

// Slim fixed banner shown ONLY when preview mode was explicitly enabled on the
// live site (?preview=1). It never shows in local dev (where preview is always
// on and a banner would just be noise). Lets you exit back to the normal
// production view in one click.
export default function PreviewBanner() {
    const { isExplicit, exitPreview } = usePreview();
    if (!isExplicit) return null;

    return (
        <div className={styles.banner} role="status">
            <span className={styles.label}>
                <FontAwesomeIcon icon={faEye} />
                Preview mode — hidden entries are visible
            </span>
            <button type="button" className={styles.exit} onClick={exitPreview}>
                <FontAwesomeIcon icon={faXmark} />
                Exit
            </button>
        </div>
    );
}
