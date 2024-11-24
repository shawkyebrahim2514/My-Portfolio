const UlMarkdown = ({ ...props }: React.HTMLAttributes<HTMLUListElement>) => {
    return (
        <ul {...props}
            style={{
                ...props.style,
                listStyleType: "none"
            }} />
    )
}

export default UlMarkdown