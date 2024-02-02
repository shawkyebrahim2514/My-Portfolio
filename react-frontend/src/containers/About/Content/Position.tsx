import { useThemeContext } from '../../../contexts/ThemeContext';
import Text from '../../../components/Text';
import { aboutPageContent } from '../../../Texts';
import { useMemo } from 'react';

export default function Position() {
    const { theme } = useThemeContext();
    const textStyle = useMemo(() => {
        return {
            color: theme.colors.dark.full,
            backgroundColor: theme.colors.main.full,
            padding: "0.25rem 0.5rem",
            display: "inline-block",
            marginTop: "0.5rem",
        }
    }, [theme]);

    return (
        <Text variant="h2" style={textStyle}>
            {aboutPageContent.position}
        </Text>
    )
}