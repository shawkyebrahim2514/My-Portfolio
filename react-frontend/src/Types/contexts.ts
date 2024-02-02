type Theme = {
    colors: {
        main: {
            full: string,
            faded: string,
            percent: (percent: number) => string
        },
        dark: {
            full: string,
            faded: string,
            percent: (percent: number) => string
        },
        contrastText: {
            full: string,
            faded: string
        }
    },
    transition: string,
    borderRadius: string,
    boxShadow: string,
    backgroundImage: string,
    bluryStyle: {
        main: {
            backgroundColor: string,
            backdropFilter: string,
            border: string
        },
        dark: {
            backgroundColor: string,
            backdropFilter: string,
            border: string
        }
    }
};

type PortfolioPages = "about" | "skills" | "education" | "experience" | "projects" | "contacts";

type Links = Record<PortfolioPages, boolean>;

export { type Theme, type Links }