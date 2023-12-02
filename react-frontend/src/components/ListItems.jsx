import React from 'react'
import Text from './Text'

export default function ListItems({ elements, icon }) {
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
                    key={line.substring(0, 10) + index}
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
