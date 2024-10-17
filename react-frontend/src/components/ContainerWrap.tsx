import { CSSProperties, FC, useMemo } from "react";
import { useTransition, animated } from "react-spring";

const ContainerWrap = (Component: FC) => function HOC() {
    const containerStyle = useMemo((): CSSProperties => {
        return {
            display: "grid",
            alignItems: "center",
            paddingTop: "70px",
            paddingBottom: "30px",
        }
    }, []);

    const transitions = useTransition(Component, {
        from: { opacity: 0, transform: "translate(-500px)" },
        enter: { opacity: 1, transform: "translate(0)" },
        leave: { opacity: 0, transform: "translate(500)" },
        config: { duration: 400 },
    });

    return transitions((styles, item) => (item != null) && (
        <animated.div style={styles}>
            <div style={containerStyle}>
                <Component />
            </div>
        </animated.div>
    ));
}

export default ContainerWrap