import { useThemeContext } from '../../../contexts/ThemeContext';

export default function BackShape() {
    const { theme } = useThemeContext();

    return (
        <div style={{
            width: "inherit",
            height: "inherit",
            position: "absolute",
            borderRadius: "50%",
            zIndex: "1",
            scale: "1.1",
            border: `3px solid ${theme.colors.base[700]}`,
        }} />
    )
}
