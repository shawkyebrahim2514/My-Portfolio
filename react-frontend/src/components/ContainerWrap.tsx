import { motion, AnimatePresence } from "framer-motion"

const variants = {
    enter: (direction: number) => {
        return {
            x: direction > 0 ? 100 : -100,
            opacity: 0
        };
    },
    center: {
        x: 0,
        opacity: 1
    },
    exit: (direction : number) => {
        return {
            x: direction < 0 ? 100 : -100,
            opacity: 0
        };
    }
};

const ContainerWrap = (Component: React.FC) => function HOC() {
    return (
        <AnimatePresence>
            <motion.div
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5 }}
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