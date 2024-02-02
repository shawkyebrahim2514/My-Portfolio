import { getEducationCourses } from '../../../APIs'
import { Course, SanityEducationCourse } from '../../../Types';
import { useEffect, useState } from 'react';
import Loader from '../../../components/Loader';
import CoursesItems from './CoursesItems';

export default function ListCourses() {
    const [courses, setCourses] = useState<Course[] | null>(null);

    useEffect(() => {
        getEducationCourses().then((result) => {
            result = sortResultFromSanity(result);
            let newState: Course[] = []
            result.forEach((element) => {
                newState.push(formatCourseFromSanity(element));
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

function sortResultFromSanity(result: SanityEducationCourse[]): SanityEducationCourse[] {
    return result.sort((element1, element2) => {
        return element2.rank - element1.rank;
    });
}

function formatCourseFromSanity(course: any): Course {
    return {
        description: course.description,
        name: course.name,
        technologies: course.technologies,
    }
}