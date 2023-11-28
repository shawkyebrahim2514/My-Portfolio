const textVariants = {
    h1: (style, children) => <h1 style={style}>{children}</h1>,
    h2: (style, children) => <h2 style={style}>{children}</h2>,
    h3: (style, children) => <h3 style={style}>{children}</h3>,
    h4: (style, children) => <h4 style={style}>{children}</h4>,
    body: (style, children) => <p style={style}>{children}</p>,
}

export default function Text({ variant, style, children }) {
    return (
        textVariants[variant] ?
            textVariants[variant](style, children) :
            textVariants.body(style, children)
    )
}
