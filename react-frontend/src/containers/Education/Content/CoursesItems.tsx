import ListButtons from '../../../components/ListButtons'
import { memo } from 'react';
import { SanityEducationPage } from '../../../Types';
import RichContent from '../../../components/RichContent';
import MainSection from '../../../components/MainSection';
import surfaces from '../../../styles/surfaces.module.css';

function CoursesItems({ courses }: Readonly<Pick<SanityEducationPage["education"], "courses">>) {
    return (
        <>
            {courses.map((course, index) => {
                return (
                    <MainSection
                        key={index}>
                        <div className={surfaces.stack}>
                            <RichContent value={course.description} />
                            {course.technologies && <ListButtons elements={course.technologies} />}
                        </div>
                    </MainSection>
                )
            })}
        </>
    )
}

export default memo(CoursesItems);