import { CSSProperties, ReactNode } from "react"

type TextProps = {
    variant?: Lowercase<keyof typeof TextVariants>,
    style?: CSSProperties,
    onClick?: () => void,
    children: ReactNode,
}

const TextVariants = {
    H1: ({ style, onClick, children }: TextProps) =>
        <h1
            onClick={onClick}
            onKeyDown={onClick}
            style={style}
            tabIndex={0}
        >{children}</h1>,
    H2: ({ style, onClick, children }: TextProps) =>
        <h2 onClick={onClick}
            onKeyDown={onClick}
            tabIndex={0}
            style={style}
        >{children}</h2>,
    H3: ({ style, onClick, children }: TextProps) =>
        <h3 onClick={onClick}
            onKeyDown={onClick}
            tabIndex={0}
            style={style}
        >{children}</h3>,
    H4: ({ style, onClick, children }: TextProps) =>
        <h4 onClick={onClick}
            onKeyDown={onClick}
            tabIndex={0}
            style={style}
        >{children}</h4>,
    BODY: ({ style, onClick, children }: TextProps) =>
        <p onClick={onClick}
            onKeyDown={onClick}
            tabIndex={0}
            style={style}
        >{children}</p>,
}

export default function Text({ variant = "body", style, onClick, children }: TextProps) {
    switch (variant) {
        case "h1":
            return <TextVariants.H1 style={style} onClick={onClick}>{children}</TextVariants.H1>
        case "h2":
            return <TextVariants.H2 style={style} onClick={onClick}>{children}</TextVariants.H2>
        case "h3":
            return <TextVariants.H3 style={style} onClick={onClick}>{children}</TextVariants.H3>
        case "h4":
            return <TextVariants.H4 style={style} onClick={onClick}>{children}</TextVariants.H4>
        default:
            return <TextVariants.BODY style={style} onClick={onClick}>{children}</TextVariants.BODY>
    }
}
