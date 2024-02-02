import { getCertificates } from '../../../APIs'
import { useEffect, useState } from 'react'
import { Certificate } from '../../../Types'
import { SanityCertificate } from '../../../Types/sanity';
import Loader from '../../../components/Loader';
import CertificatesItems from './CertificatesItems';

export default function ListCertificates() {
    const [certificates, setCertificates] = useState<Certificate[] | null>(null);

    useEffect(() => {
        getCertificates().then((result) => {
            result = sortResultFromSanity(result);
            let newState: Certificate[] = [];
            result.forEach((element) => {
                newState.push(formatCertificateFromSanity(element));
            })
            setCertificates(newState);
        });
    }, []);

    return (
        <>
            {certificates ? <CertificatesItems certificates={certificates} /> : <Loader />}
        </>
    )
}

function sortResultFromSanity(result: SanityCertificate[]): SanityCertificate[] {
    return result.sort((element1, element2) => {
        return element2.rank - element1.rank;
    });
}

function formatCertificateFromSanity(certificate: SanityCertificate): Certificate {
    return {
        description: certificate.description,
        title: certificate.title,
        subTitle: certificate.subTitle,
        link: certificate.link,
        date: certificate.date,
    }
}