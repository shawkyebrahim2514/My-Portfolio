import { Context } from '../../../contexts/ThemeContext';
import { useContext } from 'react';
import MainSection from '../../../components/MainSection'
import Text from '../../../components/Text'
import ListButtons from '../../../components/ListButtons'
import ListItems from '../../../components/ListItems'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'

export default function ListCourses({ list }) {
    const theme = useContext(Context);
    return (
        <>
            {list.map((course, index) => {
                return (
                    <MainSection key={course.name}>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.5rem",
                        }}>
                            <Text variant={"h4"} style={{
                                color: theme.colors.main.full,
                            }}>
                                {course.name}
                            </Text>
                            {/* <Text variant={"body"}>
                                {course.description}
                            </Text> */}
                            <ListItems
                                elements={course.description.split("\n")}
                                icon={<FontAwesomeIcon icon={faAngleRight} />} />
                            <ListButtons elements={course.technolgoies} />
                        </div>
                    </MainSection>
                )
            })}
        </>
    )
}
