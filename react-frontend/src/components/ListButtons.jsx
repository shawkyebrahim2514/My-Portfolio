import Button from './Button'

export default function ListButtons({ elements }) {
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: "1rem",
            flexWrap: "wrap",
        }}>
            {elements.map((tech, index) => {
                return <Button key={tech} text={tech} size='sm' />
            })}
        </div>
    )
}
