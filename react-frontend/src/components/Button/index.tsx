/** @jsxImportSource @emotion/react */

import { useCallback, useMemo } from 'react'
import { useThemeContext } from '../../contexts/ThemeContext';
import { css } from '@emotion/react';

const differentSizes = {
    sm: {
        fontSize: "0.8rem",
        padding: "0.25rem 0.5rem",
    },
    md: {
        fontSize: "1rem",
        padding: "0.35rem 0.6rem",
    },
    lg: {
        fontSize: "1rem",
        padding: "0.5rem 1rem",
    }
}

type ButtonProps = {
    readonly icon?: JSX.Element;
    readonly text?: string;
    readonly onClick?: () => void;
    readonly size?: keyof typeof differentSizes;
    readonly style?: React.CSSProperties;
    readonly pointer?: boolean;
}

export default function Button({ icon, text, onClick, size = "lg", style, pointer }: ButtonProps) {
    const { theme } = useThemeContext();
    const buttonStyle = useMemo(() => css({
        padding: differentSizes[size].padding,
        fontSize: differentSizes[size].fontSize,
        cursor: pointer ? "pointer" : "default",
        ...theme.button,
        ...style,
    }), [theme, size, style, pointer]);
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter") {
            onClick?.();
        }
    }, [onClick]);

    return (
        <div
            css={buttonStyle}
            onClick={onClick}
            onKeyDown={handleKeyDown} >
            {icon}
            {text}
        </div >
    )
}
