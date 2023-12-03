import MainSection from '../../../components/MainSection'
import Text from '../../../components/Text'
import ListItems from '../../../components/ListItems'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { Context } from '../../../contexts/ThemeContext';
import { useContext } from 'react'
import ListButtons from '../../../components/ListButtons'

export default function ListExperiences({ list }) {
    const theme = useContext(Context);

    return (
        <>
            {list.map((experience, index) => {
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
        </>
    )
}
