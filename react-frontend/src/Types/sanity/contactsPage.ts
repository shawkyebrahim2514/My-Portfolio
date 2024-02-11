import { CommonTitle } from "./common";

type Contact = {
    imgSrc: string;
    link: string;
    name: string;
}

export type SanityContactsPage = CommonTitle & {
    contacts: Contact[];
}