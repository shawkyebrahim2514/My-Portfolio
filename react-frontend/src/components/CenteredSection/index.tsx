import { CSSProperties, useMemo } from 'react'
import { useThemeContext } from '../../contexts/ThemeContext';
import Header from './Header';
import { motion } from "framer-motion"

type CenteredSectionProps = {
    readonly title: string,
    readonly subtitle?: string,
    readonly icon: JSX.Element,
    readonly children: JSX.Element | JSX.Element[],
}

export default function CenteredSection({ title, subtitle, icon, children }: CenteredSectionProps) {
    const { theme } = useThemeContext();
    const containerStyle = useMemo((): CSSProperties => {
        return {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            textAlign: "center",
            padding: "1rem",
            ...theme.bluryStyle.main,
            placeItems: "stretch",
            borderRadius: theme.borderRadius,
            boxShadow: theme.boxShadow,
        }
    }, [theme]);

    return (
        <motion.div
            initial="offscreen"
            animate="onscreen" >
            <motion.div variants={theme.motion.cardVariants} style={containerStyle}>
                <Header title={title} subtitle={subtitle} icon={icon} />
                {children}
            </motion.div>
        </motion.div>
    )
}
