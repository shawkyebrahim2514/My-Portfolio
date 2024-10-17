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
        backgroundColor: theme.colors.base,
        width: "100%",
        height: "100%",
    }), [theme.colors]);
    
    return (
        <div style={style}>
            <Text variant={"h2"}>{text}</Text>
        </div>
    );
}

export default ActualText;