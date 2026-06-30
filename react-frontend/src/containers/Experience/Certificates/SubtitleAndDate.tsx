import Text from '../../../components/Text'
import styles from './SubtitleAndDate.module.css'

type SubtitleAndDateProps = {
    readonly subTitle: string,
    readonly date: string
}

export default function SubtitleAndDate({ subTitle, date }: SubtitleAndDateProps) {
    return (
        <div className={styles.group}>
            <Text variant={"h4"}>
                {subTitle}
            </Text>
            <Text variant={"body"}>
                {date}
            </Text>
        </div>
    )
}