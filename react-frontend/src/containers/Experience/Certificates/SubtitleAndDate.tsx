import Text from '../../../components/Text'
import { CSSProperties, useMemo } from 'react'

type SubtitleAndDateProps = {
    readonly subTitle: string,
    readonly date: string
}

export default function SubtitleAndDate({ subTitle, date }: SubtitleAndDateProps) {
    const containerStyle = useMemo((): CSSProperties => ({
        display: "flex",
        alignItems: "flex-start",
        flexDirection: "column",
        width: "fit-content",
        gap: "0.5rem",
    }), []);

    return (
        <div style={containerStyle}>
            <Text variant={"h4"}>
                {subTitle}
            </Text>
            <Text variant={"body"}>
                {date}
            </Text>
        </div>
    )
}