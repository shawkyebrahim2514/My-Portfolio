import { CSSProperties, useMemo } from 'react';
import Text from '../../../components/Text'
import { useThemeContext } from '../../../contexts/ThemeContext';
import ListCourses from './ListCourses';
import { educationPageContent } from '../../../Texts';

export default function Content() {
    const containerStyle = useMemo((): CSSProperties => ({
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        gap: "1rem",
    }), []);

    return (
        <div style={containerStyle}>
            <EducationInformation />
            <ListCourses />
        </div>
    )
}

function EducationInformation() {
    const { theme } = useThemeContext();

    return (
        <>
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                width: "100%",
            }}>
                <Text variant={"body"}>
                    {educationPageContent.college.fullDate}
                </Text>
                <Text variant={"body"}>
                    {educationPageContent.college.location}
                </Text>
            </div>
            <Text variant={"body"} style={{
                color: theme.colors.main.full,
            }}>
                Relevant Coursework
            </Text>
        </>
    )
}