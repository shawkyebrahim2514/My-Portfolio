import { FC } from "react";
import { useTransition, animated, useReducedMotion } from "@react-spring/web";
import styles from "./ContainerWrap.module.css";

const ContainerWrap = (Component: FC) => function HOC() {
    const reduceMotion = useReducedMotion();
    const transitions = useTransition(Component, {
        from: { opacity: 0, transform: reduceMotion ? "translate(0)" : "translate(-500px)" },
        enter: { opacity: 1, transform: "translate(0)" },
        leave: { opacity: 0, transform: reduceMotion ? "translate(0)" : "translate(500)" },
        config: { duration: reduceMotion ? 0 : 400 },
    });

    return transitions((style, item) => (item != null) && (
        <animated.div style={style}>
            <div className={styles.container}>
                <Component />
            </div>
        </animated.div>
    ));
}

export default ContainerWrap