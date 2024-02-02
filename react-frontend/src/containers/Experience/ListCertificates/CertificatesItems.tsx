import MainSection from '../../../components/MainSection'
import { CSSProperties, memo, useMemo } from 'react'
import { Certificate } from '../../../Types'
import SubtitleAndDate from './SubtitleAndDate';
import Description from './Description';

type CertificatesItemsProps = {
    readonly certificates: Certificate[]
}

function CertificatesItems({ certificates }: CertificatesItemsProps) {
    const containerStyle = useMemo((): CSSProperties => ({
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        gap: "1rem",
    }), []);

    return (
        <>
            {certificates.map((certificate, index) => {
                return (
                    <MainSection
                        key={certificate.title}
                        title={certificate.title}
                        link={certificate.link} >
                        <div style={containerStyle}>
                            <SubtitleAndDate subTitle={certificate.subTitle} date={certificate.date} />
                            <Description description={certificate.description} />
                        </div>
                    </MainSection>
                )
            })}
        </>
    )
}

export default memo(CertificatesItems);