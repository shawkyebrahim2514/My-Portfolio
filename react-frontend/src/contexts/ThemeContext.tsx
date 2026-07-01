import { createContext, useContext, useMemo, useState } from 'react';
import backgroundImage from '../assets/background.svg';
import { ColorLevels, Theme } from '../Types';

type ThemeContextType = {
    theme: Theme,
    setTheme: React.Dispatch<React.SetStateAction<Theme>>
}

const Context = createContext<ThemeContextType | null>(null);

// Token values live in src/styles/tokens.css. The theme references them as
// CSS custom properties so JS-driven styles and *.module.css stay in sync.

const colorRamp = (name: "base" | "secondary"): ColorLevels =>
    ([0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const).reduce(
        (ramp, level) => ({ ...ramp, [level]: `var(--color-${name}-${level})` }),
        {} as ColorLevels
    );

const colors = {
    base: colorRamp("base"),
    secondary: colorRamp("secondary"),
    opacity: (percentage: number): string => `rgba(255,255,255,${percentage})`,
}

const themeProperties: Theme = {
    colors,
    transition: "var(--transition)",
    borderRadius: "var(--radius)",
    boxShadow: "var(--shadow)",
    backgroundImage: `url(${backgroundImage})`,
    border: "var(--border)",
    boxingStyle: {},
    button: {},
    container: {},
    buttonEffects: {},
};

themeProperties.boxingStyle = {
    border: themeProperties.border,
    borderRadius: themeProperties.borderRadius,
    boxShadow: themeProperties.boxShadow
}

themeProperties.container = {
    ...themeProperties.boxingStyle,
    display: "flex",
    gap: "1rem",
    padding: "1rem",
    placeItems: "stretch",
    backgroundColor: themeProperties.colors.base[50],
}

themeProperties.buttonEffects = {
    transition: themeProperties.transition,
    "&:hover": {
        transform: 'scale(1.05)',
    },
    "&:active": {
        transform: 'scale(0.95)',
        color: themeProperties.colors.base[200],
        backgroundColor: themeProperties.colors.base[600],
    },
}

themeProperties.button = {
    ...themeProperties.boxingStyle,
    display: "inline-flex",
    gap: "0.5rem",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: themeProperties.colors.base[50],
    color: themeProperties.colors.base[700],
    ...themeProperties.buttonEffects,
}

type ThemeContextProps = {
    readonly children: React.ReactNode
};

export default function ThemeContext({ children }: ThemeContextProps) {
    const [theme, setTheme] = useState(themeProperties);

    const contextValue = useMemo(() => {
        return {
            theme,
            setTheme
        }
    }, [theme]);

    return (
        <Context.Provider value={contextValue}>
            {children}
        </Context.Provider>
    )
}

function useThemeContext() {
    const result = useContext(Context);
    if (result == null) {
        throw Error("Error happened while creating the ThemeContext!")
    }
    return { ...result }
}

export { useThemeContext };