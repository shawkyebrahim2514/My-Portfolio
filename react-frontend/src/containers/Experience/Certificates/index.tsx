import { memo } from 'react';
import { SanityExperiencePage } from '../../../Types';
import Title from '../../Title';
import Content from './Content';

function Certificates({
    certificatesSection,
}: Readonly<Pick<SanityExperiencePage, 'certificatesSection'>>) {
    return (
        <>
            <Title title={certificatesSection.title} headingLevel={2} />
            <Content certificates={certificatesSection.certificates} />
        </>
    );
}

export default memo(Certificates);
