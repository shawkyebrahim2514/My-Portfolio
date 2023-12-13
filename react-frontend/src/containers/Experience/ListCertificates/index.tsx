import MainSection from '../../../components/MainSection'
import Text from '../../../components/Text'
import ListItems from '../../../components/ListItems'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { useThemeContext } from '../../../contexts/ThemeContext';
import { getCertificates } from '../../../APIs'
import { useEffect, useState } from 'react'
import { Certificate } from '../../../Types'

export default function ListCertificates() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const { theme } = useThemeContext();

    useEffect(() => {
        getCertificates().then((result) => {
            result = result.sort((element1, element2) => {
                return element2.rank - element1.rank;
            });
            let newState: Certificate[] = [];
            result.forEach((element) => {
                newState.push({
                    description: element.description,
                    title: element.title,
                    subTitle: element.subTitle,
                    link: element.link,
                    date: element.date,
                })
            })
            setCertificates(newState);
        });
    }, []);

    return (
        <>
            {certificates.map((certificate, index) => {
                return (
                    <MainSection
                        key={certificate.title}
                        title={certificate.title}
                        link={certificate.link}
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
                                    {certificate.subTitle}
                                </Text>
                                <Text variant={"body"}>
                                    {certificate.date}
                                </Text>
                            </div>
                            <div style={{
                                display: "flex",
                                alignItems: "flex-start",
                                flexDirection: "column",
                                width: "fit-content",
                                gap: "0.5rem",
                            }}>
                                {certificate.description && (
                                    <>
                                        <Text variant={"h4"} style={{
                                            color: theme.colors.main.full,
                                        }}>
                                            Description
                                        </Text>
                                        <ListItems
                                            elements={certificate.description.split("\n")}
                                            icon={<FontAwesomeIcon icon={faAngleRight} />} />
                                    </>
                                )}
                            </div>
                        </div>
                    </MainSection>
                )
            })}
        </>
    )
}
