import { SanityContactsPage } from '../../Types';
import sanityClient from './client';

const getContactsPage = async () => {
    const query = `*[_type == "portfolio"][0].pages[_type == "contactsPage"][0] {
        title,
        "contacts": contacts[] -> {
            "imgSrc": icon.asset->url,
            link,
            name
        }
    }`;
    const result: SanityContactsPage = await sanityClient.fetch(query);
    return result;
};

export {
    getContactsPage,
}