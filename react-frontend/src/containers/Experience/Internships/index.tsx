import { memo } from 'react';
import { SanityExperiencePage } from '../../../Types';
import Title from '../../Title';
import Content from './Content';

function Internships({
    internshipsSection,
}: Readonly<Pick<SanityExperiencePage, 'internshipsSection'>>) {
    return (
        <>
            <Title title={internshipsSection.title} headingLevel={2} />
            <Content internships={internshipsSection.internships} />
        </>
    );
}

export default memo(Internships);
