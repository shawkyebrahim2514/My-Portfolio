import { motion, AnimatePresence } from "framer-motion"
import { CSSProperties, FC, useMemo } from "react";

const variants = {
    enter: (direction: number) => {
        return {
            x: direction > 0 ? 100 : -100,
            opacity: 0
        };
    },
    center: (direction: number) => {
        return {
            x: 0,
            opacity: 1
        };
    },
    exit: (direction: number) => {
        return {
            x: direction < 0 ? 100 : -100,
            opacity: 0
        };
    }
};

const ContainerWrap = (Component: FC) => function HOC() {
    const containerStyle = useMemo((): CSSProperties => {
        return {
            minHeight: "100vh",
            display: "grid",
            alignItems: "center",
            paddingTop: "100px",
            paddingBottom: "30px",
        }
    }, []);

    return (
        <AnimatePresence>
            <motion.div
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5 }}
            >
                <div style={containerStyle}>
                    <Component />
                </div>
            </motion.div>
        </AnimatePresence>
    )
}

export default ContainerWrap