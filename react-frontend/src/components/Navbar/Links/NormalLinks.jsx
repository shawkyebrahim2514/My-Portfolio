import Button from '../../Button'
import { navigationControllerContext } from '../../../contexts/NavigationControllerContext';
import { useContext } from "react";
import { Context } from '../../../contexts/ThemeContext';

export default function NormalLinks() {
    const theme = useContext(Context);
    const [links, setLinks] = useContext(navigationControllerContext);

    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
        }}>
            {Object.entries(links).map(([linkName, linkActive]) => (
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
                            )
                        ))
                    }}
                    size={"lg"}
                    text={linkName} />
            ))}
        </div>
    )
}
