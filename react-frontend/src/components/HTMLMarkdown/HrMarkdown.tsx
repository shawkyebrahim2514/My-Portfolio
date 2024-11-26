import { useMemo } from 'react';
import { useThemeContext } from '../../contexts/ThemeContext';

const HrMarkdown = ({ ...props }: React.HTMLAttributes<HTMLHRElement>) => {
    const { theme } = useThemeContext();
    const elementStyle = useMemo(() => ({
        margin: "1rem 0",
        backgroundColor: theme.colors.base[200],
        height: "1px",
    }), []);
    return (
        <div {...props} style={{
            ...props.style,
            ...elementStyle,
        }} />
    )
}

export default HrMarkdown