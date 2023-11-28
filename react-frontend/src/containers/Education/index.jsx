import ContainerWrap from '../../components/ContainerWrap'
import SectionTitle from '../../components/SectionTitle'
import MainSection from '../../components/MainSection'
import Button from '../../components/Button'
import Text from '../../components/Text'
import { useContext, useEffect, useState } from 'react';
import { getEducationCourses } from '../../APIs'
import ListButtons from '../../components/ListButtons'
import { Context } from '../../contexts/ThemeContext';

function Contacts() {
    const theme = useContext(Context);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        // getEducationCourses().then((result) => {
        //     console.log(result);
        // });
        let result = [
            {
                "languages": [
                    "HTML",
                    "CSS",
                    "JavaScript",
                    "Django"
                ],
                "name": "Web Development",
                "rank": 5,
                "description": "Web Development"
            },
            {
                "name": "Software Engineering",
                "rank": 3,
                "description": "Software Engineering",
                "languages": [
                    "Java"
                ]
            },
            {
                "languages": [
                    "CPP"
                ],
                "name": "Data Structures",
                "rank": 4,
                "description": "Data Structures "
            },
            {
                "languages": [
                    "C#",
                    "SQL Server"
                ],
                "name": "Database",
                "rank": 6,
                "description": "Database"
            },
            {
                "description": "Structure Programming",
                "languages": [
                    "CPP"
                ],
                "name": "Structure Programming",
                "rank": 1
            },
            {
                "languages": [
                    "CPP"
                ],
                "name": "Object-Oriented Programming ",
                "rank": 2,
                "description": "Object-Oriented Programming "
            }
        ];

        result = result.sort((element1, element2) => {
            return element2.rank - element1.rank;
        });

        let newState = []

        result.forEach((element) => {
            newState.push({
                description: element.description,
                name: element.name,
                technolgoies: element.languages,
            })
        })

        setCourses(newState)
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
                highlightedText={"Education & Certifications"}
                text={"I have got"} />
            <MainSection
                title="Faculty of Computer and Artificial Intelligence - Cairo University"
                subtitle="BSc in Computer Science | GPA: 3.74">
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: "1rem",
                }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "1rem",
                        width: "100%",
                    }}>
                        <Text variant={"body"}>
                            From 6/2021 to 8/2025
                        </Text>
                        <Text variant={"body"}>
                            Giza, Egypt
                        </Text>
                    </div>
                    <Text variant={"body"} style={{
                        color: theme.colors.main.full,
                    }}>
                        Relevant Coursework
                    </Text>
                    {courses.map((course, index) => {
                        return (
                            <MainSection key={course.name}>
                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "0.5rem",
                                }}>
                                    <Text variant={"h4"}>
                                        {course.name}
                                    </Text>
                                    <Text variant={"body"}>
                                        {course.description}
                                    </Text>
                                    <ListButtons elements={course.technolgoies} />
                                </div>
                            </MainSection>
                        )
                    })}
                </div>
            </MainSection>
        </div>
    )
}

export default ContainerWrap(Contacts)
