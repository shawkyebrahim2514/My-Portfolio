import { CSSProperties, useMemo } from 'react';
import { SanityAboutPage } from '../../../Types';
import { useThemeContext } from '../../../contexts/ThemeContext';

export default function ActualImage({ personImage }: Readonly<Pick<SanityAboutPage, 'personImage'>>) {
    const { theme } = useThemeContext();
    const imageFrameStyle = useMemo((): CSSProperties => ({
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        overflow: "hidden",
        position: "absolute",
        boxShadow: theme.boxShadow,
        top: "0",
        left: "0",
        zIndex: "2",
        border: `3px solid ${theme.colors.base[50]}`,
    }), [theme]);
    const imageStyle = useMemo((): CSSProperties => ({
        width: "100%",
        height: "100%",
        objectFit: "cover",
    }), []);

    return (
        <div style={imageFrameStyle}>
            <img src={personImage}
                alt="Shawky Ebrahim"
                style={imageStyle} />
        </div>
    )
}
