import { useThemeContext } from '../../../contexts/ThemeContext';
import Text from '../../../components/Text';
import Button from '../../../components/Button';
import { useMediaQuery } from 'react-responsive';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines } from '@fortawesome/free-solid-svg-icons';
import { getResumeURL } from '../../../APIs';
import { aboutPageContent } from '../../../Texts';
import { useMemo } from 'react';

export default function Content() {
    const isMediumScreen = useMediaQuery({ query: '(max-width: 1124px)' });

    return (
        <div style={{
            textAlign: isMediumScreen ? "center" : "left",
        }}>
            <Salutation />
            <Name />
            <SeekingPhrase />
            <Position />
            <Description />
            <ResumeButton />
        </div>
    )
}

function Salutation() {
    return (
        <Text variant="body" style={{
            fontSize: "2.2rem",
        }}>
            {aboutPageContent.salutation}
        </Text>
    )
}

function Name() {
    const { theme } = useThemeContext();
    const textStyle = useMemo(() => {
        return {
            color: theme.colors.main.full,
            fontSize: "3.4rem",
            fontWeight: "800",
        }
    }, [theme]);

    return (
        <Text variant="body" style={textStyle}>
            {aboutPageContent.name}
        </Text>
    )
}

function SeekingPhrase() {
    return (
        <Text variant="h2">
            {aboutPageContent.seeking}
        </Text>
    )
}

function Position() {
    const { theme } = useThemeContext();
    const textStyle = useMemo(() => {
        return {
            color: theme.colors.dark.full,
            backgroundColor: theme.colors.main.full,
            padding: "0.25rem 0.5rem",
            display: "inline-block",
            marginTop: "0.5rem",
        }
    }, [theme]);

    return (
        <Text variant="h2" style={textStyle}>
            {aboutPageContent.position}
        </Text>
    )
}

function Description() {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            justifyContent: "center",
            marginTop: "1rem",
            gap: "0.5rem",
        }}>
            {aboutPageContent.description.split("\n").map((paragraph, index) => (
                <Text variant="body" key={paragraph.substring(0, 5)} style={{
                    fontSize: "1.1rem",
                }}>
                    {paragraph}
                </Text>
            ))}
        </div>
    )
}

function ResumeButton() {
    return (
        <Button
            icon={<FontAwesomeIcon icon={faFileLines} />}
            text={aboutPageContent.resume}
            pointer={true}
            onClick={() => {
                window.open(getResumeURL(), "_blank")
            }}
            style={{
                marginTop: "1rem",
            }} />
    )
}