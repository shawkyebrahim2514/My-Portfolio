/** @jsxImportSource @emotion/react */

import { useMediaQuery } from 'react-responsive';
import { CSSProperties, memo, useMemo } from 'react';
import { SanityAboutPage } from '../../../Types';
import { useThemeContext } from '../../../contexts/ThemeContext';
import HTMLMarkdown from '../../../components/HTMLMarkdown';

function Content({
    description,
}: Readonly<Omit<SanityAboutPage, 'personImage'>>) {
    const isMediumScreen = useMediaQuery({ query: '(max-width: 1124px)' });
    const { theme } = useThemeContext();
    const containerStyle = useMemo((): CSSProperties => ({
        fontSize: "1.2rem",
        color: theme.colors.base[800],
        textAlign: isMediumScreen ? "center" : "left",
    }), [isMediumScreen, theme.colors.base]);

    return (
        <div style={containerStyle}>
            <HTMLMarkdown markdown={description} />
        </div>
    )
}

export default memo(Content);
