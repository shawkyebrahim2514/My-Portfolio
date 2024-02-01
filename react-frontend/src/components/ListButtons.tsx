import { CSSProperties, useMemo } from 'react';
import Button from './Button'

type ListButtonsProps = {
    readonly elements: string[];
}

export default function ListButtons({ elements }: ListButtonsProps) {
    const mainListStyle = useMemo((): CSSProperties => {
        return {
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: "1rem",
            flexWrap: "wrap",
        }
    }, []);

    return (
        <div style={mainListStyle}>
            {elements.map((tech) => {
                return (
                    <Button key={tech} text={tech} size='sm' />
                )
            })}
        </div>
    )
}
