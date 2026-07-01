import ListButtons from '../../../components/ListButtons'
import { memo } from 'react';
import { SanityEducationPage } from '../../../Types';
import HTMLMarkdown from '../../../components/HTMLMarkdown';
import MainSection from '../../../components/MainSection';
import surfaces from '../../../styles/surfaces.module.css';

function CoursesItems({ courses }: Readonly<Pick<SanityEducationPage["education"], "courses">>) {
    return (
        <>
            {courses.map((course, index) => {
                return (
                    <MainSection
                        key={course.description}>
                        <div className={surfaces.stack}>
                            <HTMLMarkdown markdown={course.description} />
                            {course.technologies && <ListButtons elements={course.technologies} />}
                        </div>
                    </MainSection>
                )
            })}
        </>
    )
}

export default memo(CoursesItems);