import MainSection from '../../../components/MainSection'
import Text from '../../../components/Text'
import ListItems from '../../../components/ListItems'
import { useThemeContext } from '../../../contexts/ThemeContext';
import ListButtons from '../../../components/ListButtons'
import { getInternships } from '../../../APIs'
import { useEffect, useState } from 'react'
import { Internship } from '../../../Types'

export default function ListInternships() {
    const [experiences, setExperiences] = useState<Internship[]>([]);
    const { theme } = useThemeContext();

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
            {experiences.map((experience, index) => {
                return (
                    <MainSection
                        key={experience.title}
                        title={experience.title}
                        link={experience.link}
                    >
                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "column",
                            gap: "1rem",
                        }}>
                            <div style={{
                                display: "flex",
                                alignItems: "flex-start",
                                flexDirection: "column",
                                width: "fit-content",
                                gap: "0.5rem",
                            }}>
                                <Text variant={"h4"}>
                                    {experience.subTitle}
                                </Text>
                                <Text variant={"body"}>
                                    From: {experience.date.from} - To: {experience.date.to}
                                </Text>
                            </div>
                            <div style={{
                                display: "flex",
                                alignItems: "flex-start",
                                flexDirection: "column",
                                width: "fit-content",
                                gap: "0.5rem",
                            }}>
                                <Text variant={"h4"} style={{
                                    color: theme.colors.main.full,
                                }}>
                                    Description
                                </Text>
                                <ListItems elements={experience.description.split("\n")} />
                            </div>
                            <ListButtons elements={experience.technologies} />
                        </div>
                    </MainSection>
                )
            })}
        </>
    )
}
