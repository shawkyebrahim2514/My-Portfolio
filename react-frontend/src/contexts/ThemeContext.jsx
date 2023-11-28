import { createContext, useState } from 'react';
import backgroundImage from '../assets/background.svg';
const Context = createContext();

console.log("backgroundImage: ", backgroundImage);

const theme = {
    colors: {
        main: {
            full: "rgb(102, 204, 255)",
            faded: "rgb(102 204 255 / 5%)",
            percent: (percent) => `rgb(102 204 255 / ${percent}%)`
        },
        dark: {
            full: "rgb(0,31,63)",
            faded: "rgb(0 31 63 / 42%)",
            percent: (percent) => `rgb(0 31 63 / ${percent}%)`
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
};

theme.bluryStyle = {
    main: {
        backgroundColor: theme.colors.main.faded,
        backdropFilter: "blur(50px) brightness(115%)",
        border: `1px solid ${theme.colors.main.full}`
    },
    dark: {

    }
};

export default function ThemeContext({ children }) {
    const [themeContext, setThemeContext] = useState(theme);
    return (
        <Context.Provider value={themeContext}>
            {children}
        </Context.Provider>
    )
}

export { Context };