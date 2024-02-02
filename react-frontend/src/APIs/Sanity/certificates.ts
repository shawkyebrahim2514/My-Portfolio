import { SanityCertificate } from '../../Types';
import sanityClient from './client';

const getCertificates = async () => {
    const query = `*[_type == "certificates"]{
        title,
        subTitle,
        rank,
        description,
        date,
        link,
    }`;
    const result: SanityCertificate[] = await sanityClient.fetch(query);
    return result;
};

export {
    getCertificates,
}