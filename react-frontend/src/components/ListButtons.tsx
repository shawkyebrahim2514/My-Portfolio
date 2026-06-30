import Button from './Button'
import styles from './ListButtons.module.css';

type ListButtonsProps = {
    readonly elements: string[];
}

export default function ListButtons({ elements }: ListButtonsProps) {
    return (
        <div className={styles.list}>
            {elements.map((tech) => {
                return (
                    <Button key={tech} text={tech} size='sm' />
                )
            })}
        </div>
    )
}
