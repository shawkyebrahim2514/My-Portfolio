import ContainerWrap from '../../components/ContainerWrap'
import { CSSProperties, useEffect, useMemo, useState } from 'react';
import { SanityEducationPage } from '../../Types';
import { getEducationPage } from '../../APIs';
import Loader from '../../components/Loader';
import Title from '../Title';
import Content from './Content';

function Education() {
    const [educationPage, setEducationPage] = useState<SanityEducationPage | null>(null);
    const containerStyle = useMemo((): CSSProperties => ({
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "center",
        gap: "2rem",
    }), []);

    useEffect(() => {
        getEducationPage().then((result) => {
            setEducationPage(result);
        });
    }, []);

    return (
        <>
            {educationPage ? (
                <div style={containerStyle}>
                    <Title title={educationPage.title} />
                    <Content education={educationPage.education} />
                </div>
            ) : <Loader />}
        </>
    )
}

export default ContainerWrap(Education)
