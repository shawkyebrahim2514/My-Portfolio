import { CSSProperties, useEffect, useMemo, useState } from 'react'
import ContainerWrap from '../../components/ContainerWrap';
import { SanityProjectsPage } from '../../Types';
import { getProjectsPage } from '../../APIs';
import Loader from '../../components/Loader';
import Title from '../Title';
import Content from './Content';

function Projects() {
    const [projects, setProjects] = useState<SanityProjectsPage | null>(null);
    const containerStyle = useMemo((): CSSProperties => ({
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "center",
        gap: "2rem",
    }), []);

    useEffect(() => {
        getProjectsPage().then((result) => {
            setProjects(result);
        })
    }, []);

    return (
        <>
            {projects ? (
                <div style={containerStyle}>
                    <Title title={projects.title} />
                    <Content projects={projects.projects} />
                </div>
            ) : <Loader />}
        </>
    )
}

export default ContainerWrap(Projects)
