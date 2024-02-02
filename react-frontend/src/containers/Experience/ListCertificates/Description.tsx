import Text from '../../../components/Text'
import ListItems from '../../../components/ListItems'
import { useThemeContext } from '../../../contexts/ThemeContext';
import { CSSProperties, useMemo } from 'react'
import { Certificate } from '../../../Types'

type DescriptionProps = {
    readonly description: Certificate["description"]
}

export default function Description({ description }: DescriptionProps) {
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
        <>
            {description && (
                <div style={containerStyle}>
                    <Text variant={"h4"} style={descriptionStyle}>
                        Description
                    </Text>
                    <ListItems elements={description.split("\n")} />
                </div>
            )}
        </>
    )
}