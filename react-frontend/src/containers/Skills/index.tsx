import ContainerWrap from '../../components/ContainerWrap'
import Content from './Content';
import { CSSProperties, useEffect, useMemo, useState } from 'react';
import { SanitySkillsPage } from '../../Types';
import { getSkillsPage } from '../../APIs';
import Title from '../Title';
import Loader from '../../components/Loader';

function Skills() {
    const [skillsPage, setSkillsPage] = useState<SanitySkillsPage | null>(null);
    const containerStyle = useMemo((): CSSProperties => ({
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "center",
        gap: "2rem",
    }), []);

    useEffect(() => {
        getSkillsPage().then((result) => {
            setSkillsPage(result)
        })
    }, [])

    return (
        <>
            {skillsPage ? (
                <div style={containerStyle}>
                    <Title title={skillsPage.title} />
                    <Content categories={skillsPage.categories} />
                </div>
            ) : <Loader />}
        </>
    )
}

export default ContainerWrap(Skills)