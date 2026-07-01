import styles from './HTMLMarkdown.module.css';

const UlMarkdown = ({ ...props }: React.HTMLAttributes<HTMLUListElement>) => {
    return (
        <ul {...props} className={styles.ul} />
    )
}

export default UlMarkdown