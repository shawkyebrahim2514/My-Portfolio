import { useContext, useMemo } from 'react';
import Text from '../../../components/Text'
import { Context } from '../../../contexts/ThemeContext';
import ListCourses from './ListCourses';

export default function Content({ courses }) {
    const theme = useContext(Context);
    const containerStyle = useMemo(() => ({
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        gap: "1rem",
    }), []);

    return (
        <div style={containerStyle}>
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                width: "100%",
            }}>
                <Text variant={"body"}>
                    From 6/2021 to 8/2025
                </Text>
                <Text variant={"body"}>
                    Giza, Egypt
                </Text>
            </div>
            <Text variant={"body"} style={{
                color: theme.colors.main.full,
            }}>
                Relevant Coursework
            </Text>
            <ListCourses list={courses} />
        </div>
    )
}
