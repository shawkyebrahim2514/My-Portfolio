import { CSSProperties, useMemo } from 'react';
import { SanitySkillsPage } from '../../../Types';
import CenteredSection from '../../../components/CenteredSection';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from '@fortawesome/free-solid-svg-icons';
import SkillsIcons from './SkillsIcons';

export default function Content({ categories }: Readonly<Pick<SanitySkillsPage, "categories">>) {
    const listItemsContainerStyle = useMemo((): CSSProperties => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        flexWrap: "wrap",
    }), []);

    return (
        <>
            {categories.map((category) => {
                return (
                    <CenteredSection
                        key={category.title}
                        icon={<HeaderIcon />}
                        title={category.title} >
                        <div style={listItemsContainerStyle}>
                            <SkillsIcons skills={category.skills} />
                        </div>
                    </CenteredSection>
                )
            })}
        </>
    )
}

function HeaderIcon() {
    return (
        <FontAwesomeIcon icon={faCode} size={"xl"} />
    )
}