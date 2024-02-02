import { CSSProperties, ReactNode } from "react"

type TextProps = {
    readonly variant?: keyof typeof TextVariants,
    readonly style?: CSSProperties,
    readonly onClick?: () => void,
    readonly children: ReactNode,
}

const TextVariants = {
    h1: ({ style, onClick, children }: TextProps) =>
        <h1 onClick={onClick}
            onKeyDown={onClick}
            style={style}
            tabIndex={0}
        >{children}</h1>,
    h2: ({ style, onClick, children }: TextProps) =>
        <h2 onClick={onClick}
            onKeyDown={onClick}
            tabIndex={0}
            style={style}
        >{children}</h2>,
    h3: ({ style, onClick, children }: TextProps) =>
        <h3 onClick={onClick}
            onKeyDown={onClick}
            tabIndex={0}
            style={style}
        >{children}</h3>,
    h4: ({ style, onClick, children }: TextProps) =>
        <h4 onClick={onClick}
            onKeyDown={onClick}
            tabIndex={0}
            style={style}
        >{children}</h4>,
    body: ({ style, onClick, children }: TextProps) =>
        <p onClick={onClick}
            onKeyDown={onClick}
            tabIndex={0}
            style={style}
        >{children}</p>,
}

export default function Text({ variant = "body", style, onClick, children }: TextProps) {
    return TextVariants[variant]({ style, onClick, children });
}
