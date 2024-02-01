import { useEffect, useState } from 'react';
import { getSkills } from '../../../APIs';
import { TechnologySkill, TechnologyCategory, SanitySkill } from '../../../Types';
import Loader from '../../../components/Loader';
import TechnologiesItems from './TechnologiesItems';

type StateTechnology = Record<TechnologyCategory, TechnologySkill[]>;

export default function Content() {
    const [technologies, setTechnologies] = useState<StateTechnology | null>(null);

    useEffect(() => {
        getSkills().then((result) => {
            result = sortResultFromSanity(result);
            let newState: StateTechnology = initiateStateTechnology();
            result.forEach((element) => {
                newState[element.categoryName].push(formatTechnologyItemFromSanity(element));
            })
            setTechnologies(newState)
        })
    }, [])

    return (
        <>
            {technologies ? <TechnologiesItems technologies={technologies} /> : <Loader />}
        </>
    )
}

function initiateStateTechnology(): StateTechnology {
    return {
        "General": [],
        "Frontend": [],
        "Backend": [],
        "Databases": [],
        "Tools": [],
    }
}

function sortResultFromSanity(result: SanitySkill[]): SanitySkill[] {
    return result.sort((element1, element2) => {
        return element1.rank - element2.rank;
    });
}

function formatTechnologyItemFromSanity(element: SanitySkill): TechnologySkill {
    return {
        iconURL: element.iconURL,
        name: element.name,
    }
}