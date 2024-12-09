import Text from '../../Text'
import { CSSProperties, useMemo } from 'react'
import { useThemeContext } from '../../../contexts/ThemeContext'

function ActualText({ text }: { readonly text: string }) {
    const { theme } = useThemeContext();
    const style = useMemo((): CSSProperties => ({
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "inherit",
        backgroundColor: theme.colors.secondary[300],
        padding: "10px 1.4rem",
    }), [theme.colors]);
    
    return (
        <div style={style}>
            <Text variant={"h2"}>{text}</Text>
        </div>
    );
}

export default ActualText;