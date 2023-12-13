import Button from './Button'

type ListButtonsProps = {
    readonly elements: string[];
}

export default function ListButtons({ elements }: ListButtonsProps) {
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: "1rem",
            flexWrap: "wrap",
        }}>
            {elements.map((tech) => {
                return <Button key={tech} text={tech} size='sm' />
            })}
        </div>
    )
}
