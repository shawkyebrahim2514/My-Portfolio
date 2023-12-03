const textVariants = {
    h1: (style, onClick, children) =>
        <h1
            onClick={onClick}
            style={style}
        >{children}</h1>,
    h2: (style, onClick, children) =>
        <h2 onClick={onClick}
            style={style}
        >{children}</h2>,
    h3: (style, onClick, children) =>
        <h3 onClick={onClick}
            style={style}
        >{children}</h3>,
    h4: (style, onClick, children) =>
        <h4 onClick={onClick}
            style={style}
        >{children}</h4>,
    body: (style, onClick, children) =>
        <p onClick={onClick}
            style={style}
        >{children}</p>,
}

export default function Text({ variant, style, onClick, children }) {
    return (
        textVariants[variant] ?
            textVariants[variant](style, onClick, children) :
            textVariants.body(style, onClick, children)
    )
}
