import Text from './Text'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { CSSProperties, useMemo } from 'react';

type ListItemsProps = {
    readonly elements: string[];
    readonly icon?: JSX.Element;
}

export default function ListItems({
    elements,
    icon = <FontAwesomeIcon icon={faAngleRight} />
}: ListItemsProps) {
    const mainListStyle = useMemo((): CSSProperties => {
        return {
            display: "flex",
            alignItems: "flex-start",
            flexDirection: "column",
            width: "fit-content",
            gap: "0.5rem",
        }
    }, []);

    const listItemStyle = useMemo((): CSSProperties => {
        return {
            display: "flex",
            alignItems: "baseline",
            justifyContent: "flex-start",
            gap: "0.5rem",
        }
    }, []);

    return (
        <div style={mainListStyle}>
            {elements.map((line, index) => (
                <div key={createListItemKey(line)} style={listItemStyle} >
                    {icon}
                    <Text variant={"body"}>
                        {line}
                    </Text>
                </div>
            ))}
        </div>
    )
}

function createListItemKey(line: string): string {
    return line.substring(0, 5) + line.substring(line.length - 5, line.length);
}
