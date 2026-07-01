import { FC } from "react";
import { useTransition, animated } from "@react-spring/web";
import styles from "./ContainerWrap.module.css";

const ContainerWrap = (Component: FC) => function HOC() {
    const transitions = useTransition(Component, {
        from: { opacity: 0, transform: "translate(-500px)" },
        enter: { opacity: 1, transform: "translate(0)" },
        leave: { opacity: 0, transform: "translate(500)" },
        config: { duration: 400 },
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