import { getInternships } from '../../../APIs'
import { useEffect, useState } from 'react'
import { Internship, SanityInternship } from '../../../Types'
import Loader from '../../../components/Loader';
import ExperiencesItems from './ExperiencesItems'

export default function ListInternships() {
    const [experiences, setExperiences] = useState<Internship[] | null>(null);

    useEffect(() => {
        getInternships().then((result) => {
            result = sortResultFromSanity(result);
            let newState: Internship[] = [];
            result.forEach((element) => {
                newState.push(formatInternshipFromSanity(element));
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

function sortResultFromSanity(result: SanityInternship[]): SanityInternship[] {
    return result.sort((element1, element2) => {
        return element2.rank - element1.rank;
    });
}

function formatInternshipFromSanity(internship: SanityInternship): Internship {
    return {
        description: internship.description,
        title: internship.title,
        subTitle: internship.subTitle,
        technologies: internship.technologies,
        link: internship.link,
        date: internship.date,
    }
}