import { useThemeContext } from '../../../contexts/ThemeContext';
import Text from '../../../components/Text';
import { aboutPageContent } from '../../../Texts';
import { memo, useMemo } from 'react';

function Name() {
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

export default memo(Name);