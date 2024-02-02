import { SanityContact } from '../../Types';
import sanityClient from './client';

const getContacts = async () => {
    const query = `*[_type == "contacts"]{
        "imgSrc": icon.asset->url,
        link,
        name
    }`;
    const result: SanityContact[] = await sanityClient.fetch(query);
    return result;
};

export {
    getContacts,
}