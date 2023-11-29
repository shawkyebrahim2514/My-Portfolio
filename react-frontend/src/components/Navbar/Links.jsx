import { useContext, useState } from "react";
import { Context } from '../../contexts/ThemeContext';
import Button from "../Button";
import { useMediaQuery } from 'react-responsive';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { motion } from "framer-motion"
import { navigationControllerContext } from '../../contexts/NavigationControllerContext';

export default function Links() {
    const theme = useContext(Context);
    const isMediumScreen = useMediaQuery({ query: '(max-width: 974px)' });
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [links, setLinks] = useContext(navigationControllerContext);

    return (
        <>
            {isMediumScreen ? (
                <>
                    <motion.div
                        style={{
                            display: "inline-block",
                            color: theme.colors.main.full,
                            cursor: "pointer",
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        animate={{
                            rotate: isMenuOpen ? 90 : 0,
                            opacity: isMenuOpen ? 1 : 0.5,
                        }}
                        onClick={() => setIsMenuOpen((oldIsMenuOpen) => !oldIsMenuOpen)}
                    >
                        <FontAwesomeIcon
                            icon={faBars}
                            size={"xl"}
                        />
                    </motion.div>
                    <div
                        style={{
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
                        }}>
                        {Object.entries(links).map(([linkName, linkActive]) => (
                            <Button
                                key={linkName}
                                style={{
                                    backgroundColor: linkActive ? theme.colors.main.percent(50) : theme.colors.main.faded,
                                    width: "80%",
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
                            size={"lg"}
                            text={linkName} />
                    ))}
                </div>
            )}
        </>
    )
}
