import Text from '../../../components/Text'
import { CSSProperties, useMemo } from 'react'
import { Internship } from '../../../Types'

type ExperienceItemInformationProps = {
    readonly subTitle: string,
    readonly date: Internship["date"]
}

export default function ExperienceItemInformation({ subTitle, date }: ExperienceItemInformationProps) {
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
                {formatDate({ date })}
            </Text>
        </div>
    )
}

function formatDate({ date }: Pick<Internship, "date">) {
    return `From: ${date.from} - To: ${date.to}`
}