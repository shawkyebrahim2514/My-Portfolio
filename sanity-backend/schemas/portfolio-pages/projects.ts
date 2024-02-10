import { commanTitle, commanPageName } from "./commanFields";
import { BiGitRepoForked } from "react-icons/bi";

export const projectsPage = {
    name: 'projectsPage',
    type: 'document',
    title: 'Projects Page',
    icon: BiGitRepoForked,
    fields: [
        commanPageName,
        commanTitle,
        {
            name: 'projects',
            type: 'array',
            title: 'Projects',
            validation: Rule => Rule.unique().required(),
            of: [
                {
                    type: 'reference',
                    name: 'project',
                    to: [
                        {
                            type: 'projects'
                        }
                    ]
                }
            ]
        }
    ]
}