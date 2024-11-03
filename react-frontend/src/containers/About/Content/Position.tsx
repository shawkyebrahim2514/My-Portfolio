import { useThemeContext } from '../../../contexts/ThemeContext';
import Text from '../../../components/Text';
import { CSSProperties, memo, useMemo } from 'react';
import { SanityAboutPage } from '../../../Types';

function Position({ position }: Readonly<Pick<SanityAboutPage, 'position'>>) {
    const { theme } = useThemeContext();
    const textStyle = useMemo((): CSSProperties => {
        return {
            position: "relative",
            color: theme.colors.base[800],
            // backgroundColor: theme.colors.secondary[300],
            padding: "0.25rem 0.5rem",
            display: "inline-block",
            marginTop: "0.5rem",
        }
    }, [theme.colors]);
    const lightEffectStyle = useMemo((): CSSProperties => ({
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: theme.colors.secondary[300],
        height: "40%",
        zIndex: -1,
    }), []);

    return (
        <Text variant="h2" style={textStyle}>
            <div style={lightEffectStyle}></div>
            {position}
        </Text>
    )
}

export default memo(Position);