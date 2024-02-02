import { CSSProperties, useMemo } from 'react';
import Text from '../../../components/Text'
import { useThemeContext } from '../../../contexts/ThemeContext';
import { educationPageContent } from '../../../Texts';

export default function EducationInformation() {
    return (
        <>
            <FullDataAndLocation />
            <RelevantCourseworkTitle />
        </>
    )
}

function FullDataAndLocation() {
    const containerStyle = useMemo((): CSSProperties => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        width: "100%",
    }), []);

    return (
        <div style={containerStyle}>
            <Text variant={"body"}>
                {educationPageContent.college.fullDate}
            </Text>
            <Text variant={"body"}>
                {educationPageContent.college.location}
            </Text>
        </div>
    )
}

function RelevantCourseworkTitle() {
    const { theme } = useThemeContext();
    const titleStyle = useMemo((): CSSProperties => ({
        color: theme.colors.main.full,
    }), [theme.colors.main]);

    return (
        <Text variant={"body"} style={titleStyle}>
            Relevant Coursework
        </Text>
    )
}