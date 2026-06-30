import styles from './SectionError.module.css';

type SectionErrorProps = {
    readonly message?: string;
};

export default function SectionError({
    message = 'Something went wrong loading this section. Please try again later.',
}: SectionErrorProps) {
    return (
        <p className={styles.error} role="alert">
            {message}
        </p>
    );
}
