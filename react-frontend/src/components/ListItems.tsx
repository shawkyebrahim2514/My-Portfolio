import Text from './Text'

type ListItemsProps = {
    readonly elements: string[];
    readonly icon: JSX.Element;
}

export default function ListItems({ elements, icon }: ListItemsProps) {
    return (
        <div style={{
            display: "flex",
            alignItems: "flex-start",
            flexDirection: "column",
            width: "fit-content",
            gap: "0.5rem",
        }}>
            {elements.map((line, index) => (
                <div
                    key={line.substring(0, 5) + line.substring(line.length - 5, line.length)}
                    style={{
                        display: "flex",
                        alignItems: "baseline",
                        justifyContent: "flex-start",
                        gap: "0.5rem",
                    }}>
                    {icon}
                    <Text variant={"body"}>
                        {line}
                    </Text>
                </div>
            ))}
        </div>
    )
}
