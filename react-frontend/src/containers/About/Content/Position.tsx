import { useThemeContext } from '../../../contexts/ThemeContext';
import Text from '../../../components/Text';
import { aboutPageContent } from '../../../Texts';
import { memo, useMemo } from 'react';

function Position() {
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

export default memo(Position);