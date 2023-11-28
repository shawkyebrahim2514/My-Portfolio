import { useEffect, useState } from 'react'
import ContainerWrap from '../../components/ContainerWrap';
import SectionTitle from '../../components/SectionTitle';
import ProjectCard from '../../components/ProjectCard';
import { getProjects } from '../../APIs';

function Projects() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        // getProjects().then((res) => {
        // })

        let result = [
            {
                "description": "Developed a console-based application for managing banking transactions using Java and MySQL, with a focus on Object-Oriented Programming (OOP) principles, Model-View-Controller (MVC) design pattern.\nKey Features:\nUsers can login or register to access their personal banking profile.\nUsers can view their active bank accounts, open new accounts, deposit, withdraw, transfer funds, view transaction histories, and close accounts.\nUsers can update their personal information such as name, address, phone number, and email.\nThe application keeps track of all user activities and generates logs for future reference.",
                "languages": [
                    "Java",
                    "MySQL"
                ],
                "name": "Bank System Application",
                "rank": 0
            },
            {
                "description": "Utilized Node.js with Express.js, EJS engine, CSS, GraphQL with Apollor Explorer, JWT, MongoDB database, and MongoDB Atlas Search to create a full-stack website for exchanging quotations.\nIntegrated JWT (JSON Web Tokens) enables secure user authentication and authorization, guaranteeing a simple and safe login process.\nUsed the autocomplete functionality of MongoDB Atlas Search to provide quick quote searches.\nDesigned user-friendly interfaces with form validation feedback for an improved UX.",
                "imgSrc": "https://cdn.sanity.io/images/h48br789/production/d6a65a43eaaf80324d82c3011348489f4e392660-1684x1168.png",
                "languages": [
                    "NodeJS",
                    "ExpressJS",
                    "MongoDB",
                    "GraphQL",
                    "JWT",
                    "CSS"
                ],
                "name": "Quoting Website",
                "rank": 2,
                "links": {
                    "demoLink": "https://quoting-website.onrender.com/",
                    "projectLink": "https://github.com/shawkyebrahim2514/Quoting-Website"
                }
            },
            {
                "links": {
                    "projectLink": "https://github.com/shawkyebrahim2514/Muslim-Website-using-ReactJS",
                    "demoLink": "https://muslim-website.vercel.app/"
                },
                "description": "Created an Islamic website using ReactJS and Material UI Components .\nBuilt a single resource for Muslims that included essential content such as the Holy Quran, the Hijri Calendar, and Adhkar.\nUtilized various technologies, including React Hook, memoization, React Router, React Context API with useReducer and Immer, React custom hooks, Lazy loading, and Separation of concerns",
                "imgSrc": "https://cdn.sanity.io/images/h48br789/production/e8009fde3e805017c57432e79d255625a9ff1960-1012x653.png",
                "languages": [
                    "ReactJS",
                    "Material UI",
                    "JavaScript",
                    "REST API"
                ],
                "name": "Muslim Website",
                "rank": 3
            },
            {
                "name": "Student Database Management Website",
                "rank": 1,
                "links": {
                    "projectLink": "https://github.com/shawkyebrahim2514/Student-Database-Management"
                },
                "description": "Designed a full-stack web application for managing student information using Node.js, ExpressJS, EJS engine, CSS, JavaScript, and MySQL, with a focus on using the Model-View-Controller (MVC) design pattern.\nAdmins can add new students, view, edit, and delete student information based on criteria such as ID, GPA, and level.\nStudents can edit their personal information, view and manage their courses, and store notes for each course.",
                "languages": [
                    "NodeJS",
                    "ExpressJS",
                    "MySQL",
                    "CSS"
                ]
            }
        ]

        result = result.sort((element1, element2) => {
            return element2.rank - element1.rank;
        });

        let newState = []

        result.forEach((element) => {
            newState.push({
                description: element.description,
                title: element.title,
                technologies: element.languages,
                demoLink: element.links?.demoLink,
                projectLink: element.links?.projectLink,
                imgSrc: element.imgSrc,
            })
        })

        setProjects(newState);
    }, [])

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            justifyContent: "center",
            gap: "2rem",
        }}>
            <SectionTitle
                highlightedText={"Projects"}
                text={"I have built"} />

            {projects.map((project, index) => {
                return (
                    <ProjectCard
                        key={project.title}
                        imgSrc={project.imgSrc}
                        title={project.title}
                        description={project.description}
                        projectLink={project.projectLink}
                        demoLink={project.demoLink}
                        technologies={project.technologies}
                    />
                )
            })}
        </div>
    )
}

export default ContainerWrap(Projects)
