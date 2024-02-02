import { useThemeContext } from '../../../contexts/ThemeContext';
import MainSection from '../../../components/MainSection'
import Text from '../../../components/Text'
import ListButtons from '../../../components/ListButtons'
import ListItems from '../../../components/ListItems'
import { Course } from '../../../Types';
import { CSSProperties, useMemo } from 'react';

type CoursesItemsProps = {
    readonly courses: Course[]
}

export default function CoursesItems({ courses }: CoursesItemsProps) {
    const courseSectionStyle = useMemo((): CSSProperties => ({
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
    }), []);

    return (
        <>
            {courses.map((course, index) => {
                return (
                    <MainSection key={course.name}>
                        <div style={courseSectionStyle}>
                            <CourseTitle courseName={course.name} />
                            <CourseContent courseDescription={course.description} />
                            {course.technologies && <ListButtons elements={course.technologies} />}
                        </div>
                    </MainSection>
                )
            })}
        </>
    )
}

function CourseTitle({ courseName }: { readonly courseName: string }) {
    const { theme } = useThemeContext();

    return (
        <Text variant={"h4"} style={{
            color: theme.colors.main.full,
        }}>
            {courseName}
        </Text>
    )
}

function CourseContent({ courseDescription }: { readonly courseDescription: string }) {
    return (
        <ListItems elements={courseDescription.split("\n")} />
    )
}
