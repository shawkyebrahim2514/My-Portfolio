import { createContext, useContext, useMemo, useState } from 'react';
import backgroundImage from '../assets/background.svg';
import { Theme } from '../Types';

type ThemeContextType = {
    theme: Theme,
    setTheme: React.Dispatch<React.SetStateAction<Theme>>
}

const Context = createContext<ThemeContextType | null>(null);

const themeProperties: Theme = {
    colors: {
        main: {
            full: "rgb(102, 204, 255)",
            faded: "rgb(102 204 255 / 5%)",
            percent: (percent: number) => `rgb(102 204 255 / ${percent}%)`
        },
        dark: {
            full: "rgb(0,31,63)",
            faded: "rgb(0 31 63 / 42%)",
            percent: (percent: number) => `rgb(0 31 63 / ${percent}%)`
        },
        contrastText: {
            full: "rgb(255, 255, 255)",
            faded: "rgb(255 255 255 / 80%)"
        }
    },
    transition: "all 0.3s ease",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
    backgroundImage: `url(${backgroundImage})`,
    motion: {
        cardVariants: {
            offscreen: {
                x: -100,
            },
            onscreen: {
                x: 0,
                transition: {
                    type: "spring",
                    bounce: 0.4,
                    duration: 0.8
                }
            }
        }
    },
    bluryStyle: {
        main: {
            backgroundColor: '',
            backdropFilter: '',
            border: ''
        },
        dark: {
            backgroundColor: '',
            backdropFilter: '',
            border: ''
        }
    }
};

themeProperties.bluryStyle = {
    main: {
        backgroundColor: themeProperties.colors.main.faded,
        backdropFilter: "blur(50px) brightness(115%)",
        border: `1px solid ${themeProperties.colors.main.full}`
    },
    dark: {
        backgroundColor: '',
        backdropFilter: '',
        border: ''
    }
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