import Text from '../../../components/Text'
import ListItems from '../../../components/ListItems'
import { CSSProperties, useMemo } from 'react'
import { Internship } from '../../../Types'

type ExperienceItemDescriptionProps = {
    readonly description: Internship["description"]
}

export default function ExperienceItemDescription({ description }: ExperienceItemDescriptionProps) {
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
                Description
            </Text>
            <ListItems elements={description.split("\n")} />
        </div>
    )
}