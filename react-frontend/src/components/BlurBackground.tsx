/** @jsxImportSource @emotion/react */

type BlurBackgroundProps = {
    backgroundColor: string,
}

export default function BlurBackground({ backgroundColor }: BlurBackgroundProps) {
    return (
        <div css={{
            zIndex: -1,
            position: "absolute",
            backgroundColor: toRGBA(backgroundColor, 0.8),
            backdropFilter: "blur(8px)",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
        }} />
    )
}

function toRGBA(color: string, alpha: number) {
    return `${color}${Math.round(alpha * 255).toString(16)}`;
}
