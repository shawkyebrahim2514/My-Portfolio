import { useState } from 'react'
import MainImage from './MainImage';
import styles from './Image.module.css';

export type ImageProps = {
    readonly imgSrc: string,
}

export default function Image({ imgSrc }: ImageProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            onMouseOver={() => { setIsHovered(true) }}
            onFocus={() => { setIsHovered(true) }}
            onMouseOut={() => { setIsHovered(false) }}
            onBlur={() => { setIsHovered(false) }}
            className={styles.frame} >
            <MainImage imgSrc={imgSrc} isHovered={isHovered} />
        </div>
    )
}