import { useContext, useState } from "react";
import { Context } from '../../contexts/ThemeContext';
import Button from "../Button";
import { useMediaQuery } from 'react-responsive';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from '@fortawesome/free-solid-svg-icons';

export default function Links({ links, setLinks }) {
    const theme = useContext(Context);
    const isMediumScreen = useMediaQuery({ query: '(max-width: 974px)' });
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            {isMediumScreen ? (
                <>
                    <FontAwesomeIcon
                        icon={faBars}
                        size={"xl"}
                        onClick={() => setIsMenuOpen((oldIsMenuOpen) => !oldIsMenuOpen)}
                        style={{
                            cursor: "pointer",
                            color: isMenuOpen ? theme.colors.main.percent(100) : theme.colors.main.percent(50),
                            transition: theme.transition,
                        }} />
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "1rem",
                            padding: isMenuOpen ? "1rem 0 0" : "0",
                            width: "100%",
                            transition: theme.transition,
                            overflow: "hidden",
                            transform: isMenuOpen ? "scaleY(1)" : "scaleY(0)",
                            transformOrigin: "top",
                            height: isMenuOpen ? "100%" : "0",
                        }}>
                        {Object.entries(links).map(([linkName, linkActive]) => (
                            <Button
                                key={linkName}
                                style={{
                                    backgroundColor: linkActive ? theme.colors.main.percent(50) : theme.colors.main.faded,
                                    width: "100%",
                                }}
                                pointer={true}
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    setLinks((oldLinks) => (
                                        Object.fromEntries(
                                            Object.entries(oldLinks).map(([oldLinkName, oldLinkActive]) => (
                                                [oldLinkName, oldLinkName === linkName]
                                            ))
                                        )
                                    ))
                                }}
                                text={linkName} />
                        ))}
                    </div>
                </>
            ) : (
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
                            text={linkName} />
                    ))}
                </div>
            )}
        </>
    )
}
