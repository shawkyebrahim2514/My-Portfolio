import ContainerWrap from '../../components/ContainerWrap'
import SectionTitle from '../../components/SectionTitle'
import CenteredSection from '../../components/CenteredSection'
import Icon from '../../components/Icon'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { getSkills } from '../../APIs';

function Skills() {
    const [technologies, setTechnologies] = useState({
        "General": [],
        "Frontend": [],
        "Backend": [],
        "Databases": [],
        "Tools": [],
    });
    useEffect(() => {
        // getSkills().then((response) => {
        //     console.log("response: ", response)
        // })
        let result = [
            {
                "iconURL": "https://cdn.sanity.io/images/h48br789/production/14d98c4aece769666c398457feea9bdd3f0788de-38x38.svg",
                "name": "JWT",
                "rank": 6,
                "categoryName": "Backend"
            },
            {
                "rank": 5,
                "categoryName": "Frontend",
                "iconURL": "https://cdn.sanity.io/images/h48br789/production/faf5d271c07269f036926a692cffd37bd9ee6fb2-48x48.svg",
                "name": "Material UI"
            },
            {
                "name": "GraphQL",
                "rank": 5,
                "categoryName": "Backend",
                "iconURL": "https://cdn.sanity.io/images/h48br789/production/f2c2b22999c0337d649a4ffaae0e0714ec97861f-100x100.svg"
            },
            {
                "categoryName": "General",
                "iconURL": "https://cdn.sanity.io/images/h48br789/production/5cd4416f71e5db423ecc14e7b59f50e62621c94f-28x32.svg",
                "name": "C#",
                "rank": 4
            },
            {
                "rank": 4,
                "categoryName": "Frontend",
                "iconURL": "https://cdn.sanity.io/images/h48br789/production/5ff92f7a2efea881fd3b56411942d76d1306c747-815x736.svg",
                "name": "ReactJS"
            },
            {
                "categoryName": "Backend",
                "name": "REST API",
                "rank": 4
            },
            {
                "categoryName": "General",
                "iconURL": "https://cdn.sanity.io/images/h48br789/production/4cd9859bbd9d0c1cad3c48032b1a42817b69b4b9-24x32.svg",
                "name": "Java",
                "rank": 3
            },
            {
                "categoryName": "Databases",
                "iconURL": "https://cdn.sanity.io/images/h48br789/production/1860bf8ac52f18f57c7822b5f4a79690e3865803-912x2030.svg",
                "name": "MongoDB",
                "rank": 3
            },
            {
                "rank": 3,
                "categoryName": "Frontend",
                "iconURL": "https://cdn.sanity.io/images/h48br789/production/7c9f2e505f9a23175d43e9f4fd26f53921b88e52-32x32.svg",
                "name": "JavaScript"
            },
            {
                "rank": 3,
                "categoryName": "Backend",
                "iconURL": "https://cdn.sanity.io/images/h48br789/production/ad9ba9d4fa7f332121daab9e12a98dd54c26d25c-143x32.svg",
                "name": "ExpressJS"
            },
            {
                "categoryName": "Tools",
                "iconURL": "https://cdn.sanity.io/images/h48br789/production/bb7d965dc4ec675b49ebc0a22aec0c7e67aef3c7-33x32.svg",
                "name": "Adobe Illustrator",
                "rank": 2
            },
            {
                "name": "NodeJS",
                "rank": 2,
                "categoryName": "Backend",
                "iconURL": "https://cdn.sanity.io/images/h48br789/production/14fb2ee58e4afbc58fc7123e5228db7e3622555e-256x289.svg"
            },
            {
                "categoryName": "General",
                "iconURL": "https://cdn.sanity.io/images/h48br789/production/5b247c61064cb305843343115f5668bb8b84f7bb-32x32.svg",
                "name": "Python",
                "rank": 2
            },
            {
                "rank": 2,
                "categoryName": "Databases",
                "iconURL": "https://cdn.sanity.io/images/h48br789/production/aac104201706599696e682cb10f08728ecbd859f-40x32.svg",
                "name": "SQL Server"
            },
            {
                "rank": 2,
                "categoryName": "Frontend",
                "iconURL": "https://cdn.sanity.io/images/h48br789/production/cd90eeb327624a262da19e896f04e927ffe1b4c1-27x32.svg",
                "name": "CSS"
            },
            {
                "rank": 1,
                "categoryName": "Databases",
                "iconURL": "https://cdn.sanity.io/images/h48br789/production/7f7d46d01be9fceacf545a7db9b595c2e6826f10-62x32.svg",
                "name": "MySQL"
            },
            {
                "iconURL": "https://cdn.sanity.io/images/h48br789/production/bb536b43deeb9e9eb330b072c7876b218413e4b7-33x32.svg",
                "name": "Adobe XD",
                "rank": 1,
                "categoryName": "Tools"
            },
            {
                "name": "CPP",
                "rank": 1,
                "categoryName": "General",
                "iconURL": "https://cdn.sanity.io/images/h48br789/production/ae3f2f1cc61611ab645f31d9cdf84ed95a32c789-27x32.svg"
            },
            {
                "rank": 1,
                "categoryName": "Frontend",
                "iconURL": "https://cdn.sanity.io/images/h48br789/production/816ce9db9e372871a48702f486e5be60e51db8a0-27x32.svg",
                "name": "HTML"
            },
            {
                "categoryName": "Backend",
                "iconURL": "https://cdn.sanity.io/images/h48br789/production/58ac17f0d25f9f16b09188a0803914a81cc6344f-2048x1024.png",
                "name": "Django",
                "rank": 1
            }
        ]

        result = result.sort((element1, element2) => {
            return element1.rank - element2.rank;
        });

        let newState = {}

        result.forEach((element) => {
            if (newState[element.categoryName]) {
                newState[element.categoryName].push({
                    src: element.iconURL,
                    name: element.name,
                })
            } else {
                newState[element.categoryName] = [{
                    src: element.iconURL,
                    name: element.name,
                }]
            }
        })

        setTechnologies(newState)
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
                highlightedText={"Skills & Tools"}
                text={"I have experience with"} />
            {Object.entries(technologies).map(([technologyTitle, technologyIcons]) => {
                return (
                    <CenteredSection
                        key={technologyTitle}
                        icon={<FontAwesomeIcon icon={faCode} size={"xl"} />}
                        title={technologyTitle}>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "1rem",
                            flexWrap: "wrap",
                        }}>
                            {technologyIcons.map((icon, index) => {
                                return (
                                    <Icon
                                        key={icon.name}
                                        src={icon.src}
                                        text={icon.name} />
                                )
                            })}
                        </div>
                    </CenteredSection>
                )
            })}
        </div>
    )
}

export default ContainerWrap(Skills)