import { useThemeContext } from '../../../contexts/ThemeContext';
import Text from '../../../components/Text';
import { aboutPageContent } from '../../../Texts';
import { useMemo } from 'react';

export default function Name() {
    const { theme } = useThemeContext();
    const textStyle = useMemo(() => {
        return {
            color: theme.colors.main.full,
            fontSize: "3.4rem",
            fontWeight: "800",
        }
    }, [theme]);

    return (
        <Text variant="body" style={textStyle}>
            {aboutPageContent.name}
        </Text>
    )
}
