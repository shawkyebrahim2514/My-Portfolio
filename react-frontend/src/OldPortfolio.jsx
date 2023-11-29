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
import { motion } from "framer-motion"


const cardVariants = {
    offscreen: {
        y: 300
    },
    onscreen: {
        y: 0,
        // rotate: -10,
        transition: {
            type: "spring",
            bounce: 0.4,
            duration: 0.8
        }
    }
};



export default function Portfolio() {
    const theme = useContext(Context);
    console.log(theme);
    return (
        <div style={{
            backgroundColor: theme.colors.dark.full,
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
                <br />
                {/* Make it to the button\icon Components */}
                {/* <motion.div
                    style={{
                        display: "inline-block",
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                > */}
                    <Button
                        icon={<FontAwesomeIcon icon={faCoffee} spin />}
                        text={"Click me"} />
                {/* </motion.div> */}
                {/* ------------------------------------ */}
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


                {/* <motion.div
                    className="card-container"
                    initial="offscreen"
                    whileInView="onscreen"
                    viewport={{ amount: 0.8 }}
                >
                    <motion.div className="card" variants={cardVariants}> */}
                        <ProjectCard
                            imgSrc={"images/placeholder.png"}
                            title={"Hello"}
                            description={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum."}
                            technologies={['React', 'NodeJS']}
                            projectLink={"https://google.com"}
                            dempLink={"https://google.com"}
                        />
                    {/* </motion.div>
                </motion.div> */}

                <br />
                {/* <motion.div
                    className="card-container"
                    initial="offscreen"
                    whileInView="onscreen"
                    viewport={{ amount: 0.8 }}
                >
                    <motion.div className="card" variants={cardVariants}> */}
                        <ProjectCard
                            imgSrc={"images/placeholder.png"}
                            title={"Hello"}
                            description={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum."}
                            technologies={['React', 'NodeJS']}
                            projectLink={"https://google.com"}
                            dempLink={"https://google.com"}
                        />
                    {/* </motion.div>
                </motion.div> */}
                <br />
                <br />
            </div>
        </div>
    )
}
