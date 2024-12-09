import { CSSProperties, useMemo } from 'react'
import { useThemeContext } from '../../../contexts/ThemeContext';
import ActualText from './ActualText';
import Shadow from './Shadow';
import Stroke from './Stroke';

function TitleHighlightedText({ children }: { readonly children: string }) {
    const { theme } = useThemeContext();
    const outerStyle = useMemo((): CSSProperties => {
        return {
            color: theme.colors.base[900],
            boxShadow: theme.boxShadow,
            position: "relative",
            rotate: "-3deg",
            zIndex: "1",
            borderRadius: theme.borderRadius
        };
    }, [theme]);

    return (
        <div style={outerStyle}>
            <Stroke />
            <Shadow />
            <ActualText text={children} />
        </div>
    );
}

export default TitleHighlightedText;