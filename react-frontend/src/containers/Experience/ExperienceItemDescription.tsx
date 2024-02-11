import Text from '../../components/Text'
import ListItems from '../../components/ListItems'
import { CSSProperties, useMemo } from 'react'
import { SanityExperiencePage } from '../../Types'
import { useThemeContext } from '../../contexts/ThemeContext'

type ExperienceItemDescriptionProps = {
    readonly description: SanityExperiencePage['internshipsSection']['internships'][0]['description']
}

export default function ExperienceItemDescription({ description }: ExperienceItemDescriptionProps) {
    const { theme } = useThemeContext();
    const containerStyle = useMemo((): CSSProperties => ({
        display: "flex",
        alignItems: "flex-start",
        flexDirection: "column",
        width: "fit-content",
        gap: "0.5rem",
    }), []);
    const descriptionStyle = useMemo((): CSSProperties => ({
        color: theme.colors.main.full,
    }), [theme]);

    return (
        <div style={containerStyle}>
            <Text variant={"h4"} style={descriptionStyle}>
                Description
            </Text>
            <ListItems elements={description.split("\n")} />
        </div>
    )
}