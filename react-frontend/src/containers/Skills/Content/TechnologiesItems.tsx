import CenteredSection from '../../../components/CenteredSection'
import ListIcons from './listIcons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from '@fortawesome/free-solid-svg-icons';
import { CSSProperties, useMemo } from 'react';
import { TechnologySkill, TechnologyCategory } from '../../../Types';

type StateTechnology = Record<TechnologyCategory, TechnologySkill[]>;

type TechnologiesItemsProps = {
    readonly technologies: StateTechnology
}

export default function TechnologiesItems({ technologies }: TechnologiesItemsProps) {
    const listItemsContainerStyle = useMemo((): CSSProperties => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        flexWrap: "wrap",
    }), []);

    return (
        <>
            {Object.entries(technologies).map(([technologyTitle, technologyIcons]) => {
                return (
                    <CenteredSection
                        key={technologyTitle}
                        icon={<HeaderIcon />}
                        title={technologyTitle} >
                        <div style={listItemsContainerStyle}>
                            <ListIcons list={technologyIcons} />
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