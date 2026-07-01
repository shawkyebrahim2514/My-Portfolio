import styles from './HTMLMarkdown.module.css';

const LiMarkdown = ({ ...props }: React.HTMLAttributes<HTMLLIElement>) => {
    return (<li {...props} className={styles.li}>
        {props.children}
    </li>)
}

export default LiMarkdown