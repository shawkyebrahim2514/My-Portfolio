import Button from '../../Button'
import { useNavigationControllerContext } from '../../../contexts/NavigationControllerContext';
import { useThemeContext } from '../../../contexts/ThemeContext';
import { Links } from '../../../Types';

export default function NormalLinks() {
    const { theme } = useThemeContext();
    const { links, setLinks } = useNavigationControllerContext();

    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
        }}>
            {links && Object.entries(links).map(([linkName, linkActive]) => (
                <Button
                    key={linkName}
                    style={{
                        backgroundColor: linkActive ? theme.colors.main.percent(50) : theme.colors.main.faded,
                    }}
                    pointer={true}
                    onClick={() => {
                        setLinks((oldLinks) => (
                            Object.fromEntries(
                                Object.entries(oldLinks).map(([oldLinkName, oldLinkActive]) => (
                                    [oldLinkName, oldLinkName === linkName]
                                ))
                            ) as Links
                        ))
                    }}
                    size={"lg"}
                    text={
                        linkName.charAt(0).toUpperCase() + linkName.slice(1)
                    } />
            ))}
        </div>
    )
}
