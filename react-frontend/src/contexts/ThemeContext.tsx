import { createContext, useContext, useMemo, useState } from 'react';
import backgroundImage from '../assets/background.svg';
import { Theme } from '../Types';

type ThemeContextType = {
    theme: Theme,
    setTheme: React.Dispatch<React.SetStateAction<Theme>>
}

const Context = createContext<ThemeContextType | null>(null);

/* Blue (Normal)
        base: "#42afd1",
        dark1: "#163c5b",
        dark2: "#13334e",
        dark3: "#0f2940",
        dark4: "#0c2033",
        text: '#f3fcff', 
*/

/* Blue green (The second best)
        base: "#51a9c4",
        dark1: "#20424f",
        dark2: "#19343f",
        dark3: "#13262e",
        dark4: "#0c181e",
        text: '#f8feff',
*/


const themeProperties: Theme = {
    colors: {
        base: "#51a9c4",
        dark1: "#20424f",
        dark2: "#19343f",
        dark3: "#13262e",
        dark4: "#0c181e",
        text: '#f5fdff',
    },
    transition: "all 0.3s ease-out",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
    backgroundImage: `url(${backgroundImage})`,
    border: '',
    boxingStyle: {},
    button: {},
    container: {},
    buttonEffects: {},
};

themeProperties.border = `1px solid ${themeProperties.colors.base}`;

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
    backgroundColor: themeProperties.colors.dark3,
}

themeProperties.buttonEffects = {
    transition: themeProperties.transition,
    "&:hover": {
        transform: 'scale(1.05)',
    },
    "&:active": {
        transform: 'scale(0.95)',
        backgroundColor: themeProperties.colors.dark4,
    },
}

themeProperties.button = {
    ...themeProperties.boxingStyle,
    display: "inline-flex",
    gap: "0.5rem",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: themeProperties.colors.dark3,
    color: themeProperties.colors.base,
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