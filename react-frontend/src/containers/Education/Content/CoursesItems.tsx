import ListButtons from '../../../components/ListButtons'
import { CSSProperties, memo, useMemo } from 'react';
import { SanityEducationPage } from '../../../Types';
import HTMLMarkdown from '../../../components/HTMLMarkdown';
import MainSection from '../../../components/MainSection';

function CoursesItems({ courses }: Readonly<Pick<SanityEducationPage["education"], "courses">>) {
    const innerStyle = useMemo((): CSSProperties => ({
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
    }), []);

    return (
        <>
            {courses.map((course, index) => {
                return (
                    <MainSection
                        key={course.description}>
                        <div style={innerStyle}>
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