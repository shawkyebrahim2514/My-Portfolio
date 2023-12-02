import { motion, AnimatePresence } from "framer-motion"

const variants = {
    enter: (direction) => {
        return {
            x: direction > 0 ? 100 : -100,
            opacity: 0
        };
    },
    center: {
        x: 0,
        opacity: 1
    },
    exit: (direction) => {
        return {
            x: direction < 0 ? 100 : -100,
            opacity: 0
        };
    }
};

const ContainerWrap = (Component) => function HOC() {
    return (
        <AnimatePresence>
            <motion.div
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5  }}
            >
                <div style={{
                    minHeight: "100vh",
                    display: "grid",
                    alignItems: "center",
                    paddingTop: "100px",
                    paddingBottom: "30px",
                }}>
                    <Component />
                </div>
            </motion.div>
        </AnimatePresence>
    )
}

export default ContainerWrap