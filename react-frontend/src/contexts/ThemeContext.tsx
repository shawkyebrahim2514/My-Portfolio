import { createContext, useContext, useMemo, useState } from 'react';
import backgroundImage from '../assets/background.svg';
import { Theme } from '../Types';

type ThemeContextType = {
    theme: Theme,
    setTheme: React.Dispatch<React.SetStateAction<Theme>>
}

const Context = createContext<ThemeContextType | null>(null);

// Colors generate from: https://accessiblepalette.com/?lightness=98.2,93.95,85.1,76.5,67.65,57,47,40.4,24,16&5DACC9=1,0&f2f3ea=1,0

const colors = {
    base: {
        0: "#FFFFFF",
        50: "#FAFAF6",
        100: "#EDEEE6",
        200: "#D4D5CD",
        300: "#BDBDB6",
        400: "#A5A59F",
        500: "#898984",
        600: "#6F706C",
        700: "#5F5F5C",
        800: "#393937",
        900: "#282827",
    },
    secondary: {
        0: "#FFFFFF",
        50: "#FDF9F7",
        100: "#F8EBE4",
        200: "#EDCFBC",
        300: "#E2B395",
        400: "#D7966D",
        500: "#B97A52",
        600: "#976443",
        700: "#815539",
        800: "#4E3322",
        900: "#362418",
    },
    opacity: (percentage: number) => `rgba(255,255,255,${percentage})`,
}

const themeProperties: Theme = {
    colors,
    transition: "all 0.3s ease-out",
    borderRadius: "8px",
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
    backgroundImage: `url(${backgroundImage})`,
    border: '',
    boxingStyle: {},
    button: {},
    container: {},
    buttonEffects: {},
};

themeProperties.border = `1px solid ${themeProperties.colors.base[50]}`;

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
    color: themeProperties.colors.base[600],
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