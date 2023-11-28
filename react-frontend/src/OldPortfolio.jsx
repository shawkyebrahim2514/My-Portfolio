import Text from './components/Text';
import SectionTitle from './components/SectionTitle';
import { useContext } from 'react'
import { Context } from './contexts/ThemeContext';
import { faCoffee, faBars, faPlay } from '@fortawesome/free-solid-svg-icons';
import Button from './components/Button';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDesktop } from '@fortawesome/free-solid-svg-icons';
import Icon from './components/Icon';
import CenteredSection from './components/CenteredSection';
import ProjectCard from './components/ProjectCard';
import MainSection from './components/MainSection';

export default function Portfolio() {
    const theme = useContext(Context);
    console.log(theme);
    return (
        <div style={{
            backgroundColor: theme.colors.dark,
            minHeight: "100vh",
            color: theme.colors.contrastText.full,
        }}>
            <div style={{
                maxWidth: "1255px",
                margin: "0 auto",
                padding: "0 1rem",
            }}>
                <Text variant={"body"}>Hello World</Text>
                <SectionTitle highlightedText={"Skills"} />
                <br />
                <SectionTitle highlightedText={"Skills"} text={"Good"} />
                <br />
                <SectionTitle highlightedText={"Skills"} text={"Good"} subtitle={"Hello"} />
                {/* <br />
                <FontAwesomeIcon icon="coffee" />
                <FontAwesomeIcon icon={['fas', 'coffee']} />
                <FontAwesomeIcon icon={['far', 'coffee']} />
                <FontAwesomeIcon color='red' icon={["fal", "coffee"]} />
                <FontAwesomeIcon icon={faCoffee} size={'2x'} />
                <FontAwesomeIcon icon={faCoffee} size={'2x'} rotation={90}/>
                <FontAwesomeIcon icon={faCoffee} size={'2x'} flip="horizontal"/>
                <FontAwesomeIcon icon={faCoffee} size={'2x'} border />
                <FontAwesomeIcon icon={faCoffee} size={'2x'} swapOpacity  />
                <FontAwesomeIcon icon={faCoffee} size={'2x'} transform="shrink-6 left-4"  />
                <FontAwesomeIcon icon={faCoffee} size={'2x'} spin/>
                <FontAwesomeIcon icon={faCoffee} size={'2x'} pulse />
                <FontAwesomeIcon icon={faPlay} size={'2x'} pulse /> */}
                <br />
                <Button
                    icon={<FontAwesomeIcon icon={faCoffee} spin />}
                    text={"Click me"} />
                <Button
                    icon={<FontAwesomeIcon icon={faCoffee} spin />}
                    text={"Click me"} />
                <br />
                <Icon
                    src={"icons/cpp.svg"}
                    text={"Click me"} />
                <Icon
                    src={"icons/cpp.svg"}
                />
                <CenteredSection title={"Hsaewkrf"} subtitle={'Hello EveryOne'}>
                    <p>Please be quite!  </p>
                </CenteredSection>
                <br />
                <CenteredSection title={"Hsaewkrf"} subtitle={'Hello EveryOne'}>
                    <p>Please be quite!  </p>
                </CenteredSection>
                <br />
                <CenteredSection title={"Hsaewkrf"} subtitle={'Hello EveryOne'}>
                    <p>Please be quite!  </p>
                </CenteredSection>
                <br />
                <MainSection
                    title={"Hsaewkrf"}
                >
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusantium veniam in saepe, voluptas placeat error iusto distinctio maiores dolorem nisi odio fugit, nam facere aspernatur? Asperiores atque animi enim veritatis!
                </MainSection>
                <br />
                <MainSection
                    title={"Hsaewkrf"}
                >
                    <Text variant={"body"} style={{ marginBottom: "10px" }}>Hello from here</Text>
                    <MainSection>
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusantium veniam in saepe, voluptas placeat error iusto distinctio maiores dolorem nisi odio fugit, nam facere aspernatur? Asperiores atque animi enim veritatis!
                    </MainSection>
                </MainSection>
                <br />
                <ProjectCard
                    imgSrc={"images/placeholder.png"}
                    title={"Hello"}
                    description={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum."}
                    technologies={['React', 'NodeJS']}
                    projectLink={"https://google.com"}
                    dempLink={"https://google.com"}
                />
                <br />
                <ProjectCard
                    imgSrc={"images/placeholder.png"}
                    title={"Hello"}
                    description={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum."}
                    technologies={['React', 'NodeJS']}
                    projectLink={"https://google.com"}
                    dempLink={"https://google.com"}
                />
                <br />
                <br />
            </div>
        </div>
    )
}
