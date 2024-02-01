import MainSection from '../../../components/MainSection'
import Text from '../../../components/Text'
import ListItems from '../../../components/ListItems'
import ListButtons from '../../../components/ListButtons'
import { getInternships } from '../../../APIs'
import { CSSProperties, useEffect, useMemo, useState } from 'react'
import { Internship } from '../../../Types'
import Loader from '../../../components/Loader';

export default function ListInternships() {
    const [experiences, setExperiences] = useState<Internship[] | null>(null);

    useEffect(() => {
        getInternships().then((result) => {
            result = result.sort((element1, element2) => {
                return element2.rank - element1.rank;
            });
            let newState: Internship[] = [];
            result.forEach((element) => {
                newState.push({
                    description: element.description,
                    title: element.title,
                    subTitle: element.subTitle,
                    technologies: element.technologies,
                    link: element.link,
                    date: element.date,
                })
            })
            setExperiences(newState);
        });
    }, []);

    return (
        <>
            {experiences ? <ExperiencesItems experiences={experiences} /> : <Loader />}
        </>
    )
}

function ExperiencesItems({ experiences }: { experiences: Internship[] }) {
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

function ExperienceItemInformation({ subTitle, date }: Pick<Internship, "subTitle" | "date">) {
    const containerStyle = useMemo((): CSSProperties => ({
        display: "flex",
        alignItems: "flex-start",
        flexDirection: "column",
        width: "fit-content",
        gap: "0.5rem",
    }), []);

    return (
        <div style={containerStyle}>
            <Text variant={"h4"}>
                {subTitle}
            </Text>
            <Text variant={"body"}>
                {formatDate({ date })}
            </Text>
        </div>
    )
}

function formatDate({ date }: Pick<Internship, "date">) {
    return `From: ${date.from} - To: ${date.to}`

}

function ExperienceItemDescription({ description }: Pick<Internship, "description">) {
    const containerStyle = useMemo((): CSSProperties => ({
        display: "flex",
        alignItems: "flex-start",
        flexDirection: "column",
        width: "fit-content",
        gap: "0.5rem",
    }), []);

    return (
        <div style={containerStyle}>
            <Text variant={"h4"}>
                Description
            </Text>
            <ListItems elements={description.split("\n")} />
        </div>
    )
}