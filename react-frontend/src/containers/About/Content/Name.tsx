import { useThemeContext } from '../../../contexts/ThemeContext';
import Text from '../../../components/Text';
import { memo, useMemo } from 'react';
import { SanityAboutPage } from '../../../Types';

function Name({ personName }: Readonly<Pick<SanityAboutPage, 'personName'>>) {
    const { theme } = useThemeContext();
    const textStyle = useMemo(() => {
        return {
            color: theme.colors.base[800],
            fontSize: "3.4rem",
            fontWeight: "800",
        }
    }, [theme.colors]);

    return (
        <Text variant="body" style={textStyle}>
            {personName}
        </Text>
    )
}

export default memo(Name);