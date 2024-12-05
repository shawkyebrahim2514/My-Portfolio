type ColorLevels = {
    0: string,
    50: string,
    100: string,
    200: string,
    300: string,
    400: string,
    500: string,
    600: string,
    700: string,
    800: string,
    900: string,
}

type Theme = {
    colors: {
        base: ColorLevels,
        secondary: ColorLevels,
        opacity: (percentage: number) => void
    },
    transition: string,
    borderRadius: string,
    boxShadow: string,
    backgroundImage: string,
    border: string,
    button: object,
    boxingStyle: object,
    container: object,
    buttonEffects: object,
};

type PortfolioPathes = "" | "skills" | "education" | "experience" | "projects" | "contacts";

export { type Theme, type PortfolioPathes }