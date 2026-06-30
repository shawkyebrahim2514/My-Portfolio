import Text from '../../Text'
import styles from './highlight.module.css';

function ActualText({ text }: { readonly text: string }) {
    return (
        <div className={styles.actual}>
            <Text variant={"h2"}>{text}</Text>
        </div>
    );
}

export default ActualText;