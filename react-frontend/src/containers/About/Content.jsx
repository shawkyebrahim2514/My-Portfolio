import { useContext, useEffect, useState } from 'react'
import { Context } from '../../contexts/ThemeContext';
import Text from '../../components/Text';
import Button from '../../components/Button';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines } from '@fortawesome/free-solid-svg-icons';

const resumeURL = "https://drive.google.com/drive/folders/1yJmOWWaRQpM32haB8CeXCOzK0_WC6o59";

export default function Content({ isMediumScreen }) {
    const theme = useContext(Context);
    
    return (
        <div style={{
            textAlign: isMediumScreen ? "center" : "left",
        }}>
            <Text variant="body" style={{
                fontSize: "2.2rem",
            }}>
                As-salamu alaykum!
            </Text>
            <Text variant="body" style={{
                color: theme.colors.main.full,
                fontSize: "3.4rem",
                fontWeight: "800",
            }}>
                I'm Shawky Ebrahim
            </Text>
            <Text variant="h2">
                I'm looking for an internship in
            </Text>
            <Text variant="h2" style={{
                color: theme.colors.dark.full,
                backgroundColor: theme.colors.main.full,
                padding: "0.25rem 0.5rem",
                display: "inline-block",
                marginTop: "0.5rem",
            }}>
                Software Development
            </Text>
            <Text variant="body" style={{
                fontSize: "1.25rem",
                marginTop: "1rem",
            }}>
                Are you looking for an intern with a sense of humor and a love for coding?
            </Text>
            <Text variant="body" style={{
                fontSize: "1.25rem",
            }}>
                Lucky you! You've found the perfect match.
            </Text>
            <Button
                icon={<FontAwesomeIcon icon={faFileLines} />}
                text={"See My Resume"}
                pointer={true}
                onClick={() => {
                    window.open(resumeURL, "_blank")
                }}
                style={{
                    marginTop: "1rem",
                }} />
        </div>
    )
}
