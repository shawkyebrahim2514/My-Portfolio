import { CSSProperties, useMemo } from 'react'
import { useThemeContext } from '../../contexts/ThemeContext';
import Text from '../Text';
import ListButtons from '../ListButtons';
import ListItems from '../ListItems';

type ContentProps = {
    readonly title: string,
    readonly description: string,
    readonly technologies: string[],
}

export default function Content({ title, description, technologies }: ContentProps) {
    const outerStyle = useMemo((): CSSProperties => {
        return {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "1rem",
        }
    }, []);
    const innerStyle = useMemo((): CSSProperties => {
        return {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            gap: "0.25rem",
        }
    }, []);

    return (
        <div style={outerStyle}>
            <div style={innerStyle}>
                <Title title={title} />
                <ListItems elements={description.split("\n")} />
            </div>
            <ListButtons elements={technologies} />
        </div>
    )
}

function Title({ title }: Pick<ContentProps, "title">) {
    const { theme } = useThemeContext();
    const titleStyle = useMemo((): CSSProperties => {
        return {
            color: theme.colors.main.full,
        }
    }, [theme]);

    return (
        <Text variant={"h3"} style={titleStyle}>{title}</Text>
    )
}
