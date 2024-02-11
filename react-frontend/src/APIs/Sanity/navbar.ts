import { SanityNavbarData } from '../../Types';
import sanityClient from './client';

const getNavbarData = async () => {
    const query = `*[_type == "portfolio"][0].navbar`;
    const result: SanityNavbarData = await sanityClient.fetch(query);
    return result;
};

export {
    getNavbarData,
}