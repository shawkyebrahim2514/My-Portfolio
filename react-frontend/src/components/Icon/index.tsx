/** @jsxImportSource @emotion/react */

import { CSSProperties, useCallback, useMemo } from 'react'
import { useThemeContext } from '../../contexts/ThemeContext';
import Text from '../Text';
import { css } from '@emotion/react';

const variants = {
    "lg": {
        outerPadding: "0.5rem 1rem",
        imageWidth: "70px",
        imageHeight: "70px",
        fontSize: "1rem",
    },
    "md": {
        outerPadding: "0.4rem 0.9rem",
        imageWidth: "50px",
        imageHeight: "50px",
        fontSize: "0.8rem",
    },
}

type IconProps = {
    readonly src?: string;
    readonly alt?: string;
    readonly text?: string;
    readonly pointer?: boolean;
    readonly onClick?: () => void;
    readonly size?: keyof typeof variants;
}

export default function Icon({
    src,
    alt,
    text,
    pointer = false,
    onClick,
    size = "md"
}: IconProps) {
    const { theme } = useThemeContext();
    const outerStyle = useMemo(() => css({
        flexDirection: "column",
        padding: variants[size].outerPadding,
        cursor: pointer ? "pointer" : "default",
        fontSize: variants[size].fontSize,
        ...theme.button,
    }), [theme, pointer, size]);
    const imageFrameStyle = useMemo((): CSSProperties => {
        return {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: variants[size].imageWidth,
            height: variants[size].imageHeight,
            borderRadius: "50%",
            backgroundColor: theme.colors.base[50],
            border: theme.border,
            overflow: "hidden",
            filter: "drop-shadow(0px 0px 2px rgba(0,0,0,0.2))",
        };
    }, [theme, size]);
    const imageStyle = useMemo((): CSSProperties => {
        return {
            width: "70%",
            objectFit: "cover",
            filter: "drop-shadow(0px 0px 2px rgba(0,0,0,0.5))",
        };
    }, []);
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter") {
            onClick?.();
        }
    }, [onClick]);

    return (
        <div
            css={outerStyle}
            onClick={onClick}
            onKeyDown={handleKeyDown} >
            <div style={imageFrameStyle}>
                <img style={imageStyle} src={src ?? "images/placeholder.png"} alt={alt} />
            </div>
            {text && <Text variant={"body"}>{text}</Text>}
        </div>
    )
}
