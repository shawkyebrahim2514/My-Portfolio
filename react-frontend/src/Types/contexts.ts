type Theme = {
    colors: {
        base: string,
        dark1: string,
        dark2: string,
        dark3: string,
        dark4: string,
        text: string,
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