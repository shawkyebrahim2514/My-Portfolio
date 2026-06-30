import { memo } from "react"
import styles from './MainImage.module.css';

function MainImage({ imgSrc, isHovered }: { imgSrc: string, isHovered: boolean }) {
    return (
        <img
            className={styles.image}
            style={{ scale: isHovered ? "1.2" : "1" }}
            src={imgSrc}
            alt={imgSrc} />
    )
}

export default memo(MainImage);