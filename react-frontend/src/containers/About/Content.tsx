import { useThemeContext } from '../../contexts/ThemeContext';
import Text from '../../components/Text';
import Button from '../../components/Button';
import { useMediaQuery } from 'react-responsive';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines } from '@fortawesome/free-solid-svg-icons';
import { getResumeURL } from '../../APIs';
import { aboutPageContent } from '../../Texts';

export default function Content() {
    const { theme } = useThemeContext();
    const isMediumScreen = useMediaQuery({ query: '(max-width: 1124px)' });

    return (
        <div style={{
            textAlign: isMediumScreen ? "center" : "left",
        }}>
            <Text variant="body" style={{
                fontSize: "2.2rem",
            }}>
                {aboutPageContent.salutation}
            </Text>
            <Text variant="body" style={{
                color: theme.colors.main.full,
                fontSize: "3.4rem",
                fontWeight: "800",
            }}>
                {aboutPageContent.name}
            </Text>
            <Text variant="h2">
                {aboutPageContent.seeking}
            </Text>
            <Text variant="h2" style={{
                color: theme.colors.dark.full,
                backgroundColor: theme.colors.main.full,
                padding: "0.25rem 0.5rem",
                display: "inline-block",
                marginTop: "0.5rem",
            }}>
                {aboutPageContent.position}
            </Text>
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
        </div>
    )
}
