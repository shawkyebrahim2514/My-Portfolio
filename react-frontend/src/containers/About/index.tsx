import ContainerWrap from '../../components/ContainerWrap'
import Content from './Content';
import Image from './Image';
import { CSSProperties, useEffect, useMemo, useState } from 'react';
import { SanityAboutPage } from '../../Types';
import { getAboutPage } from '../../APIs';
import Loader from '../../components/Loader';

function About() {
    const [aboutPage, setAboutPage] = useState<SanityAboutPage | null>(null);
    const containerStyle = useMemo((): CSSProperties => ({
        display: "flex",
        flexDirection: "column-reverse",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "2rem",
    }), []);

    useEffect(() => {
        getAboutPage().then((result) => {
            setAboutPage(result);
        });
    }, []);

    return (
        <>
            {aboutPage ? (
                <div style={containerStyle}>
                    <Content
                        description={aboutPage.description}
                    />
                    <Image personImage={aboutPage.personImage} />
                </div>
            ) : <Loader />}
        </>
    )
}

export default ContainerWrap(About)
