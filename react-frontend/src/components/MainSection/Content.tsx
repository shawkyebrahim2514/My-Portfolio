import styles from './Content.module.css';

type ContentProps = {
    readonly children: React.ReactNode,
}

export default function Content({ children }: ContentProps) {
    return (
        <main className={styles.content}>
            <div className={styles.grow}>
                {children}
            </div>
        </main>
    )
}
