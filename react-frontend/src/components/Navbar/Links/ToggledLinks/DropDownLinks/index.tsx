import { CSSProperties, useCallback, useMemo } from "react";
import { useThemeContext } from '../../../../../contexts/ThemeContext';
import PortfolioLinks from "../../PortfolioLinks";
import BlurBackground from "../../../../BlurBackground";
import ExitButton from "./ExitButton";

type DropDownLinksProps = {
    readonly isMenuOpen: boolean,
    readonly setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function DropDownLinks({ isMenuOpen, setIsMenuOpen }: DropDownLinksProps) {
    const { theme } = useThemeContext();
    const linksContainerStyle = useMemo((): CSSProperties => ({
        position: "fixed",
        top: "0",
        right: "0",
        left: isMenuOpen ? "0" : "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "1rem",
        padding: "2rem",
        width: "100%",
        overflow: "hidden",
        transformOrigin: "top",
        transition: theme.transition,
        height: '100%',
    }), [isMenuOpen, theme]);
    const linkButtonOnClickHandler = useCallback(() => {
        setIsMenuOpen(false);
    }, [setIsMenuOpen]);

    return (
        <div style={linksContainerStyle}>
            <BlurBackground backgroundColor={theme.colors.dark4} />
            <ExitButton setIsMenuOpen={setIsMenuOpen} />
            <PortfolioLinks
                linkButtonOnClickHandler={linkButtonOnClickHandler} />
        </div>
    )
}