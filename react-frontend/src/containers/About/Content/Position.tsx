import { useThemeContext } from '../../../contexts/ThemeContext';
import Text from '../../../components/Text';
import { memo, useMemo } from 'react';
import { SanityAboutPage } from '../../../Types';

function Position({ position }: Readonly<Pick<SanityAboutPage, 'position'>>) {
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
            {position}
        </Text>
    )
}

export default memo(Position);