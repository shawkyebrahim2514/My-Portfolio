import { CSSProperties, useMemo } from 'react'
import { useThemeContext } from '../../contexts/ThemeContext';
import Text from '../Text';
import ListButtons from '../ListButtons';
import ListItems from '../ListItems';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';

type ContentProps = {
    readonly title: string,
    readonly description: string,
    readonly technologies: string[],
}

export default function Content({ title, description, technologies }: ContentProps) {
    const { theme } = useThemeContext();
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
                <Text
                    variant={"h3"}
                    style={{
                        color: theme.colors.main.full,
                    }}
                >{title}</Text>
                <ListItems
                    elements={description.split("\n")}
                    icon={<FontAwesomeIcon icon={faAngleRight} />} />
            </div>
            <ListButtons elements={technologies} />
        </div>
    )
}
