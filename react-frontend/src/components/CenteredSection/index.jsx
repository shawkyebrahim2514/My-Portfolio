import { useContext, useMemo } from 'react'
import { Context } from '../../contexts/ThemeContext';
import Header from './Header';
import { motion } from "framer-motion"

export default function CenteredSection({ title, subtitle, icon, children }) {
    const theme = useContext(Context);
    const containerStyle = useMemo(() => {
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
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.8 }}
        >
            <motion.div variants={theme.motion.cardVariants} style={containerStyle}>
                <Header title={title} subtitle={subtitle} icon={icon} />
                {children}
            </motion.div>
        </motion.div>
    )
}
