import { useThemeContext } from '../../../contexts/ThemeContext';
import MainSection from '../../../components/MainSection'
import Text from '../../../components/Text'
import ListButtons from '../../../components/ListButtons'
import ListItems from '../../../components/ListItems'
import { getEducationCourses } from '../../../APIs'
import { Course } from '../../../Types';
import { CSSProperties, useEffect, useMemo, useState } from 'react';
import Loader from '../../../components/Loader';

export default function ListCourses() {
    const [courses, setCourses] = useState<Course[] | null>(null);

    useEffect(() => {
        getEducationCourses().then((result) => {
            result = result.sort((element1, element2) => {
                return element2.rank - element1.rank;
            });
            let newState: Course[] = []
            result.forEach((element) => {
                newState.push({
                    description: element.description,
                    name: element.name,
                    technologies: element.technologies,
                })
            })
            setCourses(newState);
        });
    }, []);

    return (
        <>
            {courses ? <CoursesItems courses={courses} /> : <Loader />}
        </>
    )
}

function CoursesItems({ courses }: { readonly courses: Course[] }) {
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
