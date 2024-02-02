import MainSection from '../../../components/MainSection'
import ListButtons from '../../../components/ListButtons'
import { CSSProperties, useMemo } from 'react'
import { Internship } from '../../../Types'
import ExperienceItemInformation from './ExperienceItemInformation'
import ExperienceItemDescription from './ExperienceItemDescription'

type ExperiencesItemsProps = {
    readonly experiences: Internship[]
}

export default function ExperiencesItems({ experiences }: ExperiencesItemsProps) {
    const containerStyle = useMemo((): CSSProperties => ({
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        gap: "1rem",
    }), []);

    return (
        <>
            {experiences.map((experience, index) => {
                return (
                    <MainSection
                        key={experience.title}
                        title={experience.title}
                        link={experience.link} >
                        <div style={containerStyle}>
                            <ExperienceItemInformation subTitle={experience.subTitle} date={experience.date} />
                            <ExperienceItemDescription description={experience.description} />
                            <ListButtons elements={experience.technologies} />
                        </div>
                    </MainSection>
                )
            })}
        </>
    )
}