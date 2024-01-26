import { useThemeContext } from '../../../contexts/ThemeContext';
import MainSection from '../../../components/MainSection'
import Text from '../../../components/Text'
import ListButtons from '../../../components/ListButtons'
import ListItems from '../../../components/ListItems'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { getEducationCourses } from '../../../APIs'
import { Course } from '../../../Types';
import { useEffect, useState } from 'react';

export default function ListCourses() {
    const [courses, setCourses] = useState<Course[]>([]);
    const { theme } = useThemeContext();

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
            {courses.map((course, index) => {
                return (
                    <MainSection key={course.name}>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.5rem",
                        }}>
                            <Text variant={"h4"} style={{
                                color: theme.colors.main.full,
                            }}>
                                {course.name}
                            </Text>
                            <ListItems
                                elements={course.description.split("\n")}
                                icon={<FontAwesomeIcon icon={faAngleRight} />} />
                            {course.technologies && <ListButtons elements={course.technologies} />}
                        </div>
                    </MainSection>
                )
            })}
        </>
    )
}
