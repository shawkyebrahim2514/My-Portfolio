import Button from '../../Button'
import { useNavigationControllerContext } from '../../../contexts/NavigationControllerContext';
import { useThemeContext } from '../../../contexts/ThemeContext';
import { Links } from '../../../Types';
import { useCallback, useMemo } from 'react';

export default function NormalLinks() {
    const { theme } = useThemeContext();
    const { links, setLinks } = useNavigationControllerContext();
    const linksContainerStyle = useMemo(() => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
    }), []);
    const linkButtonStyle = useCallback((linkActive: boolean) => ({
        backgroundColor: linkActive ? theme.colors.main.percent(50) : theme.colors.main.faded
    }), [theme.colors.main]);
    const linkButtonClickHandler = useCallback((linkName: string) => {
        setLinks((oldLinks) => (
            Object.fromEntries(
                Object.entries(oldLinks).map(([oldLinkName]) => (
                    [oldLinkName, oldLinkName === linkName]
                ))
            ) as Links
        ))
    }, [setLinks]);

    return (
        <div style={linksContainerStyle}>
            {links && Object.entries(links).map(([linkName, linkActive]) => (
                <Button
                    key={linkName}
                    style={linkButtonStyle(linkActive)}
                    pointer={true}
                    onClick={() => linkButtonClickHandler(linkName)}
                    size={"lg"}
                    text={createLinkButtonText(linkName)} />
            ))}
        </div>
    )
}

function createLinkButtonText(linkName: string) {
    return linkName.charAt(0).toUpperCase() + linkName.slice(1);
}