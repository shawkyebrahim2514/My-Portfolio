import styles from './HTMLMarkdown.module.css';

const HrMarkdown = ({ ...props }: React.HTMLAttributes<HTMLHRElement>) => {
    return (
        <div {...props} className={styles.hr} />
    )
}

export default HrMarkdown