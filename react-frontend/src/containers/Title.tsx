import { memo } from 'react';
import { CommonTitle } from '../Types';
import SectionTitle from '../components/SectionTitle';

function Content({ title, headingLevel }: Readonly<CommonTitle & { headingLevel?: 1 | 2 }>) {
    return (
        <SectionTitle
            headingLevel={headingLevel}
            highlightedText={title.highlightedText}
            text={title.subText}
        />
    );
}

export default memo(Content);
