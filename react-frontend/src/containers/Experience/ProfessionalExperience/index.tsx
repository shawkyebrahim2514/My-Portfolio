import { memo } from 'react';
import { SanityExperiencePage } from '../../../Types';
import Title from '../../Title';
import Content from './Content';

function Internships({
    professionalExperienceSection,
}: Readonly<Pick<SanityExperiencePage, 'professionalExperienceSection'>>) {
    return (
        <>
            <Title title={professionalExperienceSection.title} headingLevel={2} />
            <Content
                professionalExperience={professionalExperienceSection.professionalExperience}
            />
        </>
    );
}

export default memo(Internships);
