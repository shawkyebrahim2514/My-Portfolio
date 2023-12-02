import { useContext, useMemo } from 'react'
import { Context } from '../../contexts/ThemeContext';
import { useMediaQuery } from 'react-responsive';
import Image from './Image';
import Content from './Content';
import { motion } from "framer-motion"

export default function ProjectCard({
    imgSrc = "images/placeholder.png",
    projectLink,
    demoLink,
    title,
    description,
    technologies
}) {
    const theme = useContext(Context);
    const isSmallScreen = useMediaQuery({ query: '(max-width: 768px)' });
    const containerStyle = useMemo(() => {
        return {
            padding: "1rem",
            ...theme.bluryStyle.main,
            display: "flex",
            flexDirection: isSmallScreen ? "column" : "row",
            alignItems: "stretch",
            justifyContent: "flex-start",
            gap: "1rem",
            height: "auto",
            borderRadius: theme.borderRadius,
            boxShadow: theme.boxShadow,
        }
    }, [theme, isSmallScreen]);

    return (
        <motion.div
            initial="offscreen"
            animate="onscreen"
        >
            <motion.div variants={theme.motion.cardVariants} style={containerStyle}>
                <Image imgSrc={imgSrc} isSmallScreen={isSmallScreen} projectLink={projectLink} demoLink={demoLink} />
                <Content title={title} description={description} technologies={technologies} />
            </motion.div>
        </motion.div>
    )
}