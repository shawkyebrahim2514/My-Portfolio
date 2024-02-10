import { commanTitle, changeDocumentPreviewTitle } from "./commanFields";
import { GoGoal } from "react-icons/go";

export const experiencePage = {
    name: 'experiencePage',
    type: 'document',
    title: 'Experience Page',
    icon: GoGoal,
    ...changeDocumentPreviewTitle("Experience Page"),
    fields: [
        {
            name: 'internshipsSection',
            type: 'object',
            title: 'Internships Section',
            validation: Rule => Rule.required(),
            fields: [
                commanTitle,
                {
                    name: 'internships',
                    type: 'array',
                    title: 'Internships',
                    validation: Rule => Rule.unique().required(),
                    of: [
                        {
                            type: 'reference',
                            name: 'internship',
                            to: [
                                {
                                    type: 'internships'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            name: 'certificatesSection',
            type: 'object',
            title: 'Certificates Section',
            validation: Rule => Rule.required(),
            fields: [
                commanTitle,
                {
                    name: 'certificates',
                    type: 'array',
                    title: 'Certificates',
                    validation: Rule => Rule.unique().required(),
                    of: [
                        {
                            type: 'reference',
                            name: 'certificate',
                            to: [
                                {
                                    type: 'certificates'
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}