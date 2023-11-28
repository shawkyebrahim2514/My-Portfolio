import { Fragment, useContext, useEffect } from 'react'
import { Context } from '../../contexts/ThemeContext';
import ContainerWrap from '../../components/ContainerWrap'
import SectionTitle from '../../components/SectionTitle'
import MainSection from '../../components/MainSection'
import Button from '../../components/Button'
import Text from '../../components/Text'
import { useState } from 'react';
import { getInternships } from '../../APIs'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import ListItems from '../../components/ListItems';
import ListButtons from '../../components/ListButtons';


function Experience() {
    const theme = useContext(Context);
    const [experiences, setExperiences] = useState([]);

    useEffect(() => {
        // getInternships().then((result) => {

        // });

        let result = [
            {
                "description": "Successfully completed an intensive 1-month internship program in front-end development.\nAcquired expertise in fundamental web technologies, including HTML, CSS, JavaScript, and ES6.\nDeveloped a strong understanding of ReactJS, encompassing its core concepts, React Hooks, and React Routers, and applied this knowledge to create dynamic and responsive web applications.",
                "languages": [
                    "HTML",
                    "CSS",
                    "JavaScript",
                    "ReactJS",
                    "Material UI"
                ],
                "title": "Front-end Development Internship",
                "subTitle": "Information Technology Institute (ITI) - Online Internship",
                "rank": 0,
                "date": {
                    "from": "2023-08-08",
                    "to": "2023-09-12"
                },
                "link": "https://www.linkedin.com/posts/shawkyebrahim2514_iti-web-development-using-reactjs-certification-activity-7114214039420907522-2mBN?utm_source=share&utm_medium=member_desktop"
            }
        ];

        result = result.sort((element1, element2) => {
            return element2.rank - element1.rank;
        });

        let newState = []

        result.forEach((element) => {
            newState.push({
                description: element.description,
                title: element.title,
                subtitle: element.subTitle,
                technologies: element.languages,
                link: element.link,
                date: element.date,
            })
        })

        setExperiences(newState);
    }, []);

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            justifyContent: "center",
            gap: "2rem",
        }}>
            <SectionTitle
                highlightedText={"Internships & Training"}
                text={"I have taken"} />

            {experiences.map((experience, index) => {
                return (
                    <MainSection
                        key={experience.title}
                        title={experience.title}
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
                                    {experience.subtitle}
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
                                <ListItems
                                    elements={experience.description.split("\n")}
                                    icon={<FontAwesomeIcon icon={faAngleRight} />} />
                            </div>
                            <ListButtons elements={experience.technologies} />
                        </div>
                    </MainSection>
                )
            })}
        </div>
    )
}

export default ContainerWrap(Experience)
