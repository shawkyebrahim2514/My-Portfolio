import { CSSProperties, useMemo } from 'react'

type ContentProps = {
    readonly children: React.ReactNode,
}

export default function Content({ children }: ContentProps) {
    const mainStyle = useMemo((): CSSProperties => {
        return {
            display: "flex",
            justifyContent: "flex-start",
            gap: "1rem",
            alignItems: "stretch",
        }
    }, []);

    return (
        <main style={mainStyle}>
            <div style={{
                flexGrow: 1,
            }}>
                {children}
            </div>
        </main>
    )
}
