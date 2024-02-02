import { CSSProperties, useMemo } from 'react';
import ListCourses from './ListCourses';
import EducationInformation from './EducationInformation';

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