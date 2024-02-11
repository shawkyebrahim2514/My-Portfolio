import { commanTitle, changeDocumentPreviewTitle } from "./commanFields";
import { MdContacts } from "react-icons/md";

export const contactsPage = {
    name: 'contactsPage',
    type: 'document',
    title: 'Contacts Page',
    icon: MdContacts,
    ...changeDocumentPreviewTitle("Contacts Page"),
    fields: [
        commanTitle,
        {
            name: 'contacts',
            type: 'array',
            title: 'Contacts',
            validation: Rule => Rule.unique().required(),
            of: [
                {
                    type: 'reference',
                    name: 'contact',
                    to: [
                        {
                            type: 'contacts'
                        }
                    ]
                }
            ]
        }
    ]
}