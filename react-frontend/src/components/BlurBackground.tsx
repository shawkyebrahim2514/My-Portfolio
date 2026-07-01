import styles from './BlurBackground.module.css';

type BlurBackgroundProps = {
    backgroundColor: string,
}

export default function BlurBackground({ backgroundColor }: BlurBackgroundProps) {
    return (
        <div
            className={styles.blur}
            style={{ backgroundColor: `color-mix(in srgb, ${backgroundColor} 80%, transparent)` }} />
    )
}
