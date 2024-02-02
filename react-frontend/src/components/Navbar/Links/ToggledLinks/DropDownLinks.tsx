import { CSSProperties, useCallback, useMemo } from "react";
import { useThemeContext } from '../../../../contexts/ThemeContext';
import Button from '../../../Button';
import { useNavigationControllerContext } from '../../../../contexts/NavigationControllerContext';
import { Links } from "../../../../Types";

type DropDownLinksProps = {
    readonly isMenuOpen: boolean,
    readonly setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function DropDownLinks({ isMenuOpen, setIsMenuOpen }: DropDownLinksProps) {
    const { theme } = useThemeContext();
    const { links, setLinks } = useNavigationControllerContext();
    const linksContainerStyle = useMemo((): CSSProperties => ({
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        padding: isMenuOpen ? "1rem 0 0.5rem" : "0",
        width: "100%",
        transition: theme.transition,
        overflow: "hidden",
        transform: isMenuOpen ? "scaleY(1)" : "scaleY(0)",
        transformOrigin: "top",
        height: isMenuOpen ? "100%" : "0",
    }), [isMenuOpen, theme.transition]);
    const linkButtonStyle = useCallback((linkActive: boolean): CSSProperties => ({
        backgroundColor: linkActive ? theme.colors.main.percent(50) : theme.colors.main.faded,
        width: "80%",
    }), [theme.colors.main]);
    const linkButtonClickHandler = useCallback((linkName: string) => {
        setIsMenuOpen(false);
        setLinks((oldLinks) => (
            Object.fromEntries(
                Object.entries(oldLinks).map(([oldLinkName]) => (
                    [oldLinkName, oldLinkName === linkName]
                ))
            ) as Links
        ))
    }, [setLinks, setIsMenuOpen]);

    return (
        <div style={linksContainerStyle}>
            {Object.entries(links).map(([linkName, linkActive]) => (
                <Button
                    key={linkName}
                    style={linkButtonStyle(linkActive)}
                    pointer={true}
                    onClick={() => linkButtonClickHandler(linkName)}
                    text={createLinkButtonText(linkName)} />
            ))}
        </div>
    )
}

function createLinkButtonText(linkName: string) {
    return linkName.charAt(0).toUpperCase() + linkName.slice(1);
}