import CenteredSection from '../../../components/CenteredSection'
import ListIcons from './listIcons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { getSkills } from '../../../APIs';
import { TechnologySkill, TechnologyCategory } from '../../../Types';

type StateTechnology = Record<TechnologyCategory, TechnologySkill[]>;

export default function Content() {
    const [technologies, setTechnologies] = useState<StateTechnology>({
        "General": [],
        "Frontend": [],
        "Backend": [],
        "Databases": [],
        "Tools": [],
    });

    useEffect(() => {
        getSkills().then((result) => {
            result = result.sort((element1, element2) => {
                return element1.rank - element2.rank;
            });
            let newState: StateTechnology = {
                "General": [],
                "Frontend": [],
                "Backend": [],
                "Databases": [],
                "Tools": [],
            }
            result.forEach((element) => {
                newState[element.categoryName].push({
                    iconURL: element.iconURL,
                    name: element.name,
                })
            })
            setTechnologies(newState)
        })
    }, [])

    return (
        <>
            {Object.entries(technologies).map(([technologyTitle, technologyIcons]) => {
                return (
                    <CenteredSection
                        key={technologyTitle}
                        icon={<FontAwesomeIcon icon={faCode} size={"xl"} />}
                        title={technologyTitle}>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "1rem",
                            flexWrap: "wrap",
                        }}>
                            <ListIcons list={technologyIcons} />
                        </div>
                    </CenteredSection>
                )
            })}
        </>
    )
}
